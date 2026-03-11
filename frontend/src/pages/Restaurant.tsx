import { useEffect, useState } from "react"
import type { IRestaurant } from "../types" ;
import axios from "axios";
import { restaurantService } from "../main";
import AddRestaurant from "../components/AddRestaurant";

const Restaurant = () => {

  const [restaurant , setRestaurant ] = useState<IRestaurant | null>(null) ;
  const [loading , setLoading] = useState(true) ;

  const featchMyRestaurant = async()=>{
    try {
      
      const {data} = await axios.get(`${restaurantService}/api/restaurant/my` , {
        headers:{
          Authorazation :`Bearer${localStorage.getItem("token")}` ,
        },
      }) ;


      setRestaurant(data.restaurant || null) 
      if(data.token){
        localStorage.setItem("token" , data.token);
      }

    } catch (error) {
      console.log(error) ;
    }
    finally{
      setLoading(false) ;
    }
  };

  useEffect(()=>{
    featchMyRestaurant() 
   } , []) ;

  if(loading){
    return <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Loading Your Restaurant ... </p>
    </div>
  };


  if(!restaurant){
    return <AddRestaurant/> ;
  }

  return (
    <div>
        Restaurant
    </div>
  )
}

export default Restaurant
