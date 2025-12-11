import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { HiMenu, HiX } from "react-icons/hi";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeClass = "bg-primary text-neutral rounded-lg px-4 py-2";
  const normalClass =
    "text-white hover:bg-primary hover:text-neutral rounded-lg px-4 py-2";

  return (
    <div className="min-h-screen flex bg-neutral text-white">
      
      <div className="hidden md:flex w-64 bg-neutral/90 p-6 flex-col gap-4 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-primary">User Dashboard</h2>
        <NavLink
          to="profile"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          My Profile
        </NavLink>
        <NavLink
          to="orders"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          My Orders
        </NavLink>
        <NavLink
          to="reviews"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          My Reviews
        </NavLink>
        <NavLink
          to="favorites"
          className={({ isActive }) => (isActive ? activeClass : normalClass)}
        >
          Favorite Meals
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
            <h2 className="text-2xl font-bold text-primary">User Dashboard</h2>
            <HiX
              className="text-2xl cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
          <NavLink
            to="profile"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
            onClick={() => setSidebarOpen(false)}
          >
            My Profile
          </NavLink>
          <NavLink
            to="orders"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
            onClick={() => setSidebarOpen(false)}
          >
            My Orders
          </NavLink>
          <NavLink
            to="reviews"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
            onClick={() => setSidebarOpen(false)}
          >
            My Reviews
          </NavLink>
          <NavLink
            to="favorites"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
            onClick={() => setSidebarOpen(false)}
          >
            Favorite Meals
          </NavLink>
        </div>
      </div>

      
      <div className="flex-1 p-6 md:ml-64">
        
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

export default DashboardLayout;
