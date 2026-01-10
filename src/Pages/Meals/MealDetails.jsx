import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthContext";
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
  HiCake
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
        const res = await fetch(
          `https://local-chef-bazaar-server-flame.vercel.app/meal-details/${id}`
        );
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
      const res = await fetch(
        `https://local-chef-bazaar-server-flame.vercel.app/reviews/${id}`
      );
      const data = await res.json();
      if (data.success) setReviews(data.data);
    };
    loadReviews();
  }, [id]);

  // Review Submit
  const onSubmitReview = async (formData) => {
    if (!user) return toast.error("You must be logged in to review!");

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

      const res = await fetch(
        "https://local-chef-bazaar-server-flame.vercel.app/reviews",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview),
        }
      );

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
    if (!user) return toast.error("You must be logged in to add favorites!");

    const favoriteData = {
      userEmail: user.email,
      mealId: meal._id,
      mealName: meal.foodName,
      chefId: meal.chefId,
      chefName: meal.chefName,
      price: meal.price,
      addedTime: new Date(),
    };

    const res = await fetch(
      "https://local-chef-bazaar-server-flame.vercel.app/favorites",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favoriteData),
      }
    );

    const data = await res.json();
    if (data.success) toast.success("Added to Favorites");
    else toast.error(data.message);
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
        <meta name="description" content={`Delicious ${meal.foodName} by Chef ${meal.chefName}. Order now for ${meal.price} BDT with delivery to ${meal.deliveryArea}.`} />
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
                  <span className="text-white font-semibold">{meal.rating}</span>
                </div>

                {/* Price Badge */}
                <div className="absolute top-6 right-6 px-4 py-2 bg-primary/90 backdrop-blur-sm rounded-full">
                  <span className="text-black font-bold text-lg">{meal.price} BDT</span>
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
                    <span className="text-primary font-medium">Local Chef Special</span>
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
                        <p className="font-semibold text-base-content">{meal.deliveryArea}</p>
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
                        <p className="font-semibold text-base-content">30 minutes</p>
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
                        <p className="font-semibold text-base-content">{meal.chefExperience} years</p>
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
                        <p className="font-semibold text-base-content">{meal.price} BDT</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="card-modern p-6">
                  <h3 className="text-lg font-semibold text-base-content mb-4">Ingredients</h3>
                  <p className="text-muted leading-relaxed">{meal.ingredients}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={() => navigate(`/orders/${meal._id}`)}
                    className="flex-1 group relative overflow-hidden bg-gradient-to-r from-primary to-yellow-400 text-black font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="relative flex items-center justify-center space-x-3">
                      <HiShoppingCart className="w-5 h-5" />
                      <span>Order Now</span>
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
                      <span>Add to Favorites</span>
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
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} from our community
                  </p>
                </div>
                
                <motion.button
                  onClick={() => setReviewModal(true)}
                  className="group relative overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 text-primary hover:text-primary font-semibold px-6 py-3 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Button Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  
                  {/* Button Content */}
                  <div className="relative flex items-center space-x-2">
                    <HiChatAlt className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    <span>Write Review</span>
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
                    <h3 className="text-lg font-semibold text-base-content mb-2">No reviews yet</h3>
                    <p className="text-muted mb-6">Be the first to share your experience with this meal!</p>
                    <motion.button
                      onClick={() => setReviewModal(true)}
                      className="group relative overflow-hidden bg-gradient-to-r from-primary to-yellow-400 text-black font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 active:translate-y-0 min-w-[200px]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Button Background Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-yellow-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                      
                      {/* Button Content */}
                      <div className="relative flex items-center justify-center space-x-3">
                        <HiStar className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-lg">Write First Review</span>
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
                            <h4 className="font-semibold text-base-content">{review.reviewerName}</h4>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <HiStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted">
                            <div className="flex items-center space-x-1">
                              <HiCalendar className="w-3 h-3" />
                              <span>{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <HiThumbUp className="w-3 h-3" />
                              <span>Verified Purchase</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Review Content */}
                      <p className="text-base-content leading-relaxed">{review.comment}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-surface card-modern p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-base-content">Write a Review</h3>
                <button
                  onClick={() => setReviewModal(false)}
                  className="p-2 hover:bg-hover rounded-lg transition-colors"
                >
                  <HiX className="w-5 h-5 text-muted" />
                </button>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-6">
                {/* Reviewer Name */}
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={user?.displayName || ""}
                    className="input-modern w-full"
                    readOnly
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Upload Photo
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="input-modern w-full pt-3"
                      {...register("reviewerImage", { required: "Photo is required" })}
                    />
                    <HiCamera className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  </div>
                  {errors.reviewerImage && (
                    <p className="text-error text-sm mt-1">{errors.reviewerImage.message}</p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Rating
                  </label>
                  <select
                    className="input-modern w-full"
                    {...register("rating", { required: "Rating is required" })}
                  >
                    <option value="">Select rating</option>
                    <option value="5">5 Stars - Excellent</option>
                    <option value="4">4 Stars - Very Good</option>
                    <option value="3">3 Stars - Good</option>
                    <option value="2">2 Stars - Fair</option>
                    <option value="1">1 Star - Poor</option>
                  </select>
                  {errors.rating && (
                    <p className="text-error text-sm mt-1">{errors.rating.message}</p>
                  )}
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-base-content mb-2">
                    Your Review
                  </label>
                  <textarea
                    placeholder="Share your experience with this meal..."
                    rows="4"
                    className="input-modern w-full resize-none"
                    {...register("comment", { required: "Review comment is required" })}
                  ></textarea>
                  {errors.comment && (
                    <p className="text-error text-sm mt-1">{errors.comment.message}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 pt-4">
                  <motion.button
                    type="submit"
                    disabled={imageLoading}
                    className="flex-1 btn-primary-modern disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: imageLoading ? 1 : 1.02 }}
                    whileTap={{ scale: imageLoading ? 1 : 0.98 }}
                  >
                    {imageLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      "Submit Review"
                    )}
                  </motion.button>
                  
                  <button
                    type="button"
                    onClick={() => setReviewModal(false)}
                    className="px-6 py-3 bg-surface border border-color hover:bg-hover text-base-content rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MealDetails;
