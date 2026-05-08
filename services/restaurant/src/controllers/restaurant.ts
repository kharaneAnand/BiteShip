import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import Restaurant from "../models/Restaurant.js";
import jwt from 'jsonwebtoken'

export const addRestaurant = TryCatch(async(req:AuthenticatedRequest , res)=>{

    const user = req.user;

    if(!user){
        return res.status(401).json({
            message:"Unauthorized",
        });
    }
    const existingRestaurant = await Restaurant.findOne({
        ownerId:user?._id,
    });

    if(existingRestaurant){
        return res.status(400).json({
            message:"You already have the restaurant",
        });
    }


    const {name , description , latitude , longitude , formattedAddress , phone } = req.body 

    if(!name || !latitude || !longitude ){
        return res.status(400).json({
            message: "Please give the all details" ,
        });
    }

    const file = req.file ;

    if(!file){
        return res.status(400).json({
            message : "Please give the image" ,
        });
    }

    const fileBuffer = getBuffer(file) ;

    if(!fileBuffer?.content){
        return res.status(500).json({
            message : "Failed to create a file buffer" ,
        });
    }

    const {data : uploadResult} = await axios.post(`${process.env.UTILS_SERVICE}/api/upload` , {
        buffer : fileBuffer.content ,
    });

    const restaurant = await Restaurant.create({
        name , 
        description , 
        phone , 
        image:uploadResult.url ,
        ownerId:user._id ,
        autoLocation:{
            type:"Point" ,
            coordinates:[Number(longitude) , Number(latitude)] ,
            formattedAddress,
        },
    });

    return res.status(201).json({
        message :"Restaurant created successfully " ,
        restaurant ,
    });
});

export const fetchMyRestaurant = TryCatch(async(req:AuthenticatedRequest , res)=>{

    if(!req.user){
        return res.status(401).json({
            message :"Please Login" ,
        });
    }

    const restaurant = await Restaurant.findOne({ownerId:req.user._id}) 

    if(!restaurant){
        return res.status(400).json({
            message : "Invalid User" ,
        });
    }

    if(!req.user.restaurantId){
        const token = jwt.sign({
            user:{
                ...req.user,
                restaurantId:restaurant._id
            },
        },
            process.env.JWT_SEC as string,{
                expiresIn:"15d" ,
            }
        );

        return res.json({restaurant , token});
    }

    res.json({restaurant}) ;
});