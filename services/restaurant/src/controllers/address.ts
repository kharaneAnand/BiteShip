import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import Address from "../models/Address.js";

export const addAddress = TryCatch(async(req:AuthenticatedRequest , res)=>{
    const user = req.user ;

    if(!user){
        return res.status(401).json({
            message : "Unauthorized" ,
        });
    }

    const {mobile , formattedAddress , latitude , longitude} = req.body ;
    
    if(!mobile || !formattedAddress || latitude===undefined || longitude===undefined){
        res.status(400).json({
            message : "Please give all credentials " ,
        });
    }

    const newAddress = await Address.create({
        userId : user._id ,
        mobile ,
        formattedAddress ,
        location:{
            type:"Point" ,
            coordinates:[Number(longitude) , Number(latitude)],
        },
    });

    res.json({
        message :"Address Added Successfully " ,
        address : newAddress,
    });
});


export const deleteAddress = TryCatch(async(req:AuthenticatedRequest , res)=>{
    
    const user = req.user ;

    if(!user){
        return res.status(401).json({
            message : "Unautorized" ,
        });
    }

    const {id} = req.params 
    if(!id){
        return res.status(400).json({
            message : "ID is Required" ,
        });
    }

    const address = await Address.findOne({
        _id : id ,
        userId:user._id.toString() 
    })

    if(!address){
        return res.status(404).json({
            message : "Address not found" ,
        });
    }

    await address.deleteOne() ;

    res.json({
        message :"Address deleted Successfully" ,
    });
});


export const  getMyAddress = TryCatch(async(req:AuthenticatedRequest , res)=>{

    const user = req.user ;

    if(!user){
        return res.status(401).json({
            message : "Unauthorized" ,
        });
    }

    const address = await Address.find({
        userId : user._id.toString()
    }).sort({createdAt:-1}) ;

    res.json(address) ;
});

