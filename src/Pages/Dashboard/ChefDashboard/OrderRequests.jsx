import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../../Context/AuthContext";
import { buildApiUrl } from "../../../config/api";
import { 
  HiClipboardList, 
  HiCheck, 
  HiX, 
  HiTruck, 
  HiClock, 
  HiUser, 
  HiLocationMarker,
  HiCurrencyDollar,
  HiCalendar,
  HiExclamation,
  HiCheckCircle,
  HiXCircle,
  HiRefresh,
  HiFilter
} from "react-icons/hi";

const OrderRequests = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chefId, setChefId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user info to get chefId
  useEffect(() => {
    if (!user) return;

    const fetchUserChefId = async () => {
      try {
        const res = await fetch(buildApiUrl(`/users/${user.email}`));
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
      } catch {
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
        const res = await fetch(buildApiUrl("/orders"));
        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();

        let chefOrders = [];
        if (chefId) {
          chefOrders = data.data.filter((order) => order.chefId === chefId);
        } else if (user.role === "admin") {
          chefOrders = data.data;
        }

        setOrders(chefOrders);
      } catch {
        toast.error("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, chefId]);

  // Refresh orders
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(buildApiUrl("/orders"));
      if (!res.ok) throw new Error("Failed to fetch orders");

      const data = await res.json();

      let chefOrders = [];
      if (chefId) {
        chefOrders = data.data.filter((order) => order.chefId === chefId);
      } else if (user.role === "admin") {
        chefOrders = data.data;
      }

      setOrders(chefOrders);
      toast.success("Orders refreshed successfully!");
    } catch {
      toast.error("Failed to refresh orders");
    } finally {
      setRefreshing(false);
    }
  };

  // Update order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(buildApiUrl(`/update-order-status/${orderId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Order ${newStatus} successfully!`);
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: newStatus } : o
          )
        );
      } else {
        toast.error("Failed to update order");
      }
    } catch {
      toast.error("Server error");
    }
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.orderStatus === filterStatus;
  });

  // Get status badge styling
  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
    
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-warning/10 text-warning border border-warning/20`;
      case 'accepted':
        return `${baseClasses} bg-info/10 text-info border border-info/20`;
      case 'delivered':
        return `${baseClasses} bg-success/10 text-success border border-success/20`;
      case 'cancelled':
        return `${baseClasses} bg-error/10 text-error border border-error/20`;
      default:
        return `${baseClasses} bg-neutral/10 text-neutral border border-neutral/20`;
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <HiClock className="w-4 h-4" />;
      case 'accepted':
        return <HiCheckCircle className="w-4 h-4" />;
      case 'delivered':
        return <HiTruck className="w-4 h-4" />;
      case 'cancelled':
        return <HiXCircle className="w-4 h-4" />;
      default:
        return <HiExclamation className="w-4 h-4" />;
    }
  };

  // Get order stats
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    accepted: orders.filter(o => o.orderStatus === 'accepted').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Requests | LocalChefBazaar</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2 flex items-center space-x-3">
              <HiClipboardList className="w-8 h-8 text-primary" />
              <span>Order Requests</span>
            </h1>
            <p className="text-muted">Manage incoming customer orders and requests</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-hover transition-colors disabled:opacity-50"
            >
              <HiRefresh className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <div className="card-modern p-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <HiClipboardList className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold text-base-content">{orderStats.total}</p>
              <p className="text-xs text-muted">Total Orders</p>
            </div>
          </div>

          <div className="card-modern p-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <HiClock className="w-4 h-4 text-warning" />
              </div>
              <p className="text-2xl font-bold text-base-content">{orderStats.pending}</p>
              <p className="text-xs text-muted">Pending</p>
            </div>
          </div>

          <div className="card-modern p-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <HiCheckCircle className="w-4 h-4 text-info" />
              </div>
              <p className="text-2xl font-bold text-base-content">{orderStats.accepted}</p>
              <p className="text-xs text-muted">Accepted</p>
            </div>
          </div>

          <div className="card-modern p-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <HiTruck className="w-4 h-4 text-success" />
              </div>
              <p className="text-2xl font-bold text-base-content">{orderStats.delivered}</p>
              <p className="text-xs text-muted">Delivered</p>
            </div>
          </div>

          <div className="card-modern p-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-error/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                <HiXCircle className="w-4 h-4 text-error" />
              </div>
              <p className="text-2xl font-bold text-base-content">{orderStats.cancelled}</p>
              <p className="text-xs text-muted">Cancelled</p>
            </div>
          </div>
        </motion.div>

        {/* Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-modern p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <HiFilter className="w-5 h-5 text-muted" />
              <span className="text-sm font-medium text-base-content">Filter by status:</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {['all', 'pending', 'accepted', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? 'bg-primary text-white'
                      : 'text-muted hover:text-base-content hover:bg-hover'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Orders Display */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="card-modern p-12 max-w-md mx-auto">
              <HiClipboardList className="w-16 h-16 text-muted mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-base-content mb-4">
                {filterStatus === 'all' ? 'No Orders Yet' : `No ${filterStatus} Orders`}
              </h3>
              <p className="text-muted mb-6">
                {filterStatus === 'all' 
                  ? 'When customers place orders, they will appear here for you to manage.'
                  : `No orders with ${filterStatus} status found.`
                }
              </p>
              {filterStatus !== 'all' && (
                <button
                  onClick={() => setFilterStatus('all')}
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  View All Orders
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredOrders.map((order, index) => {
              const isCancelled = order.orderStatus === "cancelled";
              const isAccepted = order.orderStatus === "accepted";
              const isDelivered = order.orderStatus === "delivered";
              const isPending = order.orderStatus === "pending";

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-modern overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-base-content mb-1">
                          {order.mealName}
                        </h3>
                        <div className={getStatusBadge(order.orderStatus)}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="ml-1 capitalize">{order.orderStatus}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-primary font-bold text-lg">
                          <HiCurrencyDollar className="w-4 h-4" />
                          <span>${order.price}</span>
                        </div>
                        <p className="text-sm text-muted">Qty: {order.quantity}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm">
                        <HiUser className="w-4 h-4 text-muted flex-shrink-0" />
                        <span className="text-base-content">{order.userEmail}</span>
                      </div>
                      
                      <div className="flex items-start space-x-3 text-sm">
                        <HiLocationMarker className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
                        <span className="text-base-content line-clamp-2">{order.userAddress}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm">
                        <HiCalendar className="w-4 h-4 text-muted flex-shrink-0" />
                        <span className="text-base-content">
                          {new Date(order.orderTime).toLocaleDateString()} at{' '}
                          {new Date(order.orderTime).toLocaleTimeString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 text-sm">
                        <HiCurrencyDollar className="w-4 h-4 text-muted flex-shrink-0" />
                        <span className="text-base-content">
                          Payment: <span className="font-medium capitalize">{order.paymentStatus}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 pt-0">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => updateStatus(order._id, "cancelled")}
                        disabled={isCancelled || isAccepted || isDelivered}
                        className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isCancelled || isAccepted || isDelivered
                            ? "bg-surface-elevated text-muted cursor-not-allowed"
                            : "bg-error text-white hover:bg-error/90"
                        }`}
                      >
                        <HiX className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>

                      <button
                        onClick={() => updateStatus(order._id, "accepted")}
                        disabled={isCancelled || isAccepted || isDelivered}
                        className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isCancelled || isAccepted || isDelivered
                            ? "bg-surface-elevated text-muted cursor-not-allowed"
                            : "bg-success text-white hover:bg-success/90"
                        }`}
                      >
                        <HiCheck className="w-4 h-4" />
                        <span>Accept</span>
                      </button>

                      <button
                        onClick={() => updateStatus(order._id, "delivered")}
                        disabled={!isAccepted || isCancelled || isDelivered}
                        className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          !isAccepted || isCancelled || isDelivered
                            ? "bg-surface-elevated text-muted cursor-not-allowed"
                            : "bg-info text-white hover:bg-info/90"
                        }`}
                      >
                        <HiTruck className="w-4 h-4" />
                        <span>Deliver</span>
                      </button>
                    </div>

                    {/* Status Help Text */}
                    {isPending && (
                      <p className="text-xs text-muted mt-3 text-center">
                        Accept or cancel this order to proceed
                      </p>
                    )}
                    {isAccepted && (
                      <p className="text-xs text-muted mt-3 text-center">
                        Mark as delivered when order is completed
                      </p>
                    )}
                    {isDelivered && (
                      <p className="text-xs text-success mt-3 text-center">
                        Order completed successfully!
                      </p>
                    )}
                    {isCancelled && (
                      <p className="text-xs text-error mt-3 text-center">
                        This order has been cancelled
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </>
  );
};

export default OrderRequests;
