import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import Cart from "../models/Cart.js";

export const addToCart = TryCatch(async(req:AuthenticatedRequest , res)=>{

    if(!req.user){
        return res.status(401).json({
            message : "Please Login" ,
        });
    }
    const userId = req.user._id ;

    const {restaurantId , itemId} = req.body 

    if(!mongoose.Types.ObjectId.isValid(restaurantId) || !mongoose.Types.ObjectId.isValid(itemId)){
        return res.status(400).json({
            message : "Invalid Restaurant and Item id",
        });
    }

    // if user try to add the item from the differnt restaurant ;
    const cartFromDifferentRestaurant = await Cart.findOne({
        userId,
        restaurantId:{$ne :restaurantId} ,
    });
    if(cartFromDifferentRestaurant){
        return res.status(400).json({
            messsage :"You can order from only one restaurant at a time . please clear your cart first to add items from this restaurant",
        });
    }

    const cartItem = await Cart.findOneAndUpdate(
        {userId , restaurantId , itemId} ,
        {
            $inc:{quantity : 1},
            $setOnInsert:{userId , restaurantId , itemId},
        },
        {upsert:true , new : true , setDefaultsOnInsert:true } 
    );

    return res.json({
        message :"Item added to cart" ,
        cart:cartItem ,
    });
});


export const fetchMyCart = TryCatch(async(req:AuthenticatedRequest , res)=>{

    if(!req.user){
        return res.status(401).json({
            message:"Please Login",
        });
    }

    const userId = req.user._id;

    const cartItems = await Cart.find({ userId })
        .populate("itemId")
        .populate("restaurantId");

    let subtotal = 0;
    let cartLength = 0;

    for(const cartItem of cartItems){

        const item : any = cartItem.itemId;

        subtotal += Number(item.price) * Number(cartItem.quantity);
        cartLength += Number(cartItem.quantity);
    }

    return res.json({
        success:true,
        cartLength,
        subtotal,
        cart:cartItems,
    });
});