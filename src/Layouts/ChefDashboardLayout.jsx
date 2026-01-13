import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { 
  HiMenu, 
  HiX, 
  HiHome, 
  HiUser, 
  HiPlus, 
  HiCollection, 
  HiClipboardList,
  HiSparkles
} from "react-icons/hi";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const ChefDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationItems = [
    { 
      to: "", 
      label: "Dashboard", 
      icon: HiHome,
      description: "Overview and analytics"
    },
    { 
      to: "chef-profile", 
      label: "My Profile", 
      icon: HiUser,
      description: "Manage your profile"
    },
    { 
      to: "create-meals", 
      label: "Create Meal", 
      icon: HiPlus,
      description: "Add new meals"
    },
    { 
      to: "my-meals", 
      label: "My Meals", 
      icon: HiCollection,
      description: "Manage your meals"
    },
    { 
      to: "order-request", 
      label: "Order Requests", 
      icon: HiClipboardList,
      description: "Handle customer orders"
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
    <div className="min-h-screen flex bg-background text-base-content">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 bg-surface border-r border-gray-200 flex-col shadow-lg">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <HiSparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-base-content">Chef Dashboard</h2>
              <p className="text-sm text-muted">Manage your kitchen</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ""}
              className={({ isActive }) =>
                `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'chef-nav-active'
                    : 'text-muted hover:text-base-content hover:bg-hover border-2 border-transparent hover:border-primary/20'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/25' 
                      : 'bg-muted/10 group-hover:bg-primary/10'
                  }`}>
                    <item.icon className={`w-5 h-5 chef-nav-icon transition-all duration-300 ${
                      isActive ? 'text-primary' : 'text-muted group-hover:text-primary'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium chef-nav-text transition-colors duration-300 ${
                      isActive ? 'text-primary font-bold' : 'text-base-content'
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs chef-nav-description transition-colors duration-300 ${
                      isActive ? 'text-primary/80 font-medium' : 'text-muted'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-2 chef-nav-indicator rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <HiSparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-base-content">Pro Chef</p>
                <p className="text-xs text-muted">Premium features</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-surface border-r border-gray-200 shadow-2xl flex flex-col"
          >
            {/* Mobile Sidebar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                    <HiSparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-base-content">Chef Dashboard</h2>
                    <p className="text-sm text-muted">Manage your kitchen</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-hover transition-colors"
                >
                  <HiX className="w-6 h-6 text-muted" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === ""}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'chef-nav-active'
                        : 'text-muted hover:text-base-content hover:bg-hover border-2 border-transparent hover:border-primary/20'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary/25' 
                          : 'bg-muted/10 group-hover:bg-primary/10'
                      }`}>
                        <item.icon className={`w-5 h-5 chef-nav-icon transition-all duration-300 ${
                          isActive ? 'text-primary' : 'text-muted group-hover:text-primary'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className={`font-medium chef-nav-text transition-colors duration-300 ${
                          isActive ? 'text-primary font-bold' : 'text-base-content'
                        }`}>
                          {item.label}
                        </div>
                        <div className={`text-xs chef-nav-description transition-colors duration-300 ${
                          isActive ? 'text-primary/80 font-medium' : 'text-muted'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 chef-nav-indicator rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden bg-surface border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-hover transition-colors"
            >
              <HiMenu className="w-6 h-6 text-base-content" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <HiSparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-base-content">Chef Dashboard</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-background">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChefDashboardLayout;
