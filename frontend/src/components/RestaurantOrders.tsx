import { useEffect, useRef, useState } from "react"
import type { Iorder } from "../types"
import { useSocket } from "../context/SocketContext";
import audio from '../assets/restaurant.mp3';
import axios from "axios";
import { restaurantService } from "../main";


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
            const {data} = await axios.get(`${restaurantService}/api/order/${restaurantId}`,{
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


    if(loading){
        return <p className="text-gray-500"> Loading Orders </p> ;
    }

    const activeOrders = orders.filter((o)=>ACTIVE_STATUSES.includes(o.status)) ;
    const completedOrders = orders.filter((o)=>!ACTIVE_STATUSES.includes(o.status)) ;

 return (
  <div className="space-y-8">

    {/* Enable Sound Notification */}
    {
      !audioUnlocked && (
        <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-linear-to-r from-blue-50 via-white to-cyan-50 p-5 shadow-sm">

          {/* Glow */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-200 opacity-30 blur-3xl"></div>

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-[#2563EB] to-[#3B82F6] text-2xl shadow-md">
                🔔
              </div>

              <div>
                <p className="text-lg font-bold text-gray-900">
                  Enable Sound Notifications
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  Get instantly notified whenever new orders arrive.
                </p>
              </div>

            </div>

            <button
              onClick={unlockAudio}
              className="rounded-2xl bg-linear-to-r from-[#2563EB] to-[#3B82F6] px-5 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
            >
              Enable Sound
            </button>

          </div>

        </div>
      )
    }

    {/* Active Orders */}
    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Active Orders
          </h3>

          <p className="text-sm text-gray-500">
            Orders currently being prepared or delivered.
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700 shadow-sm">
          {activeOrders.length} Active
        </div>

      </div>

      {
        activeOrders.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
              📦
            </div>

            <h4 className="mt-4 text-lg font-semibold text-gray-800">
              No Active Orders
            </h4>

            <p className="mt-1 text-sm text-gray-500">
              New incoming orders will appear here.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {
              activeOrders.map((order) => (

                <div
                  key={order._id}
                  className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* Glow */}
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-100 opacity-40 blur-2xl"></div>

                  <div className="relative space-y-4">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                          Order ID
                        </p>

                        <h4 className="mt-1 font-mono text-sm font-semibold text-gray-900 break-all">
                          {order._id}
                        </h4>
                      </div>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 shadow-sm">
                        Active
                      </span>

                    </div>

                    <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-4">

                      <p className="text-sm text-gray-500">
                        Preparing order...
                      </p>

                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span className="text-xs font-medium text-green-600">
                          Live
                        </span>
                      </div>

                    </div>

                  </div>

                </div>
              ))
            }

          </div>
        )
      }

    </div>

    {/* Completed Orders */}
    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Completed Orders
          </h3>

          <p className="text-sm text-gray-500">
            Successfully delivered orders history.
          </p>
        </div>

        <div className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-700 shadow-sm">
          {completedOrders.length} Completed
        </div>

      </div>

      {
        completedOrders.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
              🚚
            </div>

            <h4 className="mt-4 text-lg font-semibold text-gray-800">
              No Completed Orders
            </h4>

            <p className="mt-1 text-sm text-gray-500">
              Delivered orders will appear here.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {
              completedOrders.map((order) => (

                <div
                  key={order._id}
                  className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* Glow */}
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-100 opacity-40 blur-2xl"></div>

                  <div className="relative space-y-4">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Order ID
                        </p>

                        <h4 className="mt-1 font-mono text-sm font-semibold text-gray-900 break-all">
                          {order._id}
                        </h4>
                      </div>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 shadow-sm">
                        Delivered
                      </span>

                    </div>

                    <div className="border-t border-dashed border-gray-200 pt-4">

                      <p className="text-sm text-gray-500">
                        Order completed successfully 🎉
                      </p>

                    </div>

                  </div>

                </div>
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
