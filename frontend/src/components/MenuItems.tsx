import { useState } from "react";
import type { IMenuItem } from "../types"
import { FiEyeOff } from "react-icons/fi";
import { BsCart, BsEye } from "react-icons/bs";
import { BiTrash } from "react-icons/bi";
import { VscLoading } from "react-icons/vsc";
import axios from "axios";
import { restaurantService } from "../main";
import toast from "react-hot-toast";

interface MenuItemsProps{
  items : IMenuItem[] ;
  onItemDeleted : ()=>void ;
  isSeller : boolean 
}
const MenuItems = ({items , onItemDeleted , isSeller} : MenuItemsProps)=>{

  const [loadingItemId , setLoadingItemId] = useState<string|null>(null) ;

  const handleDelete = async(itemId : string)=>{
      const confirm = window.confirm("are you sure you want to delete this item") ;
      if(!confirm) return ;

      try {
        await axios.delete(`${restaurantService}/api/item/${itemId}` , {
          headers : {
            Authorization : `Bearer ${localStorage.getItem("token")}`,
          },
        });

        toast.success("Item deleted") ;
        onItemDeleted() ;
      } catch (error) {
        console.log(error) ;
        toast.error("Failed to delete item") ;
      }
  }

    const toggleAvailiblity = async(itemId : string)=>{
     
      try {
         const {data} = await axios.put(`${restaurantService}/api/item/status/${itemId}`,{} , {
          headers : {
            Authorization : `Bearer ${localStorage.getItem("token")}`,
          },
        });

        toast.success(data.message) ;
        onItemDeleted() ;
      } catch (error) {
        console.log(error) ;
        toast.error("Failed to Update Status") ;
      }
  }
  
 return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> 
{
  items.map((item)=>{
    const isLoading = loadingItemId === item._id  ;

    return <div key={item._id} className={`group relative flex gap-4 rounded-2xl bg-white p-4 shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${!item.isAvailable ? "opacity-70" : ""}`}>
      
      <div className="relative shrink-0 overflow-hidden rounded-lg">
        <img 
          src={item.image} 
          alt=""  
          className={`h-20 w-20 object-cover transition-transform duration-300 group-hover:scale-105 ${!item.isAvailable ? "grayscale brightness-75" :""}`}
        />
        {
          !item.isAvailable && (
            <span className="absolute inset-0 flex items-center justify-center rounded bg-black/60 text-xs font-semibold text-white">
              Not Available
            </span>
          )
        }
      </div>

      <div className="flex flex-1 flex-col justify-between">

        <div>
          <h3 className="font-semibold text-gray-900">
            {item.name}
          </h3>
          {
            item.description && (
              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )
          }
        </div>
        
        <div className="flex items-center justify-between">
          
          <p className="font-semibold text-gray-900">
            ₹{item.price}
          </p>

          {
            isSeller && (
              <div className="flex gap-2">
                <button 
                  onClick={()=>toggleAvailiblity(item._id)} 
                  className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-[#3B82F6]"
                >
                  {item.isAvailable ? <BsEye size={18}/> : <FiEyeOff size={18}/>}
                </button>

                <button 
                  onClick={()=>handleDelete(item._id)} 
                  className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                >
                  <BiTrash size={18} />
                </button>
              </div>
            )
          }

          {
            !isSeller && (
              <button 
                disabled={!item.isAvailable || isLoading} 
                onClick={()=>{}} 
                className={`flex items-center justify-center rounded-lg p-2 transition ${
                  !item.isAvailable || isLoading 
                  ? "cursor-not-allowed text-gray-400" 
                  : "text-[#3B82F6] hover:bg-blue-50"
                }`}
              >
                {
                  isLoading 
                  ? <VscLoading size={18} className="animate-spin"/> 
                  : <BsCart size={18}/>
                }
              </button>
            )
          }

        </div>

      </div>
    </div>
  })
} 
</div>;
}



export default MenuItems
