import OpenAI from "openai";
import { movieModel } from "../models/movie.model.js";
import Showtime from "../models/ShowtimeModel.js";
import { seatModel } from "../models/seat.model.js";
import Booking from "../models/bookingModel.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getSeatAvailability = async (showtimeId, hallId) => {
  try {
    const seats = await seatModel.find({ hallId }).select("seatNumber").lean();
    const totalSeats = seats.length;
    
    if (totalSeats === 0) {
      return { total: 0, available: 0 };
    }

    const seatNumbers = seats.map(seat => seat.seatNumber);
    const confirmedBookings = await Booking.find({ showtime: showtimeId, status: "confirmed" }).select("seats").lean();
    const bookedSeatNumbers = confirmedBookings.flatMap(b => b.seats);
    const availableSeats = seatNumbers.filter(seat => !bookedSeatNumbers.includes(seat)).length;

    return { total: totalSeats, available: availableSeats };
  } catch (error) {
    console.error(`Error calculating seat availability for showtime ${showtimeId}:`, error);
    return { total: 0, available: 0 };
  }
};

const formatContextString = (movies, showtimesData) => {
  const moviesContext = movies.length > 0 
    ? movies.map(m => `- ${m.title} (${m.genre.join(', ')}), Rating: ${m.rating}`).join('\n')
    : "No movies are currently available.";

  const showtimesContext = showtimesData.length > 0
    ? showtimesData.map(st => 
        `- Movie: ${st.movieTitle}, Time: ${new Date(st.startTime).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}, Hall: ${st.hallName}, Price: ${st.price}, Available Seats: ${st.available}/${st.total}`
      ).join('\n')
    : "No upcoming showtimes are scheduled.";

  return `Available Movies:\n${moviesContext}\n\nShowtimes and Availability:\n${showtimesContext}`;
};

export const handleCinemaChat = async (req, res) => {
  try {
    const { userMessage, chatHistory = [] } = req.body;

    if (!userMessage) {
      return res.status(400).json({ success: false, message: "userMessage is required." });
    }

    const limitedHistory = chatHistory.slice(-6);

    const availableMovies = await movieModel.find({ isNowShowing: true })
      .select("title description genre rating language")
      .lean();
    
    const upcomingShowtimes = await Showtime.find({ startTime: { $gte: new Date() } })
      .populate("movie", "title isNowShowing")
      .populate("hallId", "name")
      .lean();

    const showtimesWithData = await Promise.all(
      upcomingShowtimes.map(async (st) => {
        if (!st.movie || !st.hallId) return null;

        const seatData = await getSeatAvailability(st._id, st.hallId._id);
        
        return {
          movieTitle: st.movie.title,
          hallName: st.hallId.name,
          startTime: st.startTime,
          price: st.price,
          total: seatData.total,
          available: seatData.available
        };
      })
    );

    const validShowtimes = showtimesWithData.filter(st => st !== null);

    const dbContext = formatContextString(availableMovies, validShowtimes);

    const systemPrompt = {
      role: "system",
      content: `You are a Cinema Concierge. Answer concisely using ONLY the database context provided.
Constraint 1: Only answer about movie availability, showtimes, and seating.
Constraint 2: Politely decline any questions outside this context.
Constraint 3: Responses must be realistic and strictly under 150 tokens.

DATABASE CONTEXT:
${dbContext}`
    };

    const messages = [
      systemPrompt,
      ...limitedHistory,
      { role: "user", content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4-mini", 
      messages: messages,
      max_completion_tokens: 150,
    });

    const botResponse = completion.choices[0].message.content;

    const updatedHistory = [
      ...limitedHistory,
      { role: "user", content: userMessage },
      { role: "assistant", content: botResponse }
    ];

    res.status(200).json({
      success: true,
      data: {
        reply: botResponse,
        chatHistory: updatedHistory
      }
    });

  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "An error occurred while processing your chat request. Please try again later." 
    });
  }
};
