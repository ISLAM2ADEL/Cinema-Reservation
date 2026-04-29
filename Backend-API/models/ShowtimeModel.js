import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        immutable: true
    },
    isReserved: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const showtimeSchema = new mongoose.Schema(
    {
       price: Number ,
       hallId: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Hall',
           required: true
       },
       startTime: {
           type: Date,
           required: true
       },
       movie:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
       },
       seats: [seatSchema]
    },{
        timestamps:true
    }
)

export default mongoose.model('Showtime', showtimeSchema);