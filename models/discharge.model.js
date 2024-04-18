import mongoose from "mongoose";

const dischargeSchema = new mongoose.Schema({
    patientName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
  },
  doctorName:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    } ,
    Receptionist:{
        type: String,
        required: true
    },
    BillStatus:{
        type: String,
        required: true
    }

  },{timestamps: true}
);

export const Discharge = mongoose.model("Discharge", dischargeSchema);
