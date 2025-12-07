// src/components/Navbar.jsx
import React from "react";
import logo from "../../assets/logo.png";
import { NavLink } from "react-router";

const Navbar = () => {
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

   
      <div className="navbar-end flex gap-1 lg:gap-3">
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
      </div>
    </div>
  );
};

export default Navbar;
