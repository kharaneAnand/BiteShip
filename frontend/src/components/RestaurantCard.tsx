import { useNavigate } from "react-router-dom";

type props = {
    id : string , 
    image : string ;
    name : string ;
    distance : string ;
    isOpen : boolean ;
}

const RestaurantCard = ({id , image , name , distance , isOpen } : props) => {

    const navigate = useNavigate() ;

  return (
   <div className={`group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1
  ${!isOpen ? "opacity-80" : ""}`} onClick={()=>navigate(`/restaurant/${id}`)}>

  <div className="relative h-44 w-full overflow-hidden">
    <img
      src={image}
      alt=""
      className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isOpen ? "grayscale" : ""}`}
    />

    {
      !isOpen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <span className="rounded-full bg-black/80 px-4 py-1.5 text-sm font-semibold text-white shadow">
            Closed
          </span>
        </div>
      )
    }

    <div className="absolute bottom-2 left-2">
      <span className="rounded-full bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium text-gray-800 shadow-sm">
        {distance} KM away
      </span>
    </div>
  </div>

  <div className="p-4 space-y-1">
    <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-[#3B82F6] transition">
      {name}
    </h3>

    <p className="text-sm text-gray-500">
      {distance} KM away
    </p>
  </div>

</div>
  )
}

export default RestaurantCard
