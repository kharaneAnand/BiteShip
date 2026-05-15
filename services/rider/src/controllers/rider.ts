import axios from "axios";
import getBuffer from "../config/datauri.js";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import { Rider } from "../model/Rider.js";

export const addRiderProfile = TryCatch(async(req:AuthenticatedRequest , res)=>{
    const user = req.user;

    if(!user){
        return res.status(401).json({
            message :"Unauthorized" ,
        });
    }

    if(user.role !== "rider"){
        return res.status(403).json({
            message:"Only riders can create rider Profile " ,
        });
    }

    const file = req.file ;

    if(!file){
        return res.status(400).json({
            message :"Rider Image is required" ,
        });
    }

    const filebuffer = getBuffer(file) ;

    if(!filebuffer?.content){
        return  res.status(500).json({
            message : "Failed to genearate image buffer" ,
        });
    }

    const {data : uploadResult} = await axios.post(`${process.env.UTILS_SERVICE}/api/upload` , {
        buffer : filebuffer.content ,
    });

    const {phoneNumber ,  aadharNumber , drivingLicenseNumber , latitude , longitude} = req.body ;

    if(!phoneNumber || !aadharNumber || !drivingLicenseNumber || latitude === undefined || longitude === undefined){
        return res.status(400).json({
            message :"All fields are required" ,
        });
    }

    const existingProfile = await Rider.findOne({userId : user._id}) ;

    if(existingProfile){
        return res.status(404).json({
            message :"Rider profile already exists" ,
        });
    }

    const riderProfile = await Rider.create({
        userId : user._id ,
        picture :  uploadResult.url ,
        phoneNumber ,
        aadharNumber,
        drivingLicenseNumber,
        location:{
            type:"Point" ,
           coordinates:[
                Number(longitude),
                Number(latitude)
            ]
        },
        isVerified:false ,
        isAvailable:false ,
    });

    return res.status(201).json({
        message :"Rider Profile is Created Successfully" ,
        riderProfile 
    });

});

export const fetchMyProfile = TryCatch(async(req:AuthenticatedRequest , res)=>{
    const user = req.user ;

    if(!user){
        return res.status(401).json({
            message : "Unauthorized" ,
        });
    }

    const account = await Rider.findOne({ userId : user._id}) ;

    res.json(account) ;
});

export const toggleRiderAvailablity = TryCatch(async(req:AuthenticatedRequest , res)=>{
    const user = req.user ;

    if(!user){
        return res.status(401).json({
            message : "Unauthorized" ,
        });
    }

    if(user.role !== 'rider'){
        return res.status(403).json({
            message : "Only Rider can create a Rider Profile " ,
        });
    }

    const { isAvailable , latitude , longitude } = req.body ;

    if(typeof isAvailable !== "boolean"){
        return res.status(404).json({
            message : "isAvailable must be boolean" ,
        });
    }

    if(latitude === undefined || longitude === undefined) {
        return res.status(404).json({
            message : "location is required" ,
        });
    }

    const rider = await Rider.findOne({userId : user._id}) ;

    if(!rider){
        return res.status(404).json({
            message : "Rider Profile not found " ,
        });
    }

    if(isAvailable && !rider.isVerified){
        return res.status(403).json({
            message : "Rider is not verified" ,
        });
    }

    rider.isAvailable = isAvailable

    rider.location = {
        type :"Point" ,
        coordinates:[longitude , latitude] 
    }

    rider.lastActiveAt = new Date() ;

    await rider.save() ;

    res.json({
        message : isAvailable? "Rider is now online " : "Rider is now offline" ,
        rider , 
    });
});

