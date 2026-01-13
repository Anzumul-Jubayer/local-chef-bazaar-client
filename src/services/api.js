// API Service for LocalChefBazaar
import { API_BASE_URL } from '../config/api';

// Generic API call function with error handling
const apiCall = async (endpoint, options = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// Dashboard API functions
export const dashboardAPI = {
  // User Dashboard APIs
  getUserOrders: async (userEmail) => {
    return await apiCall(`/orders/user/${userEmail}`);
  },

  getUserOrderStats: async (userEmail) => {
    return await apiCall(`/orders/user/${userEmail}/stats`);
  },

  getUserFavorites: async (userEmail) => {
    return await apiCall(`/favorites/user/${userEmail}`);
  },

  getUserReviews: async (userEmail) => {
    return await apiCall(`/reviews/user/${userEmail}`);
  },

  getMonthlyOrderData: async (userEmail) => {
    return await apiCall(`/orders/user/${userEmail}/monthly`);
  },

  getSpendingTrend: async (userEmail) => {
    return await apiCall(`/orders/user/${userEmail}/spending-trend`);
  },

  getOrderStatusDistribution: async (userEmail) => {
    return await apiCall(`/orders/user/${userEmail}/status-distribution`);
  },

  getRecentOrders: async (userEmail, limit = 5) => {
    return await apiCall(`/orders/user/${userEmail}/recent?limit=${limit}`);
  },

  // Admin Dashboard APIs
  getAdminStats: async () => {
    return await apiCall('/admin/stats');
  },

  getAdminMonthlyData: async () => {
    return await apiCall('/admin/monthly-data');
  },

  getAdminOrderStatusDistribution: async () => {
    return await apiCall('/admin/order-status-distribution');
  },

  getAllUsers: async () => {
    return await apiCall('/users');
  },

  getAllOrders: async () => {
    return await apiCall('/orders');
  },

  // Chef Dashboard APIs
  getChefStats: async (chefEmail) => {
    return await apiCall(`/chef/${chefEmail}/stats`);
  },

  getChefMonthlyData: async (chefEmail) => {
    return await apiCall(`/chef/${chefEmail}/monthly-data`);
  },

  getChefOrders: async (chefId) => {
    return await apiCall(`/orders-by-chef/${chefId}`);
  },

  getChefMeals: async (chefEmail) => {
    return await apiCall(`/meals-by-chef/${chefEmail}`);
  },
};

// Profile API functions
export const profileAPI = {
  // Profile update using main server (port 3000)
  updateProfile: async (email, profileData) => {
    const encodedEmail = encodeURIComponent(email);
    
    const response = await fetch(`${API_BASE_URL}/profile-update/${encodedEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Profile update failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  },

  // Get user profile - try main server first, fallback to profile server
  getProfile: async (email) => {
    const encodedEmail = encodeURIComponent(email);
    
    try {
      // Try main server first (more reliable)
      return await apiCall(`/users/${encodedEmail}`);
    } catch (mainServerError) {
      console.warn('Main server failed, trying profile server:', mainServerError.message);
      
      try {
        // Fallback to profile server
        const response = await fetch(`http://localhost:3001/users/${encodedEmail}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Profile server failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      } catch (profileServerError) {
        console.error('Both servers failed:', { mainServerError, profileServerError });
        throw new Error(`Failed to get profile: ${profileServerError.message}`);
      }
    }
  },
};

// Fallback data structure for when API calls fail
export const fallbackDashboardData = {
  metrics: {
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    favoritesMeals: 0,
    // Admin metrics
    totalUsers: 0,
    totalRevenue: 0,
    activeChefs: 0,
    totalMeals: 0,
    // Chef metrics
    totalEarnings: 0,
    activeMeals: 0
  },
  trends: {
    orders: 0,
    spending: 0,
    favorites: 0,
    // Admin trends
    users: 0,
    revenue: 0,
    chefs: 0,
    meals: 0,
    // Chef trends
    earnings: 0,
    pending: 0
  },
  chartData: {
    monthlyOrders: [],
    spendingTrend: [],
    ordersByStatus: [],
    // Admin chart data
    monthlyRevenue: [],
    userGrowth: [],
    // Chef chart data
    monthlyEarnings: []
  },
  recentOrders: [],
  recentUsers: [],
  myMeals: []
};

// Helper function to calculate trends
export const calculateTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Helper function to format chart data
export const formatChartData = (data, type) => {
  // Ensure data is an array
  if (!Array.isArray(data)) {
    console.warn('formatChartData received non-array data:', data);
    return [];
  }

  switch (type) {
    case 'monthly':
      return data.map(item => ({
        month: item.month || item._id,
        orders: item.orders || item.count || 0,
        spending: item.spending || item.total || 0
      }));
    
    case 'status':
      return data.map(item => ({
        name: item.status || item._id,
        value: item.count || item.value || 0,
        color: getStatusColor(item.status || item._id)
      }));
    
    default:
      return Array.isArray(data) ? data : [];
  }
};

// Helper function to get status colors
const getStatusColor = (status) => {
  const colors = {
    completed: '#10b981',
    pending: '#f59e0b',
    processing: '#3b82f6',
    cancelled: '#ef4444',
    delivered: '#10b981',
    confirmed: '#3b82f6'
  };
  return colors[status?.toLowerCase()] || '#6b7280';
};

export default dashboardAPI;