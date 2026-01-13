import { useLocation } from "react-router";
import { HiCheckCircle, HiXCircle, HiInformationCircle } from "react-icons/hi";

const DashboardActiveStateTest = () => {
  const location = useLocation();

  // Helper functions (same as in Navbar)
  const isDashboardOverviewActive = (mainRoute) => {
    if (!location?.pathname || !mainRoute) return false;
    const isExactMatch = location.pathname === mainRoute;
    const isExactMatchWithSlash = location.pathname === `${mainRoute}/`;
    return isExactMatch || isExactMatchWithSlash;
  };

  const isChildRouteActive = (mainRoute) => {
    if (!location?.pathname || !mainRoute) return false;
    const isChildRoute = location.pathname.startsWith(mainRoute + '/') && 
                        location.pathname !== mainRoute && 
                        location.pathname !== `${mainRoute}/`;
    return isChildRoute;
  };

  const shouldDashboardOverviewBeActive = (mainRoute) => {
    const isOverviewRoute = isDashboardOverviewActive(mainRoute);
    const hasActiveChild = isChildRouteActive(mainRoute);
    return isOverviewRoute && !hasActiveChild;
  };

  const isSpecificRouteActive = (routePath) => {
    if (!location?.pathname || !routePath) return false;
    return location.pathname === routePath || location.pathname === `${routePath}/`;
  };

  // Test scenarios
  const testScenarios = [
    {
      route: "/dashboard",
      description: "User Dashboard Overview",
      shouldOverviewBeActive: shouldDashboardOverviewBeActive("/dashboard"),
      hasChildActive: isChildRouteActive("/dashboard"),
      isCurrentRoute: location.pathname === "/dashboard" || location.pathname === "/dashboard/"
    },
    {
      route: "/dashboard/profile", 
      description: "User Profile Page",
      shouldOverviewBeActive: shouldDashboardOverviewBeActive("/dashboard"),
      isChildRouteActive: isSpecificRouteActive("/dashboard/profile"),
      isCurrentRoute: location.pathname === "/dashboard/profile"
    },
    {
      route: "/dashboard/orders",
      description: "User Orders Page",
      shouldOverviewBeActive: shouldDashboardOverviewBeActive("/dashboard"),
      isChildRouteActive: isSpecificRouteActive("/dashboard/orders"),
      isCurrentRoute: location.pathname === "/dashboard/orders"
    }
  ];

  const currentScenario = testScenarios.find(scenario => 
    location.pathname === scenario.route || 
    location.pathname === `${scenario.route}/`
  );

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="card-modern p-4 bg-surface border border-gray-200 shadow-xl">
        <div className="flex items-center space-x-2 mb-3">
          <HiInformationCircle className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-base-content">Active State Test</h3>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Current Route:</span>
            <span className="font-mono text-primary text-xs">{location.pathname}</span>
          </div>
          
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-muted text-xs">Overview Active:</span>
                <div className="flex items-center space-x-1">
                  {shouldDashboardOverviewBeActive("/dashboard") ? (
                    <HiCheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <HiXCircle className="w-4 h-4 text-muted" />
                  )}
                  <span className="text-xs">
                    {shouldDashboardOverviewBeActive("/dashboard") ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted text-xs">Child Active:</span>
                <div className="flex items-center space-x-1">
                  {isChildRouteActive("/dashboard") ? (
                    <HiCheckCircle className="w-4 h-4 text-success" />
                  ) : (
                    <HiXCircle className="w-4 h-4 text-muted" />
                  )}
                  <span className="text-xs">
                    {isChildRouteActive("/dashboard") ? "Yes" : "No"}
                  </span>
                </div>
              </div>
              
              {currentScenario && (
                <div className="flex items-center justify-between">
                  <span className="text-muted text-xs">Current Page:</span>
                  <span className="text-xs text-primary font-medium">
                    {currentScenario.description.replace("User ", "")}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="text-xs text-muted">
              ✅ Only one item should be active at a time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardActiveStateTest;
