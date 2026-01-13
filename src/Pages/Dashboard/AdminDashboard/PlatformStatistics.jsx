import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import { buildApiUrl } from "../../../config/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { 
  HiChartPie, 
  HiUsers, 
  HiCurrencyDollar, 
  HiShoppingCart,
  HiRefresh,
  HiDownload,
  HiTrendingUp,
  HiTrendingDown,
  HiUserAdd,
  HiCheckCircle
} from "react-icons/hi";

const PlatformStatistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeChefs: 0,
    completedOrders: 0,
    pendingOrders: 0
  });
  const [chartData, setChartData] = useState({
    monthlyData: [],
    ordersByStatus: [],
    userGrowth: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

  const fetchPlatformStats = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, monthlyRes, statusRes, usersRes, ordersRes] = await Promise.all([
        fetch(buildApiUrl("/admin/stats")).catch(() => null),
        fetch(buildApiUrl("/admin/monthly-data")).catch(() => null),
        fetch(buildApiUrl("/admin/order-status-distribution")).catch(() => null),
        fetch(buildApiUrl("/users")).catch(() => null),
        fetch(buildApiUrl("/orders")).catch(() => null)
      ]);

      // Process stats data
      if (statsRes && statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.metrics);
        }
      }

      // Process monthly data
      if (monthlyRes && monthlyRes.ok) {
        const monthlyData = await monthlyRes.json();
        if (monthlyData.success) {
          setChartData(prev => ({ ...prev, monthlyData: monthlyData.data }));
        }
      }

      // Process order status distribution
      if (statusRes && statusRes.ok) {
        const statusData = await statusRes.json();
        if (statusData.success) {
          setChartData(prev => ({ ...prev, ordersByStatus: statusData.data }));
        }
      }

      // Fallback calculations if API fails
      if (usersRes && usersRes.ok && ordersRes && ordersRes.ok) {
        const users = await usersRes.json();
        const ordersData = await ordersRes.json();
        const orders = ordersData.data || [];

        // Calculate fallback stats
        const fallbackStats = {
          totalUsers: users.length,
          activeChefs: users.filter(u => u.role === 'chef').length,
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, order) => {
            let amount = 0;
            if (order.paymentInfo && order.paymentInfo.amount) {
              amount = parseFloat(order.paymentInfo.amount) / 100;
            } else if (order.totalPrice) {
              amount = parseFloat(order.totalPrice);
            } else if (order.price && order.quantity) {
              amount = parseFloat(order.price) * parseFloat(order.quantity);
            }
            return sum + amount;
          }, 0),
          completedOrders: orders.filter(o => o.orderStatus === 'delivered').length,
          pendingOrders: orders.filter(o => o.orderStatus === 'pending').length
        };

        setStats(prev => ({ ...prev, ...fallbackStats }));

        // Generate fallback chart data
        const statusDistribution = [
          { name: "Completed", value: orders.filter(o => o.orderStatus === 'delivered').length },
          { name: "Pending", value: orders.filter(o => o.orderStatus === 'pending').length },
          { name: "Processing", value: orders.filter(o => o.orderStatus === 'processing').length },
          { name: "Cancelled", value: orders.filter(o => o.orderStatus === 'cancelled').length }
        ].filter(item => item.value > 0);

        setChartData(prev => ({ ...prev, ordersByStatus: statusDistribution }));
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching platform statistics:", error);
      toast.error("Failed to load platform statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlatformStats();
  }, [fetchPlatformStats]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLastUpdated = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Platform Statistics | LocalChefBazaar</title>
        </Helmet>
        <div className="animate-fade-in space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 bg-base-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-base-300 rounded w-64"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-modern p-6 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-base-300 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-base-300 rounded w-20"></div>
                    <div className="h-6 bg-base-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Platform Statistics | LocalChefBazaar</title>
      </Helmet>

      <div className="animate-fade-in space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2 flex items-center">
              <HiChartPie className="w-8 h-8 mr-3 text-primary" />
              Platform Statistics
            </h1>
            <p className="text-muted">Comprehensive analytics and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <div className="text-sm text-muted">
              Updated {formatLastUpdated(lastUpdated)}
            </div>
            <button
              onClick={fetchPlatformStats}
              className="btn btn-outline btn-sm"
            >
              <HiRefresh className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="btn btn-primary btn-sm">
              <HiDownload className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                <HiCurrencyDollar className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Total Revenue</p>
                <p className="text-2xl font-bold text-base-content">{formatCurrency(stats.totalRevenue)}</p>
                <div className="flex items-center mt-1">
                  <HiTrendingUp className="w-4 h-4 text-success mr-1" />
                  <span className="text-sm text-success">+12.5%</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-info/10 rounded-2xl flex items-center justify-center">
                <HiUsers className="w-7 h-7 text-info" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Total Users</p>
                <p className="text-2xl font-bold text-base-content">{stats.totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <HiTrendingUp className="w-4 h-4 text-success mr-1" />
                  <span className="text-sm text-success">+8.2%</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center">
                <HiShoppingCart className="w-7 h-7 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Total Orders</p>
                <p className="text-2xl font-bold text-base-content">{stats.totalOrders.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <HiTrendingDown className="w-4 h-4 text-error mr-1" />
                  <span className="text-sm text-error">-2.1%</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
                <HiUserAdd className="w-7 h-7 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Active Chefs</p>
                <p className="text-2xl font-bold text-base-content">{stats.activeChefs.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <HiTrendingUp className="w-4 h-4 text-success mr-1" />
                  <span className="text-sm text-success">+15.3%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-base-content">Completion Rate</h3>
              <HiCheckCircle className="w-6 h-6 text-success" />
            </div>
            <div className="text-3xl font-bold text-base-content mb-2">
              {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
            </div>
            <p className="text-sm text-muted">
              {stats.completedOrders} of {stats.totalOrders} orders completed
            </p>
          </motion.div>

          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-base-content">Avg Order Value</h3>
              <HiCurrencyDollar className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-base-content mb-2">
              {formatCurrency(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)}
            </div>
            <p className="text-sm text-muted">Per order average</p>
          </motion.div>

          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-base-content">Pending Orders</h3>
              <HiShoppingCart className="w-6 h-6 text-warning" />
            </div>
            <div className="text-3xl font-bold text-base-content mb-2">
              {stats.pendingOrders}
            </div>
            <p className="text-sm text-muted">Awaiting processing</p>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Status Distribution */}
          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-base-content mb-6">Order Status Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.ordersByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Orders']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Monthly Revenue */}
          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-xl font-semibold text-base-content mb-6">Monthly Revenue</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.monthlyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Monthly Orders Bar Chart */}
        <motion.div
          className="card-modern p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h3 className="text-xl font-semibold text-base-content mb-6">Monthly Orders & Users</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#10B981" name="Orders" />
                <Bar dataKey="users" fill="#3B82F6" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PlatformStatistics;
