import Connectdb from "../db/conn.js";
import app from "./app.js";

Connectdb().then(()=>{
    app.listen(8000, ()=>{
        console.log("app is running at port 8000");
    });
    app.on("Error at server", (err)=>{
        console.log(err);
        throw err
    })
})