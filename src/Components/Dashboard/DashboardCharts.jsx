import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

// Custom tooltip component - defined outside render to avoid recreation
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-base-content mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardCharts = ({ chartData }) => {
  // Color schemes for different chart types
  const colors = {
    primary: '#D4AF37',
    secondary: '#7D2E2E',
    accent: '#2E7D32',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  };

  const pieColors = [colors.primary, colors.secondary, colors.accent, colors.success, colors.warning, colors.error];

  // Format currency for tooltips
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      
      {/* Monthly Orders/Revenue Chart */}
      <motion.div
        custom={0}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        className="card-modern p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-base-content">Monthly Trends</h3>
            <p className="text-sm text-muted">Orders and spending over time</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData.monthlyOrders || []}>
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.accent} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors.accent} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="month" 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={CustomTooltip} />
            <Legend />
            <Area
              type="monotone"
              dataKey="orders"
              stroke={colors.primary}
              fillOpacity={1}
              fill="url(#colorOrders)"
              strokeWidth={2}
              name="Orders"
            />
            <Area
              type="monotone"
              dataKey="spending"
              stroke={colors.accent}
              fillOpacity={1}
              fill="url(#colorSpending)"
              strokeWidth={2}
              name="Spending (৳)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Order Status Distribution */}
      <motion.div
        custom={1}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        className="card-modern p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-base-content">Order Status</h3>
            <p className="text-sm text-muted">Distribution by status</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.ordersByStatus || []}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {(chartData.ordersByStatus || []).map((_, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Spending Trend Line Chart */}
      <motion.div
        custom={2}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        className="card-modern p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-base-content">Spending Trend</h3>
            <p className="text-sm text-muted">Monthly spending pattern</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.spendingTrend || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="month" 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip 
              content={CustomTooltip}
              formatter={(value) => [formatCurrency(value), 'Spending']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="spending"
              stroke={colors.secondary}
              strokeWidth={3}
              dot={{ fill: colors.secondary, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors.secondary, strokeWidth: 2 }}
              name="Monthly Spending (৳)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Performance Bar Chart */}
      <motion.div
        custom={3}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        className="card-modern p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-base-content">Performance Overview</h3>
            <p className="text-sm text-muted">Key metrics comparison</p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.monthlyOrders?.slice(-6) || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis 
              dataKey="month" 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="currentColor" 
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={CustomTooltip} />
            <Legend />
            <Bar 
              dataKey="orders" 
              fill={colors.primary} 
              radius={[4, 4, 0, 0]}
              name="Orders"
            />
            <Bar 
              dataKey="spending" 
              fill={colors.accent} 
              radius={[4, 4, 0, 0]}
              name="Spending (৳)"
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;
