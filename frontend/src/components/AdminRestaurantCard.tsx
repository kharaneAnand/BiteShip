import axios from "axios"
import { adminService } from "../main"
import toast from "react-hot-toast";


const AdminRestaurantCard = ({restaurant , onVerify} : {restaurant:any , onVerify:()=>void}) => {

    const verify = async()=>{
        try {
            await axios.patch(`${adminService}/api/v1/verify/restaurant/${restaurant._id}`,{} , {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}` ,
                }
            });

            toast.success("Restaurant verified") ;
            onVerify() ;
        } catch (error) {
            toast.error("falied to verify restaurant") ;
        }
    };
  return (
  <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

    {/* Background Glow */}
    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100/40 blur-3xl"></div>
    <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-100/30 blur-3xl"></div>

    <div className="relative space-y-4">

      {/* Restaurant Image */}
      <div className="relative overflow-hidden rounded-2xl">

        <img
          src={restaurant.image}
          className="h-52 w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent"></div>

        {/* Badge */}
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2563EB] shadow-sm backdrop-blur-sm">
          Pending Verification
        </div>

      </div>

      {/* Restaurant Info */}
      <div className="space-y-3">

        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {restaurant.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Restaurant Partner
          </p>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-lg">
              📞
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Phone Number
              </p>

              <p className="mt-1 text-sm font-medium text-gray-800">
                {restaurant.phone}
              </p>
            </div>

          </div>

          <div className="flex items-start gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-lg">
              📍
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Location
              </p>

              <p className="mt-1 text-sm leading-relaxed text-gray-700">
                {restaurant.autoLocation?.formattedAddress}
              </p>
            </div>

          </div>

        </div>

        {/* Verify Button */}
        <button
          className="w-full rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
          onClick={verify}
        >
          Verify Restaurant
        </button>

      </div>

    </div>

  </div>
)
}

export default AdminRestaurantCard
