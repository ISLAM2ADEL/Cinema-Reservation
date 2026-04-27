import OpenAI from "openai";
import { movieModel } from "../models/movie.model.js";
import Showtime from "../models/ShowtimeModel.js";
import { seatModel } from "../models/seat.model.js";
import Booking from "../models/bookingModel.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const getVipAvailability = async (showtimeId, hallId) => {
  try {
 
    const vipSeats = await seatModel.find({ hallId, seatType: "VIP" }).select("seatNumber").lean();
    const totalVipSeats = vipSeats.length;
    
    if (totalVipSeats === 0) {
      return { total: 0, available: 0 };
    }

    const vipSeatNumbers = vipSeats.map(seat => seat.seatNumber);
    const confirmedBookings = await Booking.find({ showtime: showtimeId, status: "confirmed" }).select("seats").lean();
    const bookedSeatNumbers = confirmedBookings.flatMap(b => b.seats);
    const availableVipSeats = vipSeatNumbers.filter(seat => !bookedSeatNumbers.includes(seat)).length;

    return { total: totalVipSeats, available: availableVipSeats };
  } catch (error) {
    console.error(`Error calculating VIP availability for showtime ${showtimeId}:`, error);
    return { total: 0, available: 0 };
  }
};


const formatContextString = (movies, showtimesWithVip) => {
  const moviesContext = movies.length > 0 
    ? movies.map(m => `- ${m.title} (${m.genre.join(', ')}), Rating: ${m.rating}`).join('\n')
    : "No movies are currently available.";

  const showtimesContext = showtimesWithVip.length > 0
    ? showtimesWithVip.map(st => 
        `- Movie: ${st.movieTitle}, Time: ${new Date(st.startTime).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}, Hall: ${st.hallName}, Price: ${st.price}, Available VIP Seats: ${st.vipAvailable}/${st.vipTotal}`
      ).join('\n')
    : "No upcoming showtimes are scheduled.";

  return `Available Movies:\n${moviesContext}\n\nShowtimes and VIP Availability:\n${showtimesContext}`;
};


export const handleCinemaChat = async (req, res) => {
  try {
    const { userMessage, chatHistory = [] } = req.body;

    if (!userMessage) {
      return res.status(400).json({ success: false, message: "userMessage is required." });
    }

    
    const limitedHistory = chatHistory.slice(-6);

    // ============================================================================
    // 1. DATA RETRIEVAL LOGIC: GATHER CONTEXT FROM DATABASE
    // ============================================================================

    // Fetch "Now Showing" movies
    // const availableMovies = await movieModel.find({ isNowShowing: true })
    //   .select("title description genre rating language")
    //   .lean();
    
    // // Fetch upcoming showtimes, correctly populated
    // const upcomingShowtimes = await Showtime.find({ startTime: { $gte: new Date() } })
    //   .populate("movie", "title isNowShowing")
    //   .populate("hallId", "name")
    //   .lean();

    // // ============================================================================
    // // 2. VIP SEAT LOGIC
    // // ============================================================================

    // const showtimesWithVipData = await Promise.all(
    //   upcomingShowtimes.map(async (st) => {
    //     // Ensure referenced data exists before proceeding
    //     if (!st.movie || !st.hallId) return null;

    //     const vipData = await getVipAvailability(st._id, st.hallId._id);
        
    //     return {
    //       movieTitle: st.movie.title,
    //       hallName: st.hallId.name,
    //       startTime: st.startTime,
    //       price: st.price,
    //       vipTotal: vipData.total,
    //       vipAvailable: vipData.available
    //     };
    //   })
    // );

    // // Filter out nulls
    // const validShowtimes = showtimesWithVipData.filter(st => st !== null);

    // // Format Data using private helper
    // const dbContext = formatContextString(availableMovies, validShowtimes);

    const dbContext = `
Available Movies:
- Joker (Drama, Thriller), Rating: 8.4
- Interstellar (Sci-Fi, Adventure), Rating: 8.7

Showtimes and VIP Availability:
- Movie: Joker, Time: 5/1/2026, 8:00 PM, Hall: Grand Hall, Price: 150, Available VIP Seats: 5/10
- Movie: Interstellar, Time: 5/1/2026, 11:00 PM, Hall: IMAX, Price: 200, Available VIP Seats: 0/10
    `;

    // ============================================================================
    // 3. CHAT LOGIC: PREPARE AND SEND TO OPENAI
    // ============================================================================

    // Updated System Prompt: Concise, "Concierge" persona, strictly 150 token constraint
    const systemPrompt = {
      role: "system",
      content: `You are a Cinema Concierge. Answer concisely using ONLY the database context provided.
Constraint 1: Only answer about movie availability, showtimes, and VIP seating.
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
