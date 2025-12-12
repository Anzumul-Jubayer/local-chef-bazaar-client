import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
  try {
    const res = await fetch("http://localhost:3000/role-requests");
    const result = await res.json();
    if(result.success) {
      setRequests(result.data); 
    }
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (request) => {
    try {
      const res = await fetch(`http://localhost:3000/role-requests/${request._id}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: request.requestType,
          userEmail: request.userEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Success", data.message, "success");
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (request) => {
    try {
      const res = await fetch(`http://localhost:3000/role-requests/${request._id}/reject`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Rejected", data.message, "error");
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <Helmet>
      <title>Manage request | Local chef Bazar</title>
    </Helmet>
     <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Role Requests</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">User Name</th>
            <th className="border px-4 py-2">User Email</th>
            <th className="border px-4 py-2">Request Type</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Request Time</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(requests) && requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request._id}>
                <td className="border px-4 py-2">{request.userName}</td>
                <td className="border px-4 py-2">{request.userEmail}</td>
                <td className="border px-4 py-2">{request.requestType}</td>
                <td className="border px-4 py-2">{request.requestStatus}</td>
                <td className="border px-4 py-2">
                  {new Date(request.requestTime).toLocaleString()}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleAccept(request)}
                    disabled={request.requestStatus !== "pending"}
                    className="bg-green-500 text-white px-2 py-1 rounded disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request)}
                    disabled={request.requestStatus !== "pending"}
                    className="bg-red-500 text-white px-2 py-1 rounded disabled:opacity-50"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-4 py-2 text-center" colSpan={6}>
                No requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
    
  );
};

export default ManageRequests;
