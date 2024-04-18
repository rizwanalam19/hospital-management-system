import express from "express";

const app = express();
import  Patient  from "../router/patient.route.js";
import  Doctor  from "../router/doctor.route.js";
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true}));
app.get("/",(req, res)=>{
    res.json({
        "User": "rizwan",
        "mobile": 973214504
    })
})
app.use("/patient", Patient);
app.use("/doctor", Doctor);
export default app


