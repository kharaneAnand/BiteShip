import { useEffect, useState } from "react"
import { adminService } from "../main";
import axios from "axios";
import AdminRestaurantCard from "../components/AdminRestaurantCard";
import RiderAdmin from "../components/RiderAdmin";
import ActiveRestaurantCard from "../components/ActiveRestaurantCard";
import ActiveRiderCard from "../components/ActiveRiderCard";


const Admin = () => {

    const [restaurant , setRestaurant] = useState<any[]>([]) ;
    const [rider , setRider] = useState<any[]>([]) ;
    const [loading , setLoading] = useState(true) 
    const [tab , setTab] = useState<"restaurant" | "rider">("restaurant") ;
    const [verifiedRestaurants , setVerifiedRestaurants] = useState<any[]>([]);
    const [verifiedRiders , setVerifiedRiders] = useState<any[]>([]);


    const totalRevenue = verifiedRestaurants.reduce((acc, restaurant) => acc + (restaurant.revenue || 0),0);
    const totalOrders = verifiedRestaurants.reduce((acc, restaurant) => acc + (restaurant.totalOrders || 0),0);
    const onlineRiders = verifiedRiders.filter((rider) => rider.isAvailable).length;
    const openRestaurants = verifiedRestaurants.filter((restaurant) => restaurant.isOpen).length;

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

            const { data: verifiedRestaurantData } = await axios.get(`${adminService}/api/v1/admin/restaurant/verified`,{
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const { data: verifiedRiderData } = await axios.get(`${adminService}/api/v1/admin/rider/verified`,{
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );


            
            setVerifiedRestaurants(verifiedRestaurantData.restaurants);
            setVerifiedRiders(verifiedRiderData.riders);
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

    {/* Platform Analytics */}

<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

  {/* Revenue */}
  <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">

    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-green-100/40 blur-2xl"></div>

    <div className="relative">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            Total Revenue
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            ₹ {totalRevenue}
          </h3>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl">
          💰
        </div>

      </div>

      <p className="mt-4 text-xs text-green-600 font-semibold">
        Platform earnings from delivered orders
      </p>

    </div>

  </div>

  {/* Orders */}
  <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">

    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-blue-100/40 blur-2xl"></div>

    <div className="relative">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            Total Orders
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {totalOrders}
          </h3>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
          📦
        </div>

      </div>

      <p className="mt-4 text-xs text-blue-600 font-semibold">
        Successfully delivered orders
      </p>

    </div>

  </div>

  {/* Active Restaurants */}
  <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">

    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-100/40 blur-2xl"></div>

    <div className="relative">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            Open Restaurants
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {openRestaurants}
          </h3>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-2xl">
          🍽️
        </div>

      </div>

      <p className="mt-4 text-xs text-cyan-600 font-semibold">
        Restaurants currently accepting orders
      </p>

    </div>

  </div>

  {/* Riders */}
  <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">

    <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-indigo-100/40 blur-2xl"></div>

    <div className="relative">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            Online Riders
          </p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">
            {onlineRiders}
          </h3>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
          🚴
        </div>

      </div>

      <p className="mt-4 text-xs text-indigo-600 font-semibold">
        Riders currently available for delivery
      </p>

    </div>

  </div>

</div>

{/* Recent Activity */}

<div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

  <div className="flex items-center justify-between">

    <div>
      <h2 className="text-2xl font-bold text-gray-900">
        Recent Activity
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Latest platform actions & approvals
      </p>
    </div>

    <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
      Live Feed
    </div>

  </div>

  <div className="mt-6 space-y-4">

    {
      verifiedRestaurants.slice(0,3).map((restaurant)=>(
        <div
          key={restaurant._id}
          className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
        >

          <img
            src={restaurant.image}
            className="h-14 w-14 rounded-2xl object-cover"
          />

          <div className="flex-1">

            <h4 className="font-semibold text-gray-900">
              {restaurant.name}
            </h4>

            <p className="text-sm text-gray-500">
              Restaurant verified successfully
            </p>

          </div>

          <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Approved
          </div>

        </div>
      ))
    }

    {
      verifiedRiders.slice(0,2).map((rider)=>(
        <div
          key={rider._id}
          className="flex items-center gap-4 rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
        >

          <img
            src={rider.picture}
            className="h-14 w-14 rounded-2xl object-cover"
          />

          <div className="flex-1">

            <h4 className="font-semibold text-gray-900">
              Delivery Partner
            </h4>

            <p className="text-sm text-gray-500">
              Rider joined delivery network
            </p>

          </div>

          <div className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
            Active
          </div>

        </div>
      ))
    }

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

          {/* Active Restaurants */}

            <div className="space-y-5 pt-10">

            <div className="flex items-center justify-between">

                <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Active Restaurants
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Verified restaurant partners on platform.
                </p>
                </div>

                <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
                {verifiedRestaurants.length} Active
                </div>

            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {
                verifiedRestaurants.map((restaurant)=>(
                    <ActiveRestaurantCard
                    key={restaurant._id}
                    restaurant={restaurant}
                    />
                ))
                }

            </div>

            </div>

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

          {/* Active Riders */}

            <div className="space-y-5 pt-10">

            <div className="flex items-center justify-between">

                <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Active Riders
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Verified delivery riders currently on platform.
                </p>
                </div>

                <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
                {verifiedRiders.length} Active
                </div>

            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

                {
                verifiedRiders.map((rider)=>(
                    <ActiveRiderCard
                    key={rider._id}
                    rider={rider}
                    />
                ))
                }

            </div>

            </div>

        </div>
      )
    }


  </div>
)
}

export default Admin
