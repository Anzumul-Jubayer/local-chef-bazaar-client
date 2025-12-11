import React from "react";
import ChefDashboardLayout from "../../../Layouts/ChefDashboardLayout";
import { Outlet } from "react-router";
import { Helmet } from "react-helmet";

const ChefDashboard = () => {
  return (
    <>
    <Helmet>
      <title>Chef Dashboard | Local Chef bazar</title>
    </Helmet>
      <ChefDashboardLayout>
        <Outlet />
      </ChefDashboardLayout>
    </>
  );
};

export default ChefDashboard;
