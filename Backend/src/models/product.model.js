import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true , "name is required"],
        trim: true,
    },
    description:{
        type:String,
        required: [true , 'description is required'],
        trim: true
    },
    price:{
        type:Number,
        required:[true , 'price is required'],
        min: 0
    },
    stock:{
        type:Number,
        required:[true, 'stock is required to fill'],
        min : 0,
        default : 0
    },
    brand:{
        type: String,
        trim: true
    },
    images:[
        {
            type:String
        }
    ],
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required : [true,"category is required"]
    },
    isActive:{
        type:Boolean,
        default: true,
        
    }



},{
    timestamps:true
});

const productModel = mongoose.model("products",productSchema);

export default productModel;