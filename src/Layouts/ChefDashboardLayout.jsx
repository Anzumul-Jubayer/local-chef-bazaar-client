import React from "react";
import { NavLink, Outlet } from "react-router";

const ChefDashboardLayout = () => {
  const activeClass = "bg-primary text-neutral rounded-lg px-4 py-2";
  const normalClass =
    "text-white hover:bg-primary hover:text-neutral rounded-lg px-4 py-2";

  return (
    <div className="min-h-screen flex bg-neutral text-white">
      <div className="w-64 bg-neutral/90 p-6 flex flex-col gap-4 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-primary">Chef Dashboard</h2>
        <NavLink
          to="chef-profile"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          My Profile
        </NavLink>
        <NavLink
          to="create-meals"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          Create Meal
        </NavLink>
        <NavLink
          to="my-meals"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          My Meals
        </NavLink>
        <NavLink
          to="order-request"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          Order Requests
        </NavLink>
      </div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ChefDashboardLayout;
