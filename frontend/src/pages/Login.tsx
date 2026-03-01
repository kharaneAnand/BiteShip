import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../main"
import toast from "react-hot-toast"
import { useGoogleLogin } from '@react-oauth/google';
import {FcGoogle} from 'react-icons/fc'

const Login = () => {

    const [loading , setLoading] = useState(false)
    const navigate = useNavigate() 

    const responseGoogle = async(authResult :any )=>{
        setLoading(true) 

        try {
            const result = await axios.post(`${authService}/api/auth/login` , {
                code:authResult["code"] ,
            });

            localStorage.setItem("token" , result.data.token) ;
            toast.success(result.data.message) ;
            setLoading(false) ;
            navigate("/") ;

        } catch (error) {
            console.log(error) ;
            toast.error("problem while login") ;
            setLoading(false) ;
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess:responseGoogle ,
        onError: () => {
          toast.error("Google login failed");
         },
        flow:"auth-code" ,
    }) ;

 return (
  <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-red-50 via-white to-pink-50 px-4 overflow-hidden">
    
    {/* Background Glow Effects */}
    <div className="absolute -top-32 -left-32 h-72 w-72 bg-red-200 rounded-full blur-3xl opacity-40"></div>
    <div className="absolute -bottom-32 -right-32 h-72 w-72 bg-pink-200 rounded-full blur-3xl opacity-40"></div>

    <div className="relative w-full max-w-sm space-y-6 rounded-3xl bg-white/70 backdrop-blur-xl p-8 shadow-2xl border border-gray-100">

    <h1 className="text-center text-4xl font-extrabold bg-linear-to-r from-[#1E3A8A] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent tracking-tight">
      BiteShip
    </h1>

      <p className="text-center text-sm text-gray-500">
        Log in or Sign up to Continue
      </p>

      <button
        onClick={googleLogin}
        disabled={loading}
        className="group flex w-full items-center justify-center gap-3 rounded-xl
        border border-gray-300 bg-white px-4 py-3 font-medium
        shadow-md transition-all duration-300
        hover:shadow-xl hover:-translate-y-1 hover:border-gray-400
        active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <FcGoogle size={20} className="group-hover:scale-110 transition-transform duration-300" />
        {loading ? "Signing in ..." : "Continue with Google"}
      </button>

      <p className="text-center text-xs text-gray-400 leading-relaxed">
        By Continuing , you agree with our{" "}
        <span className="text-[#E23774] font-medium cursor-pointer hover:underline">
          Terms of Service
        </span>{" "}
        &{" "}
        <span className="text-[#E23774] font-medium cursor-pointer hover:underline">
          Privacy Policy
        </span>
      </p>

    </div>
  </div>
)
}

export default Login
