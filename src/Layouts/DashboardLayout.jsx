import React from "react";
import { NavLink, Outlet } from "react-router";

const DashboardLayout = () => {
  const activeClass = "bg-primary text-neutral rounded-lg px-4 py-2";
  const normalClass = "text-white hover:bg-primary hover:text-neutral rounded-lg px-4 py-2";

  return (
    <div className="min-h-screen flex bg-neutral text-white">
      {/* Sidebar */}
      <div className="w-64 bg-neutral/90 p-6 flex flex-col gap-4 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-primary">User Dashboard</h2>
        <NavLink to="profile" className={({ isActive }) => isActive ? activeClass : normalClass}>My Profile</NavLink>
        <NavLink to="orders" className={({ isActive }) => isActive ? activeClass : normalClass}>My Orders</NavLink>
        <NavLink to="reviews" className={({ isActive }) => isActive ? activeClass : normalClass}>My Reviews</NavLink>
        <NavLink to="favorites" className={({ isActive }) => isActive ? activeClass : normalClass}>Favorite Meals</NavLink>
      </div>

      
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
