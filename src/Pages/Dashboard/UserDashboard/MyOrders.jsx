import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `https://local-chef-bazaar-server-flame.vercel.app/orders/user/${user?.email}`
        );
        const data = await res.json();
        if (data.success) setOrders(data.data);
        else toast.error(data.message);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load orders");
      }
    };
    if (user?.email) fetchOrders();
  }, [user]);

  const handlePay = (orderId, amount) => {
    // Save orderId in localStorage/session to access after stripe payment
    localStorage.setItem("currentOrderId", orderId);
    localStorage.setItem("currentOrderAmount", amount);

    // Redirect to Stripe Payment page
    navigate("/dashboard/payment");
  };

  return (
    <div className="min-h-screen bg-neutral text-white py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">My Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-neutral/80 p-6 rounded-xl shadow-md border border-gray-700"
          >
            <h3 className="text-xl font-semibold mb-2">{order.foodName}</h3>
            <p>
              <span className="font-semibold">Status:</span> {order.orderStatus}
            </p>
            <p>
              <span className="font-semibold">Price:</span> ${order.price}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span> {order.quantity}
            </p>
            <p>
              <span className="font-semibold">Delivery Time:</span>{" "}
              {order.deliveryTime || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Chef Name:</span> {order.chefName}
            </p>
            <p>
              <span className="font-semibold">Chef ID:</span> {order.chefId}
            </p>
            <p>
              <span className="font-semibold">Payment Status:</span>{" "}
              {order.paymentStatus}
            </p>

            {order.orderStatus === "accepted" &&
              order.paymentStatus.toLowerCase() === "pending" && (
                <button
                  onClick={() => handlePay(order._id, order.price)}
                  className="mt-4 w-full py-2 bg-green-600 text-neutral rounded-lg font-semibold hover:bg-green-700"
                >
                  Pay
                </button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
