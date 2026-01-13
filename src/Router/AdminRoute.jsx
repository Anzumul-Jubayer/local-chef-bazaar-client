import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import LoadingPage from "../Pages/Loading/LoadingPage";
import { buildApiUrl } from "../config/api";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email) {
        setRole(null);
        setRoleLoading(false);
        return;
      }

      try {
        const res = await fetch(
          buildApiUrl(`/users/role/${user.email}`)
        );
        const data = await res.json();

        setRole(data.role || null);
      } catch (err) {
        console.error("AdminRoute role fetch error:", err);
        setRole(null);
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  if (loading || roleLoading) return <LoadingPage />;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
