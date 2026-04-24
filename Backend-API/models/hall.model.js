import mongoose from 'mongoose';
const hallSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Hall name is required'],
        trim:true,
        unique:true,
    },
    totalSeats:{
        type:Number,
        required:[true, 'Total seats are required'],
        min:[10, 'Hall must have at least 10 seats'],
    },
    type:{
        type:String,
        enum:['Standard', 'VIP', '3D'],
        default:'Standard',
    }
},
{timestamps:true}
);
export default mongoose.model('Hall', hallSchema);