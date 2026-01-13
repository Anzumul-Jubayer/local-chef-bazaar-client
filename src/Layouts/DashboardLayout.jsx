import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { HiMenu, HiX, HiUser, HiHeart, HiClipboardList, HiStar, HiHome } from "react-icons/hi";
import { AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { 
      to: "", 
      label: "Dashboard", 
      icon: HiHome,
      description: "Overview and analytics"
    },
    { 
      to: "profile", 
      label: "My Profile", 
      icon: HiUser,
      description: "Manage your account settings"
    },
    { 
      to: "orders", 
      label: "My Orders", 
      icon: HiClipboardList,
      description: "Track your meal orders"
    },
    { 
      to: "reviews", 
      label: "My Reviews", 
      icon: HiStar,
      description: "Reviews you've written"
    },
    { 
      to: "favorites", 
      label: "Favorite Meals", 
      icon: HiHeart,
      description: "Your saved favorite dishes"
    },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 40
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    closed: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-80 sidebar-modern flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <HiHome className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-base-content">Dashboard</h2>
              <p className="text-sm text-muted">Manage your account</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ""}
              className={({ isActive }) =>
                `sidebar-item group ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => (
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/20' 
                      : 'bg-current/10 group-hover:bg-current/20'
                  }`}>
                    <item.icon className={`w-4 h-4 sidebar-icon transition-all duration-300 ${
                      isActive ? 'text-primary' : ''
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium transition-colors duration-300 ${
                      isActive ? 'text-primary font-semibold' : ''
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs truncate transition-colors duration-300 ${
                      isActive ? 'text-primary/70 font-medium' : 'opacity-70'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="card-modern p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <HiStar className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-base-content">Premium Features</div>
                <div className="text-xs text-muted">Upgrade for more benefits</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              className="w-80 h-full sidebar-modern flex flex-col"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <HiHome className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-bold text-base-content">Dashboard</h2>
                      <p className="text-sm text-muted">Manage your account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-hover rounded-lg transition-colors"
                  >
                    <HiX className="w-5 h-5 text-base-content" />
                  </button>
                </div>
              </div>
              
              <nav className="flex-1 p-6 space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === ""}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `sidebar-item group ${isActive ? 'active' : ''}`
                    }
                  >
                    {({ isActive }) => (
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          isActive 
                            ? 'bg-primary/20' 
                            : 'bg-current/10 group-hover:bg-current/20'
                        }`}>
                          <item.icon className={`w-4 h-4 sidebar-icon transition-all duration-300 ${
                            isActive ? 'text-primary' : ''
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium transition-colors duration-300 ${
                            isActive ? 'text-primary font-semibold' : ''
                          }`}>
                            {item.label}
                          </div>
                          <div className={`text-xs truncate transition-colors duration-300 ${
                            isActive ? 'text-primary/70 font-medium' : 'opacity-70'
                          }`}>
                            {item.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        )}
                      </div>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="p-6 border-t border-gray-200">
                <div className="card-modern p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <HiStar className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-base-content">Premium Features</div>
                      <div className="text-xs text-muted">Upgrade for more benefits</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden bg-surface border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-hover rounded-lg transition-colors"
            >
              <HiMenu className="w-6 h-6 text-base-content" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <HiHome className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display font-semibold text-base-content">Dashboard</span>
            </div>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
