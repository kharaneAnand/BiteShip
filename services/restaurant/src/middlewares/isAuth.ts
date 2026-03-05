import {Request , Response , NextFunction } from 'express'
import jwt ,{JwtPayload} from 'jsonwebtoken' 


export interface IUser{
    _id : string ;
    name : String ;
    email : String ;
    image : String ;
    role : String ;
}

export interface AuthenticatedRequest extends Request {
    user?:IUser | null ;
}

export const isAuth = async(req:AuthenticatedRequest , res:Response , next:NextFunction):Promise<void> =>{
    try {
        const authHeader = req.headers.authorization ;

        if(!authHeader || !authHeader.startsWith("Bearer")){
            res.status(401).json({
                message:"please Login - No auth Header", 
            }) ;
            return ;
        }

        const token = authHeader.split(" ")[1];

        if(!token){
            res.status(401).json({
                message:"please Login - Token missing ",
            });
            return ;
        }

        const decodedValue = jwt.verify(token , process.env.JWT_SEC as string) as JwtPayload;

        if(!decodedValue || !decodedValue.user){
             res.status(401).json({
                message:"Invaid token", 
            }) ;
            return ;
        }


        req.user = decodedValue.user ;
        next() ;
    } catch (error) {
         res.status(500).json({
            message : "Please Login - Jwt error" ,
         })
    }
};


