import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: [true , "Fullname is required"]
    },
    email : {
        type: String,
        required: [true , "email is required"],
        unique: [true , "The email must be unique"]

    },
    password : {
        type: String,
        required : [true , "Password is required"]
    },
    role :{
        type : String,
        enum :["customer","admin"],
        default : "customer"
    }
})

const userModel = mongoose.model("users",userSchema);

export default userModel;