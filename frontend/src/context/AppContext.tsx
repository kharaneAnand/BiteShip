import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authService } from "../main";
import { type AppContextType ,type LocationData,type User } from "../types";
import axios from "axios";

const AppContext = createContext<AppContextType | undefined>(undefined) 

interface AppProviderProps{
    children:ReactNode ;
}


export const AppProvider = ({children}: AppProviderProps)=>{
    const [user , setUser] = useState<User | null>(null) ;
    const [isAuth , setIsAuth] = useState(false) ;
    const [loading , setLoading] = useState(true);

    const [location , setLocation] = useState<LocationData | null>(null) ;
    const [loadingLocation , setLoadingLocation] = useState(false) ;
    const [city , setCity] = useState("Feaching Location ...") ;

    async function fetchUser(){
        try {
            const token = localStorage.getItem("token") 
            const {data} = await axios.get(`${authService}/api/auth/me` , {
               headers:{
                 Authorization:`Bearer ${token}` ,
               } ,
            });

            setUser(data);
            setIsAuth(true) ;
        } catch (error) {
            console.log(error) 
        }finally{
            setLoading(false) ;
        }
    }   

    useEffect(()=>{
        fetchUser();
    } , []) ;


    useEffect(()=>{
        if(!navigator.geolocation) return alert("Please allow Location to continue") ;
        setLoadingLocation(true) ;


        navigator.geolocation.getCurrentPosition(async(position)=>{
            const {latitude , longitude} = position.coords ;

            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);

                const data = await res.json() ;
                setLocation({
                    latitude,
                    longitude,
                    formattedAddress : data.display_name || "current location"
                })

                setCity (
                    data.address.city || data.address.town || data.address.village || "Your Location"
                );

            } catch (error) {
               setLocation({
                    latitude ,
                    longitude,
                    formattedAddress : "Current Location"
                })

                setCity("Failed to load ") ;
            }
        });
    });

    return (
    <AppContext.Provider
     value={{isAuth,loading ,
     setIsAuth , setLoading , setUser ,
      user , location , loadingLocation , city}}
    >
    {children}
    </AppContext.Provider>
    );
};

export const useAppData = () : AppContextType =>{
    
    const context = useContext(AppContext) ;

    if(!context){
        throw new Error("useAppData must be used within AppProvider ")
    }
    return context ;
}