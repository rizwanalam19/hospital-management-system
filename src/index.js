import Connectdb from "../db/conn.js";
import app from "./app.js";
import dotenv from "dotenv"


dotenv.config({
    path: './env'
})

Connectdb().then(()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("app is running at port "+process.env.PORT);
    });
    app.on("Error at server", (err)=>{
        console.log(err);
        throw err
    })
})