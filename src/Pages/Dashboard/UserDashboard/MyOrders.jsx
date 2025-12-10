import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch(`http://localhost:3000/orders?userEmail=${user?.email}`);
      const data = await res.json();
      if (data.success) setOrders(data.data);
    };
    fetchOrders();
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-neutral/80 p-4 rounded-xl shadow-md">
              <p><strong>Meal:</strong> {order.mealName}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Total Price:</strong> {order.price * order.quantity} BDT</p>
              <p><strong>Status:</strong> {order.orderStatus}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
