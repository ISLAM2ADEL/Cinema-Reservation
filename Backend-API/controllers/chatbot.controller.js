import OpenAI from "openai";
import { movieModel } from "../models/movie.model.js";
import Showtime from "../models/ShowtimeModel.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const formatContextString = (movies, showtimesData) => {
  const moviesContext = movies.length > 0 
    ? movies.map(m => `- ${m.title} (${m.genre.join(', ')}), Rating: ${m.rating}`).join('\n')
    : "No movies are currently available.";

  const showtimesContext = showtimesData.length > 0
    ? showtimesData.map(st => 
        `- Movie: ${st.movieTitle}, Time: ${new Date(st.startTime).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}, Hall: ${st.hallName}, Price: ${st.price}, Status: ${st.available > 0 ? "Seats Available" : "Sold Out"}`
      ).join('\n')
    : "No upcoming showtimes are scheduled.";

  return `Available Movies:\n${moviesContext}\n\nShowtimes and Availability:\n${showtimesContext}`;
};

export const handleCinemaChat = async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "message is required." });
    }

    const limitedHistory = chatHistory.slice(-6);

    const availableMovies = await movieModel.find({ isNowShowing: true })
      .select("title description genre rating language")
      .lean();
    
    const upcomingShowtimes = await Showtime.find({ startTime: { $gte: new Date() } })
      .populate("movie", "title isNowShowing")
      .populate("hallId", "name")
      .select("movie hallId startTime price seats")
      .lean();

    const showtimesWithData = upcomingShowtimes.map((st) => {
      if (!st.movie || !st.hallId) return null;

      const total = st.seats ? st.seats.length : 0;
      const available = st.seats ? st.seats.filter(seat => !seat.isReserved).length : 0;
      
      return {
        movieTitle: st.movie.title,
        hallName: st.hallId.name,
        startTime: st.startTime,
        price: st.price,
        total,
        available
      };
    });

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
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-5.4-mini", 
      messages: messages,
      max_completion_tokens: 150,
    });

    const botResponse = completion.choices[0].message.content;

    const updatedHistory = [
      ...limitedHistory,
      { role: "user", content: message },
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
