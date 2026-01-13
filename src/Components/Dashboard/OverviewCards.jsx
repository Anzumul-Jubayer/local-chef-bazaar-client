import { motion } from 'framer-motion';
import { 
  HiShoppingCart, 
  HiCurrencyDollar, 
  HiClock, 
  HiHeart,
  HiTrendingUp,
  HiTrendingDown,
  HiMinus,
  HiUsers,
  HiCreditCard,
  HiChartBar,
  HiGlobe,
  HiStar,
  HiCheckCircle
} from 'react-icons/hi';

const OverviewCards = ({ metrics, trends, userRole = 'user' }) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return HiTrendingUp;
    if (trend < 0) return HiTrendingDown;
    return HiMinus;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTrend = (trend) => {
    const absValue = Math.abs(trend);
    return `${trend > 0 ? '+' : trend < 0 ? '-' : ''}${absValue.toFixed(1)}%`;
  };

  // Define cards based on user role
  const getCardsConfig = () => {
    switch (userRole) {
      case 'admin':
        return [
          {
            title: 'Total Payment',
            value: formatCurrency(metrics.totalRevenue || 0),
            trend: trends.revenue || 0,
            icon: HiCreditCard,
            color: 'success',
            description: 'Payment processed',
            category: 'financial'
          },
          {
            title: 'Total Users',
            value: (metrics.totalUsers || 0).toLocaleString(),
            trend: trends.users || 0,
            icon: HiUsers,
            color: 'primary',
            description: 'Registered users',
            category: 'users'
          },
          {
            title: 'Total Orders',
            value: (metrics.totalOrders || 0).toLocaleString(),
            trend: trends.orders || 0,
            icon: HiShoppingCart,
            color: 'accent',
            description: 'Platform orders',
            category: 'orders'
          },
          {
            title: 'Active Chefs',
            value: (metrics.activeChefs || 0).toLocaleString(),
            trend: trends.chefs || 0,
            icon: HiStar,
            color: 'warning',
            description: 'Verified chefs',
            category: 'chefs'
          },
          {
            title: 'Completion Rate',
            value: `${Math.round(((metrics.completedOrders || 0) / Math.max(metrics.totalOrders || 1, 1)) * 100)}%`,
            trend: trends.completion || 0,
            icon: HiCheckCircle,
            color: 'info',
            description: 'Order success rate',
            category: 'performance'
          },
          {
            title: 'Platform Growth',
            value: `${Math.abs(trends.growth || 0).toFixed(1)}%`,
            trend: trends.growth || 0,
            icon: HiChartBar,
            color: 'secondary',
            description: 'Monthly growth',
            category: 'analytics'
          }
        ];
      
      case 'chef':
        return [
          {
            title: 'My Orders',
            value: metrics.totalOrders || 0,
            trend: trends.orders || 0,
            icon: HiShoppingCart,
            color: 'primary',
            description: 'Orders received'
          },
          {
            title: 'Total Earnings',
            value: formatCurrency(metrics.totalEarnings || 0),
            trend: trends.earnings || 0,
            icon: HiCurrencyDollar,
            color: 'success',
            description: 'Your earnings'
          },
          {
            title: 'Active Meals',
            value: metrics.activeMeals || 0,
            trend: trends.meals || 0,
            icon: HiHeart,
            color: 'accent',
            description: 'Published meals'
          },
          {
            title: 'Pending Orders',
            value: metrics.pendingOrders || 0,
            trend: trends.pending || 0,
            icon: HiClock,
            color: 'warning',
            description: 'Awaiting action'
          }
        ];
      
      default: // user
        return [
          {
            title: 'Total Orders',
            value: metrics.totalOrders || 0,
            trend: trends.orders || 0,
            icon: HiShoppingCart,
            color: 'primary',
            description: 'Orders placed'
          },
          {
            title: 'Total Spent',
            value: formatCurrency(metrics.totalSpent || 0),
            trend: trends.spending || 0,
            icon: HiCurrencyDollar,
            color: 'success',
            description: 'Amount spent'
          },
          {
            title: 'Pending Orders',
            value: metrics.pendingOrders || 0,
            trend: trends.pending || 0,
            icon: HiClock,
            color: 'warning',
            description: 'In progress'
          },
          {
            title: 'Favorite Meals',
            value: metrics.favoritesMeals || 0,
            trend: trends.favorites || 0,
            icon: HiHeart,
            color: 'accent',
            description: 'Saved favorites'
          }
        ];
    }
  };

  const cards = getCardsConfig();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="space-y-6">
      {/* Platform Statistics Header */}
      {userRole === 'admin' && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-base-content mb-2 flex items-center justify-center space-x-2">
            <HiGlobe className="w-6 h-6 text-primary" />
            <span>Platform Statistics</span>
          </h2>
          <p className="text-muted">Comprehensive overview of platform performance and metrics</p>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className={`grid gap-6 mb-8 ${
        userRole === 'admin' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {cards.map((card, index) => {
          const TrendIcon = getTrendIcon(card.trend);
          const trendColor = getTrendColor(card.trend);
          
          return (
            <motion.div
              key={card.title}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className={`card-modern p-6 hover:shadow-lg transition-all duration-300 group relative overflow-hidden ${
                userRole === 'admin' ? 'min-h-[160px]' : ''
              }`}
            >
              {/* Background Pattern for Admin Cards */}
              {userRole === 'admin' && (
                <div className="absolute inset-0 opacity-5">
                  <div className={`w-full h-full bg-gradient-to-br from-${card.color}/20 to-transparent`}></div>
                </div>
              )}

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${card.color}/10 group-hover:bg-${card.color}/20 transition-colors shadow-sm`}>
                    <card.icon className={`w-6 h-6 text-${card.color}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm ${trendColor} bg-surface-elevated px-2 py-1 rounded-full`}>
                    <TrendIcon className="w-3 h-3" />
                    <span className="font-medium text-xs">{formatTrend(card.trend)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted uppercase tracking-wide">{card.title}</h3>
                  <p className={`font-bold text-base-content ${
                    userRole === 'admin' ? 'text-xl' : 'text-2xl'
                  }`}>{card.value}</p>
                  <p className="text-xs text-muted">{card.description}</p>
                </div>
                
                {/* Enhanced Progress indicator for Admin */}
                <div className="mt-4 h-1 bg-surface-elevated rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-${card.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${Math.min(Math.abs(card.trend) * 2, 100)}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  />
                </div>

                {/* Category Badge for Admin */}
                {userRole === 'admin' && card.category && (
                  <div className="absolute top-2 right-2 opacity-60">
                    <div className={`w-2 h-2 rounded-full bg-${card.color}`}></div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OverviewCards;
