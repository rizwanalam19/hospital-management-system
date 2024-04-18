import mongoose from "mongoose";
import { Doctor } from "./doctor.model.js";
const patientSchema = new mongoose.Schema({
    patientName:{
        type: String,
        required: true,
    },
    phone:{
        type: Number,
        required: true,
        unique: true
    },
    address:{
        type: String,
        
    },
    guardian:{
        type: String,
        required: true,
    },
    bedAllot:{
        type: String,
        required: true
    },
    doctorName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
        
    }
},{timestamps: true})

export const Patient = mongoose.model("Patient", patientSchema)