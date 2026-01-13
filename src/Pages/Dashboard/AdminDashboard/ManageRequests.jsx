import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { buildApiUrl } from "../../../config/api";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { 
  HiClipboardList, 
  HiCheck, 
  HiX, 
  HiClock, 
  HiRefresh,
  HiEye,
  HiUserAdd,
  HiShieldCheck,
  HiExclamation
} from "react-icons/hi";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("/role-requests"));
      const result = await res.json();
      if (result.success) {
        setRequests(result.data);
      } else {
        toast.error("Failed to fetch requests");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (request) => {
    setActionLoading(request._id);
    try {
      const res = await fetch(buildApiUrl(`/role-requests/${request._id}/accept`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: request.requestType,
          userEmail: request.userEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`${request.requestType} request approved successfully!`);
        fetchRequests();
        setShowModal(false);
      } else {
        toast.error(data.message || "Failed to approve request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error approving request");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (request) => {
    setActionLoading(request._id);
    try {
      const res = await fetch(buildApiUrl(`/role-requests/${request._id}/reject`), {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Request rejected successfully");
        fetchRequests();
        setShowModal(false);
      } else {
        toast.error(data.message || "Failed to reject request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting request");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="badge badge-warning badge-sm">Pending</span>;
      case "approved":
        return <span className="badge badge-success badge-sm">Approved</span>;
      case "rejected":
        return <span className="badge badge-error badge-sm">Rejected</span>;
      default:
        return <span className="badge badge-ghost badge-sm">Unknown</span>;
    }
  };

  const getRequestTypeBadge = (type) => {
    switch (type) {
      case "chef":
        return <span className="badge badge-secondary badge-sm">Chef</span>;
      case "admin":
        return <span className="badge badge-primary badge-sm">Admin</span>;
      default:
        return <span className="badge badge-ghost badge-sm">Unknown</span>;
    }
  };

  const getRequestTypeIcon = (type) => {
    switch (type) {
      case "chef":
        return <HiUserAdd className="w-5 h-5 text-secondary" />;
      case "admin":
        return <HiShieldCheck className="w-5 h-5 text-primary" />;
      default:
        return <HiClipboardList className="w-5 h-5 text-muted" />;
    }
  };

  const RequestModal = ({ request, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-base-100 rounded-2xl p-6 max-w-lg w-full shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-base-content">Request Details</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Request Header */}
          <div className="flex items-center space-x-4 p-4 bg-base-200 rounded-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              {getRequestTypeIcon(request.requestType)}
            </div>
            <div>
              <h4 className="font-semibold text-base-content">{request.userName}</h4>
              <p className="text-sm text-muted">{request.userEmail}</p>
            </div>
          </div>

          {/* Request Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted">Request Type</label>
              <div className="mt-1">{getRequestTypeBadge(request.requestType)}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted">Status</label>
              <div className="mt-1">{getStatusBadge(request.requestStatus)}</div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted">Request Date</label>
            <p className="mt-1 text-base-content">
              {new Date(request.requestTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Actions */}
          {request.requestStatus === "pending" && (
            <div className="flex space-x-3 pt-4 border-t border-base-300">
              <button
                onClick={() => handleAccept(request)}
                disabled={actionLoading === request._id}
                className="btn btn-success flex-1"
              >
                {actionLoading === request._id ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <HiCheck className="w-4 h-4 mr-2" />
                )}
                Approve
              </button>
              <button
                onClick={() => handleReject(request)}
                disabled={actionLoading === request._id}
                className="btn btn-error flex-1"
              >
                {actionLoading === request._id ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <HiX className="w-4 h-4 mr-2" />
                )}
                Reject
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Manage Requests | LocalChefBazaar</title>
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
              {[...Array(3)].map((_, i) => (
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

  const pendingRequests = requests.filter(r => r.requestStatus === "pending");
  const approvedRequests = requests.filter(r => r.requestStatus === "approved");
  const rejectedRequests = requests.filter(r => r.requestStatus === "rejected");

  return (
    <>
      <Helmet>
        <title>Manage Requests | LocalChefBazaar</title>
      </Helmet>

      <div className="animate-fade-in space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2 flex items-center">
              <HiClipboardList className="w-8 h-8 mr-3 text-primary" />
              Manage Requests
            </h1>
            <p className="text-muted">Review and manage role upgrade requests</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button
              onClick={fetchRequests}
              className="btn btn-outline btn-sm"
            >
              <HiRefresh className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="card-modern p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <HiClock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Pending Requests</p>
                <p className="text-2xl font-bold text-base-content">{pendingRequests.length}</p>
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
                <HiCheck className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Approved</p>
                <p className="text-2xl font-bold text-base-content">{approvedRequests.length}</p>
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
              <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
                <HiX className="w-6 h-6 text-error" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted">Rejected</p>
                <p className="text-2xl font-bold text-base-content">{rejectedRequests.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Requests Table */}
        <motion.div
          className="card-modern overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200">
                <tr>
                  <th className="font-semibold text-base-content">User</th>
                  <th className="font-semibold text-base-content">Request Type</th>
                  <th className="font-semibold text-base-content">Status</th>
                  <th className="font-semibold text-base-content">Request Date</th>
                  <th className="font-semibold text-base-content">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(requests) && requests.length > 0 ? (
                  requests.map((request, index) => (
                    <motion.tr
                      key={request._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-base-200/50"
                    >
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                            <span className="text-primary-content font-medium text-sm">
                              {request.userName?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-base-content">{request.userName}</div>
                            <div className="text-sm text-muted">{request.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td>{getRequestTypeBadge(request.requestType)}</td>
                      <td>{getStatusBadge(request.requestStatus)}</td>
                      <td>
                        <div className="text-base-content">
                          {new Date(request.requestTime).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted">
                          {new Date(request.requestTime).toLocaleTimeString()}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowModal(true);
                            }}
                            className="btn btn-ghost btn-sm"
                            title="View Details"
                          >
                            <HiEye className="w-4 h-4" />
                          </button>
                          {request.requestStatus === "pending" && (
                            <>
                              <button
                                onClick={() => handleAccept(request)}
                                disabled={actionLoading === request._id}
                                className="btn btn-success btn-sm"
                                title="Approve Request"
                              >
                                {actionLoading === request._id ? (
                                  <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                  <HiCheck className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(request)}
                                disabled={actionLoading === request._id}
                                className="btn btn-error btn-sm"
                                title="Reject Request"
                              >
                                {actionLoading === request._id ? (
                                  <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                  <HiX className="w-4 h-4" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <HiExclamation className="w-12 h-12 text-muted" />
                        <p className="text-muted">No requests found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Request Details Modal */}
        {showModal && selectedRequest && (
          <RequestModal
            request={selectedRequest}
            onClose={() => {
              setShowModal(false);
              setSelectedRequest(null);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ManageRequests;
