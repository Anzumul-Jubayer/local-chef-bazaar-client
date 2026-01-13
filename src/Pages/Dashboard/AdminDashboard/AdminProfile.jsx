import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { profileAPI } from "../../../services/api";
import ModernProfileForm from "../../../Components/Profile/ModernProfileForm";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { 
  HiUser, 
  HiShieldCheck, 
  HiStatusOnline,
  HiInformationCircle,
  HiClock,
  HiUserGroup,
  HiChartBar,
  HiCog,
  HiTrendingUp
} from "react-icons/hi";

const AdminProfile = () => {
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
            name: user.displayName || user.email?.split('@')[0] || 'Admin',
            email: user.email,
            photoURL: user.photoURL || '',
            address: '',
            phone: '',
            role: 'admin'
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        // Create fallback profile from Firebase user data
        setUserData({
          name: user.displayName || user.email?.split('@')[0] || 'Admin',
          email: user.email,
          photoURL: user.photoURL || '',
          address: '',
          phone: '',
          role: 'admin'
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
            photoURL: profileData.photoURL
          });
        } catch (authError) {
          console.warn('Auth context update failed, but profile was saved:', authError);
          // Don't throw here - the profile was still updated successfully
        }
        
        return result;
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      
      // Provide more specific error messages
      if (error.message.includes('getIdToken')) {
        throw new Error("Authentication error. Please refresh the page and try again.");
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error("Network error. Please check your connection and try again.");
      } else {
        throw error;
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Admin Profile | LocalChefBazaar</title>
        </Helmet>
        <div className="animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl animate-pulse">
              <div className="card-body">
                <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                  <div className="w-32 h-32 bg-base-300 rounded-full"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-base-300 rounded w-48"></div>
                    <div className="h-4 bg-base-300 rounded w-64"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-base-300 rounded w-32"></div>
                      <div className="h-4 bg-base-300 rounded w-40"></div>
                    </div>
                  </div>
                </div>
              </div>
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
          <title>Admin Profile | LocalChefBazaar</title>
        </Helmet>
        <div className="animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <HiUser className="w-16 h-16 text-base-content/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-base-content mb-2">Profile Not Found</h3>
                <p className="text-base-content/70">Unable to load profile information.</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Profile | LocalChefBazaar</title>
      </Helmet>

      <div className="animate-fade-in space-y-8">
        {/* Page Header */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Admin Profile
            </h1>
            <p className="text-base-content/60 text-lg">Manage your admin account information and settings</p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
            <HiShieldCheck className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">Administrator</span>
          </div>
        </motion.div>

        {/* Admin Info Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <HiShieldCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-base-content">Admin Privileges</h3>
              </div>
              <ul className="space-y-3 text-sm text-base-content/70">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Manage all users</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Handle role requests</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>View platform statistics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>System administration</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <HiStatusOnline className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-base-content">Account Security</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Two-Factor Auth:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 dark:text-green-400 font-medium">Enabled</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Last Login:</span>
                  <span className="text-base-content font-medium">Today</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Password:</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 dark:text-green-400 font-medium">Strong</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <HiChartBar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-base-content">Activity Stats</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Member Since:</span>
                  <span className="text-base-content font-medium">2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Actions Today:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-base-content font-medium">12</span>
                    <HiTrendingUp className="w-3 h-3 text-green-500" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/70">Total Sessions:</span>
                  <span className="text-base-content font-medium">156</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Admin Responsibilities */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <HiUserGroup className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-base-content">User Management</h4>
              </div>
              <ul className="space-y-2 text-sm text-base-content/70">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Review and approve chef applications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Manage user roles and permissions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Handle user reports and disputes</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <HiCog className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-base-content">System Administration</h4>
              </div>
              <ul className="space-y-2 text-sm text-base-content/70">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span>Monitor platform performance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span>Manage system configurations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  <span>Oversee security protocols</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div 
          className="card bg-base-100 shadow-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="card-body">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <HiInformationCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-base-content mb-3">Security Notice</h4>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  As an admin, your account has elevated privileges. Please ensure your password is strong 
                  and enable two-factor authentication for additional security. Any changes to your profile 
                  will be logged for security purposes. Always follow security best practices and report 
                  any suspicious activity immediately.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ModernProfileForm
            initialData={userData}
            onSubmit={handleProfileUpdate}
            loading={updating}
            userRole="admin"
          />
        </motion.div>
      </div>
    </>
  );
};

export default AdminProfile;
