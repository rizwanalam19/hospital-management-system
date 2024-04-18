import { Doctor } from "../models/doctor.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiRespose.js";
import asynchandler from "../utils/asynchandler.js";

const CreateDoctor = asynchandler(async(req, res)=>{
const { doctorName, phone, specialistIn, exp } = req.body;

const doctorCreate = await Doctor.create({
    doctorName, phone, specialistIn, exp
});
return res.status(200).json(new ApiResponse(200, doctorCreate, "Doctor create successfully !!!!"));
});

export { CreateDoctor }