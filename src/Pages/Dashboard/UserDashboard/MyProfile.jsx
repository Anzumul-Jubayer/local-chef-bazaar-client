import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { 
  HiUser, 
  HiMail, 
  HiLocationMarker, 
  HiShieldCheck, 
  HiStar,
  HiCake,
  HiUserGroup,
  HiSparkles,
  HiCheck
} from "react-icons/hi";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) loadUserData();
  }, [user]);

  const handleRequest = async (type) => {
    const requestPayload = {
      userId: userData._id,
      userName: userData.displayName || userData.name,
      userEmail: userData.email,
      requestType: type,
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

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <div className="card-modern p-6 animate-pulse">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 bg-base-300 rounded-full"></div>
                <div className="space-y-2 text-center">
                  <div className="h-6 bg-base-300 rounded w-32"></div>
                  <div className="h-4 bg-base-300 rounded w-48"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Details Skeleton */}
          <div className="lg:col-span-2">
            <div className="card-modern p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-base-300 rounded w-48"></div>
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-base-300 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiUser className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-lg font-semibold text-base-content mb-2">Profile not found</h3>
        <p className="text-muted">Unable to load your profile information.</p>
      </div>
    );
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'chef': return HiCake;
      case 'admin': return HiShieldCheck;
      default: return HiUser;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'chef': return 'bg-accent/10 text-accent border-accent/20';
      case 'admin': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const profileStats = [
    { label: 'Member Since', value: '2024', icon: HiStar },
    { label: 'Orders Placed', value: '12', icon: HiUser },
    { label: 'Reviews Given', value: '8', icon: HiStar },
  ];

  return (
    <>
      <Helmet>
        <title>My Profile | LocalChefBazaar</title>
      </Helmet>

      <div className="animate-fade-in-up space-y-8">
        
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-base-content">My Profile</h1>
            <p className="text-muted mt-1">Manage your account information and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="card-elevated p-6 text-center space-y-6">
              
              {/* Avatar */}
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20 mx-auto">
                  {userData.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                      <HiUser className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-success rounded-full border-4 border-surface flex items-center justify-center">
                  <HiShieldCheck className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-base-content">
                  {userData.displayName || userData.name}
                </h2>
                <p className="text-muted">{userData.email}</p>
                
                {/* Role Badge */}
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium">
                  <div className={`p-1 rounded-full ${getRoleBadgeColor(userData.role)}`}>
                    {React.createElement(getRoleIcon(userData.role), { className: "w-3 h-3" })}
                  </div>
                  <span className="capitalize">{userData.role || 'User'}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-color">
                {profileStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-bold text-primary">{stat.value}</div>
                    <div className="text-xs text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Profile Details */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            
            {/* Personal Information */}
            <div className="card-modern p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <HiUser className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-base-content">Personal Information</h3>
                  <p className="text-sm text-muted">Your account details and contact information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-surface-elevated rounded-lg">
                    <HiMail className="w-5 h-5 text-muted" />
                    <div>
                      <div className="text-sm font-medium text-base-content">Email</div>
                      <div className="text-sm text-muted">{userData.email}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-surface-elevated rounded-lg">
                    <HiLocationMarker className="w-5 h-5 text-muted" />
                    <div>
                      <div className="text-sm font-medium text-base-content">Address</div>
                      <div className="text-sm text-muted">{userData.address || "Not provided"}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-surface-elevated rounded-lg">
                    <HiShieldCheck className="w-5 h-5 text-muted" />
                    <div>
                      <div className="text-sm font-medium text-base-content">Account Status</div>
                      <div className="text-sm">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          userData.status === 'active' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {userData.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {userData.role === "chef" && userData.chefId && (
                    <div className="flex items-center space-x-3 p-3 bg-surface-elevated rounded-lg">
                      <HiCake className="w-5 h-5 text-muted" />
                      <div>
                        <div className="text-sm font-medium text-base-content">Chef ID</div>
                        <div className="text-sm text-muted font-mono">{userData.chefId}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Role Upgrade Section */}
            {(userData.role !== "chef" || userData.role !== "admin") && (
              <div className="card-modern p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <HiSparkles className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-base-content">Upgrade Your Account</h3>
                    <p className="text-sm text-muted">Unlock additional features and capabilities</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.role !== "chef" && (
                    <div className="p-4 border border-accent/20 rounded-lg bg-accent/5">
                      <div className="flex items-center space-x-3 mb-3">
                        <HiCake className="w-6 h-6 text-accent" />
                        <div>
                          <h4 className="font-semibold text-base-content">Become a Chef</h4>
                          <p className="text-sm text-muted">Start selling your homemade meals</p>
                        </div>
                      </div>
                      <ul className="text-sm text-muted space-y-2 mb-4">
                        <li className="flex items-center space-x-2">
                          <HiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Create and manage meal listings</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <HiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Receive orders from customers</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <HiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>Build your culinary reputation</span>
                        </li>
                      </ul>
                      <button
                        onClick={() => handleRequest("chef")}
                        className="w-full btn-accent-modern"
                      >
                        Request Chef Access
                      </button>
                    </div>
                  )}

                  {userData.role !== "admin" && (
                    <div className="p-4 border border-secondary/20 rounded-lg bg-secondary/5">
                      <div className="flex items-center space-x-3 mb-3">
                        <HiUserGroup className="w-6 h-6 text-secondary" />
                        <div>
                          <h4 className="font-semibold text-base-content">Become an Admin</h4>
                          <p className="text-sm text-muted">Help manage the platform</p>
                        </div>
                      </div>
                      <ul className="text-sm text-muted space-y-2 mb-4">
                        <li className="flex items-center space-x-2">
                          <HiCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span>Manage user accounts</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <HiCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span>Review chef applications</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <HiCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <span>Monitor platform activity</span>
                        </li>
                      </ul>
                      <button
                        onClick={() => handleRequest("admin")}
                        className="w-full btn-danger-modern"
                      >
                        Request Admin Access
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MyProfile;
