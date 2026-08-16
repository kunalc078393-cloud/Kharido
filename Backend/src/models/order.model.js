import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true,"user is required"],
        ref: 'users'
    },
    items:[
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"products",
                required:true
            },
            name:{
                type: String,
                required: true
            },
            images:[
                {
                    type: String 
                }
            ],
            price:{
                type:Number,
                required: true
            },

            quantity:{
                type:Number,
                required:true
            },
            itemTotal:{
                type:Number,
                required:true
            }

        }

    ],
    totalAmount : {
        type: Number,
        required : true
    },
    status : {
        type: String,
        enum: [
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled"

        ],
        default : "Pending"
    },
    paymentMethod:{
        type:String,
        enum:['COD'],
        default:"COD"
    },
    paymentStatus:{
        type:String,
        enum:["Pending","Paid","Failed"],
        default:"Pending"
    },
    shippingAddress:{
        fullName:{
            type:String,
            required:true,
        },
        phoneNo:{
            type:Number,
            required:true
        },
        addressLine:{
            type:String,
            required : true
        },
        city:{
            type:String,
            required: true  
        },
        state:{
            type: String,
            required: true
        },
        pincode:{
            type: Number,
            required: true
        }

    }

})

const orderModel = mongoose.model("orders",orderSchema);

export default orderModel;