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


   const toggleAvailiablity = async () => {
    if (!navigator.geolocation) {
        toast.error("Location access Required");
        return;
    }

    setToggling(true);

    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {

            const { data } = await axios.patch(
                `${riderService}/api/rider/toggle`,
                {
                    isAvailable: !profile?.isAvailable,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            // IMPORTANT FIX
            setProfile(data.rider);

            toast.success(
                data.rider.isAvailable
                    ? "You are Online"
                    : "You are Offline"
            );

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setToggling(false);
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 px-4 py-10">

    <div className="mx-auto max-w-lg">

        <div className="relative overflow-hidden rounded-4xl border border-gray-200 bg-white p-8 shadow-xl">

        {/* Glow Effects */}
        <div className="absolute -top-14 -right-14 h-40 w-40 rounded-full bg-blue-100 opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-14 -left-14 h-40 w-40 rounded-full bg-red-100 opacity-30 blur-3xl"></div>

        <div className="relative space-y-7">

            {/* Header */}
            <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-r from-[#2563EB] to-[#3B82F6] text-4xl shadow-lg">
                🚴
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900">
                Add Your Profile
            </h1>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Complete your rider profile to start receiving deliveries on BiteShip.
            </p>

            </div>

            {/* Aadhaar */}
            <div className="space-y-2">

            <label className="text-sm font-semibold text-gray-700">
                Aadhaar Number
            </label>

            <input
                type="number"
                placeholder="Enter Aadhaar number"
                value={aadharNumber}
                onChange={e => setAadharNumber(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
            />

            </div>

            {/* Phone */}
            <div className="space-y-2">

            <label className="text-sm font-semibold text-gray-700">
                Contact Number
            </label>

            <input
                type="number"
                placeholder="Enter contact number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
            />

            </div>

            {/* Driving License */}
            <div className="space-y-2">

            <label className="text-sm font-semibold text-gray-700">
                Driving License Number
            </label>

            <input
                type="text"
                placeholder="Enter driving license number"
                value={drivingLicenseNumber}
                onChange={e => setDrivingLicenseNumber(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-300 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100"
            />

            </div>

            {/* Upload */}
            <div className="space-y-2">

            <label className="text-sm font-semibold text-gray-700">
                Profile Picture
            </label>

            <label className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5 transition-all duration-300 hover:border-[#2563EB] hover:bg-blue-50">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition group-hover:scale-105">
                <BiUpload className="h-6 w-6 text-[#2563EB]" />
                </div>

                <div className="flex-1">

                <p className="text-sm font-semibold text-gray-800">
                    {image ? image.name : "Upload your image"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG or WEBP supported
                </p>

                </div>

                <input
                type="file"
                accept="image/*"
                hidden
                onChange={e => setImage(e.target.files?.[0] || null)}
                />

            </label>

            </div>

            {/* Info Box */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg">
                🛵
                </div>

                <div>
                <p className="text-sm font-semibold text-blue-900">
                    Rider Verification
                </p>

                <p className="mt-1 text-sm leading-relaxed text-blue-700">
                    Your details will be securely verified before activating your rider account.
                </p>
                </div>

            </div>

            </div>

            {/* Submit */}
            <button
            className="w-full rounded-2xl bg-linear-to-r from-[#2563EB] to-[#3B82F6] py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            onClick={handleSubmit}
            >
            {submitting ? "Submitting..." : "Create Rider Profile"}
            </button>

        </div>

        </div>

    </div>

    </div>
)

  return (
   <div className="space-y-6">
  <div className="mx-auto max-w-md px-4 py-6">

    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-red-100 opacity-40 blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>

      <div className="relative space-y-6">

        {/* Profile Section */}
        <div className="flex flex-col items-center text-center">

          <div className="relative">

            <img
              src={profile.picture}
              className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl"
              alt="image"
            />

            <div
              className={`absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-white
              ${profile.isAvailable ? "bg-green-500" : "bg-gray-400"}`}
            ></div>

          </div>

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {user?.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {profile.phoneNumber}
          </p>

        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">

          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold shadow-sm
            ${
              profile.isVerified
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {profile.isVerified ? "Verified Rider" : "Verification Pending"}
          </span>

          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold shadow-sm
            ${
              profile.isAvailable
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {profile.isAvailable ? "Online" : "Offline"}
          </span>

        </div>

        {/* Info Box */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg">
              📍
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-900">
                Hotspot Requirement
              </p>

              <p className="mt-1 text-sm leading-relaxed text-blue-700">
                Please stay within a <span className="font-semibold">1.5km radius</span> of any restaurant hotspot before going online to receive orders.
              </p>
            </div>

          </div>

        </div>

        {/* Availability Button */}
        {
          profile.isVerified && (
            <button
              onClick={toggleAvailiablity}
              disabled={toggling}
              className={`w-full rounded-2xl py-3.5 text-sm font-semibold text-white shadow-md transition-all duration-300
              ${
                toggling
                  ? "bg-gray-400 cursor-not-allowed"
                  : profile.isAvailable
                  ? "bg-gray-800 hover:bg-black hover:shadow-xl"
                  : "bg-linear-to-r from-[#E23744] to-[#ff5964] hover:shadow-xl hover:scale-[1.01]"
              }`}
            >
              {toggling
                ? "Updating..."
                : profile.isAvailable
                ? "Go Offline"
                : "Go Online"}
            </button>
          )
        }

      </div>

    </div>

  </div>
</div>
  )
}

export default RiderDashboard
