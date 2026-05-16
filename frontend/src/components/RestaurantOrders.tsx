import { useEffect, useRef, useState } from "react"
import type { Iorder } from "../types"
import { useSocket } from "../context/SocketContext";
import audio from '../assets/restaurant.mp3';
import axios from "axios";
import { restaurantService } from "../main";
import OrderCard from "./OrderCard";


const ACTIVE_STATUSES = [ "placed" ,"accepted" , "preparing" ,"ready_for_rider", "rider_assigned" , 
    "picked_up" ]

const RestaurantOrders = ({restaurantId}:{restaurantId : string}) => {

    const [orders , setOrders] = useState<Iorder[]>([]);
    const [loading , setLoading] = useState(true) ;
    const [audioUnlocked , setAudioLocked] = useState(false) ;

    const {socket} = useSocket() ;

    const audioRef = useRef<HTMLAudioElement | null>(null) ;


    useEffect(()=>{
        audioRef.current = new Audio(audio) ;
        audioRef.current.load() ;
    },[]);


    const unlockAudio = ()=>{
        if(audioRef.current){
            audioRef.current.play().then(()=>{
                audioRef.current!.pause() ;
                audioRef.current!.currentTime = 0 ;
                setAudioLocked(true) ;
                console.log("Audio unlocked") ;
            }).catch((err)=>{
                console.log("Failed to unlock audio : " , err) ;
            });
        }
    };

    const fetchOrders = async()=>{
        try {
            const {data} = await axios.get(`${restaurantService}/api/order/restaurant/${restaurantId}`,{
                headers:{
                    Authorization : `Bearer ${localStorage.getItem("token")}` ,
                },
            });

            setOrders(data.orders || []) ;
        } catch (error) {
            console.log(error) ;
        }finally{
            setLoading(false) ;
        }
    };

    useEffect(()=>{
        fetchOrders() ;
    },[restaurantId]) ;

    useEffect(()=>{
        if(!socket) return ;

        const onNewOrder = ()=>{
            console.log("New Order Recived (socket)") ;

            if(audioUnlocked && audioRef.current){
            audioRef.current.currentTime = 0 ;
            audioRef.current.play().catch((err)=>{
                console.error("Audio play failed: " , err) ;
            });
         }
         fetchOrders() ;
        };

        socket.on("order:new" , onNewOrder) 

        return()=>{
            socket.off("order:new" , onNewOrder) 
        };
    } , [socket , audioUnlocked]) ;

    useEffect(()=>{
      if(!socket) return ;

      const onUpdateOrder = ()=>{
        fetchOrders() 
      }

      socket.on("order:rider_assigned" , onUpdateOrder) ;
      return()=>{
        socket.off("order:rider_assigned" , onUpdateOrder);
      };
    },[socket]) ;


    if(loading){
        return <p className="text-gray-500"> Loading Orders </p> ;
    }

    const activeOrders = orders.filter((o)=>ACTIVE_STATUSES.includes(o.status)) ;
    const completedOrders = orders.filter((o)=>!ACTIVE_STATUSES.includes(o.status)) ;

return (
  <div className="space-y-8">

    {/* Sound Notification Banner */}
    {
      !audioUnlocked && (
        <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-linear-to-r from-blue-50 via-white to-cyan-50 p-6 shadow-sm">

          {/* Glow */}
          <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-blue-200/40 blur-3xl"></div>
          <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-cyan-200/40 blur-3xl"></div>

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] text-3xl shadow-lg">
                🔔
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Enable Sound Notifications
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Stay updated instantly whenever a new order arrives.
                </p>
              </div>

            </div>

            <button
              onClick={unlockAudio}
              className="rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              Enable Sound
            </button>

          </div>

        </div>
      )
    }

    {/* Active Orders */}
    <div className="space-y-5">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Active Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Orders currently being prepared or delivered.
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
          {activeOrders.length} Active
        </div>

      </div>

      {
        activeOrders.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-5xl shadow-inner">
              📦
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-800">
              No Active Orders
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Incoming orders will appear here in real-time.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {
              activeOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusUpdate={fetchOrders}
                />
              ))
            }

          </div>
        )
      }

    </div>

    {/* Completed Orders */}
    <div className="space-y-5">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Completed Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Successfully delivered orders history.
          </p>
        </div>

        <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm">
          {completedOrders.length} Completed
        </div>

      </div>

      {
        completedOrders.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-5xl shadow-inner">
              🚚
            </div>

            <h3 className="mt-5 text-xl font-bold text-gray-800">
              No Completed Orders
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Delivered orders will appear here.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {
              completedOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusUpdate={fetchOrders}
                />
              ))
            }

          </div>
        )
      }

    </div>

  </div>
)
};

export default RestaurantOrders
