import mongoose, { Document,  Schema } from "mongoose";

export interface IMenuItem extends Document{
    restaurantId : mongoose.Types.ObjectId ;
    name : string ;
    description : string ;
    image?:string ;
    price:number ;
    isAvailable:boolean ;
    createAt : Date;
    updatedAt:Date ;
}

const schema = new Schema<IMenuItem>({
    restaurantId:{
        type:Schema.Types.ObjectId ,
        ref:"Restaurant" ,
        required:true ,
        index:true ,
    },
    name : {
        type:String ,
        trim : true,
        required:true , 
    },
     description : {
        type:String ,
        trim : true, 
    },
     price : {
        type:Number ,
        required:true , 
    },
     image : {
        type:String ,
        required:true , 
    },
    isAvailable:{
        type:Boolean ,
        required:true ,
    },
},
{
    timestamps:true ,
});

export default mongoose.model<IMenuItem>("MenuItem" , schema) ;
