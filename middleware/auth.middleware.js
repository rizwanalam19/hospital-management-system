import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiRespose.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import asynchandler from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";

const VerifyjwtToken = asynchandler(async(req,res,next)=>{
const token =   req.cookies?.accessToken ||
req.header("Authorization")?.replace("Bearer", "");

const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
console.log("DecodeToken:",decodedToken);

const user = await User.findById(decodedToken?._id).select(
  "-password -refreshToken"
);

req.user = user;

    next();
}) 
export default VerifyjwtToken