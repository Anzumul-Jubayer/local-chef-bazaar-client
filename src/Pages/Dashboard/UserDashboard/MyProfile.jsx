import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

 
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/users/${user?.email}`);
        const data = await res.json();
        if (data.success) setUserData(data.data);
        else toast.error(data.message);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user data");
      }
    };

    if (user?.email) loadUserData();
  }, [user]);

  if (!userData)
    return <p className="text-center text-white mt-20">Loading...</p>;

  const handleRequest = async (type) => {
    const requestPayload = {
      _id: userData._id,
      userName: userData.displayName || userData.name,
      userEmail: userData.email,
      requestType: type, // "chef" or "admin"
      requestStatus: "pending",
      requestTime: new Date().toISOString(),
    };

    try {
      const res = await fetch("http://localhost:3000/role-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Request for ${type} sent successfully!`);
      } else {
        toast.error(data.message || "Failed to send request.");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-neutral text-white py-12 px-4">
      <motion.div
        className="max-w-2xl mx-auto bg-neutral/80 p-8 rounded-xl shadow-2xl border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">My Profile</h2>

        <div className="flex flex-col items-center gap-4 mb-6">
          <img
            src={userData.photoURL || "/default-avatar.png"}
            alt="User"
            className="w-24 h-24 rounded-full border border-primary object-cover"
          />
          <h3 className="text-xl font-semibold">
            {userData.displayName || userData.name}
          </h3>
          <p className="text-gray-400">{userData.email}</p>
        </div>

        <div className="space-y-3 text-gray-200">
          <p>
            <span className="font-semibold">Address:</span>{" "}
            {userData.address || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Role:</span>{" "}
            {userData.role || "user"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {userData.status || "active"}
          </p>
          {userData.role === "chef" && (
            <p>
              <span className="font-semibold">Chef ID:</span> {userData.chefId}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          {userData.role !== "chef" && userData.role !== "admin" && (
            <button
              onClick={() => handleRequest("chef")}
              className="px-6 py-2 bg-primary text-neutral rounded-lg font-semibold hover:bg-[#b9932c]"
            >
              Be a Chef
            </button>
          )}

          {userData.role !== "admin" && (
            <button
              onClick={() => handleRequest("admin")}
              className="px-6 py-2 bg-yellow-600 text-neutral rounded-lg font-semibold hover:bg-yellow-700"
            >
              Be an Admin
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;
