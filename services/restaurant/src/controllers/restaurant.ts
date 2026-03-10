import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/tryCatch.js";
import Restaurant from "../models/Restaurant.js";

export const addRestraunt = TryCatch(async(req:AuthenticatedRequest , res)=>{
    const user = req.user ;

    if(!user){
        return res.status(401).json({
            message : "Unauthorized" ,
        });
    }

     const existingRestaurant = await Restaurant.findOne({
        ownerId:user?._id,
     }) ;

     if(existingRestaurant){
        return ({
            message : "You already have a Restaurant",
        }) ;
     }

     const {name , description , latitude , longitude ,formattedAddress , phone } = req.body 

     if(!name || !latitude || !longitude) {
        return res.status(400).json({
            message : "please give the all request " ,
        });
     }


     const file = req.file ;
     if(!file){
        return res.status(400).json({
            message : "please give image" ,
        });
     }

     const fileBuffer = getBuffer(file) 

     if(!fileBuffer?.content){
        return res.status(500).json({
            message : "Failed to create a Buffer" ,
        });
     }

     const {data : uploadResult} = await axios.post(`${process.env.UTILS_SERVICE}/api/upload` , {
        buffer: fileBuffer.content ,
     }) ;

     const restaurant = await Restaurant.create({
        name , 
        description ,
        phone ,
        image: uploadResult ,
        ownerId : user._id ,
        autoLocation:{
            type:"Point",
            coordinates:[Number(longitude) , Number(latitude)] ,
            formattedAddress,
        },
     });
});