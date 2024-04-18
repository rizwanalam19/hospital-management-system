import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    doctorName:{
        type: String,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    specialistIn:{
        type: String,
        
    },
    exp:{
        type:Number,

    }
},{timestamp: true});

export const Doctor = mongoose.model("Doctor", doctorSchema);