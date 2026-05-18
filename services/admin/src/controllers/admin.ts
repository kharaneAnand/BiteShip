import { ObjectId } from "mongodb";
import TryCatch from "../middleware/trycatch.js";
import {getRestaurantCollection , getRiderCollection ,  getOrderCollection} from '../util/collection.js'


export const getPendingRestaurant = TryCatch(async(req ,res)=>{

    const restaurants = await (await getRestaurantCollection()).find({isVerified:false }).toArray() ;

    res.json({
        count : restaurants.length ,
        restaurants ,
    });
});

export const getPendingRiders = TryCatch(async(req ,res)=>{

    const riders = await (await getRiderCollection()).find({isVerified:false }).toArray() ;

    res.json({
        count : riders.length ,
        riders ,
    });
});


export const verifyRestaurant = TryCatch(async (req, res) => {
    const { id } = req.params;

    if (typeof id !== "string") {
        return res.status(400).json({
            message: "Invalid restaurant id",
        });
    }

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid objectId",
        });
    }

    const result = await (await getRestaurantCollection()).updateOne(
        { _id: new ObjectId(id) }, // filter
        {
            $set: {
                isVerified: true,
                updatedAt: new Date(),
            },
        }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({
            message: "Restaurant not found",
        });
    }

    res.json({
        message: "Restaurant verified successfully",
    });
});


export const verifyRider = TryCatch(async (req, res) => {
    const { id } = req.params;

    if (typeof id !== "string") {
        return res.status(400).json({
            message: "Invalid rider id",
        });
    }

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid objectId",
        });
    }

    const result = await (await getRiderCollection()).updateOne(
        { _id: new ObjectId(id) }, 
        {
            $set: {
                isVerified: true,
                updatedAt: new Date(),
            },
        }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({
            message: "Rider not found",
        });
    }

    res.json({
        message: "Rider verified successfully",
    });
});

export const getVerifiedRestaurants = TryCatch(async(req , res)=>{

    const restaurants = await (
        await getRestaurantCollection()
    ).find({isVerified:true}).toArray();

    const ordersCollection = await getOrderCollection();

    const restaurantsWithStats = await Promise.all(

        restaurants.map(async(restaurant:any)=>{

            const deliveredOrders = await ordersCollection.find({
                restaurantId: restaurant._id.toString(),
                status:"delivered",
                paymentStatus:"paid",
            }).toArray();

            const totalOrders = deliveredOrders.length;

            const revenue = deliveredOrders.reduce(
                (acc:any , order:any)=>acc + order.totalAmount ,
                0
            );

            return {
                ...restaurant,
                totalOrders,
                revenue,
            };
        })
    );

    res.json({
        count: restaurantsWithStats.length,
        restaurants: restaurantsWithStats,
    });
});

export const getVerifiedRiders = TryCatch(async(req , res)=>{

    const riders = await (
        await getRiderCollection()
    ).find({isVerified:true}).toArray();

    const ordersCollection = await getOrderCollection();

    const ridersWithStats = await Promise.all(

        riders.map(async(rider:any)=>{

            const deliveredOrders = await ordersCollection.find({
                riderId: rider._id.toString(),
                status:"delivered",
                paymentStatus:"paid",
            }).toArray();

            const completedOrders = deliveredOrders.length;

            const earnings = deliveredOrders.reduce(
                (acc:any , order:any)=>acc + (order.riderAmount || 0),
                0
            );

            return {
                ...rider,
                completedOrders,
                earnings,
                rating: 4.8,
            };
        })
    );

    res.json({
        count: ridersWithStats.length,
        riders: ridersWithStats,
    });
});