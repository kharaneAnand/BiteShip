import {MapContainer , TileLayer , Marker , useMapEvents , useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { restaurantService } from "../main";
import L from "leaflet";
import { LuLocateFixed } from "react-icons/lu";
import { BiLoader, BiPlus, BiTrash } from "react-icons/bi";


delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Address {
  _id: string;
  formattedAddress: string;
  mobile: number;
}

//  Click-to-select location
const LocationPicker = ({
  setLocation,
}: {
  setLocation: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};

//  Locate me button
const LocateMeButton = ({
  onLocate,
}: {
  onLocate: (lat: number, lng: number) => void;
}) => {
  const map = useMap();

  const locateUser = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        map.flyTo([latitude, longitude], 16, {
          animate: true,
        });

        onLocate(latitude, longitude);
      },
      () => toast.error("Location permission denied")
    );
  };

  return (
    <button
      onClick={locateUser}
      className="absolute right-3 top-3 z-1000 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow hover:bg-gray-100"
    >
      <LuLocateFixed size={16} />
      Use current location
    </button>
  );
};

const AddAddressPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  //  Form state
  const [mobile, setMobile] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  //  Reverse geocoding
  const fetchFormattedAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();

      setFormattedAddress(data.display_name || "");
    } catch {
      toast.error("Failed to fetch address");
    }
  };

  const setLocation = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);

    fetchFormattedAddress(lat, lng);
  };

  //  Fetch addresses
  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(
        `${restaurantService}/api/address/all`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAddresses(data || []);
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  //  Add address
  const addAddress = async () => {
    if (
      !mobile ||
      !formattedAddress ||
      latitude === null ||
      longitude === null
    ) {
      toast.error("Please select location on map");
      return;
    }

    try {
      setAdding(true);

      await axios.post(
        `${restaurantService}/api/address/new`,
        {
          formattedAddress,
          mobile,
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Address added");

      setMobile("");
      setFormattedAddress("");
      setLatitude(null);
      setLongitude(null);

      fetchAddresses();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setAdding(false);
    }
  };

  //  Delete address
  const deleteAddress = async (id: string) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      setDeletingId(id);

      await axios.delete(`${restaurantService}/api/address/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Address deleted");

      fetchAddresses();
    } catch {
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  return (
  <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">

    {/* Heading */}
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Select Delivery Address
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        Choose your delivery location and save it for faster checkout.
      </p>
    </div>

    {/* Map */}
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      <div className="relative h-112.5 w-full overflow-hidden">

        <MapContainer
          center={[latitude || 28.6139, longitude || 77.209]}
          zoom={13}
          className="h-full w-full z-0"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <LocationPicker setLocation={setLocation} />

          <LocateMeButton onLocate={setLocation} />

          {latitude && longitude && (
            <Marker position={[latitude, longitude]} />
          )}
        </MapContainer>

      </div>

    </div>

    {/* Selected address */}
    {formattedAddress && (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-4 shadow-sm">
        <p className="text-sm font-medium text-green-700">
          {formattedAddress}
        </p>
      </div>
    )}

    {/* Mobile */}
    <div className="space-y-2">

      <label className="text-sm font-semibold text-gray-700">
        Mobile Number
      </label>

      <input
        type="number"
        placeholder="Enter mobile number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
      />

    </div>

    {/* Save */}
    <button
      disabled={adding}
      onClick={addAddress}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50"
    >
      {adding ? (
        <BiLoader className="animate-spin" />
      ) : (
        <BiPlus />
      )}

      Save Address
    </button>

    {/* Saved Addresses */}
    <div className="space-y-4">

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Saved Addresses
        </h2>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#2563EB]">
          {addresses.length} Saved
        </span>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            Loading...
          </p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">
            No addresses saved
          </p>
        </div>
      ) : (
        addresses.map((addr) => (
          <div
            key={addr._id}
            className="flex items-start justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
          >

            <div className="flex gap-3">

              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                <BiPlus className="text-[#2563EB]" size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {addr.formattedAddress}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  📞 {addr.mobile}
                </p>
              </div>

            </div>

            <button
              onClick={() => deleteAddress(addr._id)}
              disabled={deletingId === addr._id}
              className="rounded-xl p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
            >
              {deletingId === addr._id ? (
                <BiLoader
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <BiTrash size={16} />
              )}
            </button>

          </div>
        ))
      )}
    </div>
  </div>
);
};

export default AddAddressPage;