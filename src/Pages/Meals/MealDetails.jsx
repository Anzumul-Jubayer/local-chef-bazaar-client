import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthContext";
import { buildApiUrl } from "../../config/api";
import {
  HiStar,
  HiHeart,
  HiShoppingCart,
  HiClock,
  HiLocationMarker,
  HiUser,
  HiCamera,
  HiX,
  HiChevronLeft,
  HiChatAlt,
  HiThumbUp,
  HiCalendar,
  HiSparkles,
  HiCake,
  HiCheck,
  HiShieldCheck,
  HiExclamation,
  HiArrowLeft,
} from "react-icons/hi";

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const imgbbApiKey = "f3c5a5d662d5437946e3078c7e9e3e2b";

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      try {
        const res = await fetch(buildApiUrl(`/meal-details/${id}`));
        if (!res.ok) throw new Error("Meal not found");
        const data = await res.json();
        setMeal(data);
      } catch (err) {
        console.error("Error fetching meal:", err);
        toast.error("Meal not found");
        navigate("/meals");
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [id, navigate]);

  useEffect(() => {
    const loadReviews = async () => {
      const res = await fetch(buildApiUrl(`/reviews/${id}`));
      const data = await res.json();
      if (data.success) setReviews(data.data);
    };
    loadReviews();
  }, [id]);

  // Review Submit
  const onSubmitReview = async (formData) => {
    if (!user) {
      toast.error("Please log in to submit a review!");
      navigate("/login");
      return;
    }

    setImageLoading(true);

    try {
      // Upload image to imgbb
      const imgForm = new FormData();
      imgForm.append("image", formData.reviewerImage[0]);

      const imgUploadRes = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        {
          method: "POST",
          body: imgForm,
        }
      );

      const imgUploadData = await imgUploadRes.json();
      if (!imgUploadData.success) {
        toast.error("Image upload failed!");
        return;
      }

      const imageUrl = imgUploadData.data.url;

      const newReview = {
        foodId: id,
        reviewerName: user.displayName,
        reviewerEmail: user.email,
        reviewerImage: imageUrl,
        rating: formData.rating,
        comment: formData.comment,
        date: new Date(),
      };

      const res = await fetch(buildApiUrl("/reviews"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Review submitted successfully!");
        setReviews([data.data, ...reviews]);
        setReviewModal(false);
        reset();
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review");
    } finally {
      setImageLoading(false);
    }
  };

  // Add to Favorites
  const addToFavorites = async () => {
    if (!user) {
      toast.error("Please log in to add meals to your favorites!");
      navigate("/login");
      return;
    }

    const favoriteData = {
      userEmail: user.email,
      mealId: meal._id,
      mealName: meal.foodName,
      chefId: meal.chefId,
      chefName: meal.chefName,
      price: meal.price,
      addedTime: new Date(),
    };

    const res = await fetch(buildApiUrl("/favorites"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(favoriteData),
    });

    const data = await res.json();
    if (data.success) toast.success("Added to Favorites");
    else toast.error(data.message);
  };

  // Handle Order Now
  const handleOrderNow = () => {
    if (!user) {
      toast.error("Please log in to place an order!");
      navigate("/login");
      return;
    }
    navigate(`/orders/${meal._id}`);
  };

  // Handle Write Review
  const handleWriteReview = () => {
    if (!user) {
      toast.error("Please log in to write a review!");
      navigate("/login");
      return;
    }
    setReviewModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mb-4 mx-auto"></div>
          <p className="text-muted">Loading meal details...</p>
        </div>
      </div>
    );
  }

  if (!meal) return null;

  return (
    <>
      <Helmet>
        <title>{meal.foodName} | LocalChefBazaar</title>
        <meta
          name="description"
          content={`Delicious ${meal.foodName} by Chef ${meal.chefName}. Order now for ${meal.price} BDT with delivery to ${meal.deliveryArea}.`}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="container-modern pt-8">
          <motion.button
            onClick={() => navigate("/meals")}
            className="flex items-center space-x-2 px-4 py-2 text-muted hover:text-primary transition-colors group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <HiChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Meals</span>
          </motion.button>
        </div>

        {/* Hero Section */}
        <section className="py-8">
          <div className="container-modern">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Meal Image */}
              <motion.div
                className="relative overflow-hidden rounded-2xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={meal.image}
                  alt={meal.foodName}
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full flex items-center space-x-2">
                  <HiStar className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">
                    {meal.rating}
                  </span>
                </div>

                {/* Price Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 bg-primary/90 backdrop-blur-sm rounded-full">
                  <span className="text-black font-bold text-lg">
                    {meal.price} BDT
                  </span>
                </div>
              </motion.div>

              {/* Meal Info */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <HiSparkles className="w-5 h-5 text-primary" />
                    <span className="text-primary font-medium">
                      Local Chef Special
                    </span>
                  </div>
                  <h1 className="text-4xl font-display font-bold text-base-content mb-4">
                    {meal.foodName}
                  </h1>
                  <div className="flex items-center space-x-4 text-muted">
                    <div className="flex items-center space-x-2">
                      <HiCake className="w-4 h-4" />
                      <span>by Chef {meal.chefName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HiStar className="w-4 h-4 text-yellow-400" />
                      <span>{meal.rating} rating</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="card-modern p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <HiLocationMarker className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Delivery Area</p>
                        <p className="font-semibold text-base-content">
                          {meal.deliveryArea}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card-modern p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <HiClock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Delivery Time</p>
                        <p className="font-semibold text-base-content">
                          30 minutes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card-modern p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-secondary/10 rounded-lg">
                        <HiUser className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Chef Experience</p>
                        <p className="font-semibold text-base-content">
                          {meal.chefExperience} years
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="card-modern p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <HiSparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted">Price</p>
                        <p className="font-semibold text-base-content">
                          {meal.price} BDT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="card-modern p-6">
                  <h3 className="text-lg font-semibold text-base-content mb-4">
                    Ingredients
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {meal.ingredients}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={handleOrderNow}
                    className="flex-1 group relative overflow-hidden bg-gradient-to-r from-primary to-yellow-400 text-black font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative flex items-center justify-center space-x-3">
                      <HiShoppingCart className="w-5 h-5" />
                      <span>{user ? "Order Now" : "Login to Order"}</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </motion.button>

                  <motion.button
                    onClick={addToFavorites}
                    className="group relative overflow-hidden bg-surface border-2 border-secondary/30 hover:border-secondary text-secondary hover:text-secondary font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative flex items-center justify-center space-x-3">
                      <HiHeart className="w-5 h-5" />
                      <span>{user ? "Add to Favorites" : "Login to Save"}</span>
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-16 bg-surface-elevated">
          <div className="container-modern">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Reviews Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-base-content mb-2">
                    Customer Reviews
                  </h2>
                  <p className="text-muted">
                    {reviews.length}{" "}
                    {reviews.length === 1 ? "review" : "reviews"} from our
                    community
                  </p>
                </div>

                <motion.button
                  onClick={handleWriteReview}
                  className="group relative overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 text-primary hover:text-primary font-semibold px-6 py-3 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Button Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                  {/* Button Content */}
                  <div className="relative flex items-center space-x-2">
                    <HiChatAlt className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span>{user ? "Write Review" : "Login to Review"}</span>
                    <HiSparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                  </div>

                  {/* Subtle Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-primary/10 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                </motion.button>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <HiChatAlt className="w-8 h-8 text-muted" />
                    </div>
                    <h3 className="text-lg font-semibold text-base-content mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-muted mb-6">
                      Be the first to share your experience with this meal!
                    </p>
                    <motion.button
                      onClick={handleWriteReview}
                      className="group relative overflow-hidden bg-gradient-to-r from-primary to-yellow-400 text-black font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 active:translate-y-0 min-w-[200px]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Button Background Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-yellow-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                      {/* Button Content */}
                      <div className="relative flex items-center justify-center space-x-3">
                        <HiStar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-lg">
                          {user ? "Write First Review" : "Login to Review"}
                        </span>
                        <HiSparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      </div>

                      {/* Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                      {/* Animated Border */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-primary/50 scale-100 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>

                      {/* Pulse Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-primary/10 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    </motion.button>
                  </div>
                ) : (
                  reviews.map((review, index) => (
                    <motion.div
                      key={index}
                      className="card-modern p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Review Header */}
                      <div className="flex items-start space-x-4 mb-4">
                        <img
                          src={review.reviewerImage}
                          alt={review.reviewerName}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-base-content">
                              {review.reviewerName}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <HiStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted">
                            <div className="flex items-center space-x-1">
                              <HiCalendar className="w-3 h-3" />
                              <span>
                                {new Date(review.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <HiThumbUp className="w-3 h-3" />
                              <span>Verified Purchase</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <p className="text-base-content leading-relaxed">
                        {review.comment}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Modern Review Modal */}
      <AnimatePresence>
        {reviewModal && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setReviewModal(false)}
          >
            <motion.div
              className="bg-background border border-gray-200/20 shadow-2xl rounded-3xl p-0 w-full max-w-lg max-h-[95vh] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modern Modal Header */}
              <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 p-8 border-b border-gray-200/10">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/20 rounded-2xl shadow-lg">
                      <HiStar className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-base-content mb-1">
                        Share Your Experience
                      </h3>
                      <p className="text-sm text-muted">
                        Help others discover great meals
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setReviewModal(false)}
                    className="p-3 hover:bg-surface-elevated rounded-2xl transition-all duration-300 group"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <HiX className="w-6 h-6 text-muted group-hover:text-error transition-colors" />
                  </motion.button>
                </div>
              </div>

              {/* Modern Review Form */}
              <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <form
                  onSubmit={handleSubmit(onSubmitReview)}
                  className="space-y-8"
                >
                  {/* Meal Preview Card */}
                  <div className="bg-surface-elevated rounded-2xl p-5 border border-gray-200/10">
                    <div className="flex items-center space-x-4">
                      <img
                        src={meal.image}
                        alt={meal.foodName}
                        className="w-16 h-16 object-cover rounded-xl shadow-md"
                      />
                      <div>
                        <h4 className="font-bold text-base-content line-clamp-1">
                          {meal.foodName}
                        </h4>
                        <p className="text-sm text-muted">by Chef {meal.chefName}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <HiStar className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-muted">{meal.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviewer Information */}
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-base-content mb-3">
                        <HiUser className="w-4 h-4 text-primary" />
                        <span>Your Name</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={user?.displayName || ""}
                          placeholder={user ? "" : "Please log in first"}
                          className="input-modern w-full pl-12 bg-surface-elevated border-gray-200/20 focus:border-primary/50 focus:ring-primary/20"
                          readOnly
                        />
                        <HiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                      </div>
                      {!user && (
                        <motion.p 
                          className="text-error text-sm mt-2 flex items-center space-x-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <HiExclamation className="w-4 h-4" />
                          <span>You must be logged in to submit a review</span>
                        </motion.p>
                      )}
                    </div>

                    {/* Enhanced Image Upload */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-base-content mb-3">
                        <HiCamera className="w-4 h-4 text-accent" />
                        <span>Upload Photo</span>
                        <span className="text-xs text-muted">(Optional)</span>
                      </label>
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          {...register("reviewerImage", {
                            required: "Photo is required",
                          })}
                        />
                        <div className="border-2 border-dashed border-gray-200/30 group-hover:border-primary/50 rounded-2xl p-8 text-center transition-all duration-300 bg-surface-elevated group-hover:bg-primary/5">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                              <HiCamera className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                              <p className="text-base-content font-medium">
                                Click to upload photo
                              </p>
                              <p className="text-sm text-muted">
                                PNG, JPG up to 10MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      {errors.reviewerImage && (
                        <motion.p 
                          className="text-error text-sm mt-2 flex items-center space-x-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <HiExclamation className="w-4 h-4" />
                          <span>{errors.reviewerImage.message}</span>
                        </motion.p>
                      )}
                    </div>

                    {/* Interactive Star Rating */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-base-content mb-3">
                        <HiStar className="w-4 h-4 text-yellow-400" />
                        <span>Your Rating</span>
                      </label>
                      <div className="bg-surface-elevated rounded-2xl p-6 border border-gray-200/10">
                        <select
                          className="input-modern w-full bg-background border-gray-200/20 focus:border-primary/50 focus:ring-primary/20"
                          {...register("rating", { required: "Rating is required" })}
                        >
                          <option value="">How would you rate this meal?</option>
                          <option value="5">⭐⭐⭐⭐⭐ Excellent - Absolutely amazing!</option>
                          <option value="4">⭐⭐⭐⭐ Very Good - Really enjoyed it</option>
                          <option value="3">⭐⭐⭐ Good - It was decent</option>
                          <option value="2">⭐⭐ Fair - Could be better</option>
                          <option value="1">⭐ Poor - Not satisfied</option>
                        </select>
                      </div>
                      {errors.rating && (
                        <motion.p 
                          className="text-error text-sm mt-2 flex items-center space-x-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <HiExclamation className="w-4 h-4" />
                          <span>{errors.rating.message}</span>
                        </motion.p>
                      )}
                    </div>

                    {/* Enhanced Comment Section */}
                    <div>
                      <label className="flex items-center space-x-2 text-sm font-semibold text-base-content mb-3">
                        <HiChatAlt className="w-4 h-4 text-secondary" />
                        <span>Your Review</span>
                      </label>
                      <div className="relative">
                        <textarea
                          placeholder="Share your experience with this meal... What did you love about it? How was the taste, presentation, and delivery?"
                          rows="5"
                          className="input-modern w-full resize-none bg-surface-elevated border-gray-200/20 focus:border-primary/50 focus:ring-primary/20 pl-4 pt-4"
                          {...register("comment", {
                            required: "Review comment is required",
                            minLength: {
                              value: 10,
                              message: "Please write at least 10 characters"
                            }
                          })}
                        ></textarea>
                        <div className="absolute bottom-3 right-3 text-xs text-muted">
                          <HiSparkles className="w-3 h-3 inline mr-1" />
                          Be specific and helpful
                        </div>
                      </div>
                      {errors.comment && (
                        <motion.p 
                          className="text-error text-sm mt-2 flex items-center space-x-1"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <HiExclamation className="w-4 h-4" />
                          <span>{errors.comment.message}</span>
                        </motion.p>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Modern Form Actions */}
              <div className="p-8 bg-surface-elevated border-t border-gray-200/10">
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    type="button"
                    onClick={() => setReviewModal(false)}
                    className="flex-1 px-6 py-4 bg-surface border-2 border-gray-200/20 hover:border-muted/50 text-base-content hover:text-muted font-semibold rounded-2xl transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span>Cancel</span>
                    </div>
                  </motion.button>

                  <motion.button
                    type="submit"
                    onClick={handleSubmit(onSubmitReview)}
                    disabled={imageLoading}
                    className="flex-1 group relative overflow-hidden bg-gradient-to-r from-primary via-primary to-accent text-white font-bold px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: imageLoading ? 1 : 1.02 }}
                    whileTap={{ scale: imageLoading ? 1 : 0.98 }}
                  >
                    {/* Button Background Animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Button Content */}
                    <div className="relative flex items-center justify-center space-x-2">
                      {imageLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                          <span>Publishing Review...</span>
                        </>
                      ) : (
                        <>
                          <HiCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span>Publish Review</span>
                          <HiSparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300" />
                        </>
                      )}
                    </div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </motion.button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-muted">
                  <div className="flex items-center space-x-1">
                    <HiShieldCheck className="w-3 h-3 text-accent" />
                    <span>Secure & Private</span>
                  </div>
                  <div className="w-1 h-1 bg-muted rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <HiHeart className="w-3 h-3 text-red-400" />
                    <span>Help Others Discover</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MealDetails;
