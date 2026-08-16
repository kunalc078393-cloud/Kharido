import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";

export async function placeOrder(req, res){
    const {shippingAddress , paymentMethod = "COD"}  = req.body;

    if(!shippingAddress){
        return res.status(400).json({
            "message":"Shipping Address is required"
        })
    }
    else{
        if(!shippingAddress.fullName){
            return res.status(400).json({
                "message":"recepient Full Name is required"
            })
        }
        if(!shippingAddress.phoneNo){
            return res.status(400).json({
                "message":"recepient Phone No is required"
            })
        }
        else{
            if(!Number.isInteger(shippingAddress.phoneNo)){
                return res.status(400).json({
                    "message":"Phone No must a Number Not String"
                })
            }
            if(shippingAddress.phoneNo.toString().length != 10){
                return res.status(400).json({
                    "message":"Phone NO must contain 10 digits"
                })
            }
        }
        if(!shippingAddress.addressLine){
            return res.status(400).json({
                "message":"recepient's Address is required"
            })
        }
        if(!shippingAddress.city){
            return res.status(400).json({
                "message":"recepient's city is required"
            })
        }
        if(!shippingAddress.state){
            return res.status(400).json({
                "message":"recepient's State is required"
            })
        }
        if(!shippingAddress.pincode){
            return res.status(400).json({
                "message":"recepient's pincode is required"
            })
        }
        else{
            if(!Number.isInteger(shippingAddress.pincode)){
                return res.status(400).json({
                    "message":"Pinncode must be Integer"
                })
            }
            if(shippingAddress.pincode.toString().length != 6){
                return res.status(400).json({
                    "message":"Pincode must contains only 6 digits"
                })
            }
        }
    }

    if(paymentMethod !== "COD"){
        return res.status(400).json({
            "message":"Only cash on delivery mode is available"
        })
    }

    const cart = await cartModel.findOne({user:req.user._id}).populate('items.product');

    if(!cart || cart.items.length === 0){
        return res.status(400).json({
            "message":"Cart not found or Empty"
        })
    }

    for(const item of cart.items){
        if(!item.product.isActive){
            return res.status(400).json({
                "message":`${item.product.name} is no longer available`
            })

        }
        if(item.quantity > item.product.stock){
            return res.status(400).json({
                "message":`${item.product.name} is Out of Stock .`,
            })
        }

    }

    const orderItems = [];
    let totalAmount = 0;

    for(const item of cart.items){
        const product ={
            product : item.product,
            name : item.product.name,
            images : item.product.images,
            price : item.product.price,
            quantity : item.quantity,
            itemTotal : item.quantity * item.product.price,
        }

        orderItems.push(product);

        totalAmount += product.itemTotal;
       
        
    }

    const order = await orderModel.create({
        user:req.user.id,
        items:orderItems,
        totalAmount,
        shippingAddress,
        paymentMethod
    });

    for(const item of cart.items){
        item.product.stock -= item.quantity;
        await item.product.save();
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
        "message":"order successfully placed",
        order
    })

    
}

export async function myOrders(req, res){
    const orders = await orderModel.find({user:req.user._id});
    if(orders.isEmpty){
        return res.status(200).json({
            "message":"No Order Placed yet"
        })
    }

    res.status(200).json({
        "message":"Orders fetched Successfully",
        orders
    })
}

export async function getAllOrders(req, res){
    const orders = await orderModel.find().populate('user','fullName email').sort({createdAt:-1});

    res.status(200).json({
        "message":"Orders fetched successfully",
        "count":orders.length,
        orders
    })
}

export async function updateOrderStatus(req, res){
    const {id} = req.params;
    const {status} = req.body;

    const allowedStatues = [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled"

    ]

    if(!allowedStatues.includes(status)){
        return res.status(400).json({
            "message":"Invalid order status"
        })

    }

    const order = await orderModel.findById(id);

    if(!order){
        return res.status(404).json({
            "message":"order not found",
        });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
        "message":"order status successfully updated",
        order
    })
}

