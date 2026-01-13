# Dynamic Dashboard System

## Overview

The LocalChefBazaar platform now features a comprehensive dynamic dashboard system with real-time data, interactive charts, and role-based analytics. The dashboard provides different views and metrics based on user roles (User, Chef, Admin).

## Features

### 🎯 Core Components

#### 1. Overview Cards (`OverviewCards.jsx`)
- **Dynamic Metrics**: Real-time key performance indicators
- **Trend Analysis**: Percentage change indicators with visual cues
- **Role-Based Content**: Different metrics for User, Chef, and Admin roles
- **Interactive Design**: Hover effects and progress indicators
- **Responsive Layout**: Adapts to different screen sizes

**User Metrics:**
- Total Orders
- Total Spent
- Pending Orders
- Favorite Meals

**Chef Metrics:**
- My Orders
- Total Earnings
- Active Meals
- Pending Orders

**Admin Metrics:**
- Total Users
- Total Revenue
- Total Orders
- Active Chefs

#### 2. Dashboard Charts (`DashboardCharts.jsx`)
- **Multiple Chart Types**: Area, Line, Pie, and Bar charts using Recharts
- **Interactive Tooltips**: Custom-styled tooltips with theme support
- **Responsive Design**: Charts adapt to container size
- **Real Data Integration**: Connected to live API endpoints
- **Theme Compatibility**: Works with Light/Dark mode

**Chart Types:**
- Monthly Trends (Area Chart)
- Order Status Distribution (Pie Chart)
- Spending Trend (Line Chart)
- Performance Overview (Bar Chart)

#### 3. Data Tables (`DataTable.jsx`)
- **Advanced Sorting**: Multi-column sorting with visual indicators
- **Search Functionality**: Real-time filtering across all columns
- **Pagination**: Configurable items per page with navigation
- **Custom Cell Types**: Currency, Date, Status, Image, and Truncated text
- **Responsive Design**: Horizontal scrolling on mobile devices

**Features:**
- Status badges with icons
- Currency formatting (BDT)
- Date formatting
- Image thumbnails
- Truncated text with tooltips

### 🏠 Dashboard Pages

#### 1. User Dashboard (`DashboardHome.jsx`)
- **Personal Analytics**: Order history, spending patterns, favorites
- **Quick Actions**: Browse meals, track orders, get support
- **Recent Activity**: Latest orders with status tracking
- **Auto-refresh**: Updates every 5 minutes
- **Error Handling**: Graceful fallbacks and retry mechanisms

#### 2. Chef Dashboard (`ChefDashboardHome.jsx`)
- **Business Analytics**: Earnings, order volume, meal performance
- **Order Management**: Recent orders with customer details
- **Meal Overview**: Active meals with ratings and status
- **Quick Actions**: Create meals, manage orders, edit profile
- **Performance Insights**: Monthly trends and status distribution

#### 3. Admin Dashboard (`AdminDashboardHome.jsx`)
- **Platform Analytics**: User growth, revenue, order statistics
- **User Management**: Recent users with role and status
- **Order Monitoring**: Platform-wide order tracking
- **Quick Actions**: Manage users, review requests, view statistics
- **Comprehensive Metrics**: Total users, revenue, orders, active chefs

### 🔧 Technical Implementation

#### Data Fetching Strategy
```javascript
// Parallel API calls for optimal performance
const [ordersRes, mealsRes, usersRes] = await Promise.all([
  fetch('/api/orders'),
  fetch('/api/meals'),
  fetch('/api/users')
]);
```

#### Error Handling
- **Graceful Degradation**: Fallback data when API calls fail
- **User Feedback**: Toast notifications for errors
- **Retry Mechanisms**: Manual refresh buttons
- **Loading States**: Skeleton loaders during data fetching

#### Performance Optimizations
- **Memoized Calculations**: Expensive operations cached
- **Lazy Loading**: Components loaded on demand
- **Efficient Re-renders**: Optimized state updates
- **Auto-refresh**: Configurable intervals with silent updates

### 🎨 Design System

