import { useEffect, useState } from "react";
import { useAppData } from "../context/AppContext"
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CgShoppingCart } from "react-icons/cg";
import { BiMapPin, BiSearch } from "react-icons/bi";


const Navbar = () => {

    const {isAuth , city  } = useAppData() ;
    const currentLocation = useLocation() ;

    const isHomePage = currentLocation.pathname === '/' 

    const [searchParams , setSearchParams] = useSearchParams() ;
    const [search , setSearch] = useState(searchParams.get("search") || "") ;

    useEffect(()=>{
        const timer = setTimeout(()=>{
            if(search){
                setSearchParams({search})
            }else{
                setSearchParams({})
            }
        } , 400)

        return ()=> clearTimeout(timer)
    } , [search]) ;


  return (
  <div className="w-full bg-white shadow-sm border-b border-gray-200">

    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

      {/* Logo */}
      <Link
        to={"/"}
        className="text-2xl font-extrabold bg-linear-to-r from-[#1E3A8A] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent tracking-tight"
      >
        BiteShip
      </Link>

      <div className="flex items-center gap-5">

        {/* Cart */}
        <Link to={"/cart"} className="relative group">
          <CgShoppingCart className="h-6 w-6 text-gray-800 transition-all duration-300 group-hover:text-[#3B82F6] group-hover:scale-105" />
          <span
            className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full
            bg-linear-to-r from-[#1E3A8A] to-[#3B82F6]
            text-xs font-semibold text-white shadow-sm"
          >
            0
          </span>
        </Link>

        {/* Account / Login */}
        {isAuth ? (
          <Link
            to="/account"
            className="font-semibold text-gray-800 hover:text-[#3B82F6] transition-colors duration-300"
          >
            Account
          </Link>
        ) : (
          <Link
            to="/Login"
            className="font-semibold text-gray-800 hover:text-[#3B82F6] transition-colors duration-300"
          >
            Login
          </Link>
        )}
      </div>
    </div>

    {/* Search Bar */}
    {isHomePage && (
      <div className="border-t border-gray-200 px-4 py-4 bg-white">

        <div className="mx-auto flex max-w-7xl items-center rounded-xl border border-gray-300 shadow-sm overflow-hidden transition-all duration-300 focus-within:shadow-md">

          {/* Location */}
          <div className="flex items-center gap-2 px-4 border-r border-gray-200 text-gray-800">
            <BiMapPin className="h-4 w-4 text-[#3B82F6]" />
            <span className="text-sm truncate max-w-35 font-medium">
              {city}
            </span>
          </div>

          {/* Search Input */}
          <div className="flex flex-1 items-center gap-2 px-4">
            <BiSearch className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for restaurant"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 bg-transparent"
            />
          </div>

        </div>

      </div>
    )}
  </div>
)
}

export default Navbar
