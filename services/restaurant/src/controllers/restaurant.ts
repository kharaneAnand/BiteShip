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
        isVerified:false ,
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
            message : "No restaurant Found" ,
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

export const updateStatusRestauarnt = TryCatch(async(req:AuthenticatedRequest , res)=>{

        if(!req.user){
            return res.status(403).json({
                message : "Please Login " 
            }) ;
        }

        const {status} = req.body ;

        if(typeof status !== 'boolean'){
            return res.status(400).json({
                message : "Status Must be boolean" ,
            });
        }

        const restaurant = await Restaurant.findOneAndUpdate({
            ownerId : req.user._id ,
        } , {isOpen : status} , {new:true}) ;

        if(!restaurant){
            return res.status(404).json({
                message: "Restaurant not found " ,
            });
        }

        res.json({
            message : "Restaurant Status Updated " ,
            restaurant ,
        });
});

export const updateRestaurant = TryCatch(async(req:AuthenticatedRequest , res)=>{
     if(!req.user){
        return res.status(403).json({
            message : "Please Login" ,
        });
     }

     const {name , description } = req.body ;

     const restaurant = await Restaurant.findOneAndUpdate(
        {ownerId : req.user._id},
        {name : name , description : description},
        {new : true} 
     );

     if(!restaurant){
        return res.json({
            message : "Restauerant is not found" ,
        });
     }

     res.json({
        message : "Restaurant Updated" ,
        restaurant
     });
});

export const getNearbyRestaurant = TryCatch(async(req , res)=>{

    const {latitude , longitude , radius=5000 , search=""} = req.query ;

    if(!latitude || !longitude){
        return res.status(400).json({
            message : "Latitude and Longitude are Required" ,
        });
    }

    const query : any = {
        isVerified : true 
    }

    if(search && typeof search === "string"){
        query.name = {$regex: search , $options:"i"} ;
    }

    const restaurants = await Restaurant.aggregate([
        {
            $geoNear:{
                near :{
                    type : "Point",
                    coordinates:[Number(longitude) , Number(latitude)] 
                },
                distanceField:"distance" ,
                maxDistance:Number ,
                spherical:true ,
                query,
            },
        },
        {
            $sort:{
                isOpen: -1 ,
                distance : 1 ,
            },
        },{
            $addFields:{
                distanceKm:{
                    $round:[{$divide:["$distance" , 1000]} , 2] ,
                },
            },
        },
    ]);

    res.json({
        success:true ,
        count : restaurants.length ,
        restaurants ,
    });
});

export const fetchSingleRestaurant = TryCatch(async(req , res)=>{
    const restaurant = await Restaurant.findById(req.params._id) ;
    res.json(restaurant) ;
});