#### Color Scheme
- **Primary**: Gold (#D4AF37/#F4D03F)
- **Secondary**: Red (#7D2E2E/#E74C3C)
- **Accent**: Green (#2E7D32/#58D68D)
- **Status Colors**: Success, Warning, Error, Info

#### Animations
- **Fade In Up**: Staggered component entrance
- **Hover Effects**: Subtle transforms and shadows
- **Loading States**: Pulse animations for skeletons
- **Chart Animations**: Smooth data transitions

#### Responsive Breakpoints
- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (4 columns)

### 📊 Data Integration

#### API Endpoints
- `GET /orders` - All platform orders
- `GET /orders/user/:email` - User-specific orders
- `GET /orders/user/:email/stats` - Order statistics
- `GET /meals` - All meals
- `GET /users` - All users
- `GET /favorites/user/:email` - User favorites

#### Data Processing
- **Trend Calculations**: Percentage change from previous period
- **Chart Data Formatting**: Transform API data for Recharts
- **Status Aggregation**: Group orders by status
- **Monthly Grouping**: Organize data by time periods

### 🔒 Security & Privacy

#### Role-Based Access
- **Data Filtering**: Users only see their own data
- **Chef Isolation**: Chefs see only their meals and orders
- **Admin Overview**: Full platform visibility with aggregated data
- **Authentication**: All endpoints require valid user session

#### Data Protection
- **Email Masking**: Sensitive information truncated in tables
- **Secure API Calls**: Authentication headers included
- **Error Sanitization**: No sensitive data in error messages

### 🚀 Usage Examples

#### Adding New Metrics
```javascript
// In OverviewCards.jsx
const newMetric = {
  title: 'New Metric',
  value: data.newValue,
  trend: calculateTrend(current, previous),
  icon: HiIcon,
  color: 'primary',
  description: 'Metric description'
};
```

#### Custom Chart Integration
```javascript
// In DashboardCharts.jsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData.customData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip content={<CustomTooltip />} />
    <Bar dataKey="value" fill={colors.primary} />
  </BarChart>
</ResponsiveContainer>
```

#### Table Column Configuration
```javascript
// In DataTable.jsx
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, type: 'currency' },
  { key: 'status', label: 'Status', sortable: true, type: 'status' },
  { key: 'date', label: 'Date', sortable: true, type: 'date' }
];
```

### 🔄 Auto-Refresh System

#### Configuration
- **User Dashboard**: 5-minute intervals
- **Chef Dashboard**: 3-minute intervals
- **Admin Dashboard**: Manual refresh only
- **Silent Updates**: No loading indicators for background refreshes

#### Implementation
```javascript
const { dashboardData, refreshData, silentRefresh } = useDashboardData(300000);

// Auto-refresh every 5 minutes
useEffect(() => {
  const interval = setInterval(silentRefresh, 300000);
  return () => clearInterval(interval);
}, []);
```

### 📱 Mobile Optimization

#### Responsive Design
- **Stacked Layout**: Cards stack vertically on mobile
- **Horizontal Scrolling**: Tables scroll horizontally
- **Touch-Friendly**: Larger touch targets
- **Simplified Navigation**: Collapsible sidebars

#### Performance
- **Reduced Data**: Fewer items per page on mobile
- **Optimized Images**: Smaller thumbnails
- **Lazy Loading**: Charts load when visible
- **Efficient Animations**: Reduced motion on low-power devices

### 🎯 Future Enhancements

#### Planned Features
- **Real-time Updates**: WebSocket integration
- **Export Functionality**: PDF/CSV downloads
- **Advanced Filters**: Date ranges, custom criteria
- **Notifications**: In-app alerts for important events
- **Customizable Dashboards**: User-configurable layouts

#### Performance Improvements
- **Caching Strategy**: Redis integration
- **Database Optimization**: Indexed queries
- **CDN Integration**: Static asset delivery
- **Progressive Loading**: Incremental data fetching

## Conclusion

The Dynamic Dashboard System provides a comprehensive, real-time view of platform activity with role-based customization, interactive visualizations, and responsive design. The system is built for scalability, performance, and user experience across all device types and user roles.