import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../../Context/AuthContext';
import { useDashboardData } from '../../../hooks/useDashboardData';
import OverviewCards from '../../../Components/Dashboard/OverviewCards';
import DashboardCharts from '../../../Components/Dashboard/DashboardCharts';
import DataTable from '../../../Components/Dashboard/DataTable';
import { 
  HiRefresh, 
  HiClock, 
  HiExclamationCircle,
  HiSparkles
} from 'react-icons/hi';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const { 
    dashboardData, 
    error, 
    lastUpdated, 
    isRefreshing, 
    refreshData 
  } = useDashboardData(300000); // Auto-refresh every 5 minutes

  // Define columns for recent orders table
  const orderColumns = [
    { 
      key: 'mealName', 
      label: 'Meal', 
      sortable: true,
      type: 'truncate'
    },
    { 
      key: 'chefName', 
      label: 'Chef', 
      sortable: true 
    },
    { 
      key: 'totalPrice', 
      label: 'Amount', 
      sortable: true,
      type: 'currency'
    },
    { 
      key: 'orderStatus', 
      label: 'Status', 
      sortable: true,
      type: 'status'
    },
    { 
      key: 'orderDate', 
      label: 'Date', 
      sortable: true,
      type: 'date'
    }
  ];

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

  if (error) {
    return (
      <>
        <Helmet>
          <title>Dashboard | LocalChefBazaar</title>
        </Helmet>
        
        <div className="animate-fade-in">
          <div className="card-modern p-8 text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiExclamationCircle className="w-8 h-8 text-error" />
            </div>
            <h3 className="text-lg font-semibold text-base-content mb-2">Unable to Load Dashboard</h3>
            <p className="text-muted mb-6">{error}</p>
            <button
              onClick={refreshData}
              className="btn-primary-modern inline-flex items-center space-x-2"
            >
              <HiRefresh className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard | LocalChefBazaar</title>
      </Helmet>

      <div className="animate-fade-in-up space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-display font-bold text-base-content">
              Welcome back, {user?.displayName?.split(' ')[0] || 'User'}!
            </h1>
            <p className="text-muted mt-1">Here's what's happening with your orders and activity</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2 text-sm text-muted">
              <HiClock className="w-4 h-4" />
              <span>Updated {formatLastUpdated(lastUpdated)}</span>
            </div>
            
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="btn-ghost-modern inline-flex items-center space-x-2"
            >
              <HiRefresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <OverviewCards 
          metrics={dashboardData.metrics}
          trends={dashboardData.trends}
          userRole="user"
        />

        {/* Charts Section */}
        <div className="animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <HiSparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-base-content">Analytics Overview</h2>
              <p className="text-sm text-muted">Your ordering patterns and spending insights</p>
            </div>
          </div>
          
          <DashboardCharts 
            chartData={dashboardData.chartData}
          />
        </div>

        {/* Recent Orders Table */}
        <div className="animate-fade-in-up">
          <DataTable
            data={dashboardData.recentOrders || []}
            columns={orderColumns}
            title="Recent Orders"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          <div className="card-modern p-6 text-center hover:shadow-lg transition-all duration-300 group">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <HiSparkles className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-base-content mb-2">Browse Meals</h3>
            <p className="text-sm text-muted mb-4">Discover new delicious meals from local chefs</p>
            <button className="btn-primary-modern w-full">
              Explore Meals
            </button>
          </div>

          <div className="card-modern p-6 text-center hover:shadow-lg transition-all duration-300 group">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
              <HiClock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-base-content mb-2">Track Orders</h3>
            <p className="text-sm text-muted mb-4">Monitor your current and past orders</p>
            <button className="btn-accent-modern w-full">
              View Orders
            </button>
          </div>

          <div className="card-modern p-6 text-center hover:shadow-lg transition-all duration-300 group">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/20 transition-colors">
              <HiExclamationCircle className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-base-content mb-2">Get Support</h3>
            <p className="text-sm text-muted mb-4">Need help? Contact our support team</p>
            <button className="btn-secondary-modern w-full">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
