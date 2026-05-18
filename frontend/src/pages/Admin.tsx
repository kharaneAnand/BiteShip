import { useEffect, useState } from "react"
import { adminService } from "../main";
import axios from "axios";
import AdminRestaurantCard from "../components/AdminRestaurantCard";
import RiderAdmin from "../components/RiderAdmin";


const Admin = () => {

    const [restaurant , setRestaurant] = useState<any[]>([]) ;
    const [rider , setRider] = useState<any[]>([]) ;
    const [loading , setLoading] = useState(true) 
    const [tab , setTab] = useState<"restaurant" | "rider">("restaurant") ;

    const fetchData = async()=>{
        try {
            const {data} = await axios.get(`${adminService}/api/v1/admin/restaurant/pending` , {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`,
                },
            }) ;

            const { data: riderData } = await axios.get(`${adminService}/api/v1/admin/rider/pending`,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

setRider(riderData.riders);

            setRestaurant(data.restaurants) ;  
            setRider(riderData.riders);
        } catch (error) {
            console.log(error) ;
        }finally{
            setLoading(false) ;
        }
    };

    useEffect(()=>{
        fetchData() ;
    },[]);

    if(loading){
        return <div className="flex h-[60vh] items-center justify-center">
            <p className="text-gray-500">Loading admin panel...</p>
        </div>
    }
  return (
  <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">

    {/* Header */}
    <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-100/40 blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-100/30 blur-3xl"></div>

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage restaurant & rider verification requests.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4">

          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Pending Restaurants
            </p>

            <h3 className="mt-1 text-2xl font-bold text-gray-900">
              {restaurant.length}
            </h3>

          </div>

          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-5 py-4 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
              Pending Riders
            </p>

            <h3 className="mt-1 text-2xl font-bold text-gray-900">
              {rider.length}
            </h3>

          </div>

        </div>

      </div>

    </div>

    {/* Tabs */}
    <div className="flex flex-wrap gap-4">

      <button
        onClick={() => setTab("restaurant")}
        className={`rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300
        ${
          tab === "restaurant"
            ? "bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-lg"
            : "border border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50"
        }`}
      >
        Restaurants
      </button>

      <button
        onClick={() => setTab("rider")}
        className={`rounded-2xl px-6 py-3 text-sm font-semibold transition-all duration-300
        ${
          tab === "rider"
            ? "bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] text-white shadow-lg"
            : "border border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-blue-50"
        }`}
      >
        Riders
      </button>

    </div>

    {/* Restaurant Section */}
    {
      tab === "restaurant" && (

        <div className="space-y-5">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Restaurant Verification
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Approve pending restaurant partner requests.
              </p>
            </div>

            <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              {restaurant.length} Pending
            </div>

          </div>

          {
            restaurant.length === 0 ? (

              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-14 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
                  🍽️
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  No Pending Restaurants
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  All restaurant verification requests are completed.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {
                  restaurant.map((res) => (
                    <AdminRestaurantCard
                      key={res._id}
                      restaurant={res}
                      onVerify={fetchData}
                    />
                  ))
                }

              </div>

            )
          }

        </div>
      )
    }

    {/* Rider Section */}
    {
      tab === "rider" && (

        <div className="space-y-5">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Rider Verification
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Review & approve delivery partner requests.
              </p>
            </div>

            <div className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-700 shadow-sm">
              {rider.length} Pending
            </div>

          </div>

          {
            rider.length === 0 ? (

              <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-14 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-50 text-4xl">
                  🚴
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  No Pending Riders
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  All rider verification requests are completed.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {
                  rider.map((r) => (
                    <RiderAdmin
                      key={r._id}
                      rider={r}
                      onVerify={fetchData}
                    />
                  ))
                }

              </div>

            )
          }

        </div>
      )
    }

  </div>
)
}

export default Admin
