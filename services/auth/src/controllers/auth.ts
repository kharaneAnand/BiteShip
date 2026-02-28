import { Request , Response } from "express"
import User from "../model/user.js";
import  jwt  from "jsonwebtoken";

export const loginUser = async(req:Request , res:Response) =>{
    try {
        
        const {email , name , picture} = req.body

        let user = await User.findOne({email}) 

       if(!user){
        user = await User.create({
            name , 
            email ,
            image : picture ,
        }) ;
       }

       const token = jwt.sign({user} , process.env.JWT_SEC as string , {
        expiresIn:"15d",
       });

       res.status(200).json({
        message : "logged success" ,
        token ,
        user,
       });

    } catch (error:any) {
        res.status(500).json({
            message: error.message ,
        })
    }
} ;