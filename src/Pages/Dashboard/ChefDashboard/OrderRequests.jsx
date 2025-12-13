import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../../Context/AuthContext";

const OrderRequests = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chefId, setChefId] = useState(null);

  // Fetch user info to get chefId
  useEffect(() => {
    if (!user) return;

    const fetchUserChefId = async () => {
      try {
        const res = await fetch(
          `https://local-chef-bazaar-server-flame.vercel.app/users/${user.email}`
        );
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();

        if (data.success && data.data) {
          const currentUser = data.data;
          if (currentUser.role === "chef") {
            setChefId(currentUser.chefId);
          } else if (currentUser.role === "admin") {
            setChefId(null); // admin sees all
          }
        }
      } catch (err) {
        toast.error("Failed to fetch user info");
      }
    };

    fetchUserChefId();
  }, [user]);

  // Fetch orders and filter by chefId
  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          "https://local-chef-bazaar-server-flame.vercel.app/orders"
        );
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();

        let chefOrders = [];
        if (chefId) {
          chefOrders = data.data.filter((order) => order.chefId === chefId);
        } else if (user.role === "admin") {
          chefOrders = data.data;
        }

        setOrders(chefOrders);
      } catch (err) {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, chefId]);

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(
        `https://local-chef-bazaar-server-flame.vercel.app/update-order-status/${orderId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderStatus: newStatus }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success(`Order ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: newStatus } : o
          )
        );
      } else {
        toast.error("Failed to update order");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  if (loading)
    return <p className="text-white text-center mt-20">Loading...</p>;

  return (
    <>
      <Helmet>
        <title>Order Requests | LocalChefBazaar</title>
      </Helmet>

      <div className="min-h-screen bg-neutral text-white p-6">
        <h2 className="text-3xl font-bold text-primary text-center mb-8">
          Order Requests
        </h2>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {orders.length === 0 && (
            <p className="text-center col-span-full">
              No orders found for you.
            </p>
          )}
          {orders.map((order) => {
            const isCancelled = order.orderStatus === "cancelled";
            const isAccepted = order.orderStatus === "accepted";
            const isDelivered = order.orderStatus === "delivered";

            return (
              <motion.div
                key={order._id}
                className="bg-neutral/80 border border-gray-700 p-4 rounded-xl shadow-lg flex flex-col justify-between"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{order.mealName}</h3>
                  <p>Price: ${order.price}</p>
                  <p>Quantity: {order.quantity}</p>
                  <p>
                    Status:{" "}
                    <span className="font-semibold">{order.orderStatus}</span>
                  </p>
                  <p>User: {order.userEmail}</p>
                  <p>Address: {order.userAddress}</p>
                  <p>Payment: {order.paymentStatus}</p>
                  <p>
                    Ordered At: {new Date(order.orderTime).toLocaleString()}
                  </p>
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => updateStatus(order._id, "cancelled")}
                    disabled={isCancelled || isAccepted || isDelivered}
                    className={`px-3 py-1 rounded ${
                      isCancelled || isAccepted || isDelivered
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "accepted")}
                    disabled={isCancelled || isAccepted || isDelivered}
                    className={`px-3 py-1 rounded ${
                      isCancelled || isAccepted || isDelivered
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(order._id, "delivered")}
                    disabled={!isAccepted || isCancelled || isDelivered}
                    className={`px-3 py-1 rounded ${
                      !isAccepted || isCancelled || isDelivered
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Deliver
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default OrderRequests;
