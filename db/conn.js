import mongoose from "mongoose";
import { DB_NAME } from "../src/constant.js";
const Connectdb = async()=>{
try {
        const conectionInstances = await mongoose.connect(`mongodb://127.0.0.1:27017/${DB_NAME}`);
        console.log("Database connected successfully !!!!!!!");
} catch (error) {
    console.log("Database cnnection problem",error);
}
}

export default Connectdb;