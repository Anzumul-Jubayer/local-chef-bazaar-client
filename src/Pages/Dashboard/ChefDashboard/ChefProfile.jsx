import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { profileAPI } from "../../../services/api";
import ModernProfileForm from "../../../Components/Profile/ModernProfileForm";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { 
  HiUser, 
  HiStar, 
  HiClock,
  HiInformationCircle,
  HiChartBar,
  HiHeart,
  HiCake,
  HiTrendingUp
} from "react-icons/hi";

const ChefProfile = () => {
  const { user, updateUserData } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

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
            name: user.displayName || user.email?.split('@')[0] || 'Chef',
            email: user.email,
            photoURL: user.photoURL || '',
            address: '',
            phone: '',
            role: 'chef'
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        // Create fallback profile from Firebase user data
        setUserData({
          name: user.displayName || user.email?.split('@')[0] || 'Chef',
          email: user.email,
          photoURL: user.photoURL || '',
          address: '',
          phone: '',
          role: 'chef'
        });
        toast.error("Could not load profile data, using basic information");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleProfileUpdate = async (profileData) => {
    setUpdateLoading(true);
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
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Chef Profile | LocalChefBazaar</title>
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
          <title>Chef Profile | LocalChefBazaar</title>
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
        <title>Chef Profile | LocalChefBazaar</title>
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              Chef Profile
            </h1>
            <p className="text-base-content/60 text-lg">Manage your chef profile and showcase your culinary expertise</p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <HiCake className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Chef</span>
          </div>
        </motion.div>

        {/* Chef Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <HiStar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-base-content">Rating</h3>
              </div>
              <div className="text-3xl font-bold text-base-content mb-1">4.8</div>
              <p className="text-sm text-base-content/60">Average rating</p>
              <div className="flex items-center mt-2">
                <HiTrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-xs text-success font-medium">+0.2 this month</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <HiChartBar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-base-content">Orders</h3>
              </div>
              <div className="text-3xl font-bold text-base-content mb-1">156</div>
              <p className="text-sm text-base-content/60">Total completed</p>
              <div className="flex items-center mt-2">
                <HiTrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-xs text-success font-medium">+12 this week</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl flex items-center justify-center">
                  <HiHeart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-base-content">Meals</h3>
              </div>
              <div className="text-3xl font-bold text-base-content mb-1">24</div>
              <p className="text-sm text-base-content/60">Active dishes</p>
              <div className="flex items-center mt-2">
                <HiTrendingUp className="w-4 h-4 text-success mr-1" />
                <span className="text-xs text-success font-medium">+3 this month</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all duration-300">
            <div className="card-body">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                  <HiClock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-base-content">Experience</h3>
              </div>
              <div className="text-3xl font-bold text-base-content mb-1">{userData.experience || 2}</div>
              <p className="text-sm text-base-content/60">Years cooking</p>
              <div className="flex items-center mt-2">
                <span className="text-xs text-base-content/60">Professional chef</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chef Tips */}
        <motion.div 
          className="card bg-base-100 shadow-xl border border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="card-body">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <HiInformationCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-base-content mb-3">Chef Profile Tips</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-base-content/70">
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Add a compelling bio to attract more customers</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Specify your cooking specialty and experience level</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Upload a professional profile picture</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>Keep your contact information up to date</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>Add your website or social media links</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span>Respond quickly to customer inquiries</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ModernProfileForm
            initialData={userData}
            onSubmit={handleProfileUpdate}
            loading={updateLoading}
            userRole="chef"
          />
        </motion.div>
      </div>
    </>
  );
};

export default ChefProfile;
