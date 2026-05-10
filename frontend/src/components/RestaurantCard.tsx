import { useNavigate } from "react-router-dom"


type props = {
    id:string ,
    image : string ,
    name : string ,
    isOpen : boolean ,
    distance : string ,
}

const RestaurantCard = ({id , image , name , distance , isOpen } : props) => {

    const navigate = useNavigate() ;

return (
  <div
    className={`group cursor-pointer overflow-hidden rounded-3xl bg-white border border-gray-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
    ${!isOpen ? "opacity-80" : ""}`}
    onClick={() => navigate(`/restaurant/${id}`)}
  >

    <div className="relative h-48 w-full overflow-hidden">

      <img
        src={image}
        alt="image of the Restaurant"
        className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110
        ${!isOpen ? "grayscale" : ""}`}
      />

      {/* soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

      {
        !isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white border border-white/20 backdrop-blur">
              Closed
            </span>
          </div>
        )
      }

      {/* distance badge */}
      <div className="absolute bottom-3 left-3">
        <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-800 shadow-lg">
          {distance} KM away
        </span>
      </div>

      {/* top right subtle dot */}
      <div className="absolute right-3 top-3">
        <div className={`h-3 w-3 rounded-full shadow
          ${isOpen ? "bg-green-500" : "bg-red-500"}`}
        />
      </div>

    </div>

    <div className="p-4">

      <div className="flex items-start justify-between gap-3">

        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-[#2563EB]">
            {name}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {distance} Km away
          </p>
        </div>

      </div>

    </div>

  </div>
)
}

export default RestaurantCard
