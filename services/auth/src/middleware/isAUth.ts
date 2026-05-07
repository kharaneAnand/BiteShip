import { Request , Response , NextFunction } from "express";
import jwt , {JwtPayload} from 'jsonwebtoken'
import User, { IUser } from "../model/User.js";
import TryCatch from "./trycatch.js";

export interface AuthenticatedRequest extends Request{
    user?:IUser | null ;
}

export const isAuth = async(req:AuthenticatedRequest , res:Response , next:NextFunction) : Promise<void>=>{
    try {
        
        const authHeader = req.headers.authorization ;

        if(!authHeader || !authHeader.startsWith("Bearer")){
            res.status(401).json({
                message:"please Login - No auth Headers ", 
            });
            return ;
        }
        const token = authHeader.split(" ")[1] ;

        if(!token){
            res.status(401).json({
                message:"Please Login - Token missing " ,
            });
            return ;
        }

        const decodedValue = jwt.verify(token , process.env.JWT_SEC as string )as JwtPayload ;

        if(!decodedValue || !decodedValue.user){
            res.status(401).json({
                message : "Invaild token " ,
            });
            return ;
        }


        req.user = decodedValue.user ;
        next() ;
    } catch (error : any) {
        res.status(500).json({
            message : "Please Login - jwt error" ,
        })
    }
};


const allowedRoles = ["customer" , "rider" , "seller"] as const ;
type Role = (typeof allowedRoles)[number] ;

export const addUserRole = TryCatch(async(req:AuthenticatedRequest , res)=>{
    
    if(!req.user?._id){
        return res.status(401).json({
            message :"Unathorized" ,
        }) ;
    }

    const {role} = req.body as {role:Role};
    
    if(!allowedRoles.includes(role)){
        return res.status(400).json({
            message:"Invalid role" , 
        });
    }

    const user = await User.findByIdAndUpdate(req.user._id , {role} , {new:true}) 

    if(!user){
        return res.status(404).json({
            message:"User not found" ,
        });
    }

    const token = jwt.sign({user}, process.env.JWT_SEC as string ,{
        expiresIn : "15d" ,
    });

    res.json({user , token }) ;

}) ;
