import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { HiMenu, HiX, HiHome, HiBell, HiSearch } from "react-icons/hi";
import { FaUsers, FaChartPie, FaUserShield } from "react-icons/fa";
import { MdRequestPage } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getLinkClass = (isActive, isPartiallyActive = false) => {
    const baseClasses = "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative group";
    
    if (isActive || isPartiallyActive) {
      return `${baseClasses} bg-primary text-primary-content shadow-lg transform scale-[1.02] font-semibold border-l-4 border-primary-content/30`;
    }
    
    return `${baseClasses} text-base-content hover:bg-primary/10 hover:text-primary hover:shadow-md hover:scale-[1.01] hover:border-l-4 hover:border-primary/30`;
  };

  const getIconClass = (isActive, isPartiallyActive = false) => {
    if (isActive || isPartiallyActive) {
      return "w-5 h-5 text-primary-content";
    }
    return "w-5 h-5 group-hover:text-primary transition-colors";
  };

  const menuItems = [
    { 
      to: "", 
      icon: HiHome, 
      label: "Overview", 
      end: true,
      paths: [""] // Exact match for dashboard home
    },
    { 
      to: "admin-profile", 
      icon: CgProfile, 
      label: "My Profile",
      paths: ["admin-profile"] // Profile related paths
    },
    { 
      to: "manage-user", 
      icon: FaUsers, 
      label: "Manage Users",
      paths: ["manage-user"] // User management paths
    },
    { 
      to: "manage-request", 
      icon: MdRequestPage, 
      label: "Manage Requests",
      paths: ["manage-request"] // Request management paths
    },
    { 
      to: "statistics", 
      icon: FaChartPie, 
      label: "Platform Statistics",
      paths: ["statistics"] // Statistics related paths
    },
  ];

  // Check if current path matches any of the menu item paths
  const isMenuItemActive = (menuItem) => {
    const currentPath = location.pathname.split('/').pop() || '';
    
    if (menuItem.end && currentPath === '') {
      return true;
    }
    
    return menuItem.paths.some(path => {
      if (path === '' && currentPath === '') return true;
      return currentPath === path || currentPath.startsWith(path + '/');
    });
  };

  const MenuLink = ({ item, onClick = null }) => {
    const isActive = isMenuItemActive(item);
    
    return (
      <NavLink
        to={item.to}
        end={item.end}
        className={() => getLinkClass(isActive)}
        onClick={onClick}
      >
        <item.icon className={getIconClass(isActive)} />
        <span className={isActive ? "text-primary-content" : "group-hover:text-primary transition-colors"}>
          {item.label}
        </span>
        {/* Active indicator */}
        {isActive && (
          <div className="absolute right-2 w-2 h-2 bg-primary-content rounded-full animate-pulse"></div>
        )}
      </NavLink>
    );
  };

  return (
    <div className="min-h-screen flex bg-base-100">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex w-72 bg-base-200/50 backdrop-blur-sm border-r border-base-300/50 flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-base-300/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <FaUserShield className="w-5 h-5 text-primary-content" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-base-content">Admin Panel</h2>
              <p className="text-sm text-base-content/70">Management Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-6 space-y-2">
          <div className="mb-4">
            <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-3">
              Main Navigation
            </p>
          </div>
          {menuItems.map((item) => (
            <MenuLink key={item.to} item={item} />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-base-300/50">
          <div className="text-xs text-base-content/50 text-center space-y-1">
            <p className="font-medium">LocalChefBazaar Admin</p>
            <p>Version 1.0.0</p>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-success font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE OVERLAY SIDEBAR */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className={`w-80 bg-base-200 h-full flex flex-col shadow-2xl transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Sidebar Header */}
          <div className="p-6 border-b border-base-300/50">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                  <FaUserShield className="w-5 h-5 text-primary-content" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-base-content">Admin Panel</h2>
                  <p className="text-sm text-base-content/70">Management Dashboard</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-base-300/50 rounded-lg transition-colors"
              >
                <HiX className="w-6 h-6 text-base-content" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
            <div className="mb-4">
              <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-3">
                Main Navigation
              </p>
            </div>
            {menuItems.map((item) => (
              <MenuLink 
                key={item.to} 
                item={item} 
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          {/* Mobile Sidebar Footer */}
          <div className="p-6 border-t border-base-300/50">
            <div className="text-xs text-base-content/50 text-center space-y-1">
              <p className="font-medium">LocalChefBazaar Admin</p>
              <p>Version 1.0.0</p>
              <div className="flex items-center justify-center space-x-1 mt-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-success font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="bg-base-100/80 backdrop-blur-sm border-b border-base-300/50 px-4 lg:px-8 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-base-200 rounded-lg transition-colors"
            >
              <HiMenu className="w-6 h-6 text-base-content" />
            </button>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="text-base-content/50">Admin</span>
              <span className="text-base-content/30">/</span>
              <span className="text-base-content font-medium">
                {menuItems.find(item => isMenuItemActive(item))?.label || 'Overview'}
              </span>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Search admin panel..."
                  className="w-full pl-10 pr-4 py-2 bg-base-200/50 border border-base-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-base-200 rounded-lg transition-colors relative">
                <HiBell className="w-6 h-6 text-base-content" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-pulse"></span>
              </button>
              
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
                <FaUserShield className="w-4 h-4 text-primary-content" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 bg-base-50 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
