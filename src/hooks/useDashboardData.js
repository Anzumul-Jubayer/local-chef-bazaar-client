// Custom hook for dashboard data management
import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { useLoadingState } from './useLoadingState';
import { dashboardAPI, fallbackDashboardData, calculateTrend, formatChartData } from '../services/api';
import toast from 'react-hot-toast';

export const useDashboardData = (autoRefreshInterval = null) => {
  const { user } = useContext(AuthContext);
  const { startLoading, stopLoading } = useLoadingState();
  const [dashboardData, setDashboardData] = useState(fallbackDashboardData);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (showLoading = true) => {
    if (!user?.email) return;
    
    setError(null);
    if (showLoading) {
      startLoading('Loading dashboard data...');
    } else {
      setIsRefreshing(true);
    }
    
    try {
      // Fetch all dashboard data in parallel
      const [
        ,  // ordersData - not directly used, but kept for potential future use
        orderStats,
        favoritesData,
        monthlyData,
        spendingTrend,
        statusDistribution,
        recentOrders
      ] = await Promise.all([
        dashboardAPI.getUserOrders(user.email).catch(() => ({ orders: [] })),
        dashboardAPI.getUserOrderStats(user.email).catch(() => ({ 
          totalOrders: 0, 
          totalSpent: 0, 
          pendingOrders: 0,
          previousMonthOrders: 0,
          previousMonthSpent: 0
        })),
        dashboardAPI.getUserFavorites(user.email).catch(() => ({ favorites: [] })),
        dashboardAPI.getMonthlyOrderData(user.email).catch(() => []),
        dashboardAPI.getSpendingTrend(user.email).catch(() => []),
        dashboardAPI.getOrderStatusDistribution(user.email).catch(() => []),
        dashboardAPI.getRecentOrders(user.email, 5).catch(() => [])
      ]);

      // Calculate trends
      const orderTrend = calculateTrend(
        orderStats.totalOrders || 0, 
        orderStats.previousMonthOrders || 0
      );
      const spendingTrendValue = calculateTrend(
        orderStats.totalSpent || 0, 
        orderStats.previousMonthSpent || 0
      );
      const favoritesTrend = calculateTrend(
        favoritesData.favorites?.length || 0,
        favoritesData.previousMonthFavorites || 0
      );

      // Format chart data with proper data extraction
      const monthlyDataArray = monthlyData?.data || monthlyData || [];
      const spendingTrendArray = spendingTrend?.data || spendingTrend || [];
      const statusDistributionArray = statusDistribution?.data || statusDistribution || [];

      const formattedMonthlyData = formatChartData(monthlyDataArray, 'monthly');
      const formattedSpendingData = formatChartData(spendingTrendArray, 'monthly');
      const formattedStatusData = formatChartData(statusDistributionArray, 'status');

      setDashboardData({
        metrics: {
          totalOrders: orderStats.totalOrders || 0,
          totalSpent: orderStats.totalSpent || 0,
          pendingOrders: orderStats.pendingOrders || 0,
          favoritesMeals: favoritesData.favorites?.length || 0
        },
        trends: {
          orders: orderTrend,
          spending: spendingTrendValue,
          favorites: favoritesTrend
        },
        chartData: {
          monthlyOrders: formattedMonthlyData,
          spendingTrend: formattedSpendingData,
          ordersByStatus: formattedStatusData
        },
        recentOrders: recentOrders?.data || recentOrders || [].slice(0, 5) // Ensure max 5 orders
      });

      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try refreshing the page.');
      
      if (showLoading) {
        toast.error('Failed to load dashboard data');
      }
      
      // Use fallback data on error
      setDashboardData(fallbackDashboardData);
    } finally {
      if (showLoading) {
        stopLoading();
      } else {
        setIsRefreshing(false);
      }
    }
  }, [user?.email, startLoading, stopLoading]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefreshInterval || !user?.email) return;

    const interval = setInterval(() => {
      fetchDashboardData(false); // Silent refresh
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshInterval, user?.email, fetchDashboardData]);

  // Manual refresh function
  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Silent refresh function (no loading indicator)
  const silentRefresh = useCallback(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  return {
    dashboardData,
    error,
    lastUpdated,
    isRefreshing,
    refreshData,
    silentRefresh,
    setError
  };
};

export default useDashboardData;