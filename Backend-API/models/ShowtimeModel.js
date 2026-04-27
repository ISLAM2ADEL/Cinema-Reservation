import mongoose from 'mongoose';

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
       // wait for movie :(
    },{
        timestamps:true
    }
)

export default mongoose.model('Showtime', showtimeSchema);