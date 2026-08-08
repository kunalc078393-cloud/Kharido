import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required:true,
        unique : true
    },
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref : 'products',
                required : true,
                
            },
            quantity:{
                type: Number,
                default:1,
                min : 1
            }
          
        }
    ]
});

const cartModel = mongoose.model("Cart",cartSchema);

export default cartModel;