import { useNavigate, useParams } from "react-router-dom"
import { useAppData } from "../context/AppContext";
import { useEffect } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";

const PaymentSuccess = () => {
    const {paymentId} = useParams<{paymentId : string}>() 
    const navigate = useNavigate() ;

    const {fetchCart} = useAppData() ;

    useEffect(()=>{
        fetchCart() 
     ,[]})
  return (
  <div className="flex min-h-[80vh] items-center justify-center px-4 py-10 bg-linear-to-br from-blue-50 via-white to-cyan-50 overflow-hidden">

    {/* Background Glow */}
    <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-blue-200 opacity-30 blur-3xl"></div>
    <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-cyan-200 opacity-30 blur-3xl"></div>

    <div className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-2xl backdrop-blur-xl text-center space-y-5">

      {/* Success Icon */}
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 shadow-inner">
        <BiCheckCircle
          size={64}
          className="text-green-500"
        />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Payment Successful
        </h1>

        <p className="text-sm leading-relaxed text-gray-500">
          Your order has been placed successfully 🎉
        </p>
      </div>

      {/* Payment ID */}
      {
        paymentId && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left shadow-sm">

            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Payment ID
            </span>

            <p className="mt-2 break-all rounded-lg bg-white px-3 py-2 font-mono text-sm text-gray-700 border border-gray-200">
              {paymentId}
            </p>

          </div>
        )
      }

      {/* Buttons */}
      <div className="space-y-3 pt-2">

        <button
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg"
          onClick={() => navigate("/")}
        >
          Order More
          <BsArrowRight size={16} />
        </button>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-800 transition-all duration-300 hover:bg-gray-50 hover:shadow-sm"
          onClick={() => navigate("/orders")}
        >
          Your Orders
          <BsArrowRight size={16} />
        </button>

      </div>

    </div>
  </div>
)
}

export default PaymentSuccess
