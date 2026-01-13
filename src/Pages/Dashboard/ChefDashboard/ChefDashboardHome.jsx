import { useState, useEffect, useContext, useCallback } from "react";
import { Helmet } from "react-helmet";
import { AuthContext } from "../../../Context/AuthContext";
import OverviewCards from "../../../Components/Dashboard/OverviewCards";
import DashboardCharts from "../../../Components/Dashboard/DashboardCharts";
import DataTable from "../../../Components/Dashboard/DataTable";
import { dashboardAPI } from "../../../services/api";
import {
  HiRefresh,
  HiExclamationCircle,
} from "react-icons/hi";
import toast from "react-hot-toast";

/* ================= Helper ================= */
const generateMonthlyData = (orders) => {
  const data = {};
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    data[key] = { month: key, orders: 0, earnings: 0 };
  }

  orders.forEach((o) => {
    const d = new Date(o.orderTime || o.orderDate || o.createdAt);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    if (data[key]) {
      data[key].orders += 1;
      // Use robust payment calculation
      const amount = o.totalPrice || 
                    o.price || 
                    o.amount || 
                    o.paymentAmount || 
                    (o.paymentInfo && o.paymentInfo.amount) ||
                    (o.quantity && o.price ? o.quantity * o.price : 0) ||
                    0;
      data[key].earnings += parseFloat(amount || 0);
    }
  });

  return Object.values(data);
};

/* ================= Component ================= */
const ChefDashboardHome = () => {
  const { user } = useContext(AuthContext);

  const [dashboardData, setDashboardData] = useState({
    metrics: {
      totalOrders: 0,
      totalEarnings: 0,
      activeMeals: 0,
      pendingOrders: 0,
    },
    trends: {},
    chartData: {
      monthlyOrders: [],
      spendingTrend: [],
      ordersByStatus: [],
    },
    recentOrders: [],
    myMeals: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  /* ================= Fetch ================= */
  const fetchChefData = useCallback(async (showLoading = true) => {
    if (!user?.email) return;

    showLoading ? setLoading(true) : setIsRefreshing(true);
    setError(null);

    try {
      const [statsRes, monthlyRes, ordersRes, mealsRes] = await Promise.all([
        dashboardAPI.getChefStats(user.email).catch(() => null),
        dashboardAPI.getChefMonthlyData(user.email).catch(() => null),
        dashboardAPI.getAllOrders().catch(() => ({ data: [] })),
        dashboardAPI.getChefMeals(user.email).catch(() => ({ data: [] })),
      ]);

      const chefOrders = ordersRes.data.filter(
        (o) =>
          o.chefEmail === user.email ||
          o.chefName === user.displayName
      );

      const chefMeals = mealsRes.data.filter(
        (m) =>
          m.userEmail === user.email ||
          m.chefEmail === user.email
      );

      const monthlyOrders =
        monthlyRes?.data?.length > 0
          ? monthlyRes.data
          : generateMonthlyData(chefOrders);

      const ordersByStatus = [
        { name: "Completed", value: chefOrders.filter(o => o.orderStatus === "delivered").length },
        { name: "Pending", value: chefOrders.filter(o => o.orderStatus === "pending").length },
        { name: "Processing", value: chefOrders.filter(o => o.orderStatus === "processing").length },
        { name: "Cancelled", value: chefOrders.filter(o => o.orderStatus === "cancelled").length },
      ].filter(i => i.value > 0);

      setDashboardData({
        metrics: {
          totalOrders: chefOrders.length,
          totalEarnings: chefOrders.reduce((sum, order) => {
            // Use robust payment calculation
            const amount = order.totalPrice || 
                          order.price || 
                          order.amount || 
                          order.paymentAmount || 
                          (order.paymentInfo && order.paymentInfo.amount) ||
                          (order.quantity && order.price ? order.quantity * order.price : 0) ||
                          0;
            return sum + parseFloat(amount || 0);
          }, 0),
          activeMeals: chefMeals.length,
          pendingOrders: chefOrders.filter(o =>
            ["pending", "processing"].includes(o.orderStatus)
          ).length,
        },
        trends: statsRes?.trends || {},
        chartData: {
          monthlyOrders,
          spendingTrend: monthlyOrders.map(m => ({
            month: m.month,
            spending: m.earnings,
          })),
          ordersByStatus,
        },
        recentOrders: chefOrders.slice(0, 10),
        myMeals: chefMeals.slice(0, 10),
      });

      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
      toast.error("Dashboard load failed");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.email, user?.displayName]);

  useEffect(() => {
    fetchChefData();
  }, [fetchChefData]);

  /* ================= Utils ================= */
  const formatLastUpdated = (date) => {
    if (!date) return "Never";
    const diff = (new Date() - date) / 60000;
    if (diff < 1) return "Just now";
    if (diff < 60) return `${Math.floor(diff)}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  /* ================= Tables ================= */
  const orderColumns = [
    { key: "mealName", label: "Meal", sortable: true },
    { key: "totalPrice", label: "Amount", sortable: true, type: "currency" },
    { key: "orderStatus", label: "Status", sortable: true, type: "status" },
  ];

  const mealColumns = [
    { key: "foodName", label: "Meal", sortable: true },
    { key: "price", label: "Price", sortable: true, type: "currency" },
    { key: "rating", label: "Rating", sortable: true },
  ];

  /* ================= UI ================= */
  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (error)
    return (
      <div className="p-10 text-center">
        <HiExclamationCircle className="mx-auto text-error text-4xl mb-3" />
        <p>{error}</p>
        <button onClick={() => fetchChefData()} className="btn mt-4">
          Retry
        </button>
      </div>
    );

  return (
    <>
      <Helmet>
        <title>Chef Dashboard | LocalChefBazaar</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Welcome, Chef {user?.displayName || "Chef"} 👋
          </h1>
          <button onClick={() => fetchChefData(false)} className="btn">
            <HiRefresh className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>

        <p className="text-sm text-muted">
          Updated {formatLastUpdated(lastUpdated)}
        </p>

        <OverviewCards
          metrics={dashboardData.metrics}
          trends={dashboardData.trends}
          userRole="chef"
        />

        <DashboardCharts chartData={dashboardData.chartData} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DataTable
            title="Recent Orders"
            data={dashboardData.recentOrders}
            columns={orderColumns}
          />
          <DataTable
            title="My Meals"
            data={dashboardData.myMeals}
            columns={mealColumns}
          />
        </div>
      </div>
    </>
  );
};

export default ChefDashboardHome;
