import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { HiStar, HiUser, HiChat, HiTruck, HiUserGroup } from "react-icons/hi";
import { useLoadingState } from "../../hooks/useLoadingState";
import { buildApiUrl } from "../../config/api";

const DisplayReviews = () => {
  const [reviews, setReviews] = useState([]);
  const { fetchWithLoading } = useLoadingState();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchWithLoading(
          buildApiUrl("/reviews"),
          {},
          "Loading customer reviews..."
        );

        if (data.success) {
          setReviews(data.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Error loading reviews:", error);
      }
    };

    loadReviews();
  }, [fetchWithLoading]);

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-modern">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full text-primary font-medium mb-6">
            <HiChat className="w-4 h-4" />
            <span>Authentic Stories, Genuine Satisfaction</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-display font-bold text-base-content mb-6 leading-tight">
            Taste the Love in Every
            <span className="block text-primary mt-2"> Customer Review</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted max-w-4xl mx-auto leading-relaxed">
            Experience the warmth of homemade cooking through the eyes of our delighted customers. 
            Every meal tells a story, every review shares a moment of pure culinary joy that brings 
            <span className="text-primary font-semibold"> families and flavors together</span>.
          </p>
        </motion.div>

        {/* Reviews Grid */}
        {reviews.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 max-w-2xl mx-auto border border-primary/20">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiChat className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-base-content mb-4">
                Be the First to Share Your Experience!
              </h3>
              <p className="text-lg text-muted mb-6 leading-relaxed">
                We're excited to hear from our first customers. Your feedback helps us serve you better 
                and guides others in discovering amazing homemade meals.
              </p>
              <motion.a
                href="/meals"
                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-primary via-yellow-400 to-accent text-black font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-2 border-primary/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button Content */}
                <div className="relative flex items-center space-x-2 z-10">
                  <span className="text-black font-bold">Order Your First Meal</span>
                  <HiStar className="w-5 h-5 text-yellow-600 group-hover:rotate-12 group-hover:text-black transition-all duration-300" />
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </motion.a>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                className="card-modern p-6 group hover:shadow-xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {/* Review Header */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    {review.reviewerImage ? (
                      <img
                        src={review.reviewerImage}
                        alt={review.reviewerName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <HiUser className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base-content truncate">
                      {review.reviewerName}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <HiStar
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'text-yellow-500 fill-current dark:text-yellow-400' 
                                : 'text-base-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <blockquote className="text-muted leading-relaxed mb-4 italic">
                  "{review.comment}"
                </blockquote>

                {/* Review Footer */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">
                    {new Date(review.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  
                  <div className="flex items-center space-x-1 text-primary">
                    <HiStar className="w-3 h-3" />
                    <span className="font-medium">Verified</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        {reviews.length > 0 && (
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-3xl p-10 md:p-12 border border-primary/10 shadow-xl max-w-4xl mx-auto">
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl md:text-4xl font-display font-bold text-base-content mb-4">
                  Ready to Create Your Own 
                  <span className="text-primary"> Success Story?</span>
                </h3>
                <p className="text-xl text-muted mb-2 max-w-2xl mx-auto leading-relaxed">
                  Join our community of food lovers and discover why LocalChefBazaar is the 
                  <span className="text-accent font-semibold"> #1 choice</span> for authentic homemade meals
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
                  <div className="flex items-center space-x-2">
                    <HiStar className="w-4 h-4 text-yellow-500" />
                    <span>Over 10,000 happy customers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiTruck className="w-4 h-4 text-blue-500" />
                    <span>Fast delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HiUserGroup className="w-4 h-4 text-green-500" />
                    <span>Verified chefs</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.a 
                href="/meals" 
                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-primary via-yellow-400 to-accent text-black font-bold px-14 py-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 overflow-hidden min-w-[260px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Pulsing Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
                
                {/* Button Content */}
                <div className="relative flex items-center space-x-4 z-10">
                  <span className="text-xl font-bold">Explore Delicious Meals</span>
                  <div className="flex items-center space-x-2">
                    <HiStar className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                      <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
                    </div>
                  </div>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Border Animation */}
                <div className="absolute inset-0 rounded-2xl border-4 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"></div>
              </motion.a>
              
              {/* Trust Indicators */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-muted"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free delivery on orders over ৳200</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>30-45 min delivery time</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>100% satisfaction guarantee</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DisplayReviews;
