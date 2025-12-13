import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DisplayReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetch(
          "https://local-chef-bazaar-server-flame.vercel.app/reviews"
        );
        const data = await res.json();

        if (data.success) {
          setReviews(data.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Error loading reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-300 py-10">Loading reviews...</p>
    );
  }

  return (
    <div
      className="py-16 px-4 bg-linear-to-b from-[#121212] via-[#1a1a1a] to-[#0d0d0d] 
    relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-60 h-60 bg-yellow-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <h2 className="text-3xl font-bold text-center text-primary mb-10">
        What Our Customers Say
      </h2>

      {reviews.length === 0 && (
        <p className="text-center text-gray-400">No reviews available.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <motion.div
            key={review._id}
            className="backdrop-blur-xl bg-neutral/40 border border-gray-700 
          p-6 rounded-xl shadow-xl hover:shadow-2xl transition"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <div className="flex items-center gap-4">
              <img
                src={review.reviewerImage}
                alt=""
                className="w-14 h-14 rounded-full object-cover border border-gray-600"
              />
              <div>
                <h4 className="font-semibold text-white text-lg">
                  {review.reviewerName}
                </h4>
                <p className="text-yellow-400">⭐ {review.rating}/5</p>
              </div>
            </div>

            <p className="mt-4 text-gray-300 leading-relaxed">
              "{review.comment}"
            </p>

            <p className="mt-3 text-sm text-gray-500">
              {new Date(review.date).toLocaleDateString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DisplayReviews;
