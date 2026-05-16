import { useEffect, useState } from "react";
import { riderService } from "../main";
import axios from "axios";
import toast from "react-hot-toast";

interface Props{
    orderId : string ;
    onAccpeted:()=>void ;
}

const RiderOrderRequest = ({orderId , onAccpeted}:Props) => {

    const [accpeting , setAccepting] = useState(false) ;
    const [secondsLeft , setSecondsLeft] = useState(10) ;

    useEffect(()=>{
        const interval = setInterval(()=>{
            setSecondsLeft((prev)=>{
                if(prev <= 1){
                    clearInterval(interval);
                    onAccpeted() ;
                    return 0 ;
                }
                return prev-1 ;
            });
        } ,1000);
        return ()=>clearInterval(interval) ;
    },[onAccpeted]); 

    const acceptOrder = async()=>{
        try {
            await axios.post(`${riderService}/api/rider/accept/${orderId}`,{},{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`,
                },
            });

            toast.success("order Accepted") ;
            onAccpeted() ;
        } catch (error:any) {
            toast.error(error.response.data.message);
            onAccpeted() ;
        }finally{
            setAccepting(false) ;
        }
    };

  return (
  <div className="group relative overflow-hidden rounded-3xl border border-blue-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

    {/* Background Glow */}
    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-100/50 blur-3xl"></div>
    <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-cyan-100/40 blur-3xl"></div>

    {/* Top Gradient Line */}
    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#1E3A8A] via-[#2563EB] to-[#3B82F6]"></div>

    <div className="relative space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#2563EB]">
            New Delivery Request
          </p>

          <h3 className="mt-1 text-lg font-bold text-gray-900">
            Order #{orderId.slice(-6)}
          </h3>
        </div>

        <div className="rounded-2xl bg-red-50 px-4 py-2 text-center shadow-sm">
          <p className="text-xs font-medium text-red-500">
            Accept Within
          </p>

          <p className="text-lg font-bold text-red-600">
            {secondsLeft}s
          </p>
        </div>

      </div>

      {/* Info Card */}
      <div className="rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50 to-cyan-50 p-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] text-xl text-white shadow-md">
            🚚
          </div>

          <div>
            <p className="text-sm font-semibold text-[#1E3A8A]">
              Nearby delivery available
            </p>

            <p className="mt-1 text-xs text-blue-700/80">
              Accept quickly to start delivery and earn rewards.
            </p>
          </div>

        </div>

      </div>

      {/* Accept Button */}
      <button
        disabled={accpeting}
        onClick={acceptOrder}
        className="w-full rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-50"
      >
        {accpeting ? "Accepting..." : "Accept Order"}
      </button>

    </div>

  </div>
)
}

export default RiderOrderRequest
