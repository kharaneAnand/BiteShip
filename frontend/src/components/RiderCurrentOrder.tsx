import axios from "axios";
import type { Iorder } from "../types"
import { riderService } from "../main";
import toast from "react-hot-toast";

interface Props {
    order : Iorder ;
    onStatusUpdate : ()=>void ;
}

const RiderCurrentOrder = ({order , onStatusUpdate}:Props) => {
    const updateStatus = async()=>{
        try {
            await axios.put(`${riderService}/api/rider/order/update/${order._id}` , {} ,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}` ,
                },
            });

            toast.success("Order Status updated") ;
            onStatusUpdate() ;
        } catch (error:any) {
            toast.error(error.response.data.message) ;
        }
    }
 return (
  <div className="relative overflow-hidden rounded-4xl py-5 border border-gray-200 bg-white p-6 shadow-sm">

    {/* Background Glow */}
    <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-blue-100/50 blur-3xl"></div>
    <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-cyan-100/40 blur-3xl"></div>

    {/* Top Accent */}
    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]"></div>

    <div className="relative space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
            Active Delivery
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Current Order
          </h1>
        </div>

        <div className="rounded-2xl bg-blue-50 px-4 py-2 shadow-sm">
          <p className="text-xs font-medium text-blue-500">
            Status
          </p>

          <p className="mt-1 text-sm font-bold capitalize text-[#2563EB]">
            {order.status.replace("_", " ")}
          </p>
        </div>

      </div>

      {/* Order Details */}
      <div className="space-y-4">

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-md">
              🍴
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">
                Pickup Restaurant
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {order.restaurantName}
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">

          <div className="flex items-start gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-md">
              📍
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">
                Delivery Address
              </p>

              <p className="mt-1 text-sm font-semibold leading-relaxed text-gray-900">
                {order.deliveryAddress.formattedAddress}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Earnings & Amount */}
      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-2xl border border-green-100 bg-green-50 p-4 shadow-sm">

          <p className="text-xs font-medium text-green-600">
            Order Total
          </p>

          <h3 className="mt-2 text-2xl font-bold text-green-700">
            ₹{order.totalAmount}
          </h3>

        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">

          <p className="text-xs font-medium text-[#2563EB]">
            Your Earnings
          </p>

          <h3 className="mt-2 text-2xl font-bold text-[#1E3A8A]">
            ₹{order.riderAmount}
          </h3>

        </div>

      </div>

      {/* Customer Phone */}
      {
        order.deliveryAddress.mobile && (

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

            <div className="flex items-center justify-between gap-4">

              <div>
                <p className="text-xs font-medium text-gray-500">
                  Customer Phone
                </p>

                <p className="mt-1 text-sm font-bold text-gray-900">
                  {order.deliveryAddress.mobile}
                </p>
              </div>

              <a
                href={`tel:${order.deliveryAddress.mobile}`}
                className="rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                Call
              </a>

            </div>

          </div>
        )
      }

      {/* Action Buttons */}
      <div className="space-y-3">

        {
          order.status === "rider_assigned" && (
            <button
              onClick={() => updateStatus()}
              className="w-full rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
            >
              Reached Restaurant
            </button>
          )
        }

        {
          order.status === "picked_up" && (
            <button
              onClick={() => updateStatus()}
              className="w-full rounded-2xl bg-linear-to-r from-green-500 to-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
            >
              Mark as Delivered
            </button>
          )
        }

      </div>

    </div>

  </div>
)
}

export default RiderCurrentOrder
