import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import OverviewCards from './OverviewCards';
import DashboardCharts from './DashboardCharts';
import DataTable from './DataTable';
import { 
  HiRefresh, 
  HiDownload, 
  HiFilter,
  HiSparkles,
  HiTrendingUp
} from 'react-icons/hi';

const DashboardDemo = ({ userRole = 'user' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sample data for demonstration
  const sampleData = {
    user: {
      metrics: {
        totalOrders: 24,
        totalSpent: 12500,
        pendingOrders: 3,
        favoritesMeals: 8
      },
      trends: {
        orders: 15.2,
        spending: -5.8,
        pending: 25.0,
        favorites: 12.5
      },
      chartData: {
        monthlyOrders: [
          { month: 'Jan 2024', orders: 5, spending: 2500 },
          { month: 'Feb 2024', orders: 8, spending: 4200 },
          { month: 'Mar 2024', orders: 6, spending: 3100 },
          { month: 'Apr 2024', orders: 12, spending: 6800 },
          { month: 'May 2024', orders: 9, spending: 4900 },
          { month: 'Jun 2024', orders: 15, spending: 7200 }
        ],
        spendingTrend: [
          { month: 'Jan', spending: 2500 },
          { month: 'Feb', spending: 4200 },
          { month: 'Mar', spending: 3100 },
          { month: 'Apr', spending: 6800 },
          { month: 'May', spending: 4900 },
          { month: 'Jun', spending: 7200 }
        ],
        ordersByStatus: [
          { name: 'Completed', value: 18 },
          { name: 'Pending', value: 3 },
          { name: 'Processing', value: 2 },
          { name: 'Cancelled', value: 1 }
        ]
      },
      recentOrders: [
        {
          id: '1',
          mealName: 'Chicken Biryani',
          chefName: 'Chef Sarah',
          totalPrice: 450,
          orderStatus: 'delivered',
          orderDate: '2024-01-10T10:30:00Z'
        },
        {
          id: '2',
          mealName: 'Beef Curry',
          chefName: 'Chef Ahmed',
          totalPrice: 380,
          orderStatus: 'processing',
          orderDate: '2024-01-09T15:45:00Z'
        },
        {
          id: '3',
          mealName: 'Fish Fry',
          chefName: 'Chef Fatema',
          totalPrice: 320,
          orderStatus: 'pending',
          orderDate: '2024-01-08T12:20:00Z'
        }
      ]
    },
    chef: {
      metrics: {
        totalOrders: 156,
        totalEarnings: 78500,
        activeMeals: 12,
        pendingOrders: 8
      },
      trends: {
        orders: 22.5,
        earnings: 18.7,
        meals: 8.3,
        pending: -12.4
      },
      chartData: {
        monthlyOrders: [
          { month: 'Jan 2024', orders: 25, earnings: 12500 },
          { month: 'Feb 2024', orders: 32, earnings: 16800 },
          { month: 'Mar 2024', orders: 28, earnings: 14200 },
          { month: 'Apr 2024', orders: 35, earnings: 18900 },
          { month: 'May 2024', orders: 41, earnings: 22100 },
          { month: 'Jun 2024', orders: 38, earnings: 19800 }
        ],
        spendingTrend: [
          { month: 'Jan', spending: 12500 },
          { month: 'Feb', spending: 16800 },
          { month: 'Mar', spending: 14200 },
          { month: 'Apr', spending: 18900 },
          { month: 'May', spending: 22100 },
          { month: 'Jun', spending: 19800 }
        ],
        ordersByStatus: [
          { name: 'Completed', value: 142 },
          { name: 'Pending', value: 8 },
          { name: 'Processing', value: 4 },
          { name: 'Cancelled', value: 2 }
        ]
      },
      recentOrders: [
        {
          id: '1',
          mealName: 'Special Biryani',
          customerName: 'John Doe',
          totalPrice: 550,
          orderStatus: 'delivered',
          orderDate: '2024-01-10T14:30:00Z'
        },
        {
          id: '2',
          mealName: 'Mutton Curry',
          customerName: 'Jane Smith',
          totalPrice: 480,
          orderStatus: 'processing',
          orderDate: '2024-01-10T11:15:00Z'
        }
      ]
    },
    admin: {
      metrics: {
        totalUsers: 1250,
        totalRevenue: 485000,
        totalOrders: 3420,
        activeChefs: 85
      },
      trends: {
        users: 12.8,
        revenue: 25.4,
        orders: 18.9,
        chefs: 15.2
      },
      chartData: {
        monthlyOrders: [
          { month: 'Jan 2024', orders: 450, revenue: 225000, users: 180 },
          { month: 'Feb 2024', orders: 520, revenue: 268000, users: 210 },
          { month: 'Mar 2024', orders: 480, revenue: 245000, users: 195 },
          { month: 'Apr 2024', orders: 650, revenue: 335000, users: 250 },
          { month: 'May 2024', orders: 720, revenue: 385000, users: 280 },
          { month: 'Jun 2024', orders: 680, revenue: 365000, users: 265 }
        ],
        spendingTrend: [
          { month: 'Jan', spending: 225000 },
          { month: 'Feb', spending: 268000 },
          { month: 'Mar', spending: 245000 },
          { month: 'Apr', spending: 335000 },
          { month: 'May', spending: 385000 },
          { month: 'Jun', spending: 365000 }
        ],
        ordersByStatus: [
          { name: 'Completed', value: 2890 },
          { name: 'Pending', value: 320 },
          { name: 'Processing', value: 150 },
          { name: 'Cancelled', value: 60 }
        ]
      },
      recentOrders: [
        {
          id: '1',
          mealName: 'Chicken Biryani',
          chefName: 'Chef Sarah',
          customerEmail: 'john@example.com',
          totalPrice: 450,
          orderStatus: 'delivered',
          orderDate: '2024-01-10T10:30:00Z'
        },
        {
          id: '2',
          mealName: 'Beef Curry',
          chefName: 'Chef Ahmed',
          customerEmail: 'jane@example.com',
          totalPrice: 380,
          orderStatus: 'processing',
          orderDate: '2024-01-09T15:45:00Z'
        }
      ]
    }
  };

  const currentData = sampleData[userRole] || sampleData.user;

  // Table columns based on user role
  const getTableColumns = () => {
    switch (userRole) {
      case 'admin':
        return [
          { key: 'mealName', label: 'Meal', sortable: true, type: 'truncate' },
          { key: 'chefName', label: 'Chef', sortable: true },
          { key: 'customerEmail', label: 'Customer', sortable: true },
          { key: 'totalPrice', label: 'Amount', sortable: true, type: 'currency' },
          { key: 'orderStatus', label: 'Status', sortable: true, type: 'status' },
          { key: 'orderDate', label: 'Date', sortable: true, type: 'date' }
        ];
      case 'chef':
        return [
          { key: 'mealName', label: 'Meal', sortable: true, type: 'truncate' },
          { key: 'customerName', label: 'Customer', sortable: true },
          { key: 'totalPrice', label: 'Amount', sortable: true, type: 'currency' },
          { key: 'orderStatus', label: 'Status', sortable: true, type: 'status' },
          { key: 'orderDate', label: 'Date', sortable: true, type: 'date' }
        ];
      default:
        return [
          { key: 'mealName', label: 'Meal', sortable: true, type: 'truncate' },
          { key: 'chefName', label: 'Chef', sortable: true },
          { key: 'totalPrice', label: 'Amount', sortable: true, type: 'currency' },
          { key: 'orderStatus', label: 'Status', sortable: true, type: 'status' },
          { key: 'orderDate', label: 'Date', sortable: true, type: 'date' }
        ];
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HiSparkles },
    { id: 'analytics', label: 'Analytics', icon: HiTrendingUp },
    { id: 'data', label: 'Data Table', icon: HiFilter }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
            </h1>
            <p className="text-muted">
              {userRole === 'admin' 
                ? 'Platform overview and management tools'
                : userRole === 'chef'
                ? 'Your business analytics and order management'
                : 'Your order history and favorite meals'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              <HiRefresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-hover transition-colors">
              <HiDownload className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-1 mb-8 bg-surface p-1 rounded-lg"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-base-content hover:bg-hover'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <OverviewCards 
                metrics={currentData.metrics}
                trends={currentData.trends}
                userRole={userRole}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card-modern p-6">
                  <h3 className="text-lg font-semibold text-base-content mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted">This Month</span>
                      <span className="font-semibold text-success">+25.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Last 7 Days</span>
                      <span className="font-semibold text-primary">+12.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted">Yesterday</span>
                      <span className="font-semibold text-accent">+5.2%</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-modern p-6">
                  <h3 className="text-lg font-semibold text-base-content mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {currentData.recentOrders.slice(0, 3).map((order, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-hover">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-base-content">{order.mealName}</p>
                          <p className="text-xs text-muted">
                            {userRole === 'chef' ? order.customerName : order.chefName}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-success">
                          ৳{order.totalPrice}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <DashboardCharts chartData={currentData.chartData} />
          )}

          {activeTab === 'data' && (
            <DataTable
              data={currentData.recentOrders}
              columns={getTableColumns()}
              title={`Recent ${userRole === 'chef' ? 'Orders' : 'Orders'}`}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardDemo;
