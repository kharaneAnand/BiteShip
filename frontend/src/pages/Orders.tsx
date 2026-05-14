import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Iorder } from "../types";
import { useSocket } from "../context/SocketContext";
import { restaurantService } from "../main";

const ACTIVE_STATUSES = [
  "placed",
  "accepted",
  "preparing",
  "ready_for_rider",
  "rider_assigned",
  "picked_up",
];

const Orders = () => {
  const [orders, setOrders] = useState<Iorder[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { socket } = useSocket();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${restaurantService}/api/order/myorder`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onOrderUpdate = () => {
      fetchOrders();
    };

    socket.on("order:update", onOrderUpdate);

    return () => {
      socket.off("order:update", onOrderUpdate);
    };
  }, [socket]);

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Loading orders...
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">
          No orders yet
        </p>
      </div>
    );
  }

  const activeOrders = orders.filter((o) =>
    ACTIVE_STATUSES.includes(o.status)
  );

  const completedOrders = orders.filter(
    (o) => !ACTIVE_STATUSES.includes(o.status)
  );

  return (
  <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">

    {/* Header */}
    <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          My Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track all your active and completed food orders.
        </p>
      </div>

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-blue-50 px-4 py-2 text-center shadow-sm">
          <p className="text-lg font-bold text-[#2563EB]">
            {activeOrders.length}
          </p>

          <p className="text-xs font-medium text-gray-500">
            Active
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 px-4 py-2 text-center shadow-sm">
          <p className="text-lg font-bold text-green-600">
            {completedOrders.length}
          </p>

          <p className="text-xs font-medium text-gray-500">
            Completed
          </p>
        </div>

      </div>

    </div>

    {/* Active Orders */}
    <section className="space-y-4">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Active Orders
          </h2>

          <p className="text-sm text-gray-500">
            Orders currently in progress.
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700 shadow-sm">
          {activeOrders.length} Active
        </div>

      </div>

      {activeOrders.length === 0 ? (

        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
            🍕
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No Active Orders
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Your ongoing orders will appear here.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-5">
          {activeOrders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              onClick={() => navigate(`/orders/${order._id}`)}
            />
          ))}
        </div>

      )}
    </section>

    {/* Completed Orders */}
    <section className="space-y-4">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Completed Orders
          </h2>

          <p className="text-sm text-gray-500">
            Delivered and completed order history.
          </p>
        </div>

        <div className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-700 shadow-sm">
          {completedOrders.length} Completed
        </div>

      </div>

      {completedOrders.length === 0 ? (

        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
            🚚
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            No Completed Orders
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Completed orders will appear here.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-5">
          {completedOrders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              onClick={() => navigate(`/orders/${order._id}`)}
            />
          ))}
        </div>

      )}
    </section>

  </div>
);
};

export default Orders;

// component OrderRow
const OrderRow = ({
  order,
  onClick,
}: {
  order: Iorder;
  onClick: () => void;
}) => {
 return (
  <div
    className="group relative cursor-pointer overflow-hidden rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    onClick={onClick}
  >

    {/* Glow */}
    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-100 opacity-40 blur-3xl"></div>

    <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

      {/* Left */}
      <div className="space-y-4">

        <div className="flex items-center gap-4">

          {/* Order Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-[#2563EB] to-[#3B82F6] shadow-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <span className="text-lg font-bold text-white">
                #
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Order ID
            </p>

            <h3 className="font-mono text-sm font-bold text-gray-900">
              #{order._id.slice(-6)}
            </h3>
          </div>

        </div>

        <div className="flex flex-wrap gap-2">
          {order.items.slice(0, 3).map((item, index) => (
            <span
              key={index}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
            >
              {item.name} × {item.quantity}
            </span>
          ))}
        </div>

      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-4">

        <span
          className={`rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm
          ${
            ACTIVE_STATUSES.includes(order.status)
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status.replaceAll("_", " ")}
        </span>

        <div className="text-right">
          <p className="text-xs text-gray-500">
            Total Amount
          </p>

          <h4 className="text-xl font-bold text-gray-900">
            ₹{order.totalAmount}
          </h4>
        </div>

      </div>

    </div>

    {/* Footer */}
    <div className="relative mt-5 flex items-center justify-between border-t border-dashed border-gray-200 pt-4">

      <div>
        <p className="text-xs text-gray-500">
          Payment Status
        </p>

        <p className="text-sm font-semibold capitalize text-gray-800">
          {order.paymentStatus}
        </p>
      </div>

      <button  className="rounded-2xl bg-linear-to-r from-[#2563EB] to-[#3B82F6] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg">
        View Details
      </button>

    </div>

  </div>
);
};