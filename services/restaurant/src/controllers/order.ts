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

  const { paymentMethod, distance, addressId } = req.body;

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