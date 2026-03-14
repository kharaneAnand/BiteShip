import { useState } from "react";
import axios from "axios";
import type { IRestaurant } from "../types"
import { restaurantService } from "../main";
import toast from "react-hot-toast";
import { BiEdit, BiMapPin, BiSave } from "react-icons/bi";

interface props{
    restaurant : IRestaurant ;
    isSeller : boolean ;
    onUpdate : (restaurant : IRestaurant)=> void ;
}

const RestaurantProfile = ({restaurant , isSeller , onUpdate}:props) => {

    const [editMode , setEditMode] = useState(false) ;
    const [name , setName] = useState(restaurant.name) ;
    const [description , setDescription] = useState(restaurant.description) ;
    const [ isOpen , setIsOpen] = useState(restaurant.isOpen) ;
    const [loading , setLoading] = useState(false) 


    const toggleOpenStatus = async()=>{
        try {
            const {data} = await axios.put(`${restaurantService}/api/restaurant/status` , {status : !isOpen} ,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}` ,
                },
            }) ;

            toast.success(data.message) ;
            setIsOpen(data.restaurant.isOpen) 

            
        } catch (error:any) {
            console.log(error) ;
           toast.error(error?.response?.data?.message || "Something went wrong")
        }
    };

    const saveChanges = async() =>{
        try {
            setLoading(true) ;

            const {data} = await axios.put(`${restaurantService}/api/restaurant/edit` , {name , description} , {
                headers:{
                    Authorization :`Bearer ${localStorage.getItem("token")}` ,
                },
            });
           
            toast.success("Restaurant Updated") ;
            onUpdate(data.restaurant);
            setEditMode(false) ;
        } catch (error) {
            console.log(error) ;
            toast.error("Failed to Update ") ;
        }
        finally{
            setLoading(false) ;
        }
    };


return (
  <div className="group mx-auto max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">

    {
      restaurant.image && (
        <div className="relative overflow-hidden">
          <img
            src={restaurant.image}
            alt=""
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute right-3 top-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white shadow
            ${isOpen ? "bg-green-600" : "bg-red-600"}`}>
              {isOpen ? "OPEN" : "CLOSED"}
            </span>
          </div>
        </div>
      )
    }

    <div className="p-6 space-y-5">

      {
        isSeller && (
          <div className="flex items-start justify-between">
            <div className="flex-1">

              {
                editMode ? (
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-lg font-semibold outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-gray-900">
                    {restaurant.name}
                  </h2>
                )
              }

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <BiMapPin className="h-4 w-4 text-[#3B82F6]" />
                {
                  restaurant.autoLocation.formattedAddress || "Location is Unavailable"
                }
              </div>

            </div>

            <button
              onClick={() => setEditMode(!editMode)}
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            >
              <BiEdit size={18} />
            </button>
          </div>
        )
      }

      {
        editMode ? (
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
          />
        ) : (
          <p className="text-sm leading-relaxed text-gray-600">
            {restaurant.description || "NO description added"}
          </p>
        )
      }

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">

        <span className={`text-sm font-semibold ${isOpen ? "text-green-600" : "text-red-500"}`}>
          {isOpen ? "OPEN" : "CLOSED"}
        </span>

        <div className="flex gap-3">

          {
            editMode && (
              <button
                onClick={saveChanges}
                disabled={loading}
                className="flex items-center gap-1 rounded-lg bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] px-3 py-1.5 text-sm text-white shadow-sm transition hover:shadow-md"
              >
                <BiSave size={16} />
                Save
              </button>
            )
          }

          {
            isSeller && (
              <button
                onClick={toggleOpenStatus}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium text-white shadow-sm transition
                ${isOpen
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isOpen ? "Close Restaurant" : "Open Restaurant"}
              </button>
            )
          }

        </div>
      </div>

      <p className="text-xs text-gray-400">
        Created On {new Date(restaurant.createdAt).toLocaleDateString()}
      </p>

    </div>
  </div>
)
}

export default RestaurantProfile
