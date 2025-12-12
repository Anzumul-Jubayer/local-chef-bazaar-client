import React from "react";
import { Helmet } from "react-helmet";
import AdminDashboardLayout from "../../../Layouts/AdminDashboardLayout";
import { Outlet } from "react-router";

const AdminDashboard = () => {
  return (
    <div>
      <Helmet>
        <title>Admin Dashboard | Local Chef bazar</title>
      </Helmet>
      <AdminDashboardLayout>
        <Outlet/>
      </AdminDashboardLayout>
    </div>
  );
};

export default AdminDashboard;
