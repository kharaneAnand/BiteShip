import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom"
import { utilsService } from "../main";
import toast from "react-hot-toast";


const OrderSuccess = () => {

    const [params] = useSearchParams() 

    const sessionId = params.get("session_id") ;

    useEffect(()=>{
        const verifyPayment = async()=>{
            if(!sessionId) return ;

            try {
                await axios.post(`${utilsService}/api/payment/stripe/verify` , {
                    sessionId 
                })

                toast.success("payment Successfully 🎉") 
            } catch (error) {
                toast.error("stripe verification failed") 
                console.log(error) ; 
            }
        };
        verifyPayment()
    } , [sessionId]);
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <h1 className="text-2xl font-bold text-green-600">Payment Successfull 🎉</h1>
    </div>
  );
};

export default OrderSuccess ;
