import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext";


const Orders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [meal, setMeal] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");

  // Fetch meal details
  useEffect(() => {
    const loadMeal = async () => {
      try {
        const res = await fetch(`http://localhost:3000/meal-details/${id}`);
        const data = await res.json();
        setMeal(data);
      } catch (err) {
        toast.error("Error fetching meal");
      }
    };
    loadMeal();
  }, [id]);

  if (!meal) return <p className="text-center text-white mt-20">Loading...</p>;

  const totalPrice = meal.price * quantity;

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to place an order");
      return;
    }

    // Confirm popup
    const result = await Swal.fire({
      title: "Confirm Order",
      html: `Your total price is <b>${totalPrice} BDT</b>.<br/>Do you want to confirm the order?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm",
      cancelButtonText: "Cancel",
      background: "#1f1f1f",
      color: "white",
    });

    if (!result.isConfirmed) return;

    const orderData = {
      foodId: meal._id,
      mealName: meal.foodName,
      price: meal.price,
      quantity,
      chefId: meal.chefId,
      paymentStatus: "Pending",
      userEmail: user.email,
      userAddress: address,
      orderStatus: "pending",
      orderTime: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          title: "Success!",
          text: "Order placed successfully!",
          icon: "success",
          background: "#1f1f1f",
          color: "white",
        });

        navigate("/my-orders");
      } else {
        toast.error("Error placing order");
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral text-white py-12 px-4">
      <motion.div
        className="max-w-xl mx-auto bg-neutral/80 rounded-xl p-8 shadow-2xl border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-6">Confirm Your Order</h2>

        <form onSubmit={handleConfirmOrder} className="space-y-5">
          {/* Meal Name */}
          <div>
            <label className="font-semibold">Meal Name</label>
            <input
              type="text"
              value={meal.foodName}
              disabled
              className="input input-bordered w-full mt-1 text-black"
            />
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold">Price (per unit)</label>
            <input
              type="text"
              value={meal.price + " BDT"}
              disabled
              className="input input-bordered w-full mt-1 text-black"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="font-semibold">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input input-bordered w-full mt-1 text-black"
              required
            />
          </div>

          {/* Chef ID */}
          <div>
            <label className="font-semibold">Chef ID</label>
            <input
              type="text"
              value={meal.chefId}
              disabled
              className="input input-bordered w-full mt-1 text-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-semibold">Your Email</label>
            <input
              type="text"
              value={user.email}
              disabled
              className="input input-bordered w-full mt-1 text-black"
            />
          </div>

          {/* Address */}
          <div>
            <label className="font-semibold">Delivery Address</label>
            <textarea
              placeholder="Enter your delivery address..."
              className="textarea textarea-bordered w-full mt-1 text-black"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          {/* Total Price */}
          <p className="text-xl font-bold text-primary">
            Total Price: {totalPrice} BDT
          </p>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-neutral rounded-lg font-semibold hover:bg-[#b9932c]"
          >
            Confirm Order
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Orders;
