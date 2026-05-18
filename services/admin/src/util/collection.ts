import {connectDB} from '../config/db.js'

export const getRestaurantCollection = async()=>{
    const db = await connectDB() 

    return db.collection("restaurants") ;
}

export const getRiderCollection = async()=>{
    const db = await connectDB() 

    return db.collection("riders") ;
}

export const getOrderCollection = async()=>{
    const db = await connectDB()

    return db.collection("orders");
}