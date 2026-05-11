import { useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppContext";
import { useState } from "react";
import type { ICart, IMenuItem, IRestaurant } from "../types";
import axios from "axios";
import { restaurantService } from "../main";
import toast from "react-hot-toast";
import { VscLoading } from "react-icons/vsc";
import { BiMinus, BiPlus } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";

const Cart = () => {

  const { cart, subTotal, quantity, fetchCart } = useAppData();

  const navigate = useNavigate();

  const [loadingItemId, setLoadingItemId] = useState<string | null>(null);
  const [clearingCart, setClearingCart] = useState(false);

  if (!cart || cart.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg text-gray-500">
          Your Cart is empty
        </p>
      </div>
    );
  }

  const restaurant = cart[0].restaurantId as IRestaurant;

  const deliveryFee = subTotal < 250 ? 49 : 0;
  const platformFee = 10;

  const grandTotal = subTotal + deliveryFee + platformFee;

  const increaseQty = async (itemId: string) => {

    try {

      setLoadingItemId(itemId);

      await axios.put(
        `${restaurantService}/api/cart/inc`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchCart();

    } catch (error) {

      toast.error("Something went wrong");

    } finally {

      setLoadingItemId(null);

    }
  };

  const decreaseQty = async (itemId: string) => {

    try {

      setLoadingItemId(itemId);

      await axios.put(
        `${restaurantService}/api/cart/dec`,
        { itemId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchCart();

    } catch (error) {

      toast.error("Something went wrong");

    } finally {

      setLoadingItemId(null);

    }
  };

  const clearCart = async () => {

    const confirmClear = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmClear) return;

    try {

      setClearingCart(true);

      await axios.delete(
        `${restaurantService}/api/cart/clear`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchCart();

      toast.success("Cart Cleared");

    } catch (error) {

      toast.error("Something went wrong");

    } finally {

      setClearingCart(false);

    }
  };

  const checkOut = () => {
    navigate("/checkout");
  };

  return (
  <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">

    {/* Restaurant Info */}
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      
      <div className="flex items-start justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {restaurant.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {restaurant.autoLocation.formattedAddress}
          </p>
        </div>

        <div className={`rounded-full px-4 py-1.5 text-sm font-semibold shadow-sm
          ${restaurant.isOpen
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-600"
          }`}
        >
          {restaurant.isOpen ? "Open" : "Closed"}
        </div>

      </div>

    </div>

    {/* Cart Items */}
    <div className="space-y-4">

      {cart.map((cartItem: ICart) => {

        const item = cartItem.itemId as IMenuItem;

        const isLoading = loadingItemId === item._id;

        return (
          <div
            key={item._id}
            className="group flex items-center gap-4 rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg"
          >

            <div className="overflow-hidden rounded-2xl">
              <img
                src={item.image}
                className="h-24 w-24 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="flex-1">

              <h3 className="text-base font-semibold text-gray-900">
                {item.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                ₹{item.price}
              </p>

            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-3 py-2">

              <button
                className="rounded-full p-1.5 text-gray-700 transition hover:bg-white disabled:opacity-50"
                disabled={isLoading}
                onClick={() => decreaseQty(item._id)}
              >
                {isLoading ? (
                  <VscLoading
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <BiMinus size={16} />
                )}
              </button>

              <span className="min-w-5 text-center font-semibold text-gray-900">
                {cartItem.quantity}
              </span>

              <button
                className="rounded-full p-1.5 text-gray-700 transition hover:bg-white disabled:opacity-50"
                disabled={isLoading}
                onClick={() => increaseQty(item._id)}
              >
                {isLoading ? (
                  <VscLoading
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <BiPlus size={16} />
                )}
              </button>

            </div>

            {/* Item Total */}
            <p className="w-20 text-right text-base font-semibold text-gray-900">
              ₹{item.price * cartItem.quantity}
            </p>

          </div>
        );
      })}
    </div>

    {/* Summary */}
    <div className="space-y-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">

      <h3 className="text-lg font-bold text-gray-900">
        Bill Summary
      </h3>

      <div className="space-y-3">

        <div className="flex justify-between text-sm text-gray-600">
          <span>Total Items</span>
          <span className="font-medium text-gray-900">{quantity}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">₹{subTotal}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Delivery Fee</span>

          <span className="font-medium text-gray-900">
            {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Platform Fee</span>
          <span className="font-medium text-gray-900">₹{platformFee}</span>
        </div>

      </div>

      {subTotal < 250 && (
        <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-[#2563EB]">
          Add items worth ₹{250 - subTotal} more to get free delivery
        </div>
      )}

      <div className="flex justify-between border-t border-dashed border-gray-300 pt-4 text-lg font-bold text-gray-900">
        <span>Grand Total</span>
        <span>₹{grandTotal}</span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={checkOut}
        className={`mt-2 w-full rounded-2xl bg-linear-to-r from-[#1E3A8A] to-[#3B82F6] py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:shadow-lg
        ${!restaurant.isOpen ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={!restaurant.isOpen}
      >
        {!restaurant.isOpen ? "Restaurant is Closed" : "Proceed to Checkout"}
      </button>

      {/* Clear Cart Button */}
      <button
        onClick={clearCart}
        disabled={clearingCart}
        className="mt-3 flex w-full items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-800 transition-all duration-300 hover:bg-gray-50 disabled:opacity-50"
      >

        {clearingCart ? (
          <VscLoading className="animate-spin" size={18} />
        ) : (
          <>
            Clear Cart
            <TbTrash size={16} />
          </>
        )}

      </button>

    </div>
  </div>
);
};

export default Cart;