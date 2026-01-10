import { useContext, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { NavLink } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import ThemeToggle from "./ThemeToggle";
import { 
  HiMenu, 
  HiX, 
  HiUser, 
  HiLogout, 
  HiHeart, 
  HiClipboardList,
  HiStar,
  HiChevronDown,
  HiHome,
  HiCollection,
  HiInformationCircle,
  HiPhone,
  HiCake,
  HiChartBar,
  HiPlus,
  HiViewGrid,
  HiClipboard,
  HiUserGroup,
  HiShieldCheck,
  HiArrowRight,
  HiBookOpen
} from "react-icons/hi";

const Navbar = () => {
  const { user, signOutFunc, loading } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Fetch role from backend
  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email) {
        setRole(null);
        setRoleLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://local-chef-bazaar-server-flame.vercel.app/users/role/${user.email}`
        );
        const data = await res.json();
        setRole(data.role || null);
      } catch (err) {
        console.error("Navbar role fetch error:", err);
        setRole(null);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOutFunc();
      toast.success("Successfully logged out!");
      setIsMobileMenuOpen(false);
      setIsProfileMenuOpen(false);
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const closeAllMenus = () => {
    setIsProfileMenuOpen(false);
  };

  if (loading || roleLoading) {
    return (
      <nav className="nav-modern sticky top-0 z-50">
        <div className="container-modern">
          <div className="flex justify-center items-center h-16">
            <div className="animate-pulse flex items-center space-x-3">
              <div className="w-8 h-8 bg-base-300 rounded-full"></div>
              <div className="w-32 h-4 bg-base-300 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Base navigation links (always visible)
  const baseNavigationLinks = [
    { to: "/", label: "Home", icon: HiHome },
    { to: "/meals", label: "Meals", icon: HiCollection },
    { to: "/blog", label: "Blog", icon: HiBookOpen },
    { to: "/about", label: "About", icon: HiInformationCircle },
    { to: "/contact", label: "Contact", icon: HiPhone },
  ];

  // Role-specific dashboard menu items
  const getDashboardMenuItems = () => {
    switch (role) {
      case "admin":
        return {
          title: "Admin Dashboard",
          icon: HiShieldCheck,
          mainRoute: "/admin-dashboard",
          items: [
            { 
              group: "Management", 
              items: [
                { to: "/admin-dashboard/admin-profile", label: "Admin Profile", icon: HiUser },
                { to: "/admin-dashboard/manage-user", label: "Manage Users", icon: HiUserGroup },
                { to: "/admin-dashboard/manage-request", label: "Role Requests", icon: HiClipboard },
              ]
            },
            { 
              group: "Analytics", 
              items: [
                { to: "/admin-dashboard/statistics", label: "Platform Statistics", icon: HiChartBar },
              ]
            }
          ]
        };
      
      case "chef":
        return {
          title: "Chef Dashboard",
          icon: HiCake,
          mainRoute: "/chef-dashboard",
          items: [
            { 
              group: "Profile & Meals", 
              items: [
                { to: "/chef-dashboard/chef-profile", label: "Chef Profile", icon: HiUser },
                { to: "/chef-dashboard/create-meals", label: "Create Meal", icon: HiPlus },
                { to: "/chef-dashboard/my-meals", label: "My Meals", icon: HiViewGrid },
              ]
            },
            { 
              group: "Orders", 
              items: [
                { to: "/chef-dashboard/order-request", label: "Order Requests", icon: HiClipboardList },
              ]
            }
          ]
        };
      
      default: // user role
        return {
          title: "My Dashboard",
          icon: HiUser,
          mainRoute: "/dashboard",
          items: [
            { 
              group: "Account", 
              items: [
                { to: "/dashboard/profile", label: "My Profile", icon: HiUser },
                { to: "/dashboard/orders", label: "My Orders", icon: HiClipboardList },
              ]
            },
            { 
              group: "Preferences", 
              items: [
                { to: "/dashboard/favorites", label: "Favorite Meals", icon: HiHeart },
                { to: "/dashboard/reviews", label: "My Reviews", icon: HiStar },
              ]
            }
          ]
        };
    }
  };

  const dashboardMenu = user ? getDashboardMenuItems() : null;

  // Role badge configuration
  const getRoleBadge = () => {
    switch (role) {
      case "admin":
        return { label: "Admin", color: "bg-secondary/10 text-secondary border-secondary/20" };
      case "chef":
        return { label: "Chef", color: "bg-accent/10 text-accent border-accent/20" };
      default:
        return { label: "Member", color: "bg-primary/10 text-primary border-primary/20" };
    }
  };

  const roleBadge = getRoleBadge();

  // Helper function to get item descriptions
  const getItemDescription = (label) => {
    const descriptions = {
      "Admin Profile": "Manage admin settings",
      "Manage Users": "User management tools",
      "Role Requests": "Review role requests",
      "Platform Statistics": "Analytics & reports",
      "Chef Profile": "Update chef information",
      "Create Meal": "Add new meals",
      "My Meals": "Manage your meals",
      "Order Requests": "Handle incoming orders",
      "My Profile": "Personal information",
      "My Orders": "Order history",
      "Favorite Meals": "Saved favorites",
      "My Reviews": "Your meal reviews"
    };
    return descriptions[label] || "Access this section";
  };

  return (
    <nav className="nav-modern sticky top-0 z-50">
      <div className="container-modern">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={logo} 
                alt="LocalChefBazaar Logo" 
                className="w-10 h-10 object-cover transition-all duration-300"
              />
            </div>
            <div className="font-display">
              <span className="text-xl font-bold text-primary">Local</span>
              <span className="text-xl font-bold text-secondary">Chef</span>
              <span className="text-xl font-bold text-accent">Bazaar</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Base Navigation Links */}
            {baseNavigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeAllMenus}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 group ${
                    isActive 
                      ? "bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 text-primary font-bold shadow-lg border border-primary/20" 
                      : "text-base-content hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 hover:text-primary hover:shadow-md"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 rounded-xl blur-sm"></div>
                    )}
                    
                    {/* Content */}
                    <div className="relative flex items-center space-x-2">
                      <link.icon className={`w-4 h-4 transition-all duration-300 ${
                        isActive ? "text-primary scale-110" : "group-hover:text-primary group-hover:scale-105"
                      }`} />
                      <span className="relative">
                        {link.label}
                        {/* Active underline */}
                        {isActive && (
                          <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                        )}
                      </span>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />
            
            {!user ? (
              <div className="flex items-center space-x-2">
                <NavLink
                  to="/login"
                  className="btn-ghost-modern px-4 py-2 rounded-lg"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn-primary-modern"
                >
                  Get Started
                </NavLink>
              </div>
            ) : (
              <div className="relative">
                {/* Profile Dropdown Menu */}
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                  }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-hover transition-colors group"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <HiUser className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div className="hidden xl:block text-left">
                    <div className="text-sm font-medium text-base-content max-w-24 truncate">
                      {user.displayName || "User"}
                    </div>
                    <div className={`text-xs px-2 py-0.5 rounded-full border ${roleBadge.color} font-medium`}>
                      {roleBadge.label}
                    </div>
                  </div>
                  <HiChevronDown className={`w-4 h-4 text-muted transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 card-modern p-4 animate-fade-in shadow-xl dropdown-modern">
                    {/* User Info Header */}
                    <div className="px-3 py-4 border-b border-color">
                      <div className="flex items-center space-x-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <HiUser className="w-6 h-6 text-primary" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-base-content truncate">
                            {user.displayName || "User"}
                          </p>
                          <p className="text-xs text-muted truncate">{user.email}</p>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-2 ${roleBadge.color}`}>
                            {roleBadge.label}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dashboard Section */}
                    {dashboardMenu && (
                      <div className="py-4 border-b border-color">
                        <div className="flex items-center space-x-2 mb-4 px-3">
                          <dashboardMenu.icon className="w-5 h-5 text-primary" />
                          <h3 className="font-bold text-base-content">{dashboardMenu.title}</h3>
                        </div>
                        
                        {/* Main Dashboard Link */}
                        <div className="mb-4">
                          <NavLink
                            to={dashboardMenu.mainRoute}
                            onClick={() => setIsProfileMenuOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group border ${
                                isActive
                                  ? "bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border-primary/30 shadow-lg"
                                  : "bg-gradient-to-r from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 border-primary/10 hover:border-primary/20"
                              }`
                            }
                          >
                            {({ isActive }) => (
                              <>
                                <div className={`p-2 rounded-lg transition-colors ${
                                  isActive ? "bg-primary/25" : "bg-primary/15 group-hover:bg-primary/25"
                                }`}>
                                  <HiViewGrid className={`w-5 h-5 transition-all duration-300 ${
                                    isActive ? "text-primary scale-110" : "text-primary"
                                  }`} />
                                </div>
                                <div className="flex-1">
                                  <div className={`font-semibold transition-colors ${
                                    isActive ? "text-primary" : "text-base-content"
                                  }`}>Dashboard Overview</div>
                                  <div className="text-xs text-muted">Main dashboard</div>
                                </div>
                                <HiArrowRight className={`w-4 h-4 text-primary transition-all duration-300 ${
                                  isActive ? "opacity-100 translate-x-1" : "opacity-0 group-hover:opacity-100"
                                }`} />
                              </>
                            )}
                          </NavLink>
                        </div>

                        {/* Dashboard Menu Items */}
                        <div className="space-y-3">
                          {dashboardMenu.items.map((group, groupIndex) => (
                            <div key={groupIndex}>
                              <div className="flex items-center space-x-2 mb-2 px-3">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                <h4 className="text-xs font-bold text-muted uppercase tracking-wider">
                                  {group.group}
                                </h4>
                                <div className="flex-1 h-px bg-border"></div>
                              </div>
                              <div className="space-y-1">
                                {group.items.map((item) => (
                                  <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={() => setIsProfileMenuOpen(false)}
                                    className={({ isActive }) =>
                                      `menu-item-modern flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 group ${
                                        isActive
                                          ? "bg-gradient-to-r from-primary/15 to-accent/15 text-primary font-semibold border border-primary/20 shadow-md"
                                          : "text-base-content hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 hover:text-primary"
                                      }`
                                    }
                                  >
                                    {({ isActive }) => (
                                      <>
                                        <div className={`p-1.5 rounded-lg transition-colors ${
                                          isActive 
                                            ? "bg-primary/20" 
                                            : "bg-base-300 group-hover:bg-primary/10"
                                        }`}>
                                          <item.icon className={`w-4 h-4 transition-all duration-300 ${
                                            isActive 
                                              ? "text-primary scale-110" 
                                              : "text-muted group-hover:text-primary"
                                          }`} />
                                        </div>
                                        <div className="flex-1">
                                          <div className={`font-medium transition-colors ${
                                            isActive ? "text-primary" : ""
                                          }`}>{item.label}</div>
                                          <div className={`text-xs text-muted transition-opacity ${
                                            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                          }`}>
                                            {getItemDescription(item.label)}
                                          </div>
                                        </div>
                                        <HiChevronDown className={`w-3 h-3 text-muted rotate-[-90deg] transition-all duration-300 ${
                                          isActive 
                                            ? "opacity-100 text-primary" 
                                            : "opacity-0 group-hover:opacity-100"
                                        }`} />
                                      </>
                                    )}
                                  </NavLink>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Logout */}
                    <div className="pt-3">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-3 text-sm text-error hover:bg-error/10 rounded-lg transition-colors group"
                      >
                        <div className="p-1.5 bg-error/10 rounded-lg group-hover:bg-error/20 transition-colors">
                          <HiLogout className="w-4 h-4 text-error" />
                        </div>
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-hover transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden animate-fade-in">
            <div className="card-modern mt-2 p-4 space-y-3">
              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {baseNavigationLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `relative flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 group ${
                        isActive
                          ? "bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 text-primary font-bold shadow-lg border border-primary/20"
                          : "text-base-content hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 hover:text-primary"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20 rounded-xl blur-sm"></div>
                        )}
                        
                        {/* Content */}
                        <div className="relative flex items-center space-x-3">
                          <link.icon className={`w-5 h-5 transition-all duration-300 ${
                            isActive ? "text-primary scale-110" : "group-hover:text-primary group-hover:scale-105"
                          }`} />
                          <span className="relative">
                            {link.label}
                            {/* Active underline */}
                            {isActive && (
                              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                            )}
                          </span>
                        </div>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t border-color pt-4">
                {!user ? (
                  <div className="space-y-2">
                    <NavLink
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block w-full btn-ghost-modern text-center py-3 rounded-lg"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={closeMobileMenu}
                      className="block w-full btn-primary-modern text-center py-3 rounded-lg"
                    >
                      Get Started
                    </NavLink>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Mobile User Info */}
                    <div className="flex items-center space-x-3 px-4 py-3 bg-surface-elevated rounded-lg">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <HiUser className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-base-content truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {user.email}
                        </p>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border mt-1 ${roleBadge.color}`}>
                          {roleBadge.label}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Dashboard Section */}
                    {dashboardMenu && (
                      <div className="bg-surface-elevated rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-4">
                          <dashboardMenu.icon className="w-5 h-5 text-primary" />
                          <h3 className="font-bold text-base-content">{dashboardMenu.title}</h3>
                        </div>
                        
                        {/* Main Dashboard Link */}
                        <NavLink
                          to={dashboardMenu.mainRoute}
                          onClick={closeMobileMenu}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 mb-4 ${
                              isActive
                                ? "bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border border-primary/20 shadow-lg"
                                : "bg-primary/5 hover:bg-primary/10"
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <HiViewGrid className={`w-5 h-5 transition-all duration-300 ${
                                isActive ? "text-primary scale-110" : "text-primary"
                              }`} />
                              <div>
                                <div className={`font-semibold transition-colors ${
                                  isActive ? "text-primary" : "text-base-content"
                                }`}>Dashboard Overview</div>
                                <div className="text-xs text-muted">Main dashboard</div>
                              </div>
                            </>
                          )}
                        </NavLink>

                        {/* Dashboard Menu Items */}
                        <div className="space-y-3">
                          {dashboardMenu.items.map((group, groupIndex) => (
                            <div key={groupIndex}>
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                                  {group.group}
                                </span>
                                <div className="flex-1 h-px bg-border"></div>
                              </div>
                              <div className="space-y-1">
                                {group.items.map((item) => (
                                  <NavLink
                                    key={item.to}
                                    to={item.to}
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                      `flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                                        isActive
                                          ? "bg-gradient-to-r from-primary/15 to-accent/15 text-primary font-semibold border border-primary/20 shadow-md"
                                          : "text-base-content hover:bg-gradient-to-r hover:from-primary/5 hover:to-accent/5 hover:text-primary"
                                      }`
                                    }
                                  >
                                    {({ isActive }) => (
                                      <>
                                        <item.icon className={`w-4 h-4 transition-all duration-300 ${
                                          isActive ? "text-primary scale-110" : "text-muted"
                                        }`} />
                                        <div>
                                          <div className={`font-medium transition-colors ${
                                            isActive ? "text-primary" : ""
                                          }`}>{item.label}</div>
                                          <div className="text-xs text-muted">{getItemDescription(item.label)}</div>
                                        </div>
                                      </>
                                    )}
                                  </NavLink>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-error hover:bg-error/10 rounded-lg transition-colors"
                    >
                      <HiLogout className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close menus */}
      {isProfileMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeAllMenus}
        />
      )}
    </nav>
  );
};

export default Navbar;
