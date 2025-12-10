import React from "react";
import { Outlet } from "react-router";
import DashboardLayout from "../../../Layouts/DashboardLayout";


const UserDashboard = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default UserDashboard;
