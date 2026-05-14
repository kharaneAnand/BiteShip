import { useParams } from "react-router-dom"
import { useSocket } from "../context/SocketContext";
import { useEffect, useState } from "react";
import type { Iorder } from "../types";
import { restaurantService } from "../main";
import axios from "axios";


const OrderPage = () => {

    const {id} = useParams() ;
    const {socket} = useSocket() ;

    const [order , setOrder] = useState<Iorder | null>(null) ;
    const[loading , setLoading] = useState(true) ;

    const fetchOrder = async()=>{
        try {
            const {data} = await axios.get(`${restaurantService}/api/order/${id}` , {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`,
                },
            });

            setOrder(data) ;
        } catch (error) {
            console.log(error) ;
        }finally{
            setLoading(false) ;
        }
    };

    useEffect(()=>{
        fetchOrder() ;
    },[id]) ;

    useEffect(()=>{
        if(!socket) return ;

        const onOrderUpdate = ()=>{
            fetchOrder() ;
        };

        socket.on("order:update" , onOrderUpdate) ;

        return()=>{
            socket.off("order:update" , onOrderUpdate) ;
        };
    },[socket]) ;

    if(loading){
        return <p className="text-center text-gray-500">Loading order...</p>
    }

    if(!order){
        return(
            <div className="flex min-h-[60vh] items-center jutify-center">
                <p className="text-gray-500">No order Found</p>
            </div>
        );
    }


 return (
  <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">

    {/* Header */}
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-100 opacity-40 blur-3xl"></div>

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="text-sm font-medium text-[#2563EB]">
            Live Order Tracking
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Order #{order._id.slice(-6)}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Track your order status and delivery details in real-time.
          </p>
        </div>

        <div
          className={`rounded-2xl px-5 py-3 text-sm font-semibold shadow-sm capitalize
          ${
            order.status === "delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "preparing"
              ? "bg-blue-100 text-blue-700"
              : order.status === "placed"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {order.status.replaceAll("_", " ")}
        </div>

      </div>

    </div>

    {/* Items */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Ordered Items
          </h2>

          <p className="text-sm text-gray-500">
            Delicious food prepared fresh for you.
          </p>
        </div>

        <div className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-[#2563EB]">
          {order.items.length} Items
        </div>

      </div>

      <div className="space-y-4">

        {
          order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/70 px-4 py-4 transition hover:bg-white hover:shadow-sm"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-[#2563EB] to-[#3B82F6] text-xl text-white shadow-sm">
                  🍽️
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Quantity : {item.quantity}
                  </p>
                </div>

              </div>

              <div className="text-right">

                <p className="text-lg font-bold text-gray-900">
                  ₹{item.price * item.quantity}
                </p>

                <p className="text-xs text-gray-500">
                  ₹{item.price} each
                </p>

              </div>

            </div>
          ))
        }

      </div>

    </div>

    {/* Delivery Address */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <div className="flex items-start gap-4">

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl shadow-sm">
          📍
        </div>

        <div className="flex-1">

          <h2 className="text-xl font-bold text-gray-900">
            Delivery Address
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {order.deliveryAddress.formattedAddress}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
            📞 {order.deliveryAddress.mobile}
          </div>

        </div>

      </div>

    </div>

    {/* Payment Summary */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">

      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Payment Summary
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Complete breakdown of your order charges.
        </p>
      </div>

      <div className="space-y-4">

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Subtotal
          </span>

          <span className="font-semibold text-gray-900">
            ₹{order.subTotal}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Delivery Fee
          </span>

          <span className="font-semibold text-gray-900">
            ₹{order.deliveryFee}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Platform Fee
          </span>

          <span className="font-semibold text-gray-900">
            ₹{order.platformFee}
          </span>
        </div>

      </div>

      <div className="border-t border-dashed border-gray-300 pt-4">

        <div className="flex items-center justify-between">

          <span className="text-lg font-bold text-gray-900">
            Grand Total
          </span>

          <span className="text-2xl font-bold text-[#2563EB]">
            ₹{order.totalAmount}
          </span>

        </div>

      </div>

      <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Payment Method
          </p>

          <p className="mt-2 text-sm font-semibold capitalize text-gray-900">
            {order.paymentMethod}
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
            Payment Status
          </p>

          <p className="mt-2 text-sm font-semibold capitalize text-green-700">
            {order.paymentStatus}
          </p>
        </div>

      </div>

    </div>

  </div>
);
}

export default OrderPage