export async function cancelOrder(req, res){
    const {id} = req.params;
    const order = await orderModel.findById(id).populate('items.product');

    if(!order){
        return res.status(404).json({
            "message":"Order not found"
        });
    }

    if(!order.user.equals(req.user._id)){
        return res.status(403).json({
            "message":"you are not allowed to cancel this order"
        })
    }
    if(['Shipped','Confirmed','Cancelled'].includes(order.status)){
        return res.status(400).json({
            "message":"This order can't be cancelled."
        })
    }

    for(const item of order.items){
        item.product.stock += item.quantity;
        await item.product.save();

    }
    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
        "message":"Order Cancelled successfully"
    })


}

export async function buyNow(req , res){
    const {productId , quantity = 1 , shippingAddress, paymentMethod= "COD"} = req.body;

    if(!shippingAddress){
        return res.status(400).json({
            "message":"Shipping Address is required"
        })
    }
    else{
        if(!shippingAddress.fullName){
            return res.status(400).json({
                "message":"recepient Full Name is required"
            })
        }
        if(!shippingAddress.phoneNo){
            return res.status(400).json({
                "message":"recepient Phone No is required"
            })
        }
        else{
            if(!Number.isInteger(shippingAddress.phoneNo)){
                return res.status(400).json({
                    "message":"Phone No must a Number Not String"
                })
            }
            if(shippingAddress.phoneNo.toString().length != 10){
                return res.status(400).json({
                    "message":"Phone NO must contain 10 digits"
                })
            }
        }
        if(!shippingAddress.addressLine){
            return res.status(400).json({
                "message":"recepient's Address is required"
            })
        }
        if(!shippingAddress.city){
            return res.status(400).json({
                "message":"recepient's city is required"
            })
        }
        if(!shippingAddress.state){
            return res.status(400).json({
                "message":"recepient's State is required"
            })
        }
        if(!shippingAddress.pincode){
            return res.status(400).json({
                "message":"recepient's pincode is required"
            })
        }
        else{
            if(!Number.isInteger(shippingAddress.pincode)){
                return res.status(400).json({
                    "message":"Pinncode must be Integer"
                })
            }
            if(shippingAddress.pincode.toString().length != 6){
                return res.status(400).json({
                    "message":"Pincode must contains only 6 digits"
                })
            }
        }
    }

    if(paymentMethod !== "COD"){
        return res.status(400).json({
            "message":"Only cash on delivery mode is available"
        })
    }


    if(!productId){
        return res.status(400).json({
            "message":"Product Id is required"
        })
    }

    if(!Number.isInteger(quantity) || quantity < 1){
        return res.status(404).json({
            "message":"quantity must be positive integer"
        })
    }

    const product = await productModel.findById(productId);

    if(!product){
        return res.status(404).json({
            "message":"Product not found"
        })
    }

    if(!product.isActive){
        return res.status(400).json({
            "message":"Product is on longer available"
        })
    }

    if(product.stock < quantity){
        return res.status(400).json({
            "message":"Product is not in stock for the required"
        })
    }

    const order = await orderModel.create({
        user:req.user._id,
        items:[
            {
                product: product._id,
                name : product.name,
                images : product.images,
                price : product.price,
                quantity,
                itemTotal : quantity * product.price
            }
        ],
        totalAmount : quantity * product.price,
        shippingAddress,
        paymentMethod

    })
    product.stock -= quantity;
    await product.save();

    res.status(200).json({
        "message":"Order Placed successfully",
        order
    })

}

export async function updatePaymentStatus(req, res){
    const {id} = req.params;

    const {paymentStatus} = req.body;

    if(!["failed","paid"].includes(paymentStatus)){
        return res.status(400).json({
            "message":"Invalid Payment status"
        })

    }

    const order = await orderModel.findOne({id});

    if(!order){
        return res.status(404).json({
            "message":"Order Not found"
        })
    }

    if(order.paymentMethod !== "COD"){
        return res.status(400).json({
            "message":"This order is not COD order"
        })
    }

    if(order.status !== "Delivered"){
        return res.status(400).json({
            "message":"Payment can only be marked as peid after delivered"
        })
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({
        "message":"Payment status updated successfully",
        order
    })



}



