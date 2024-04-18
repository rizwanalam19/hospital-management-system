import { Patient } from "../models/patient.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiRespose.js";
import { Discharge } from "../models/discharge.model.js";
import { Doctor } from "../models/doctor.model.js";
import { TotalBed } from "../src/constant.js";

const CreatePatient = asynchandler(async (req, res) => {
  const { patientName, phone, address, guardian, bedAllot, doctorName } =
    req.body;

  const doctor = await Doctor.findOne({ doctorName: doctorName });
  if (!doctor) {
    throw new ApiError(400, "Doctor Not Found !!!!");
  }
    // Check if the number of allocated beds is less than the total available beds
    const allocatedBeds = await Patient.countDocuments({ bedAllot: { $exists: true, $ne: null } }); // Assuming bedAllot is null or not set when no bed is allocated
    if (allocatedBeds >= TotalBed) {
      throw new ApiError(400, "No beds available for allocation.");
    }
  
  const patient = new Patient({
    patientName,
    phone,
    address,
    guardian,
    bedAllot,
    doctorName: doctor.id,
  });

  const patientCreate = await patient.save();
  console.log(patientCreate);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        patientCreate,
        "Patient data saved successfully !!!!!!"
      )
    );
});

const DischargePatient = asynchandler(async (req, res) => {
  const patient_id = req.params.id;
  console.log(patient_id);
  const patient = await Patient.findById(patient_id);
  if (!patient) {
    throw new ApiError(400, "patient not Found");
  }
  const { dischargeBy, bill } = req.body;
  console.log("Patient:", patient);
  const disPatient = await Discharge.create({
    patientName: patient.id,
    doctorName: patient.doctorName,
    Receptionist: dischargeBy,
    BillStatus: bill
  });
  await Patient.findByIdAndDelete(patient_id);   //await Patient.save();

  return res .status(200).json(new ApiResponse(200,disPatient,"Discharge successfully!!!!"));
});

export { CreatePatient, DischargePatient };
