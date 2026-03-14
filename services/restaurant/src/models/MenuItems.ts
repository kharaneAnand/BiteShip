import mongoose,{ Document, Schema, STATES} from "mongoose";

export interface IMenuItem extends Document{
    restaurantId : mongoose.Types.ObjectId ;
    name:String;
    description:string;
    image?:string ;
    price:number;
    isAvailabe:boolean;
    createdAt:Date;
    updatedAt:Date;
}

const schema = new Schema<IMenuItem>({
    restaurantId :{
        type : Schema.Types.ObjectId ,
        ref : "Restaurant" ,
        required:true ,
        index:true ,
    },

    name:{
        type:String ,
        required:true ,
        trim : true , 
    },

     description:{
        type:String ,
        trim : true , 
    },

    image:{
        type:String ,
        required:true ,
    },

    isAvailabe:{
        type:Boolean ,
        required : true ,
    } ,
},
{   
    timestamps:true ,
}
);


export default mongoose.model<IMenuItem>("MenuItem" , schema)  ;


