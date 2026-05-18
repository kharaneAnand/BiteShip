const ActiveRestaurantCard = ({ restaurant }: { restaurant: any }) => {

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* Glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-100/40 blur-3xl"></div>

      <div className="relative space-y-4">

        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl">

          <img
            src={restaurant.image}
            className="h-52 w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>

          <div className="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow">
            Active
          </div>

        </div>

        {/* Info */}
        <div className="space-y-4">

          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {restaurant.name}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Verified Restaurant Partner
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-2xl bg-gray-50 p-3 border border-gray-200">
              <p className="text-xs text-gray-500">
                Orders
              </p>

              <h4 className="mt-1 text-lg font-bold text-gray-900">
                {restaurant.totalOrders || 0}
              </h4>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3 border border-gray-200">
              <p className="text-xs text-gray-500">
                Revenue
              </p>

              <h4 className="mt-1 text-lg font-bold text-gray-900">
                ₹ {restaurant.revenue || 0}
              </h4>
            </div>

          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Phone
              </p>

              <p className="mt-1 text-sm text-gray-800">
                {restaurant.phone}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Address
              </p>

              <p className="mt-1 text-sm text-gray-700">
                {restaurant.autoLocation?.formattedAddress}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ActiveRestaurantCard;