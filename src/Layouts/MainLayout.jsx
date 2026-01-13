import React from "react";
import Navbar from "../Components/Common/Navbar";
import { Outlet } from "react-router";
import Footer from "../Components/Common/Footer";
import BackToTop from "../Components/Common/BackToTop";
// import DashboardActiveStateTest from "../Components/Common/DashboardActiveStateTest";

const MainLayout = () => {
  // Enable this for testing dashboard active states
  // const enableActiveStateTest = false;

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content transition-colors duration-300">
      <Navbar></Navbar>
      <div className="flex-1 bg-base-100">
        <Outlet></Outlet>
      </div>
      <Footer></Footer>
      <BackToTop />
      {/* {enableActiveStateTest && <DashboardActiveStateTest />} */}
    </div>
  );
};

export default MainLayout;
