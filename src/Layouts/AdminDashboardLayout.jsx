import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { HiMenu, HiX } from "react-icons/hi";
import { FaUsers, FaChartPie, FaUserShield } from "react-icons/fa";
import { MdRequestPage } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

const AdminDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeClass = "bg-primary text-primary-content rounded-lg px-4 py-2";
  const normalClass =
    "text-base-content hover:bg-primary hover:text-primary-content rounded-lg px-4 py-2 transition-colors";

  return (
    <div className="min-h-screen flex bg-base-100 text-base-content">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex w-64 bg-base-200 p-6 flex-col gap-4 border-r border-base-300">
        <h2 className="text-2xl font-bold mb-6 text-primary">Admin Dashboard</h2>

        <NavLink to="admin-profile" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
          <div className="flex items-center gap-2">
            <CgProfile /> My Profile
          </div>
        </NavLink>

        <NavLink to="manage-user" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
          <div className="flex items-center gap-2">
            <FaUsers /> Manage Users
          </div>
        </NavLink>

        <NavLink to="manage-request" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
          <div className="flex items-center gap-2">
            <MdRequestPage /> Manage Requests
          </div>
        </NavLink>

        <NavLink to="statistics" className={({ isActive }) => (isActive ? activeClass : normalClass)}>
          <div className="flex items-center gap-2">
            <FaChartPie /> Platform Statistics
          </div>
        </NavLink>
      </div>

      {/* MOBILE OVERLAY SIDEBAR */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/60 ${sidebarOpen ? "block" : "hidden"}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div
          className="w-64 bg-base-200 p-6 h-full flex flex-col gap-4 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Admin Dashboard</h2>
            <HiX
              className="text-2xl cursor-pointer text-base-content"
              onClick={() => setSidebarOpen(false)}
            />
          </div>

          <NavLink to="admin-profile" className={({ isActive }) => (isActive ? activeClass : normalClass)} onClick={() => setSidebarOpen(false)}>
            <div className="flex items-center gap-2">
              <CgProfile /> My Profile
            </div>
          </NavLink>

          <NavLink to="manage-user" className={({ isActive }) => (isActive ? activeClass : normalClass)} onClick={() => setSidebarOpen(false)}>
            <div className="flex items-center gap-2">
              <FaUsers /> Manage Users
            </div>
          </NavLink>

          <NavLink to="manage-request" className={({ isActive }) => (isActive ? activeClass : normalClass)} onClick={() => setSidebarOpen(false)}>
            <div className="flex items-center gap-2">
              <MdRequestPage /> Manage Requests
            </div>
          </NavLink>

          <NavLink to="statistics" className={({ isActive }) => (isActive ? activeClass : normalClass)} onClick={() => setSidebarOpen(false)}>
            <div className="flex items-center gap-2">
              <FaChartPie /> Platform Statistics
            </div>
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="md:hidden mb-4">
          <HiMenu className="text-3xl cursor-pointer text-base-content" onClick={() => setSidebarOpen(true)} />
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
