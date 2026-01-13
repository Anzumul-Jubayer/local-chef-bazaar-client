import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthContext";
import { Helmet } from "react-helmet";
import {
  HiHeart,
  HiTrash,
  HiEye,
  HiShoppingCart,
  HiRefresh,
  HiStar,
  HiCalendar,
  HiUser,
} from "react-icons/hi";
import { useNavigate } from "react-router";
import { useLoadingState } from "../../../hooks/useLoadingState";
import { buildApiUrl } from "../../../config/api";

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const { user } = useContext(AuthContext);
  const { withLoading } = useLoadingState();
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      await withLoading(async () => {
        const res = await fetch(
          buildApiUrl(`/favorites/${user.email}`)
        );
        const data = await res.json();
        if (data.success) setFavorites(data.data);
      }, "Loading your favorite meals...");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load favorites!");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this meal from favorites?"))
      return;

    try {
      const res = await fetch(buildApiUrl(`/favorites/${id}`), {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Meal removed from favorites successfully!");
        fetchFavorites();
      } else {
        toast.error("Failed to remove meal!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove meal!");
    }
  };

  const handleViewMeal = (mealId) => {
    navigate(`/meal-details/${mealId}`);
  };

  const handleOrderMeal = (mealId) => {
    navigate(`/orders/${mealId}`);
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <HiHeart className="w-16 h-16 text-muted mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Please Log In
        </h3>
        <p className="text-muted">
          You need to be logged in to see your favorite meals.
        </p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Favorite Meals | Local Chef Bazar</title>
      </Helmet>

      <div className="dashboard-page">
        {/* Header */}
        <div className="dashboard-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="dashboard-title flex items-center gap-3">
                <HiHeart className="w-8 h-8 text-red-500" />
                My Favorite Meals
              </h1>
              <p className="dashboard-subtitle">
                Your saved collection of delicious meals
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-surface border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-muted hover:text-gray-900 dark:text-white"
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-muted hover:text-gray-900 dark:text-white"
                  }`}
                >
                  List
                </button>
              </div>
              <button
                onClick={fetchFavorites}
                className="btn btn-outline btn-sm flex items-center gap-2"
              >
                <HiRefresh className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Favorites Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <HiHeart className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Favorite Meals Yet
            </h3>
            <p className="text-muted mb-6">
              Start exploring and save your favorite meals to see them here!
            </p>
            <button
              onClick={() => navigate("/meals")}
              className="btn btn-primary"
            >
              Browse Meals
            </button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              // Grid View
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((fav) => (
                  <div
                    key={fav._id}
                    className="bg-surface rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-primary/30 group"
                  >
                    {/* Meal Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                      <HiShoppingCart className="w-12 h-12 text-primary/50" />
                      <button
                        onClick={() => handleDelete(fav._id)}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        title="Remove from favorites"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Meal Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {fav.mealName}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <HiUser className="w-4 h-4" />
                          <span>{fav.chefName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted">
                          <HiCalendar className="w-4 h-4" />
                          <span>
                            Added {new Date(fav.addedTime).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-primary">
                          ৳{fav.price}
                        </span>
                        {fav.rating && (
                          <div className="flex items-center gap-1">
                            <HiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-muted">
                              {fav.rating}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewMeal(fav.mealId)}
                          className="btn btn-outline btn-sm flex-1 flex items-center justify-center gap-2"
                        >
                          <HiEye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleOrderMeal(fav.mealId)}
                          className="btn btn-primary btn-sm flex-1 flex items-center justify-center gap-2"
                        >
                          <HiShoppingCart className="w-4 h-4" />
                          Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="bg-surface rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface-elevated">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Meal Name
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Chef
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Price
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Date Added
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-color">
                      {favorites.map((fav) => (
                        <tr
                          key={fav._id}
                          className="hover:bg-hover transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                                <HiShoppingCart className="w-6 h-6 text-primary/50" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {fav.mealName}
                                </div>
                                {fav.rating && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <HiStar className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span className="text-xs text-muted">
                                      {fav.rating}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white">
                            {fav.chefName}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-primary">
                              ৳{fav.price}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted">
                            {new Date(fav.addedTime).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleViewMeal(fav.mealId)}
                                className="p-2 hover:bg-hover rounded-lg transition-colors group"
                                title="View Meal"
                              >
                                <HiEye className="w-4 h-4 text-muted group-hover:text-primary" />
                              </button>
                              <button
                                onClick={() => handleOrderMeal(fav.mealId)}
                                className="p-2 hover:bg-hover rounded-lg transition-colors group"
                                title="Order Meal"
                              >
                                <HiShoppingCart className="w-4 h-4 text-muted group-hover:text-primary" />
                              </button>
                              <button
                                onClick={() => handleDelete(fav._id)}
                                className="p-2 hover:bg-hover rounded-lg transition-colors group"
                                title="Remove from Favorites"
                              >
                                <HiTrash className="w-4 h-4 text-muted group-hover:text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
                <div className="text-2xl font-bold text-red-500">
                  {favorites.length}
                </div>
                <div className="text-sm text-muted">Favorite Meals</div>
              </div>
              <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
                <div className="text-2xl font-bold text-primary">
                  ৳
                  {favorites
                    .reduce((sum, fav) => sum + parseFloat(fav.price || 0), 0)
                    .toFixed(2)}
                </div>
                <div className="text-sm text-muted">Total Value</div>
              </div>
              <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
                <div className="text-2xl font-bold text-green-500">
                  {new Set(favorites.map((fav) => fav.chefName)).size}
                </div>
                <div className="text-sm text-muted">Different Chefs</div>
              </div>
              <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
                <div className="text-2xl font-bold text-blue-500">
                  ৳
                  {favorites.length > 0
                    ? (
                        favorites.reduce(
                          (sum, fav) => sum + parseFloat(fav.price || 0),
                          0
                        ) / favorites.length
                      ).toFixed(2)
                    : "0.00"}
                </div>
                <div className="text-sm text-muted">Average Price</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyFavorites;
