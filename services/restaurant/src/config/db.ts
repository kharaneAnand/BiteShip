import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string , {
            dbName : "BiteShip" ,
        });

        console.log("connected to the mongodb") ;
    } catch (error) {
        console.log(error) ;
    }
};

export default connectDB ;