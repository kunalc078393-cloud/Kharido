import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true , "category name is required"],
        unique : [true , "Category name must be unique"],
        trim :true

    },
    image : {
        type:String,
        default:""
    },
    isActive:{
        type:Boolean,
        default: true,

    }
},{
    timestamps : true
})

const categoryModel = mongoose.model("category",categorySchema);

export default categoryModel;