import express from "express";

const app = express();
import  Patient  from "../router/patient.route.js";
import  Doctor  from "../router/doctor.route.js";
import User from "../router/User.route.js"
import cookieParser from "cookie-parser";

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

app.get("/",(req, res)=>{
    res.json({
        "User": "rizwan",
        "mobile": 973214504
    })
})
app.use("/patient", Patient);
app.use("/doctor", Doctor);
app.use("/user", User)
export default app


