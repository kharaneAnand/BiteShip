import {useState} from 'react' ;
import { useNavigate } from 'react-router-dom';
import { authService } from '../main';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import { useAppData } from '../context/AppContext';

const Login = () =>{
    const [loading , setLoading] = useState(false)
    const navigate = useNavigate() ;


    const {setUser , setIsAuth} = useAppData() ;

    const responseGoogle = async(authresult:any)=>{
        setLoading(true) 
        try {
            
            const result = await axios.post(`${authService}/api/auth/login` , {
                code : authresult["code"],
            });

            localStorage.setItem("token" , result.data.token) ;
            toast.success(result.data.message) ;
            setLoading(false) ;
            setUser(result.data.user) ;
            setIsAuth(true) ;
            navigate("/") ;

        } catch (error) {
            console.log(error) ;
            toast.error("problem while LogIn ") ;
            setLoading(false) ;
        }
    }


    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError : responseGoogle ,
        flow:"auth-code",
    });

   return (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-red-50 via-white to-pink-50 px-4">

    {/* Soft Background Glow */}
    <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-red-200 blur-3xl opacity-30"></div>
    <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-pink-200 blur-3xl opacity-30"></div>

    {/* Subtle Grid Overlay */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:5rem_5rem]"></div>

    <div
      className="
        relative w-full max-w-sm space-y-7
        rounded-[28px]
        border border-white/60
        bg-white/75
        p-9
        backdrop-blur-2xl
        shadow-[0_10px_50px_rgba(0,0,0,0.08)]
      "
    >

      {/* Brand */}
      <div className="space-y-2">
        <h1 className="text-center text-4xl font-extrabold bg-linear-to-r from-[#1E3A8A] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent tracking-tight">
          BiteShip
        </h1>

        <p className="text-center text-sm text-gray-500">
          Log in or Sign up to Continue
        </p>
      </div>

      {/* Auth Button */}
      <button
        onClick={googleLogin}
        disabled={loading}
        className="
          group relative flex w-full items-center justify-center gap-3
          overflow-hidden rounded-2xl
          border border-gray-200
          bg-white/90
          px-4 py-3.5
          font-medium text-gray-700
          shadow-sm
          transition-all duration-300
          hover:-translate-y-0.5
          hover:border-gray-300
          hover:shadow-lg
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >

        {/* Hover Glow */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-red-50 via-transparent to-blue-50"></div>

        <FcGoogle
          size={20}
          className="relative z-10 transition-transform duration-300 group-hover:scale-110"
        />

        <span className="relative z-10">
          {loading ? "Signing in ..." : "Continue with Google"}
        </span>
      </button>

      {/* Footer */}
      <p className="text-center text-xs leading-relaxed text-gray-400">
        By Continuing , you agree with our{" "}
        <span className="text-[#E23774] font-medium cursor-pointer transition-colors hover:text-[#be185d] hover:underline">
          Terms of Service
        </span>{" "}
        &{" "}
        <span className="text-[#E23774] font-medium cursor-pointer transition-colors hover:text-[#be185d] hover:underline">
          Privacy Policy
        </span>
      </p>
    </div>
  </div>
)
}


export default Login
