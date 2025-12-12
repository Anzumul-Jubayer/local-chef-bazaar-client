import React from "react";
import { Outlet } from "react-router";
import DashboardLayout from "../../../Layouts/DashboardLayout";
import { Helmet } from "react-helmet";


const UserDashboard = () => {
  return (
    <>
    <Helmet>
        <title>Dashboard | Local Chef bazar</title>
      </Helmet>
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
    </>
    
  );
};

export default UserDashboard;
