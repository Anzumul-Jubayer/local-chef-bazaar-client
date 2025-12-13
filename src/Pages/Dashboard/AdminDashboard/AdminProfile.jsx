import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const res = await fetch(
          `https://local-chef-bazaar-server-flame.vercel.app/users/${user?.email}`
        );
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
      userId: userData._id,
      userName: userData.displayName || userData.name,
      userEmail: userData.email,
      requestType: type, // "admin" or "chef"
    };

    try {
      const res = await fetch(
        "https://local-chef-bazaar-server-flame.vercel.app/role-requests",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestPayload),
        }
      );

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
    <>
      <Helmet>
        <title>Admin Profile | LocalChefBazaar</title>
      </Helmet>

      <div className="min-h-screen bg-neutral text-white py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-xl mx-auto bg-neutral/80 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700 flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-primary">
            Admin Profile
          </h2>

          {/* Profile Image & Info */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={userData.photoURL || "/default-avatar.png"}
              alt="Admin"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-primary object-cover"
            />
            <h3 className="text-xl sm:text-2xl font-semibold">
              {userData.displayName || userData.name}
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              {userData.email}
            </p>
          </div>

          {/* Details */}
          <div className="w-full space-y-2 sm:space-y-3 text-gray-200 mt-4">
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
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminProfile;
