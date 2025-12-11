import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { HiMenu, HiX } from "react-icons/hi";

const ChefDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeClass = "bg-primary text-neutral rounded-lg px-4 py-2";
  const normalClass =
    "text-white hover:bg-primary hover:text-neutral rounded-lg px-4 py-2";

  return (
    <div className="min-h-screen flex bg-neutral text-white">
      
      <div className="hidden md:flex w-64 bg-neutral/90 p-6 flex-col gap-4 border-r border-gray-700">
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

      
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/60 ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className="w-64 bg-neutral p-6 h-full flex flex-col gap-4 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Chef Dashboard</h2>
            <HiX
              className="text-2xl cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <NavLink
            to="chef-profile"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
            onClick={() => setSidebarOpen(false)}
          >
            My Profile
          </NavLink>
          <NavLink
            to="create-meals"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
            onClick={() => setSidebarOpen(false)}
          >
            Create Meal
          </NavLink>
          <NavLink
            to="my-meals"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
            onClick={() => setSidebarOpen(false)}
          >
            My Meals
          </NavLink>
          <NavLink
            to="order-request"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
            onClick={() => setSidebarOpen(false)}
          >
            Order Requests
          </NavLink>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 md:ml-64">
        {/* Mobile toggle button */}
        <div className="md:hidden mb-4">
          <HiMenu
            className="text-3xl cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default ChefDashboardLayout;
