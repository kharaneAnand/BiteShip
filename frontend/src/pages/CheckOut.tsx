import { useEffect, useState } from "react";
import { useAppData } from "../context/AppContext";
import axios from "axios";
import { restaurantService, utilsService } from "../main";
import { useNavigate } from "react-router-dom";
import type { ICart, IMenuItem, IRestaurant  } from "../types";
import toast from "react-hot-toast";
import { BiCreditCard, BiLoader } from "react-icons/bi";

interface Address{
  _id : string ;
  formattedAddress : string ;
  mobile : number ;
}


const CheckOut = () => {

  const {cart , subTotal , quantity} = useAppData() ;

  const [addresses , setAddresses] = useState<Address[]>([]) ;
  const [selectedAddressId , setSelectedAddressId] = useState<string |null>(null) ;
  const [loadingAddress , setLoadingAddress] = useState(true) ;
  const [loadingRazorpay , setLoadingRazorpay] = useState(false);
  const [loadingStripe , setLoadingStripe] = useState(false) ;
  const [creatingOrder , setCreatingOrder] = useState(false) ;


  useEffect(()=>{
    const fetchAddresses = async()=>{
      if(!cart || cart.length===0){
        setLoadingAddress(false) 
        return 
      }
      try {
        
        const {data} = await axios.get(`${restaurantService}/api/address/all` ,{
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}` ,
          },
        });

        setAddresses(data || []) ;

      } catch (error) {
        console.log(error) ;
      }finally{
        setLoadingAddress(false) ;
      }
    };

    fetchAddresses() ;
  } , [cart]) ;

   const navigate = useNavigate() ;
  

  if(!cart || cart.length === 0){
    return <div className="flex min-h-[60vh] item-center justify-center">
      <p className="text-gray-500 text-lg">Your Cart is Empty </p>
    </div>
  }


 
  const restaurant = cart[0].restaurantId as IRestaurant 
  const deliveryFee = subTotal < 250 ? 49 : 0 ;
  const platformFee = 10 ;
  const grandTotal = subTotal + deliveryFee + platformFee ;

  const createOrder = async(paymentMethod:"razorpay" | "stripe")=>{
    if(!selectedAddressId) return null ;

    setCreatingOrder(true) ;

    try {
      const {data} = await axios.post(`${restaurantService}/api/order/new` , {
        paymentMethod ,
        addressId : selectedAddressId ,
      },{
        headers:{
          Authorization : `Bearer ${localStorage.getItem("token")}` ,
        },
      });

      return data ;
    } catch (error) {
      toast.error("Failed to create order") ;
    }finally{
      setCreatingOrder(false) ;
    }
  };

  const payWithRazorpay = async()=>{

    try {
      setLoadingRazorpay(true) 

      const order = await createOrder("razorpay") 
      if(!order) return ;

      const {orderId , amount} = order 
      const {data} = await axios.post(`${utilsService}/api/payment/create` , {
        orderId
      }) 

      const {razorpayOrderId , key} = data ;

      const options = {
        key ,
        amount: amount * 100 ,
        currency : "INR" ,
        name : "BiteShip" ,
        description :"Food Order Payment" ,
        order_id : razorpayOrderId ,

        handler: async(response:any)=>{
          try {
            await axios.post(`${utilsService}/api/payment/verify` , {
              razorpay_order_id :response.razorpay_order_id ,
              razorpay_payment_id: response.razorpay_payment_id ,
              razorpay_signature : response.razorpay_signature , 
              orderId ,
            });

            toast.success("payment successfull 🎉") ;
            navigate('/paymentsuccess/' + response.razorpay_payment_id) ;
          } catch (error) {
            toast.error("Payment verification failed") ;
          }
        },
        theme :{
          color : "#3B82F6"
        },
      };

      const razorpay = new (window as any).Razorpay(options) ;
      razorpay.open()
    } catch (error) {
      console.log(error) ;
      toast.error("payment Failed Please refresh page") ;
    }finally{
      setLoadingRazorpay(false) ;
    }
  };

  const payWithStripe = async()=>{
      try {

        setLoadingStripe(true);
        
        const order = await createOrder("stripe") 
        if(!order) return ;

        console.log("Stripe Checkout" , order) ;
      } catch (error) {
        console.log(error) ;
        toast.error("payment failed") 
      } finally{
        setLoadingStripe(false) ;
      }
  };

 return (
  <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">

    {/* Heading */}
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Checkout
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Review your order and complete payment securely.
      </p>
    </div>

    {/* Restaurant Info */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {restaurant.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {restaurant.autoLocation.formattedAddress}
          </p>
        </div>

        <div className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm
          ${restaurant.isOpen
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
          }`}
        >
          {restaurant.isOpen ? "Open" : "Closed"}
        </div>

      </div>

    </div>

    {/* Address Section */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">

      <div className="flex items-center justify-between">

        <h3 className="text-lg font-bold text-gray-900">
          Delivery Address
        </h3>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2563EB]">
          {addresses.length} Saved
        </span>

      </div>

      {
        loadingAddress ? (
          <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">
            Loading Addresses ...
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-500">
            No Address found . please add one
          </div>
        ) : addresses.map((add) => (
          <label
            key={add._id}
            className={`flex cursor-pointer gap-4 rounded-2xl border p-4 transition-all duration-300
            ${selectedAddressId === add._id
              ? "border-[#2563EB] bg-blue-50 shadow-sm"
              : "border-gray-200 hover:bg-gray-50"
            }`}
          >

            <input
              type="radio"
              checked={selectedAddressId === add._id}
              onChange={() => setSelectedAddressId(add._id)}
              className="mt-1 accent-[#2563EB]"
            />

            <div>
              <p className="text-sm font-semibold text-gray-900">
                {add.formattedAddress}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {add.mobile}
              </p>
            </div>

          </label>
        ))
      }
    </div>

    {/* Order Summary */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">

      <h3 className="text-lg font-bold text-gray-900">
        Order Summary
      </h3>

      <div className="space-y-3">
        {
          cart.map((cartItem: ICart) => {

            const item = cartItem.itemId as IMenuItem;

            return (
              <div
                className="flex items-center justify-between text-sm"
                key={cartItem._id}
              >

                <span className="text-gray-700">
                  {item.name} X {cartItem.quantity}
                </span>

                <span className="font-medium text-gray-900">
                  ₹{item.price * cartItem.quantity}
                </span>

              </div>
            )
          })
        }
      </div>

      <div className="border-t border-dashed border-gray-300 pt-4 space-y-3">

        <div className="flex justify-between text-sm text-gray-600">
          <span>Items ({quantity})</span>
          <span className="font-medium text-gray-900">
            ₹{subTotal}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery Fee</span>

          <span className="font-medium text-gray-900">
            {deliveryFee === 0 ? "Free" : `₹ ${deliveryFee}`}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Platform Fee</span>

          <span className="font-medium text-gray-900">
            ₹{platformFee}
          </span>
        </div>

      </div>

      {subTotal < 250 && (
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-[#2563EB]">
          Add Item Worth ₹{250 - subTotal} more to get Free delivery
        </div>
      )}

      <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
        <span>Grand Total</span>
        <span>₹{grandTotal}</span>
      </div>

    </div>

    {/* Payment Section */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">

      <h3 className="text-lg font-bold text-gray-900">
        Payment Method
      </h3>

      <button
        onClick={payWithRazorpay}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#2563EB] to-[#3B82F6] py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50"
        disabled={!selectedAddressId || loadingRazorpay || creatingOrder}
      >
        {loadingRazorpay ? (
          <BiLoader size={18} className="animate-spin" />
        ) : (
          <BiCreditCard size={18} />
        )}

        Pay With Razorpay
      </button>

      <button
        onClick={payWithStripe}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-gray-800 hover:shadow-lg disabled:opacity-50"
        disabled={!selectedAddressId || loadingStripe || creatingOrder}
      >
        {loadingStripe ? (
          <BiLoader size={18} className="animate-spin" />
        ) : (
          <BiCreditCard size={18} />
        )}

        Pay With Stripe
      </button>

    </div>

  </div>
)
}

export default CheckOut
