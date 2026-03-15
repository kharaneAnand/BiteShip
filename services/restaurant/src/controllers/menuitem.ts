import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/tryCatch.js";
import Restaurant from "../models/Restaurant.js";
import MenuItems from "../models/MenuItems.js";


export const addMenuItem = TryCatch(async(req:AuthenticatedRequest , res)=>{
    if(!req.user){
        return res.status(400).json({
            message: " Please login " ,
        });
    }

    const restaurant = await Restaurant.findOne({ownerId: req.user._id}) ;
    if(!restaurant){
        return res.status(404).json({
            message:"No Restaurant Found " ,
        });
    }

    const {name , description , price} = req.body ;
    if(!name && !price){
        return res.status(400).json({
            message : "Name & Price are Required" ,
        });
    } 

    const file = req.file ;

    if(!file){
        return res.status(400).json({
            message : "Please give the Image" ,
        });
    }

    const fileBuffer = getBuffer(file) ;

    if(!fileBuffer?.content){
        return res.status(500).json({
            message : "Failed to create a File Buffer" ,
        });
    }

    const {data : uploadResult} = await axios.post(`${process.env.UTILS_SERVICE}/api/upload`,
        {
            buffer : fileBuffer.content ,
        }
    );

   const item = await MenuItems.create({
    name ,
    description ,
    price ,
    restaurantId :restaurant._id,
    image : uploadResult.url
   })

   res.json({
    message : "Item added successfully",
    item ,
   });
}) ;

export const getAllItems = TryCatch(async(req:AuthenticatedRequest , res)=>{
    const{id} = req.body ;

    if(!id){
        return res.status(400).json({
            message:"Id is Required " ,
        });
    }

    const items = await MenuItems.find({restaurantId:id})

    res.json(items) ;
});

export const deleteMenuItem = TryCatch(async(req:AuthenticatedRequest , res)=>{
    if(!req.user){
        return res.status(401).json({
            message : "Please Login" ,
        });
    }

    const {itemId} = req.params ;
    if(!itemId){
        return res.status(400).json({
            message : "Id is required" ,
        });
    }

    const item = await MenuItems.findById(itemId) ;

    if(!item){
        return res.status(404).json({
            message : "No item found",
        });
    }

    const restaurant = await Restaurant.findOne({
        _id:item.restaurantId ,
        ownerId:req.user._id ,
    });

    if(!restaurant){
        return res.status(404).json({
            message:"No restaurant found ",
        });
    }

    await item.deleteOne() 

    res.json({
        message : "Menu item deleted successfully" ,
    });

});

export const toggleMenuItemAvailability = TryCatch(async(req:AuthenticatedRequest , res)=>{
    if(!req.user){
        return res.status(401).json({
            message : "Please Login" ,
        });
    }

    const {itemId} = req.params ;
    if(!itemId){
        return res.status(400).json({
            message:"Id is Required" ,
        });
    }

    const item = await MenuItems.findById(itemId) ;
    if(!item){
        return res.status(400).json({
            message : "Item is not available" ,
        });
    }

    const restaurant = await Restaurant.findById({
        _id : item.restaurantId ,
        ownerId : req.user._id ,
    });

    if(!restaurant){
        return res.status(404).json({
            message : "No restaurant found " ,
        });
    }

    item.isAvailabe = !item.isAvailabe ;
    await item.save() ;

    res.json({
        message : `Item marked as ${item.isAvailabe ? "available" : "unavailable"}` ,
        item,
    });
});

