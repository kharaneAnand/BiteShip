import type { Iorder } from "../types" ;
import {useState , useEffect} from 'react' ;
import {MapContainer , TileLayer , Marker , Popup , useMap} from 'react-leaflet' ;
import * as L from 'leaflet' ;
import 'leaflet/dist/leaflet.css' ;
import 'leaflet-routing-machine' ;
import axios  from "axios"; 
import {realtimeService} from '../main'


declare module "leaflet"{
    namespace Routing{
        function control (options : any) : any ;
        function osrmv1(options?:any) : any ;
    }
}


const riderIcon = new L.DivIcon({
    html : "🛵" ,
    iconSize : [30 , 30],
    className:"",
});


const deliveryIcon = new L.DivIcon({
    html:"📦",
    iconSize:[30 , 30] ,
    className:"" ,
});


interface Props{
    order : Iorder ,
}

const Routing = ({
    from ,
    to 
}:{
    from :[number , number] ,
    to : [number , number ] 
})=>{
    const map = useMap() ;

    useEffect(()=>{
        const control = L.Routing.control({
            waypoints :[L.latLng(from) , L.latLng(to)] ,
            lineOptions:{
                styles :[{color : "#E23744" , weight:5}] ,
            },
            addWaypoints : false ,
            draggableWaypoints : false ,
            show : false ,
            createMarker:()=>null ,
            router : L.Routing.osrmv1({
                serviceUrl : "https://router.project-osrm.org/route/v1"
            })
        }).addTo(map) ;

        return ()=>{
            map.removeControl(control) ;
        }
    } , [from , to , map]);

    return null ;
};


const RiderOrderMap = ({ order }:Props) => {

    const [riderLocation , setRiderLocation] =useState<[number , number] | null >(null) ;

    if(order.deliveryAddress.latitude == null || order.deliveryAddress.longitude == null) return null ;

    const deliveryLocation : [number , number] = [
        order.deliveryAddress.latitude ,
        order.deliveryAddress.longitude ,
    ];

    useEffect(()=>{
        const fetchLocation = ()=>{
            navigator.geolocation.getCurrentPosition((pos)=>{
                const latitude = pos.coords.latitude ;
                const longitude = pos.coords.longitude ;

                setRiderLocation([latitude , longitude]) ;

                axios.post(`${realtimeService}/api/v1/internal/emit`,{
                    event:"rider:location" ,
                    room:`user:${order.userId}` ,
                    payload:{latitude , longitude} ,
                },{
                    headers:{
                        "x-internal-key":import.meta.env.VITE_INTERNAL_SERVICE_KEY ,
                    },
                });
            } , (err)=> console.log("location error :- " , err),{
                enableHighAccuracy:true ,
                maximumAge:5000 ,
                timeout:10000,
            });
        };

        fetchLocation() ;
        const interval = setInterval(fetchLocation , 10000) ;

        return ()=>clearInterval(interval) ;
    },[order.userId]);

    if(!riderLocation) return null ;


 return (
  <div className="relative overflow-hidden rounded-3xl  border border-gray-200 bg-white p-4 shadow-sm">

    {/* Background Glow */}
    <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-blue-100/50 blur-3xl"></div>
    <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-100/40 blur-3xl"></div>

    <div className="relative space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Live Delivery Tracking
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Navigate smoothly to the customer location.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 shadow-sm">

          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>

          <span className="text-xs font-semibold text-blue-700">
            Live Route
          </span>

        </div>

      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-3">

        <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3">

          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Pickup
          </p>

          <p className="mt-1 text-sm font-medium text-gray-800">
            Restaurant
          </p>

        </div>

        <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-3">

          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
            Destination
          </p>

          <p className="mt-1 text-sm font-medium text-gray-800">
            Customer
          </p>

        </div>

      </div>

      {/* Map */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">

        <MapContainer
          center={riderLocation}
          zoom={14}
          className="h-130 w-full"
        >

          <TileLayer
            attribution="&copy; openStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={riderLocation} icon={riderIcon}>
            <Popup>
              🚴 You (Rider)
            </Popup>
          </Marker>

          <Marker position={deliveryLocation} icon={deliveryIcon}>
            <Popup>
              📍 Delivery Location
            </Popup>
          </Marker>

          <Routing
            from={riderLocation}
            to={deliveryLocation}
          />

        </MapContainer>

      </div>

      {/* Bottom Status */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 md:flex-row md:items-center md:justify-between">

        <div>
          <p className="text-sm font-semibold text-gray-900">
            Navigation Active
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Follow the highlighted route for faster delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">

          <span className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>

          <span className="text-xs font-semibold text-green-600">
            GPS Connected
          </span>

        </div>

      </div>

    </div>

  </div>
)
}

export default RiderOrderMap
