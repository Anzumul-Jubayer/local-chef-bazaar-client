import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { buildApiUrl } from "../../../config/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import { 
  HiCollection, 
  HiPencil, 
  HiTrash, 
  HiEye, 
  HiStar, 
  HiClock, 
  HiLocationMarker,
  HiCurrencyDollar,
  HiPlus,
  HiX,
  HiCheck,
  HiSparkles,
  HiPhotograph
} from "react-icons/hi";

const MyMeals = () => {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMeal, setEditingMeal] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Fetch meals
  useEffect(() => {
    const loadMeals = async () => {
      try {
        const res = await fetch(buildApiUrl(`/meals-by-chef/${user?.email}`));
        const data = await res.json();
        if (data.success) {
          setMeals(data.data);
        } else {
          toast.error("Failed to load meals");
        }
      } catch (err) {
        toast.error("Server error");
      }
      setLoading(false);
    };
    if (user?.email) loadMeals();
  }, [user]);

  // Delete meal
  const handleDelete = async (id, mealName) => {
    const result = await Swal.fire({
      title: "Delete Meal?",
      text: `Are you sure you want to delete "${mealName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(buildApiUrl(`/meals/${id}`), {
          method: "DELETE",
        });
        const data = await res.json();

        if (data.success) {
          Swal.fire({
            title: "Deleted!",
            text: "Your meal has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
          setMeals((prev) => prev.filter((m) => m._id !== id));
        } else {
          Swal.fire("Error!", data.message || "Deletion failed", "error");
        }
      } catch (err) {
        Swal.fire("Error!", "Server error occurred", "error");
      }
    }
  };

  // Update meal
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedMeal = {
      foodName: form.foodName.value,
      price: parseFloat(form.price.value),
      rating: parseFloat(form.rating.value),
      estimatedDeliveryTime: form.estimatedDeliveryTime.value,
      ingredients: form.ingredients.value.split(",").map((i) => i.trim()),
      deliveryArea: form.deliveryArea.value,
    };

    try {
      const res = await fetch(buildApiUrl(`/meals/${editingMeal._id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMeal),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Meal updated successfully!");
        setMeals(
          meals.map((m) =>
            m._id === editingMeal._id ? { ...m, ...updatedMeal } : m
          )
        );
        setEditingMeal(null);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Meals | LocalChefBazaar</title>
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2 flex items-center space-x-3">
              <HiCollection className="w-8 h-8 text-primary" />
              <span>My Meals</span>
            </h1>
            <p className="text-muted">Manage your delicious meal offerings</p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-surface border border-gray-200 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-base-content'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-base-content'
                }`}
              >
                List
              </button>
            </div>

            <button
              onClick={() => window.location.href = '/chef-dashboard/create-meals'}
              className="dashboard-btn-primary flex items-center space-x-2 px-4 py-2 rounded-lg"
            >
              <HiPlus className="w-4 h-4" />
              <span>Add New Meal</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="card-modern p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <HiCollection className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">{meals.length}</p>
                <p className="text-sm text-muted">Total Meals</p>
              </div>
            </div>
          </div>

          <div className="card-modern p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <HiStar className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">
                  {meals.length > 0 ? (meals.reduce((sum, meal) => sum + (meal.rating || 0), 0) / meals.length).toFixed(1) : '0.0'}
                </p>
                <p className="text-sm text-muted">Avg Rating</p>
              </div>
            </div>
          </div>

          <div className="card-modern p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <HiCurrencyDollar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-base-content">
                  ৳{meals.length > 0 ? Math.round(meals.reduce((sum, meal) => sum + (meal.price || 0), 0) / meals.length) : '0'}
                </p>
                <p className="text-sm text-muted">Avg Price</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Meals Display */}
        {meals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="card-modern p-12 max-w-md mx-auto">
              <HiCollection className="w-16 h-16 text-muted mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-base-content mb-4">No Meals Yet</h3>
              <p className="text-muted mb-6">
                Start sharing your culinary creations with food lovers around you.
              </p>
              <button
                onClick={() => window.location.href = '/chef-dashboard/create-meals'}
                className="dashboard-btn-primary flex items-center space-x-2 px-6 py-3 rounded-lg mx-auto"
              >
                <HiPlus className="w-5 h-5" />
                <span>Create Your First Meal</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }
          >
            {meals.map((meal, index) => (
              <motion.div
                key={meal._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={viewMode === 'grid' ? "card-modern overflow-hidden group" : "card-modern p-6"}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={meal.image}
                        alt={meal.foodName}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => setEditingMeal(meal)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                        >
                          <HiPencil className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleDelete(meal._id, meal.foodName)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                        >
                          <HiTrash className="w-4 h-4 text-error" />
                        </button>
                      </div>

                      {/* Rating Badge */}
                      <div className="absolute top-4 left-4 flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <HiStar className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">{meal.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-base-content mb-2 line-clamp-1">
                        {meal.foodName}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-muted">
                          <HiCurrencyDollar className="w-4 h-4" />
                          <span>৳{meal.price}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted">
                          <HiClock className="w-4 h-4" />
                          <span>{meal.estimatedDeliveryTime}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted">
                          <HiLocationMarker className="w-4 h-4" />
                          <span className="line-clamp-1">{meal.deliveryArea}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted">
                          {meal.ingredients?.length || 0} ingredients
                        </span>
                        <button
                          onClick={() => setEditingMeal(meal)}
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  // List View
                  <div className="flex items-center space-x-6">
                    <img
                      src={meal.image}
                      alt={meal.foodName}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-base-content mb-1">
                        {meal.foodName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted">
                        <div className="flex items-center space-x-1">
                          <HiCurrencyDollar className="w-4 h-4" />
                          <span>৳{meal.price}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiStar className="w-4 h-4" />
                          <span>{meal.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiClock className="w-4 h-4" />
                          <span>{meal.estimatedDeliveryTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingMeal(meal)}
                        className="p-2 text-muted hover:text-primary hover:bg-hover rounded-lg transition-colors"
                      >
                        <HiPencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(meal._id, meal.foodName)}
                        className="p-2 text-muted hover:text-error hover:bg-hover rounded-lg transition-colors"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Edit Modal */}
        <AnimatePresence>
          {editingMeal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setEditingMeal(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-base-content flex items-center space-x-2">
                      <HiPencil className="w-5 h-5 text-primary" />
                      <span>Edit Meal</span>
                    </h3>
                    <button
                      onClick={() => setEditingMeal(null)}
                      className="p-2 hover:bg-hover rounded-lg transition-colors"
                    >
                      <HiX className="w-5 h-5 text-muted" />
                    </button>
                  </div>
                </div>

                <form onSubmit={handleUpdateSubmit} className="p-6 space-y-6">
                  {/* Meal Image Preview */}
                  <div className="text-center">
                    <img
                      src={editingMeal.image}
                      alt={editingMeal.foodName}
                      className="w-32 h-32 rounded-xl object-cover mx-auto border-4 border-primary/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Food Name */}
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">
                        Food Name
                      </label>
                      <input
                        type="text"
                        name="foodName"
                        defaultValue={editingMeal.foodName}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">
                        Price (৳)
                      </label>
                      <input
                        type="number"
                        name="price"
                        step="0.01"
                        defaultValue={editingMeal.price}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">
                        Rating (0-5)
                      </label>
                      <input
                        type="number"
                        name="rating"
                        step="0.1"
                        min="0"
                        max="5"
                        defaultValue={editingMeal.rating}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                      />
                    </div>

                    {/* Delivery Time */}
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">
                        Delivery Time
                      </label>
                      <input
                        type="text"
                        name="estimatedDeliveryTime"
                        defaultValue={editingMeal.estimatedDeliveryTime}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Delivery Area */}
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">
                      Delivery Area
                    </label>
                    <input
                      type="text"
                      name="deliveryArea"
                      defaultValue={editingMeal.deliveryArea}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  {/* Ingredients */}
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">
                      Ingredients (comma separated)
                    </label>
                    <textarea
                      name="ingredients"
                      rows={3}
                      defaultValue={editingMeal.ingredients?.join(", ")}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setEditingMeal(null)}
                      className="flex items-center space-x-2 px-6 py-3 border border-gray-200 rounded-lg hover:bg-hover transition-colors"
                    >
                      <HiX className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      type="submit"
                      className="dashboard-btn-primary flex items-center space-x-2 px-6 py-3 rounded-lg"
                    >
                      <HiCheck className="w-4 h-4" />
                      <span>Update Meal</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MyMeals;
