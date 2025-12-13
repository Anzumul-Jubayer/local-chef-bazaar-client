import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../Context/AuthContext";
import { useContext } from "react";
// ধরলাম তুমি auth hook আছে

const MealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // logged-in user

  const [meal, setMeal] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(false);

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
      } catch (error) {
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
      toast.success("Review submitted!");
      setReviews([data.data, ...reviews]);
      setReviewModal(false);
      reset();
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

  if (loading)
    return (
      <p className="text-center text-white mt-20">Loading meal details...</p>
    );
  if (!meal) return null;

  return (
    <>
      <Helmet>
        <title>{meal.foodName} | LocalChefBazaar</title>
      </Helmet>

      <div className="py-12 px-4 bg-neutral min-h-screen">
        <motion.div
          className="max-w-4xl mx-auto bg-neutral/90 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={meal.image}
            alt={meal.foodName}
            className="w-full h-80 object-cover"
          />

          <div className="p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">{meal.foodName}</h2>
            <p className="mb-2">Chef: {meal.chefName}</p>
            <p className="mb-2">Price: {meal.price} BDT</p>
            <p className="mb-2">Rating: {meal.rating} ⭐</p>
            <p className="mb-2">Ingredients: {meal.ingredients}</p>
            <p className="mb-2">Estimated Delivery Time: 30 mins</p>
            <p className="mb-2">
              Chef's Experience: {meal.chefExperience} years
            </p>
            <p className="mb-2">Delivery Area: {meal.deliveryArea}</p>

            <div className="flex gap-3 mt-4">
              <button
                className="w-full py-3 bg-primary text-neutral rounded-lg font-semibold hover:bg-[#b9932c]"
                onClick={() => navigate(`/orders/${meal._id}`)}
              >
                Order Now
              </button>

              <button
                className="w-full py-3 bg-yellow-600 text-neutral rounded-lg font-semibold hover:bg-yellow-700"
                onClick={addToFavorites}
              >
                Favorite
              </button>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto mt-10 text-white">
          <h3 className="text-2xl font-bold mb-3">Reviews</h3>

          <button
            className="px-5 py-2 bg-primary text-neutral rounded-lg hover:bg-[#b9932c]"
            onClick={() => setReviewModal(true)}
          >
            Give Review
          </button>

          <div className="mt-5 space-y-4">
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              reviews.map((review, index) => (
                <motion.div
                  key={index}
                  className="bg-neutral/80 p-4 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={review.reviewerImage}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold">{review.reviewerName}</p>
                      <p className="text-yellow-400">{review.rating} ⭐</p>
                    </div>
                  </div>

                  <p className="mt-2 text-gray-300">{review.comment}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(review.date).toLocaleString()}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {reviewModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.form
              onSubmit={handleSubmit(onSubmitReview)}
              className="bg-neutral p-6 rounded-xl w-96 text-white"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              {/* Reviewer Name */}
              <input
                type="text"
                {...register("reviewerName")}
                value={user?.displayName || ""}
                className="input input-bordered w-full mb-3 text-black"
                readOnly
              />

              {/* Image Upload */}
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full mb-3 text-black"
                {...register("reviewerImage", { required: true })}
              />
              {errors.reviewerImage && (
                <span className="text-red-500 text-sm">Image is required</span>
              )}

              {/* Rating */}

              <input
                type="number"
                placeholder="Rating (1–5)"
                className="input input-bordered w-full mb-3 text-black"
                min="1"
                max="5"
                {...register("rating", { required: true, min: 1, max: 5 })}
              />
              {errors.rating && (
                <span className="text-red-500 text-sm">
                  Valid rating is required
                </span>
              )}

              {/* Comment */}
              <textarea
                placeholder="Write comment..."
                className="textarea textarea-bordered w-full mb-3 text-black"
                {...register("comment", { required: true })}
              ></textarea>
              {errors.comment && (
                <span className="text-red-500 text-sm">
                  Comment is required
                </span>
              )}

              <div className="flex justify-end gap-3">
                <button className="px-4 py-2 bg-primary rounded-lg">
                  Submit
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-500 rounded-lg"
                  onClick={() => setReviewModal(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MealDetails;
