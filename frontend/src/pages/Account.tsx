import { useNavigate } from "react-router-dom"
import { useAppData } from "../context/AppContext"
import toast from 'react-hot-toast'
import { BiLogOut, BiMapPin, BiPackage } from "react-icons/bi"

const Account = () => {

    const {user , setUser , setIsAuth} = useAppData() 

    const firstLetter = user?.name.charAt(0).toUpperCase();

    const navigate = useNavigate() ;

    const logOutHandler = () =>{
        localStorage.setItem("token" , "") ;
        setUser(null) ;
        setIsAuth(false) ;
        navigate("/login");
        toast.success("logout success") ;
    }

  return (
   <div className="min-h-screen bg-gray-50 px-4 py-8">
  <div className="mx-auto max-w-md rounded-2xl bg-white shadow-md border border-gray-200 overflow-hidden">

    <div className="flex items-center gap-4 border-b border-gray-200 p-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] text-xl font-semibold text-white shadow-sm">
        {firstLetter}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {user?.name}
        </h2>
        <p className="text-sm text-gray-500">
          {user?.email}
        </p>
      </div>
    </div>

    <div className="divide-y divide-gray-200">

      <div
        className="flex cursor-pointer items-center gap-4 p-5 transition-all duration-200 hover:bg-gray-50"
        onClick={() => navigate("/orders")}
      >
        <BiPackage className="h-5 w-5 text-[#3B82F6]" />
        <span className="font-medium text-gray-800">Your Orders</span>
      </div>

      <div
        className="flex cursor-pointer items-center gap-4 p-5 transition-all duration-200 hover:bg-gray-50"
        onClick={() => navigate("/address")}
      >
        <BiMapPin className="h-5 w-5 text-[#3B82F6]" />
        <span className="font-medium text-gray-800">Addresses</span>
      </div>

      <div
        className="flex cursor-pointer items-center gap-4 p-5 transition-all duration-200 hover:bg-gray-50"
        onClick={logOutHandler}
      >
        <BiLogOut className="h-5 w-5 text-[#3B82F6]" />
        <span className="font-medium text-gray-800">Logout</span>
      </div>

    </div>

  </div>
</div>
  )
}

export default Account
