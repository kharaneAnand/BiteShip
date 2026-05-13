import axios from "axios";
import { AuthenticatedRequest } from "../middleware/isAuth.js";
import TryCatch from "../middleware/trycatch.js";
import Address from "../models/Address.js";
import Cart from "../models/Cart.js";
import { IMenuItem } from "../models/MenuItems.js";
import Order from "../models/Order.js";
import Restaurant, { Irestaurant } from "../models/Restaurant.js";

export const createOrder = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { paymentMethod , addressId } = req.body;


  if (!addressId) {
    return res.status(400).json({
      message: "Address is Required",
    });
  }

  const address = await Address.findOne({
    _id: addressId,
    userId: user._id,
  });

  if (!address) {
    return res.status(404).json({
      message: "Address Not Found",
    });
  }

  const getDistanceKm  = (lat1:number , lon1:number , lat2:number , lon2:number):number=>{
    const R = 6371 ;
    const dLat = (lat2 - lat1) * Math.PI / 180.0;
    const dLon = (lon2 - lon1) * Math.PI / 180.0;

    const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos((lat1 * Math.PI)/180) * Math.cos((lat2 * Math.PI)/180) * Math.sin(dLon/2)*Math.sin(dLon/2) ;

    const c = 2 * Math.atan2(Math.sqrt(a) , Math.sqrt(1-a)) ;
    return  +(R*c).toFixed(2) ;
  };
   
 


  const cartItems = await Cart.find({
    userId: user._id,
  })
    .populate<{ itemId: IMenuItem }>("itemId")
    .populate<{ restaurantId: Irestaurant }>("restaurantId");

  if (cartItems.length === 0) {
    return res.status(400).json({
      message: "Cart is empty",
    });
  }

  const firstCartItem = cartItems[0];

  if (!firstCartItem || !firstCartItem.restaurantId) {
    return res.status(400).json({
      message: "Invalid cart data",
    });
  }

  const restaurantId = firstCartItem.restaurantId._id;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    return res.status(404).json({
      message: "No restaurant with this id",
    });
  }

  if (!restaurant.isOpen) {
    return res.status(400).json({
      message: "Sorry, this restaurant is closed for now",
    });
  }

   const distance = getDistanceKm(
    address.location.coordinates[1] ,
    address.location.coordinates[0] ,
    restaurant.autoLocation.coordinates[1],
    restaurant.autoLocation.coordinates[0]
  );

  let subTotal = 0;

  const orderItems = cartItems.map((cart) => {
    const item = cart.itemId;

    if (!item) {
      throw new Error("Invalid cart item");
    }

    const itemsTotal = item.price * cart.quantity;

    subTotal += itemsTotal;

    return {
      itemId: item._id.toString(),
      name: item.name,
      price: item.price,
      quantity: cart.quantity,
    };
  });

  const deliveryFee = subTotal < 250 ? 49 : 0;
  const platformFee = 10;
  const totalAmount = subTotal + deliveryFee + platformFee;

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  const [longitude, latitude] = address.location.coordinates;

  const riderAmount = Math.ceil(distance) * 25;

  const order = await Order.create({
    userId: user._id.toString(),
    restaurantId: restaurantId.toString(),
    restaurantName: restaurant.name,

    riderId: null,

    distance,
    riderAmount,

    items: orderItems,

    subTotal,
    deliveryFee,
    platformFee,
    totalAmount,

    addressId: address._id.toString(),

    deliveryAddress: {
      formattedAddress: address.formattedAddress,
      mobile: address.mobile,
      latitude,
      longitude,
    },

    paymentMethod,
    paymentStatus: "pending",

    status: "placed",

    expiresAt,
  });

  await Cart.deleteMany({
    userId: user._id,
  });

  res.json({
    message : "Order created Succesfully" ,
    orderId : order._id.toString(),
    amount : totalAmount 
  });
});


//Internal API 
export const fetchOrderForPayment = TryCatch(async(req ,res)=>{
    if(req.headers["x-internal-key"] !== process.env.INTERNAL_SERVICE_KEY){
        return res.status(403).json({
            message :"Forbidden" ,
        });
    }


    const order = await Order.findById(req.params.id) 

    if(!order){
        return res.status(404).json({
            message :"Order not found" ,
        });
    }

    if(order.paymentStatus !== "pending"){
        return res.status(400).json({
            message :"Order already paid" ,
        });
    }

    res.json({
        orderId : order._id ,
        amount : order.totalAmount ,
        currency : "INR" ,
    });
});


export const fetchRestaurantOrders = TryCatch(async(req:AuthenticatedRequest , res)=>{

  const user = req.user ;
  const {restaurantId} = req.params ;

  if(!user){
    return res.status(401).json({
      message : "Unauthorized" ,
    });
  }

  if(!restaurantId){
    return res.status(400).json({
      message : "Restaurant id is required" ,
    });
  }

  const limit = req.query.limit ? Number(req.query.limit) : 0 ;
  
  const orders = await Order.find({restaurantId , paymentStatus:"paid"}).sort({createdAt : -1}).limit(limit) ;

  return res.json({
    success : true ,
    count : orders.length , 
    orders ,
  });
});


const ALLOWED_STATUSES = ["accpeted" , "preparing" , "ready_for_rider"] as const  ;

export const updateOrderStatus = TryCatch(async(req:AuthenticatedRequest , res)=>{
    
    const user = req.user ;
    const {orderId} = req.params;
    const {status} = req.body ;

    if(!user){
      return res.status(401).json({
        message : "Unauthorized" ,
      });
    }

    if(!ALLOWED_STATUSES.includes(status)){
      return res.status(400).json({
        message : "Invalid order Status" ,
      });
    }

    const order = await Order.findById(orderId) ;

    if(!order){
      return res.status(404).json({
        message : "Order not found " ,
      });
    }

    if(order.paymentStatus !== "paid"){
      return res.status(404).json({
        message : "Order not completed" ,
      });
    }

    const restaurant = await Restaurant.findById(order.restaurantId) ;

    if(!restaurant){
      return res.status(404).json({
        message : "Restaurant not found" ,
      });
    }

    if(restaurant.ownerId !== user._id.toString()){
      return res.status(401).json({
        message : "You are not allowed to update this order" ,
      });
    }

    order.status = status ;

    await order.save() ;
    await axios.post(`${process.env.REALTIME_SERVICE}/api/v1/internal/emit` , {
      event : "order:update" ,
      room :`user:${order.userId}` ,
      payload : {
        orderId : order._id ,
        status: order.status ,
      },
    },{
      headers:{
        "x-internal-key":process.env.INTERNAL_SERVICE_KEY ,
      },
    });
    
    //now assign riders ;
    res.json({
      message : "order status updated successfully ",
      order ,
    });
  
});