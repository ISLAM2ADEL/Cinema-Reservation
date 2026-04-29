import Showtime from '../models/ShowtimeModel.js';
import Hall from '../models/hall.model.js';

export const createShowtime = async(req,res) => {
    try{
        const hallData = await Hall.findById(req.body.hallId);
        if(!hallData){
            return res.status(404).json({success: false, message: 'Hall not found'});
        }

        const generatedSeats = [];
        for(let i=1; i<=hallData.totalSeats; i++){
            generatedSeats.push({ id: i.toString(), isReserved: false });
        }
        
        req.body.seats = generatedSeats;

        const showtime = await Showtime.create(req.body);
        res.status(201).json({success: true, data: showtime});
    }
    catch(error){
        res.status(400).json({success: false, error: error.message});
    }
}


export const getAllShowtimes = async(req,res)=>{
    try{
        const showtimes = await Showtime.find().populate('hallId').populate('movie');
        res.status(200).json({success: true, data: showtimes});
    }
    catch(error){
        res.status(500).json({success: false, error: error.message});
    }
}

export const getShowtimeById = async(req,res)=>{
    try{
        const showtime = await Showtime.findById(req.params.id).populate('hallId').populate('movie');
        if(!showtime){
            return res.status(404).json({success: false, message: 'Showtime not found'});
        }
        
        const availableSeatsCount = showtime.seats.filter(seat => !seat.isReserved).length;

        res.status(200).json({
            success: true, 
            data: showtime,
            availableSeats: availableSeatsCount
        });
    }
    catch(error){
        res.status(500).json({success: false, error: error.message});
    }
}

export const updateShowtime = async(req,res) => {
    try{
        const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        if(!showtime){
            return res.status(404).json({success: false, message: 'Showtime not found'});
        }
        res.status(200).json({success: true, data: showtime});
    }
    catch(error){
        res.status(400).json({success: false, error: error.message});
    }
}

export const deleteShowtime = async(req,res) => {
    try{
        const showtime = await Showtime.findByIdAndDelete(req.params.id);
        if(!showtime){
            return res.status(404).json({success: false, message: 'Showtime not found'});
        }
        res.status(200).json({success: true, message: 'Showtime deleted successfully', data: {}});
    }
    catch(error){
        res.status(500).json({success: false, error: error.message});
    }
}
