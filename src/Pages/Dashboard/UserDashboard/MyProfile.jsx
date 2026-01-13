import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { profileAPI } from "../../../services/api";
import ModernProfileForm from "../../../Components/Profile/ModernProfileForm";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  HiUser,
  HiSparkles,
  HiCake,
  HiUserGroup,
  HiCheck,
  HiStar,
} from "react-icons/hi";
import { buildApiUrl } from "../../../config/api";

const MyProfile = () => {
  const { user, updateUserData } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const data = await profileAPI.getProfile(user.email);
        if (data.success) {
          setUserData(data.data);
        } else {
          console.warn("Profile load warning:", data.message);
          // If profile not found, create a basic profile from user data
          setUserData({
            name: user.displayName || user.email?.split("@")[0] || "User",
            email: user.email,
            photoURL: user.photoURL || "",
            address: "",
            phone: "",
            role: "user",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        // Create fallback profile from Firebase user data
        setUserData({
          name: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          photoURL: user.photoURL || "",
          address: "",
          phone: "",
          role: "user",
        });
        toast.error("Could not load profile data, using basic information");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleProfileUpdate = async (profileData) => {
    setUpdating(true);
    try {
      const result = await profileAPI.updateProfile(user.email, profileData);

      if (result.success) {
        setUserData(result.data);

        // Update AuthContext to reflect changes in navbar immediately
        try {
          await updateUserData({
            name: profileData.name,
            photoURL: profileData.photoURL,
          });
        } catch (authError) {
          console.warn(
            "Auth context update failed, but profile was saved:",
            authError
          );
          // Don't throw here - the profile was still updated successfully
        }

        return result;
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);

      // Provide more specific error messages
      if (error.message.includes("getIdToken")) {
        throw new Error(
          "Authentication error. Please refresh the page and try again."
        );
      } else if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        throw new Error(
          "Network error. Please check your connection and try again."
        );
      } else {
        throw error;
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleRoleRequest = async (type) => {
    const requestPayload = {
      userId: userData._id,
      userName: userData.displayName || userData.name,
      userEmail: userData.email,
      requestType: type,
    };

    try {
      const res = await fetch(buildApiUrl("/role-requests"), {
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

  if (loading) {
    return (
      <>
        <Helmet>
          <title>My Profile | LocalChefBazaar</title>
        </Helmet>
        <div className="animate-fade-in">
          <div className="space-y-8">
            <div className="animate-pulse">
              <div className="h-8 bg-base-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-base-300 rounded w-64"></div>
            </div>

            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="card bg-base-100 shadow-xl animate-pulse"
                >
                  <div className="card-body">
                    <div className="h-6 bg-base-300 rounded w-32 mb-4"></div>
                    <div className="space-y-4">
                      {[...Array(2)].map((_, j) => (
                        <div key={j} className="h-12 bg-base-300 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <Helmet>
          <title>My Profile | LocalChefBazaar</title>
        </Helmet>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiUser className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-lg font-semibold text-base-content mb-2">
            Profile not found
          </h3>
          <p className="text-base-content/60">
            Unable to load your profile information.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | LocalChefBazaar</title>
      </Helmet>

      <div className="animate-fade-in-up space-y-8">
        {/* Page Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-base-content/60 mt-2 text-lg">
              Manage your account information and preferences
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <HiStar className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Member
            </span>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ModernProfileForm
            initialData={userData}
            onSubmit={handleProfileUpdate}
            loading={updating}
            userRole="user"
          />
        </motion.div>

        {/* Role Upgrade Section */}
        {userData.role !== "chef" && userData.role !== "admin" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="card bg-base-100 shadow-xl border border-base-200">
              <div className="card-body">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-base-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <HiSparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-base-content">
                      Upgrade Your Account
                    </h3>
                    <p className="text-sm text-base-content/60">
                      Unlock additional features and capabilities
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div
                    className="p-6 border-2 border-orange-200 dark:border-orange-800 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                        <HiCake className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-base-content">
                          Become a Chef
                        </h4>
                        <p className="text-sm text-base-content/60">
                          Start selling your homemade meals
                        </p>
                      </div>
                    </div>
                    <ul className="text-sm text-base-content/70 space-y-3 mb-6">
                      <li className="flex items-center space-x-3">
                        <HiCheck className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>Create and manage meal listings</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <HiCheck className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>Receive orders from customers</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <HiCheck className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        <span>Build your culinary reputation</span>
                      </li>
                    </ul>
                    <button
                      onClick={() => handleRoleRequest("chef")}
                      className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Request Chef Access
                    </button>
                  </motion.div>

                  <motion.div
                    className="p-6 border-2 border-red-200 dark:border-red-800 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 hover:shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <HiUserGroup className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-base-content">
                          Become an Admin
                        </h4>
                        <p className="text-sm text-base-content/60">
                          Help manage the platform
                        </p>
                      </div>
                    </div>
                    <ul className="text-sm text-base-content/70 space-y-3 mb-6">
                      <li className="flex items-center space-x-3">
                        <HiCheck className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>Manage user accounts</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <HiCheck className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>Review chef applications</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <HiCheck className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>Monitor platform activity</span>
                      </li>
                    </ul>
                    <button
                      onClick={() => handleRoleRequest("admin")}
                      className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      Request Admin Access
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default MyProfile;
