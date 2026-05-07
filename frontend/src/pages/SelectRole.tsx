import { useState } from "react"
import { useAppData } from "../context/AppContext"
import { useNavigate } from "react-router-dom"
import { authService } from "../main"
import axios from 'axios'


 type Role = "customer" | "rider" | "seller" | null 


const SelectRole = () => {   

   const [role, setRole] = useState<Role>(null) 
    const {setUser} = useAppData() ;
    const navigate = useNavigate() ;

    const roles : Role[] = ["customer" , "rider" , "seller"] 

    const addRole = async() =>{
        try {
            const {data} = await axios.put(`${authService}/api/auth/add/role` , {role} ,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}` ,
                },
            });

            localStorage.setItem("token" , data.token) ;
            setUser(data.user) ; 

            navigate("/" , {replace:true}) ;
        } catch (error) {
            alert("something went wrong") ;
            console.log(error) ;
        }
    }


 return (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-red-50 via-white to-pink-50 px-4">

    {/* Background Glow Effects */}
    <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-red-200 blur-3xl opacity-35"></div>
    <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-pink-200 blur-3xl opacity-35"></div>

    {/* Subtle Grid Overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:5rem_5rem]"></div>

    <div
      className="
        relative w-full max-w-sm space-y-8
        rounded-[28px]
        border border-white/60
        bg-white/75
        p-8
        backdrop-blur-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
      "
    >

      {/* Logo */}
      <h1 className="text-center text-4xl font-extrabold bg-linear-to-r from-[#1E3A8A] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent tracking-tight">
        BiteShip
      </h1>

      {/* Title */}
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Choose your Role
        </h2>

        <p className="text-sm leading-relaxed text-gray-500">
          Select how you want to continue
        </p>
      </div>

      {/* Role Buttons */}
      <div className="space-y-4">
        {roles.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`
              group w-full rounded-2xl border px-4 py-3.5
              text-sm font-semibold capitalize
              transition-all duration-300 transform-gpu
              ${
                role === r
                  ? "border-transparent bg-linear-to-r from-[#FF4D4D] to-[#FF7A00] text-white shadow-lg shadow-orange-200/50 scale-[1.02]"
                  : "border-gray-200 bg-white/80 text-gray-700 shadow-sm hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              }
            `}
          >
            <span className="transition-all duration-300 group-hover:tracking-[0.01em]">
              Continue as {r}
            </span>
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        disabled={!role}
        onClick={addRole}
        className={`
          w-full rounded-2xl px-4 py-3.5
          text-sm font-bold
          transition-all duration-300
          ${
            role
              ? "bg-linear-to-r from-[#1E3A8A] via-[#3B82F6] to-[#06B6D4] text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
              : "cursor-not-allowed bg-gray-200 text-gray-400"
          }
        `}
      >
        Next
      </button>

    </div>
  </div>
)
}

export default SelectRole
