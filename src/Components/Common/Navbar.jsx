// src/components/Navbar.jsx
import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { NavLink } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, signOutFunc, loading } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Fetch role from backend
  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email) {
        setRole(null);
        setRoleLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/users/role/${user.email}`);
        const data = await res.json();
        setRole(data.role || null); // backend: { success:true, role:"chef" }
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
    } catch (error) {
      toast.error("Logout failed: " + error.message);
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="navbar bg-neutral text-soft-gray shadow-md px-4 lg:px-10">
        <span className="loading loading-ring loading-xl text-white mx-auto"></span>
      </div>
    );
  }

  const links = (
    <>
      <NavLink
        to="/"
        className="lg:mr-8 text-white font-semibold hover:text-primary transition"
      >
        Home
      </NavLink>

      <NavLink
        to="/meals"
        className="lg:mr-8 text-white font-semibold hover:text-primary transition"
      >
        Meals
      </NavLink>

      {user && role === "user" && (
        <NavLink
          to="/dashboard"
          className="lg:mr-8 text-white font-semibold hover:text-primary transition"
        >
          Dashboard
        </NavLink>
      )}

      {user && role === "chef" && (
        <NavLink
          to="/chef-dashboard"
          className="lg:mr-8 text-white font-semibold hover:text-primary transition"
        >
          Chef Dashboard
        </NavLink>
      )}
      {user && role === "admin" && (
        <NavLink
          to="/admin-dashboard"
          className="lg:mr-8 text-white font-semibold hover:text-primary transition"
        >
          Admin Dashboard
        </NavLink>
      )}
    </>
  );

  return (
    <div className="navbar bg-neutral text-soft-gray shadow-md px-4 lg:px-10">
      <div className="navbar-start -ml-2">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-8 6h8"
              />
            </svg>
          </div>

          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content mt-3 w-52 p-3 rounded-box bg-neutral shadow-lg text-soft-gray"
          >
            {links}
          </ul>
        </div>

        <div className=" -ml-4 lg:ml-0 flex items-center gap-1 lg:gap-2">
          <img src={logo} alt="" className="w-5 lg:w-10 rounded-full" />
          <span className="text-xs lg:text-2xl font-bold text-primary">
            LocalChefBazaar
          </span>
        </div>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal gap-4">{links}</ul>
      </div>

      <div className="navbar-end flex gap-2 lg:gap-3 items-center">
        {!user ? (
          <>
            <NavLink
              to="/login"
              className="btn btn-sm border-primary text-primary hover:bg-primary hover:text-neutral transition"
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="btn btn-sm bg-primary text-neutral hover:bg-[#b9932c] border-none"
            >
              Register
            </NavLink>
          </>
        ) : (
          <>
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-primary"
              />
            )}

            <button
              onClick={handleLogout}
              className="btn btn-sm border-primary text-primary hover:bg-primary hover:text-neutral transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
