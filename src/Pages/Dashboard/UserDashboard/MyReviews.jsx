import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthContext";
import { buildApiUrl } from "../../../config/api";
import {
  HiStar,
  HiPencil,
  HiTrash,
  HiX,
  HiCheck,
  HiRefresh,
  HiChatAlt2,
  HiCalendar,
} from "react-icons/hi";
import { useLoadingState } from "../../../hooks/useLoadingState";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ rating: "", comment: "" });
  const { user } = useContext(AuthContext);
  const { withLoading } = useLoadingState();

  const fetchReviews = async () => {
    if (!user?.email) return;

    try {
      await withLoading(async () => {
        const res = await fetch(buildApiUrl(`/reviews/user/${user.email}`));
        const data = await res.json();
        if (data.success) setReviews(data.data);
      }, "Loading your reviews...");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(buildApiUrl(`/reviews/${id}`), {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review deleted successfully!");
        fetchReviews();
      } else {
        toast.error("Failed to delete review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review");
    }
  };

  const startEdit = (review) => {
    setEditingReview(review._id);
    setEditForm({
      rating: review.rating,
      comment: review.comment,
    });
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditForm({ rating: "", comment: "" });
  };

  const handleUpdate = async (reviewId) => {
    try {
      const res = await fetch(buildApiUrl(`/reviews/${reviewId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: parseInt(editForm.rating),
          comment: editForm.comment,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Review updated successfully!");
        fetchReviews();
        cancelEdit();
      } else {
        toast.error("Failed to update review");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update review");
    }
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() =>
              interactive && onRatingChange && onRatingChange(star)
            }
            className={`${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            } transition-transform`}
            disabled={!interactive}
          >
            <HiStar
              className={`w-5 h-5 ${
                star <= rating
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="dashboard-title flex items-center gap-3">
              <HiChatAlt2 className="w-8 h-8 text-primary" />
              My Reviews
            </h1>
            <p className="dashboard-subtitle">
              Manage your meal reviews and ratings
            </p>
          </div>
          <button
            onClick={fetchReviews}
            className="btn btn-outline btn-sm flex items-center gap-2 self-start sm:self-auto"
          >
            <HiRefresh className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Reviews Content */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <HiChatAlt2 className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-muted mb-6">
            Start reviewing meals you've ordered to help other customers!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-surface rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              {editingReview === review._id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Edit Review for {review.mealName}
                    </h3>
                    <button
                      onClick={cancelEdit}
                      className="p-2 hover:bg-hover rounded-lg transition-colors"
                    >
                      <HiX className="w-5 h-5 text-muted" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Rating
                    </label>
                    {renderStars(editForm.rating, true, (rating) =>
                      setEditForm((prev) => ({ ...prev, rating }))
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Comment
                    </label>
                    <textarea
                      value={editForm.comment}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      placeholder="Share your experience with this meal..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdate(review._id)}
                      className="btn btn-primary btn-sm flex items-center gap-2"
                    >
                      <HiCheck className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="btn btn-outline btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {review.mealName}
                      </h3>
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(review)}
                        className="p-2 hover:bg-hover rounded-lg transition-colors group"
                        title="Edit Review"
                      >
                        <HiPencil className="w-4 h-4 text-muted group-hover:text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 hover:bg-hover rounded-lg transition-colors group"
                        title="Delete Review"
                      >
                        <HiTrash className="w-4 h-4 text-muted group-hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  {review.comment && (
                    <div className="mb-4">
                      <p className="text-gray-900 dark:text-white leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted">
                    <div className="flex items-center gap-1">
                      <HiCalendar className="w-4 h-4" />
                      <span>
                        {new Date(
                          review.date || review.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {review.updatedAt &&
                      review.updatedAt !== review.createdAt && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Edited
                        </span>
                      )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {reviews.length > 0 && (
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-primary">
              {reviews.length}
            </div>
            <div className="text-sm text-muted">Total Reviews</div>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-yellow-500">
              {(
                reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviews.length
              ).toFixed(1)}
            </div>
            <div className="text-sm text-muted">Average Rating</div>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-green-500">
              {reviews.filter((r) => r.rating >= 4).length}
            </div>
            <div className="text-sm text-muted">4+ Star Reviews</div>
          </div>
          <div className="bg-surface rounded-lg p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-blue-500">
              {reviews.filter((r) => r.comment && r.comment.length > 0).length}
            </div>
            <div className="text-sm text-muted">With Comments</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
