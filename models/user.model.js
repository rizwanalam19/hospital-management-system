import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Please Enter the Password"],

    },
    refreshToken:{
        type: String
    }

},{timestamps: true})

userSchema.pre("save",async function (next){
    if(this.isModified("password")){
        this.password =await bcrypt.hash(this.password, 10);
        next();
    }
else
next();
})


userSchema.methods.isPasswordCorrect = async function(password){
    const validate = await bcrypt.compare(password,this.password);
    return validate ;
}
userSchema.methods.GenerateAccessToken = function(){
    
   return jwt.sign({  _id: this._id,  email: this.email,
        username: this.username,
        fullName: this.fullname },
        process.env.ACCESS_TOKEN_SECRET,
        
    );
   
}
userSchema.methods.GenerateRefreshToken = function (){
    return jwt.sign({ _id: this.id },
        process.env.ACCESS_TOKEN_SECRET,
    )
}

export const User = mongoose.model("User", userSchema);


