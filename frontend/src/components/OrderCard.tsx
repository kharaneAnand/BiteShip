import { useEffect, useState } from "react";
import type { Iorder } from "../types";
import { ORDER_ACTIONS } from "../utils/orderflow";
import { restaurantService } from "../main";
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  order: Iorder;
  onStatusUpdate?: () => void;
}

const statusColor = (status: string) => {
  switch (status) {
    case "placed":
      return "bg-yellow-100 text-yellow-700";

    case "accepted":
      return "bg-orange-100 text-orange-700";

    case "preparing":
      return "bg-blue-100 text-blue-700";

    case "ready_for_rider":
      return "bg-indigo-100 text-indigo-700";

    case "picked_up":
      return "bg-purple-100 text-purple-700";

    case "delivered":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const OrderCard = ({ order, onStatusUpdate }: Props) => {
  const [loading, setLoading] = useState(false);
  const [retryVisible , setRetryVisible] = useState(false) ;


  const actions = ORDER_ACTIONS[order.status] || [];

  useEffect(()=>{
    if(order.status !== "ready_for_rider"){
      setRetryVisible(false) ;
      return ;
    }

    const timer = setTimeout(()=>{
      setRetryVisible(true)
     , 10000})
     return ()=> clearTimeout(timer) 
  } , [order.status])


  const updateStatus = async (status: string) => {
    try {
      setLoading(true);
      setRetryVisible(false) ;
      await axios.put(
        `${restaurantService}/api/order/${order._id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Order updated");

      onStatusUpdate?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

    {/* Glow */}
    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100 opacity-40 blur-3xl"></div>

    <div className="relative space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#3B82F6]">
            Order ID
          </p>

          <h3 className="mt-1 font-mono text-sm font-bold text-gray-900">
            #{order._id.slice(-6)}
          </h3>
        </div>

        <span
          className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm ${statusColor(
            order.status
          )}`}
        >
          {order.status.replaceAll("_", " ")}
        </span>

      </div>

      {/* Items */}
      <div className="rounded-2xl bg-gray-50 p-4 space-y-2">

        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Ordered Items
        </p>

        <div className="space-y-2">
          {
            order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >

                <span className="text-gray-700">
                  {item.name}
                </span>

                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-800 shadow-sm">
                  x{item.quantity}
                </span>

              </div>
            ))
          }
        </div>

      </div>

      {/* Total + Payment */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3">

        <div>
          <p className="text-xs text-gray-500">
            Payment Status
          </p>

          <p className={`mt-1 text-sm font-semibold ${
            order.paymentStatus === "paid"
              ? "text-green-600"
              : "text-red-500"
          }`}>
            {order.paymentStatus}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-500">
            Total Amount
          </p>

          <p className="mt-1 text-lg font-bold text-gray-900">
            ₹{order.totalAmount}
          </p>
        </div>

      </div>

      {/* Action Buttons */}
      {
        order.paymentStatus === "paid" && actions.length > 0 && (

          <div className="flex flex-wrap gap-3 pt-1">

            {
              actions.map((status) => (

                <button
                  key={status}
                  disabled={loading}
                  onClick={() => updateStatus(status)}
                  className="rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                >
                  {
                    loading
                      ? "Updating..."
                      : `Mark as ${status.replaceAll("_", " ")}`
                  }
                </button>
              ))
            }

          </div>
        )
      }

    </div>

   {order.status === "ready_for_rider" && retryVisible && (

  <div className="relative overflow-hidden rounded-2xl border border-blue-200 bg-linear-to-r from-blue-50 via-white to-cyan-50 p-4 shadow-sm">

    {/* Glow Effect */}
    <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-200 opacity-30 blur-2xl"></div>

    <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <p className="text-sm font-semibold text-[#2563EB]">
          Rider not assigned yet
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Retry sending this order to nearby riders.
        </p>
      </div>

      <button
        className="rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
        onClick={() => updateStatus("ready_for_rider")}
      >
        Retry Ready for Rider
      </button>

    </div>

  </div>
)}
  </div>
)
};

export default OrderCard;