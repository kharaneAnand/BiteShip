import { useEffect, useState } from "react";
import { useAppData } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { riderService } from "../main";
import toast from "react-hot-toast";
import { BiUpload } from "react-icons/bi";


 interface IRider {
    _id : string ;
    picture: string ;
    phoneNumber : string ;
    aadharNumber : string ;
    drivingLicenseNumber : string ;
    isVerified : boolean ;
    isAvailable : boolean ;
}


const RiderDashboard = () => {

    const {user} = useAppData() ;
    const {socket} = useSocket() ;

    const [profile , setProfile] = useState<IRider | null>(null) ;
    const [loading , setLoading] = useState(true) ;
    const [toggling , setToggling] = useState(false) ;

    const fetchProfile = async()=>{
        try {
            const {data} = await axios.get(`${riderService}/api/rider/myprofile` , {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}` ,
                },
            });

            setProfile(data || null) ;
        } catch (error) {
            setProfile(null) ;
            console.log(error) ;
        }finally{
            setLoading(false) ;
        }
    };


    useEffect(()=>{
        if(user?.role === "rider"){
            fetchProfile() ;
        }else {
            setLoading(false) ;
        }
    } , [user]) ;


    const toggleAvailiablity = async() =>{
        if(!navigator.geolocation){
            toast.error("Location access Required") ;
            return ;
        }

        setToggling(true) ;
        navigator.geolocation.getCurrentPosition(async(pos)=>{
            try {
                await axios.patch(`${riderService}/api/rider/toggle` , {
                     isAvailable: !profile?.isAvailable , latitude:pos.coords.latitude , longitude:pos.coords.longitude } ,
                     {
                        headers:{
                            Authorization: `Bearer ${localStorage.getItem("token")}` ,
                        },
                });

                toast.success(profile?.isAvailable ? "You are offline": "you are Online" ) ;
            } catch (error : any) {
                toast.error(error.response.data.message) ;
            }finally{
                setToggling(false) ;
            }
        });
    };

    const [phoneNumber , setPhoneNumber] = useState("") ;
    const [aadharNumber , setAadharNumber] = useState("") ;
    const [drivingLicenseNumber , setDrivingLicenseNumber] = useState("") ;
    const [image , setImage] = useState<File | null >(null) ;
    const [submitting , setSubmitting] = useState(false) ;

     const handleSubmit = async() =>{
         if(!navigator.geolocation){
            toast.error("Location access Required") ;
            return ;
        }

        setSubmitting(true) ;
        navigator.geolocation.getCurrentPosition(async(pos)=>{

            const formData = new FormData() ;
            formData.append("phoneNumber" , phoneNumber);
            formData.append("aadharNumber", aadharNumber);
            formData.append("drivingLicenseNumber" , drivingLicenseNumber);
            formData.append("latitude" , pos.coords.latitude.toString());
            formData.append("longitude" , pos.coords.longitude.toString());

            if(image){
                formData.append("file" , image) ;
            }
           

            try {
              const {data} =  await axios.post(`${riderService}/api/rider/new` , formData ,
                     {
                        headers:{
                            Authorization: `Bearer ${localStorage.getItem("token")}` ,
                        },
                });

                toast.success(data.message) ;
                fetchProfile() ;
            } catch (error : any) {
                toast.error(error.response.data.message) ;
            }finally{
                setSubmitting(false) ;
            }
        });
     }

    if(user?.role !== "rider"){
        return <div className="flex min-h-[60vh] items-center text-gray-500">You are not registerted as rider</div>
    }

    if(loading){
        return (
            <div className="flex min-h-[60vh] items-center justify-center text-gray-500">Loading rider details</div>
        );
    }


    if(!profile) return (
         <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-md border border-gray-200 space-y-6">
        
              <h1 className="text-2xl font-semibold text-gray-900">
                Add Your Profile 
              </h1>
        
              <input
                type="number"
                placeholder="Aadhar number"
                value={aadharNumber}
                onChange={e => setAadharNumber(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
              />
        
              <input
                type="number"
                placeholder="Contact Number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
              />
        
               <input
                type="text"
                placeholder="driving Licence"
                value={drivingLicenseNumber}
                onChange={e => setDrivingLicenseNumber(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
              />
        
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 p-4 text-sm text-gray-600 transition hover:bg-gray-50">
                <BiUpload className="h-5 w-5 text-[#3B82F6]" />
                {image ? image.name : "Upload your image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={e => setImage(e.target.files?.[0] || null)}
                />
              </label>
        
        
              <button
                className="w-full rounded-xl py-3 text-sm font-semibold text-white bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] shadow-sm transition hover:shadow-md active:scale-[0.98]"
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? "submitting..." : "Add Profile  "}
              </button>
        
            </div>
          </div>
    )

  return (
    <div>
      RiderDashboard  
    </div>
  )
}

export default RiderDashboard
