import { useState } from "react"
import { useAppData } from "../context/AppContext"
import toast from "react-hot-toast"
import axios from "axios"
import { restaurantService } from "../main"
import { BiMapPin, BiUpload } from "react-icons/bi"

const AddRestaurant = () => {

    const [name , setName] = useState("")
    const [description , setDescription] = useState("")
    const [phone , setPhone] = useState("")
    const [image , setImage] = useState<File | null>(null)
    const [submitting , setSubmitting ] = useState(false)


    const {loadingLocation , location} = useAppData() 

    const handleSubmit = async() =>{
        if(!name || !image || !location){
            alert("All fields are requrired ") ;
            return ;
        }


        const formData = new FormData() 

        formData.append("name" , name);
        formData.append("description", description);
        formData.append("latitude" , String(location.latitude)) ;
        formData.append("longitude" , String(location.longitude)) ;
        formData.append("formattedAddress" , location.formattedAddress) ; 
        formData.append("file" , image) ;
        formData.append("phone" , phone);



        try {

            setSubmitting(true) ;
            await axios.post(`${restaurantService}/api/restaurant/new` , formData , {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}` ,
                },
            });

            toast.success("Restaurant Added successfully") ;
            
        } catch (error:any) {
            toast.error(error.response.data.message)
        } finally{
            setSubmitting(false) ;
        }
    };


  return (
  <div className="min-h-screen bg-gray-50 px-4 py-8">
    <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-md border border-gray-200 space-y-6">

      <h1 className="text-2xl font-semibold text-gray-900">
        Add Your Restaurant
      </h1>

      <input
        type="text"
        placeholder="Restaurant Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
      />

      <input
        type="number"
        placeholder="Contact Number"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
      />

      <textarea
        placeholder=" Restaurant description "
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
      />

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 p-4 text-sm text-gray-600 transition hover:bg-gray-50">
        <BiUpload className="h-5 w-5 text-[#3B82F6]" />
        {image ? image.name : "Upload restaurant image"}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={e => setImage(e.target.files?.[0] || null)}
        />
      </label>

      <div className="flex items-start gap-3 rounded-xl border border-gray-300 p-4">
        <BiMapPin className="mt-0.5 h-5 w-5 text-[#3B82F6]" />
        <div className="text-sm text-gray-700">
          {loadingLocation
            ? "Fetching Your location ..."
            : location?.formattedAddress || "Location not available"}
        </div>
      </div>

      <button
        className="w-full rounded-xl py-3 text-sm font-semibold text-white bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] shadow-sm transition hover:shadow-md active:scale-[0.98]"
        disabled={submitting}
        onClick={handleSubmit}
      >
        {submitting ? "submitting..." : "Add Restaurant "}
      </button>

    </div>
  </div>
);
};

export default AddRestaurant
