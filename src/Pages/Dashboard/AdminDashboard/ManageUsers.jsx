import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { buildApiUrl } from "../../../config/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { 
  HiUsers, 
  HiSearch, 
  HiFilter, 
  HiExclamation,
  HiCheckCircle,
  HiXCircle,
  HiEye,
  HiRefresh,
  HiDownload,
  HiUserAdd
} from "react-icons/hi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("/users"));
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole, filterStatus]);

  // Make user fraud
  const makeFraud = async (id) => {
    try {
      const res = await fetch(buildApiUrl(`/users/${id}/fraud`), {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Failed to update user");

      const data = await res.json();

      if (data.success) {
        toast.success("User marked as fraud");
        // Update local state
        setUsers(prev =>
          prev.map(user =>
            user._id === id ? { ...user, status: "fraud" } : user
          )
        );
      } else {
        toast.error(data.message || "Failed to mark as fraud");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="badge badge-success badge-sm">Active</span>;
      case "fraud":
        return <span className="badge badge-error badge-sm">Fraud</span>;
      case "suspended":
        return <span className="badge badge-warning badge-sm">Suspended</span>;
      default:
        return <span className="badge badge-ghost badge-sm">Unknown</span>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <span className="badge badge-primary badge-sm">Admin</span>;
      case "chef":
        return <span className="badge badge-secondary badge-sm">Chef</span>;
      case "user":
        return <span className="badge badge-ghost badge-sm">User</span>;
      default:
        return <span className="badge badge-ghost badge-sm">Unknown</span>;
    }
  };

  const UserModal = ({ user, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-base-100 rounded-2xl p-6 max-w-md w-full shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-base-content">User Details</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <HiXCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-primary-content font-bold text-lg">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-base-content">{user.name}</h4>
              <p className="text-sm text-muted">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted">Role</label>
              <div className="mt-1">{getRoleBadge(user.role)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted">Status</label>
              <div className="mt-1">{getStatusBadge(user.status)}</div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted">Address</label>
            <p className="mt-1 text-base-content">{user.address || "Not provided"}</p>
          </div>

          <div className="flex space-x-2 pt-4">
            {user.role !== "admin" && user.status !== "fraud" && (
              <button
                onClick={() => {
                  makeFraud(user._id);
                  onClose();
                }}
                className="btn btn-error btn-sm flex-1"
              >
                <HiExclamation className="w-4 h-4 mr-2" />
                Mark as Fraud
              </button>
            )}
            <button onClick={onClose} className="btn btn-outline btn-sm flex-1">
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Manage Users | LocalChefBazaar</title>
        </Helmet>
        <div className="animate-fade-in space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 bg-base-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-base-300 rounded w-64"></div>
            </div>
          </div>
          <div className="card-modern p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 animate-pulse">
                  <div className="w-12 h-12 bg-base-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-base-300 rounded w-32"></div>
                    <div className="h-3 bg-base-300 rounded w-48"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Users | LocalChefBazaar</title>
      </Helmet>

      <div className="animate-fade-in space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2 flex items-center">
              <HiUsers className="w-8 h-8 mr-3 text-primary" />
              Manage Users
            </h1>
            <p className="text-muted">Monitor and manage all platform users</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={fetchUsers}
              className="btn btn-outline btn-sm"
            >
              <HiRefresh className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button className="btn btn-primary btn-sm">
              <HiDownload className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <HiUsers className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Total Users</p>
                <p className="text-2xl font-bold text-base-content">{users.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <HiCheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Active Users</p>
                <p className="text-2xl font-bold text-base-content">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <HiUserAdd className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Chefs</p>
                <p className="text-2xl font-bold text-base-content">
                  {users.filter(u => u.role === 'chef').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
                <HiExclamation className="w-6 h-6 text-error" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Fraud Users</p>
                <p className="text-2xl font-bold text-base-content">
                  {users.filter(u => u.status === 'fraud').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          className="card-modern p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="select select-bordered"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="chef">Chefs</option>
              <option value="admin">Admins</option>
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="select select-bordered"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="fraud">Fraud</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          className="card-modern overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200">
                <tr>
                  <th className="font-semibold text-base-content">User</th>
                  <th className="font-semibold text-base-content">Email</th>
                  <th className="font-semibold text-base-content">Role</th>
                  <th className="font-semibold text-base-content">Status</th>
                  <th className="font-semibold text-base-content">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-base-200/50"
                    >
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                            <span className="text-primary-content font-medium text-sm">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-base-content">{user.name}</div>
                            <div className="text-sm text-muted truncate max-w-32">
                              {user.address || "No address"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-base-content">{user.email}</div>
                      </td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                            className="btn btn-ghost btn-sm"
                            title="View Details"
                          >
                            <HiEye className="w-4 h-4" />
                          </button>
                          {user.role !== "admin" && user.status !== "fraud" && (
                            <button
                              onClick={() => makeFraud(user._id)}
                              className="btn btn-error btn-sm"
                              title="Mark as Fraud"
                            >
                              <HiExclamation className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <HiUsers className="w-12 h-12 text-muted" />
                        <p className="text-muted">No users found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* User Details Modal */}
        {showModal && selectedUser && (
          <UserModal
            user={selectedUser}
            onClose={() => {
              setShowModal(false);
              setSelectedUser(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ManageUsers;
