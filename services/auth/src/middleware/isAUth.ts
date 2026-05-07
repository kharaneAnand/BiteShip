import { Request , Response , NextFunction } from "express";
import jwt , {JwtPayload} from 'jsonwebtoken'
import { IUser } from "../model/User.js";

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