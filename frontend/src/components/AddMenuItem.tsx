import axios from "axios";
import { useState } from "react"
import { restaurantService } from "../main";
import { BiUpload } from "react-icons/bi";
import toast from "react-hot-toast";

const AddMenuItem = ({onItemAdded} : {onItemAdded:()=>void}) => {

    const [name , setName] = useState("")
    const[description , setDescription] = useState("") ;
    const [price , setPrice] = useState("") ;
    const [image , setImage] = useState<File | null>(null) ;  
    const [loading , setLoading] = useState(false) ;


    const resetForm = ()=>{
        setName("") 
        setDescription("")
        setPrice("") ;
        setImage(null) ;
    };

    const handleSubmit = async()=>{
        if(!name || !price || !image){
            alert("Name price and image is required") ;
            return ;
        }

        const formData = new FormData() 

        formData.append("name" , name) ;
        formData.append("description" , description) ;
        formData.append("price" , price) ;
        formData.append("file" , image) ;


        try {
            setLoading(true) ;
            await axios.post(`${restaurantService}/api/item/new` , formData,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`,
                },
            });

            toast.success("Item added  successfully") 
            resetForm() ;
            onItemAdded() ;
        } catch (error) {
            console.log(error);
            toast.error("Failed to add Item") ;
        }finally{
            setLoading(false) ;
        }
    };

 return (
  <div className="max-w-md space-y-5 m-auto rounded-2xl bg-white border border-gray-200 shadow-sm p-6">
    
    <h2 className="text-xl font-semibold text-gray-900">
      Add Menu Item
    </h2>

    <input
      type="text"
      placeholder="Item name "
      value={name}
      onChange={e => setName(e.target.value)}
      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
    />

    <textarea
      placeholder="Item description "
      value={description}
      onChange={e => setDescription(e.target.value)}
      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
    />

    <input
      type="number"
      placeholder="Price ₹ "
      value={price}
      onChange={e => setPrice(e.target.value)}
      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
    />

    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 p-4 text-sm text-gray-600 transition hover:bg-gray-50">
      <BiUpload className="h-5 w-5 text-[#3B82F6]" />
      {image ? image.name : "Upload Item image"}
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={e => setImage(e.target.files?.[0] || null)}
      />
    </label>

    <button
      disabled={loading}
      onClick={handleSubmit}
      className="w-full rounded-xl text-white text-sm py-3 font-semibold transition shadow-sm hover:shadow-md active:scale-[0.98] bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] cursor-pointer"
    >
      {loading ? "Adding..." : "Add Item"}
    </button>

  </div>
)
}

export default AddMenuItem
