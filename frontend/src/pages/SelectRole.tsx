import { useState } from "react";
import { useAppData } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../main";
import axios from "axios";

type Role = "customer" | "rider" | "seller" | null  

const SelectRole = () => {

    const [role , setRole] = useState<Role>(null) ;
    const {setUser} = useAppData() ;
    const navigate = useNavigate() ;


    const roles : Role[] = ["customer" , "rider" , "seller"] 

    const addRole = async() =>{
        try {
            const {data} = await axios.put(`${authService}/api/auth/add/role` ,
                 {role} ,{
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem("token")}`,
                    },
                 } );

                 localStorage.setItem("token" , data.token) ;
                 setUser(data.user) 

                 navigate("/" , {replace : true}) ;
        } catch (error) {
            alert("something went Wrong") ;
            console.log(error) ;
        }
    }

  return (
  <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-red-50 via-white to-pink-50 px-4 overflow-hidden">

    {/* Background Glow Effects */}
    <div className="absolute -top-32 -left-32 h-72 w-72 bg-red-200 rounded-full blur-3xl opacity-40"></div>
    <div className="absolute -bottom-32 -right-32 h-72 w-72 bg-pink-200 rounded-full blur-3xl opacity-40"></div>

    <div className="relative w-full max-w-sm space-y-8 rounded-3xl bg-white/70 backdrop-blur-xl p-8 shadow-2xl border border-gray-100">

      {/* Logo */}
      <h1 className="text-center text-4xl font-extrabold bg-linear-to-r from-[#1E3A8A] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent tracking-tight">
        BiteShip
      </h1>

      {/* Title */}
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Choose your Role
        </h2>
        <p className="text-sm text-gray-500">
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
              group w-full rounded-2xl border px-4 py-3 text-sm font-semibold capitalize
              transition-all duration-300 shadow-sm
              ${
                role === r
                  ? "border-transparent bg-linear-to-r from-[#FF4D4D] to-[#FF7A00] text-white shadow-lg scale-[1.02]"
                  : "border-gray-300 bg-white text-gray-700 hover:shadow-md hover:-translate-y-1 hover:border-gray-400"
              }
            `}
          > 
            <span className="transition-all duration-300 group-hover:tracking-wide">
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
          w-full rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300
          ${
            role
              ? "bg-linear-to-r from-[#1E3A8A] via-[#3B82F6] to-[#06B6D4] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >
        Next
      </button>

    </div>
  </div>
)
}

export default SelectRole;
