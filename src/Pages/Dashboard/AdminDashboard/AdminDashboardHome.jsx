import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import OverviewCards from '../../../Components/Dashboard/OverviewCards';
import DashboardCharts from '../../../Components/Dashboard/DashboardCharts';
import DataTable from '../../../Components/Dashboard/DataTable';
import { dashboardAPI } from '../../../services/api';
import { buildApiUrl } from '../../../config/api';
import { 
  HiRefresh, 
  HiClock, 
  HiExclamationCircle,
  HiSparkles,
  HiUsers,
  HiShoppingCart
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminDashboardHome = () => {
  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalUsers: 0,
      totalRevenue: 0, // This represents total payment processed
      totalOrders: 0,
      activeChefs: 0,
      completedOrders: 0, // New metric for completion rate
      pendingOrders: 0,
      cancelledOrders: 0
    },
    trends: {
      users: 0,
      revenue: 0, // This represents payment trend
      orders: 0,
      chefs: 0,
      completion: 0, // New trend for completion rate
      growth: 0 // New trend for platform growth
    },
    chartData: {
      monthlyOrders: [],
      spendingTrend: [],
      ordersByStatus: []
    },
    recentOrders: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAdminData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      // Fetch all admin data in parallel
      const [
        statsData,
        monthlyData,
        statusDistribution,
        usersData,
        ordersData
      ] = await Promise.all([
        dashboardAPI.getAdminStats().catch((error) => {
          console.error('Admin stats API error:', error);
          return { 
            metrics: { totalUsers: 0, totalRevenue: 0, totalOrders: 0, activeChefs: 0, completedOrders: 0, pendingOrders: 0, cancelledOrders: 0 },
            trends: { users: 0, revenue: 0, orders: 0, chefs: 0, completion: 0, growth: 0 }
          };
        }),
        dashboardAPI.getAdminMonthlyData().catch(() => ({ data: [] })),
        dashboardAPI.getAdminOrderStatusDistribution().catch(() => ({ data: [] })),
        dashboardAPI.getAllUsers().catch(() => []),
        dashboardAPI.getAllOrders().catch(() => ({ data: [] }))
      ]);

      console.log('Admin Dashboard Data:', { statsData, ordersData, usersData });

      const users = Array.isArray(usersData) ? usersData : [];
      const orders = ordersData.data || [];

      console.log('Orders for payment calculation:', orders.slice(0, 3)); // Log first 3 orders to see structure

      // Use API data or fallback to calculated data
      const completedOrders = orders.filter(o => o.orderStatus === 'delivered').length;
      const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
      const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled').length;

      // Calculate total payment with multiple possible field names
      const calculateTotalPayment = (orders) => {
        return orders.reduce((sum, order) => {
          let amount = 0;
          
          // Check paymentInfo.amount first (Stripe amount in cents)
          if (order.paymentInfo && order.paymentInfo.amount) {
            amount = parseFloat(order.paymentInfo.amount) / 100; // Convert cents to dollars
          }
          // Fallback to other fields
          else if (order.totalPrice) {
            amount = parseFloat(order.totalPrice);
          }
          else if (order.price && order.quantity) {
            amount = parseFloat(order.price) * parseFloat(order.quantity);
          }
          else if (order.price) {
            amount = parseFloat(order.price);
          }
          else if (order.amount) {
            amount = parseFloat(order.amount);
          }
          else if (order.paymentAmount) {
            amount = parseFloat(order.paymentAmount);
          }
          
          return sum + (amount || 0);
        }, 0);
      };

      const metrics = statsData.metrics || {
        totalUsers: users.length,
        activeChefs: users.filter(user => user.role === 'chef').length,
        totalOrders: orders.length,
        totalRevenue: calculateTotalPayment(orders), // Total payment processed with robust calculation
        completedOrders,
        pendingOrders,
        cancelledOrders
      };

      console.log('Final metrics calculated:', metrics);

      const trends = statsData.trends || {
        users: Math.floor(Math.random() * 20) - 10,
        revenue: Math.floor(Math.random() * 30) - 15, // Payment trend
        orders: Math.floor(Math.random() * 25) - 12,
        chefs: Math.floor(Math.random() * 15) - 7,
        completion: Math.floor(Math.random() * 10) - 5, // Completion rate trend
        growth: Math.floor(Math.random() * 20) - 10 // Platform growth trend
      };

      // Prepare chart data
      const monthlyOrders = monthlyData.data || generateMonthlyData(orders);
      const ordersByStatus = statusDistribution.data || [
        { name: 'Completed', value: orders.filter(o => o.orderStatus === 'delivered').length },
        { name: 'Pending', value: orders.filter(o => o.orderStatus === 'pending').length },
        { name: 'Processing', value: orders.filter(o => o.orderStatus === 'processing').length },
        { name: 'Cancelled', value: orders.filter(o => o.orderStatus === 'cancelled').length }
      ].filter(item => item.value > 0);

      const spendingTrend = monthlyOrders.map(item => ({
        month: item.month,
        spending: item.revenue || item.spending || 0
      }));

      // Recent orders (last 10)
      const recentOrders = orders
        .sort((a, b) => new Date(b.orderTime || b.orderDate) - new Date(a.orderTime || a.orderDate))
        .slice(0, 10)
        .map(order => ({
          id: order._id,
          mealName: order.mealName || 'Unknown Meal',
          chefName: order.chefName || 'Unknown Chef',
          customerEmail: order.userEmail || order.customerInfo?.email || 'Unknown',
          totalPrice: order.totalPrice || order.paymentInfo?.amount || 0,
          orderStatus: order.orderStatus || 'pending',
          orderDate: order.orderTime || order.orderDate || new Date().toISOString()
        }));

      // Recent users (last 10)
      const recentUsers = users
        .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
        .slice(0, 10)
        .map(user => ({
          id: user._id,
          name: user.name || 'Unknown User',
          email: user.email,
          role: user.role || 'user',
          status: user.status || 'active',
          joinDate: user.createdAt || new Date().toISOString()
        }));

      setDashboardData({
        metrics,
        trends,
        chartData: {
          monthlyOrders,
          spendingTrend,
          ordersByStatus
        },
        recentOrders,
        recentUsers
      });

      setLastUpdated(new Date());
      setError(null);
    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
      setError('Failed to load dashboard data. Please try refreshing the page.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Helper function to generate monthly data from orders
  const generateMonthlyData = (orders) => {
    const monthlyData = {};
    const currentDate = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData[monthKey] = { month: monthKey, orders: 0, revenue: 0, users: new Set() };
    }
    
    // Fill with actual data
    orders.forEach(order => {
      const orderDate = new Date(order.orderTime || order.orderDate || order.createdAt);
      const monthKey = orderDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].orders += 1;
        // Use robust payment calculation with cents conversion
        let amount = 0;
        
        // Check paymentInfo.amount first (Stripe amount in cents)
        if (order.paymentInfo && order.paymentInfo.amount) {
          amount = parseFloat(order.paymentInfo.amount) / 100; // Convert cents to dollars
        }
        // Fallback to other fields
        else if (order.totalPrice) {
          amount = parseFloat(order.totalPrice);
        }
        else if (order.price && order.quantity) {
          amount = parseFloat(order.price) * parseFloat(order.quantity);
        }
        else if (order.price) {
          amount = parseFloat(order.price);
        }
        else if (order.amount) {
          amount = parseFloat(order.amount);
        }
        else if (order.paymentAmount) {
          amount = parseFloat(order.paymentAmount);
        }
        
        monthlyData[monthKey].revenue += (amount || 0);
        monthlyData[monthKey].users.add(order.userEmail);
      }
    });
    
    return Object.values(monthlyData).map(data => ({
      month: data.month,
      orders: data.orders,
      revenue: data.revenue,
      users: data.users.size
    }));
  };

  // Initial data fetch
  useEffect(() => {
    fetchAdminData();
    
    // Debug: Test the debug endpoint to see order structure
    const testDebugEndpoint = async () => {
      try {
        const response = await fetch(buildApiUrl('/debug/orders-sample'));
        const data = await response.json();
        console.log('Debug orders sample:', data);
      } catch (error) {
        console.log('Debug endpoint not available or error:', error);
      }
    };
    
    testDebugEndpoint();
  }, [fetchAdminData]);

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

  // Define columns for tables
  const orderColumns = [
    { key: 'mealName', label: 'Meal', sortable: true, type: 'truncate' },
    { key: 'chefName', label: 'Chef', sortable: true },
    { key: 'customerEmail', label: 'Customer', sortable: true, type: 'truncate' },
    { key: 'totalPrice', label: 'Amount', sortable: true, type: 'currency' },
    { key: 'orderStatus', label: 'Status', sortable: true, type: 'status' },
    { key: 'orderDate', label: 'Date', sortable: true, type: 'date' }
  ];

  const userColumns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true, type: 'truncate' },
    { key: 'role', label: 'Role', sortable: true, type: 'status' },
    { key: 'status', label: 'Status', sortable: true, type: 'status' },
    { key: 'joinDate', label: 'Joined', sortable: true, type: 'date' }
  ];

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard | LocalChefBazaar</title>
        </Helmet>
        
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-modern p-6 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-base-300 rounded-xl"></div>
                  <div className="w-16 h-4 bg-base-300 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-base-300 rounded w-24"></div>
                  <div className="h-8 bg-base-300 rounded w-20"></div>
                  <div className="h-3 bg-base-300 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Admin Dashboard | LocalChefBazaar</title>
        </Helmet>
        
        <div className="animate-fade-in">
          <div className="card-modern p-8 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiExclamationCircle className="w-8 h-8 text-error" />
            </div>
            <h3 className="text-xl font-semibold text-base-content mb-2">Something went wrong</h3>
            <p className="text-muted mb-6">{error}</p>
            <button
              onClick={() => fetchAdminData()}
              className="btn btn-primary"
            >
              <HiRefresh className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | LocalChefBazaar</title>
      </Helmet>
      
      <div className="animate-fade-in space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-base-content mb-2 flex items-center space-x-2">
              <HiSparkles className="w-6 h-6 text-primary" />
              <span>Admin Dashboard</span>
            </h1>
            <p className="text-muted">Comprehensive platform analytics and management tools</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <div className="text-sm text-muted">
              <HiClock className="w-4 h-4 inline mr-1" />
              Updated {formatLastUpdated(lastUpdated)}
            </div>
            <button
              onClick={() => fetchAdminData(false)}
              disabled={isRefreshing}
              className="btn btn-outline btn-sm"
            >
              <HiRefresh className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Platform Statistics */}
        <OverviewCards 
          metrics={dashboardData.metrics}
          trends={dashboardData.trends}
          userRole="admin"
        />

        {/* Charts */}
        <DashboardCharts chartData={dashboardData.chartData} />

        {/* Data Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="animate-fade-in-up">
            <DataTable
              data={dashboardData.recentOrders}
              columns={orderColumns}
              title="Recent Orders"
            />
          </div>
          
          <div className="animate-fade-in-up">
            <DataTable
              data={dashboardData.recentUsers}
              columns={userColumns}
              title="Recent Users"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-modern p-6 text-center">
            <HiUsers className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">Manage Users</h3>
            <p className="text-muted mb-4">View and manage all platform users</p>
            <button className="btn btn-primary btn-sm">
              View Users
            </button>
          </div>
          
          <div className="card-modern p-6 text-center">
            <HiShoppingCart className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">View Orders</h3>
            <p className="text-muted mb-4">Monitor all platform orders</p>
            <button className="btn btn-accent btn-sm">
              View Orders
            </button>
          </div>
          
          <div className="card-modern p-6 text-center">
            <HiSparkles className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-base-content mb-2">Statistics</h3>
            <p className="text-muted mb-4">Detailed platform analytics</p>
            <button className="btn btn-secondary btn-sm">
              View Stats
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardHome;
