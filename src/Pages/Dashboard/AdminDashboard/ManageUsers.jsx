import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
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

  // Make user fraud
  const makeFraud = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/users/${id}/fraud`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Failed to update user");

      const data = await res.json();

      if (data.success) {
        toast.success("User marked as fraud");
        // Update local state
        setUsers((prev) =>
          prev.map((user) =>
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

  if (loading) return <p className="text-center mt-10">Loading users...</p>;

  return (
   <>
   <Helmet>
      <title>Manage user | Local chef Bazar</title>
    </Helmet>
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-white">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center border-b border-gray-700">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">{user.status}</td>
                <td className="px-4 py-2">
                  {user.role !== "admin" && user.status !== "fraud" ? (
                    <button
                      onClick={() => makeFraud(user._id)}
                      className="px-4 py-1 bg-red-600 rounded hover:bg-red-700 transition"
                    >
                      Make Fraud
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-1 bg-gray-600 rounded cursor-not-allowed"
                    >
                      N/A
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
   </>
  );
};

export default ManageUsers;
