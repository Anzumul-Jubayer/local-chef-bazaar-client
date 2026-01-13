import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { AuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import {
  HiShoppingCart,
  HiCreditCard,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiEye,
  HiRefresh,
  HiFilter,
} from "react-icons/hi";
import { buildApiUrl } from "../../../config/api";
import { useLoadingState } from "../../../hooks/useLoadingState";

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const { withLoading } = useLoadingState();
  const navigate = useNavigate();

  const fetchOrders = useCallback(async () => {
    try {
      await withLoading(async () => {
        const res = await fetch(
          buildApiUrl(`/orders/user/${user?.email}`)
        );
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          toast.error(data.message);
        }
      }, "Loading your orders...");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    }
  }, [user?.email, withLoading]);

  useEffect(() => {
    if (user?.email) fetchOrders();
  }, [user?.email, fetchOrders]);

  // Filter orders based on status and payment filters using useMemo
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }

    if (paymentFilter !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentStatus.toLowerCase() === paymentFilter
      );
    }

    return filtered;
  }, [orders, statusFilter, paymentFilter]);

  const handlePay = (orderId, amount) => {
    localStorage.setItem("currentOrderId", orderId);
    localStorage.setItem("currentOrderAmount", amount);
    navigate("/dashboard/payment");
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "confirmed":
        return <HiCheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <HiClock className="w-5 h-5 text-yellow-500" />;
      case "cancelled":
      case "rejected":
        return <HiXCircle className="w-5 h-5 text-red-500" />;
      default:
        return <HiClock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1";
    switch (status?.toLowerCase()) {
      case "accepted":
      case "confirmed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case "cancelled":
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
    }
  };

  const getPaymentBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    switch (status?.toLowerCase()) {
      case "paid":
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`;
      case "failed":
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400`;
    }
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="dashboard-title flex items-center gap-3">
              <HiShoppingCart className="w-8 h-8 text-primary" />
              My Orders
            </h1>
            <p className="dashboard-subtitle">
              Track and manage your meal orders
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="btn btn-outline btn-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <HiRefresh className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <HiFilter className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filter Orders
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Order Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <HiShoppingCart className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {orders.length === 0
              ? "No Orders Yet"
              : "No Orders Match Your Filters"}
          </h3>
          <p className="text-muted mb-6">
            {orders.length === 0
              ? "Start ordering delicious meals from our talented chefs!"
              : "Try adjusting your filters to see more orders."}
          </p>
          {orders.length === 0 && (
            <button
              onClick={() => navigate("/meals")}
              className="btn btn-primary"
            >
              Browse Meals
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-surface rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-primary/30"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {order.foodName || order.mealTitle}
                  </h3>
                  <p className="text-sm text-muted">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <div className={getStatusBadge(order.orderStatus)}>
                  {getStatusIcon(order.orderStatus)}
                  <span className="capitalize">{order.orderStatus}</span>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Chef</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.chefName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Price</span>
                  <span className="text-sm font-semibold text-primary">
                    ৳{order.price}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Quantity</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.quantity}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted">Total Amount</span>
                  <span className="text-lg font-bold text-primary">
                    ৳{(order.price * order.quantity).toFixed(2)}
                  </span>
                </div>
                {order.deliveryTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted">Delivery Time</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {order.deliveryTime}
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Status */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted">Payment</span>
                <span className={getPaymentBadge(order.paymentStatus)}>
                  {order.paymentStatus}
                </span>
              </div>

              {/* Order Date */}
              <div className="text-xs text-muted mb-4">
                Ordered on{" "}
                {new Date(
                  order.createdAt || order.orderDate
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  className="btn btn-outline btn-sm flex-1 flex items-center justify-center gap-2"
                  onClick={() => {
                    /* Add view details functionality */
                  }}
                >
                  <HiEye className="w-4 h-4" />
                  View Details
                </button>

                {order.orderStatus === "accepted" &&
                  order.paymentStatus.toLowerCase() === "pending" && (
                    <button
                      onClick={() =>
                        handlePay(order._id, order.price * order.quantity)
                      }
                      className="btn btn-primary btn-sm flex items-center justify-center gap-2"
                    >
                      <HiCreditCard className="w-4 h-4" />
                      Pay Now
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {orders.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-primary">
              {orders.length}
            </div>
            <div className="text-sm text-muted">Total Orders</div>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-green-500">
              {
                orders.filter(
                  (o) =>
                    o.orderStatus === "accepted" ||
                    o.orderStatus === "confirmed"
                ).length
              }
            </div>
            <div className="text-sm text-muted">Confirmed</div>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-yellow-500">
              {orders.filter((o) => o.orderStatus === "pending").length}
            </div>
            <div className="text-sm text-muted">Pending</div>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-primary">
              ৳
              {orders
                .reduce((sum, order) => sum + order.price * order.quantity, 0)
                .toFixed(2)}
            </div>
            <div className="text-sm text-muted">Total Spent</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
