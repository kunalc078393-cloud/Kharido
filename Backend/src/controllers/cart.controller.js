import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";


export async function addToCart(req, res){
    const {productId , quantity = 1} = req.body; 

    if(quantity < 1){
        return res.status(400).json({
            "message":"Quantity must be atleast 1"
        })
    }

    if(!productId){
        return res.status(400).json({
            "message":"Product Id is required",
        })
    }

    const product = await productModel.findById(productId);
    
    if(!product || !product.isActive){
        return res.status(404).json({
            "message":"Product Not found",
        })
    }

    const item = {
        product : product._id,
        quantity
    }

    const cart = await cartModel.findOne({user:req.user._id})|| await cartModel.create({user:req.user._id});
    let isItemAdded = false;
    cart.items.forEach((i , idx)=>{
        if(i.product.equals(item.product)){
            cart.items[idx].quantity += item.quantity;
            isItemAdded = true
        }
    })

    if(!isItemAdded){
        cart.items.push(item);
    }

    await cart.save();
    

    res.status(200).json({
        "message":"Item successfully added to the cart",
        cart

    })

}


export async function getCart(req, res) {
    const cart = await cartModel.findOne({
        user:req.user._id
    }).populate({
        path:"items.product",
        populate: {
            path:"category"
        }
    });

    if(!cart){
        return res.status(200).json({
            "message":"Cart is Empty",
            cart:{
                items:[]
            }
        })
    }

    let cartTotal = 0;

    cart.items.forEach((item , idx) =>{
        cart.items[idx].itemTotal = item.product.price  * item.quantity;
        cartTotal += cart.items[idx].itemTotal;
    }

    )
    
    res.status(200).json({
        "message":"cart successfully fetched",
        cart,
        cartTotal

    })

    
}

export async function updateCartItem(req, res){
    const {id} = req.params;
    const {quantity} = req.body;

    if(!Number.isInteger(quantity) || quantity < 1 ){
        return res.status(400).json({
            "message":"Quantity must a positive integer."
        })
    }

    const cart = await cartModel.findOne({user:req.user._id});

    if(!cart){
        return res.status(404).json({
            "message":"Cart not found. Invalid Id"
        })
    }

    const cartItem = cart.items.find(item =>item.product.equals(id));

    console.log(cartItem);

    if(!cartItem){
        return res.status(404).json({
            "message":"Product Not found in Cart"
        })
    }

    cartItem.quantity = quantity;

    await cart.save();

    res.status(200).json({
        "message":"Cart Updated successfully",
        cart
    })




}

export async function removeCartItem(req, res){
    const {id} = req.params;

    const cart = await cartModel.findOne({
        user:req.user._id
    });

    if(!cart){
        return res.status(404).json({
            "message":"Cart Not found"
        });
    }

    const cartItem = cart.items.find(item => item.product.equals(id));
    if(!cartItem){
        return res.status(404).json({
            "message":"Product Not found in the cart"
        })
    }

    cart.items = cart.items.filter(item => !item.product.equals(id));
    await cart.save();

    res.status(200).json({
        "message":"Item has been removed from the cart",
        cart
    })

}


export async function clearCart(req, res){
    const cart = await cartModel.findOne({user:req.user._id});

    if(!cart){
        return res.status(404).json({
            "message":"cart not found"
        })
    }

    cart.items = []
    await cart.save();

    res.status(200).json({
        "message":"Cart successfully cleared",
        cart
    })
}
