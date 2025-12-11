import React from "react";
import ChefDashboardLayout from "../../../Layouts/ChefDashboardLayout";
import { Outlet } from "react-router";

const ChefDashboard = () => {
  return (
    <ChefDashboardLayout>
      <Outlet />
    </ChefDashboardLayout>
  );
};

export default ChefDashboard;
