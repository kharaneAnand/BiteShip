import mongoose ,{Schema , Document} from 'mongoose' ;

export interface Iorder extends Document{
    userId : string ;
    restaurantId : string ;
    restaurantName : string ;
    riderId?: string | null ;
    riderPhone : number | null ;
    riderName : string | null ;
    distance : number ;
    riderAmount : number ;

    items:{
        itemId : string ;
        name : string ;
        price : string ;
        quantity : number;
    }[];

    subTotal : number ;
    deliveryFee : number ;
    platformFee : number ;
    totalAmount : number ;

    addressId : string ;
    deliveryAddress : {
        formattedAddress : string ;
        mobile : number ;
        latitude : number ;
        longitude : number ;
    };

    status : | "placed" | "accepted" | "preparing" | "ready_for_rider" | "rider_assigned" | "picked_up"| "deliverd" | "cancelled" ;

    paymentMethod : "razorpay" | "stripe" ;
    paymentStatus : "pending" | "paid" | "failed" ;

    expiresAT : Date ;
    createdAT : Date ;
    updateAT : Date ; 

}


const OrderSchema = new Schema<Iorder>(
    {
        userId:{
            type:String ,
            required:true ,
        },
        restaurantId:{
            type:String ,
            required:true ,
        },
        restaurantName:{
            type:String ,
            required:true ,
        },
        riderId:{
            type:String ,
            default:null,
        },
        riderName:{
            type:String ,
            default:null,
        },
        riderPhone:{
            type:Number ,
            default:null,
        },
        riderAmount:{
            type:Number ,
            required:true 
        },
        distance:{
            type:Number ,
            required:true 
        },

        items:[
            {
                itmeId : String ,
                name : String ,
                price : Number ,
                quantity : Number ,
            },
        ],

        subTotal:Number ,
        deliveryFee:Number ,
        platformFee:Number ,
        totalAmount:Number ,
        addressId:{
            type : String ,
            required:true ,
        },

        deliveryAddress:{
            formattedAddress:{
                type:String ,
                required:true ,
            },
            mobile:{
                type :Number ,
                required : true ,
            },
            latitude :Number ,
            longitude:Number ,
        },

        status : {
            type : String ,
            enum : [ "placed" , "accepted" , "preparing",  "ready_for_rider" , 
                "rider_assigned" , "picked_up" , "deliverd" , "cancelled"] , default:"placed"
        },

        paymentMethod:{
            type: String ,
            enum:["razorpay" , "stripe"],
            required:true ,
        },

        paymentStatus:{
            type:String ,
            enum : ["pending" , "paid" , "failed"] ,
            default : "pending" ,
        },

        expiresAT:{
            type:Date ,
            index:{expireAfterSeconds:0} ,
        },
    },{
        timestamps:true ,
    }
);



export default mongoose.model<Iorder>("Order" , OrderSchema) ;