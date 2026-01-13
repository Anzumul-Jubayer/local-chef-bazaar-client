// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  HiStar, 
  HiChat, 
  HiArrowLeft, 
  HiArrowRight,
  HiLocationMarker
} from "react-icons/hi";
import { useState } from "react";
import fatemaImage from "../../assets/fatema.jpg";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Rashida Begum",
      role: "Food Enthusiast",
      location: "Dhaka",
      rating: 5,
      comment: "LocalChefBazaar has completely changed how I enjoy meals at home. The quality is exceptional and the variety keeps me excited for every order!",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      orderCount: 45
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      role: "Working Professional",
      location: "Chittagong",
      rating: 5,
      comment: "As someone with a busy schedule, this platform is a lifesaver. Fresh, homemade meals delivered right to my office. Absolutely love it!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      orderCount: 32
    },
    {
      id: 3,
      name: "Fatima Rahman",
      role: "Mother of Two",
      location: "Sylhet",
      rating: 5,
      comment: "The chefs here are amazing! My kids love the variety and I love knowing they're eating healthy, homemade food. Highly recommended!",
      image: fatemaImage,
      orderCount: 67
    },
    {
      id: 4,
      name: "Karim Abdullah",
      role: "Student",
      location: "Rajshahi",
      rating: 5,
      comment: "Affordable, delicious, and convenient. Perfect for students like me who want good food without breaking the bank. The app makes ordering so easy!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      orderCount: 28
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-surface-elevated">
      <div className="container-modern">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
            <span className="text-sm font-medium text-accent">Customer Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-base-content mb-6">
            What Our 
            <span className="text-accent"> Customers Say</span>
          </h2>
          
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what our satisfied customers have to say 
            about their LocalChefBazaar experience.
          </p>
        </motion.div>

        {/* Main Testimonial */}
        <motion.div
          className="max-w-4xl mx-auto mb-12"
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-modern p-8 md:p-12 text-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full translate-x-20 translate-y-20"></div>
            
            {/* Quote Icon */}
            <div className="relative mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                <HiChat className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </div>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <HiStar key={i} className="w-6 h-6 text-yellow-500" />
              ))}
            </div>

            {/* Comment */}
            <blockquote className="text-xl md:text-2xl text-base-content font-medium leading-relaxed mb-8 relative">
              "{testimonials[currentIndex].comment}"
            </blockquote>

            {/* Customer Info */}
            <div className="flex items-center justify-center space-x-4">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover border-4 border-primary/20"
              />
              <div className="text-left">
                <h4 className="text-lg font-bold text-base-content">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-muted text-sm flex items-center space-x-1">
                  <span>{testimonials[currentIndex].role}</span>
                  <HiLocationMarker className="w-3 h-3 text-primary" />
                  <span>{testimonials[currentIndex].location}</span>
                </p>
                <p className="text-primary text-sm font-medium">
                  {testimonials[currentIndex].orderCount} orders completed
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-center space-x-6 mb-12">
          <motion.button
            onClick={prevTestimonial}
            className="w-12 h-12 bg-surface hover:bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HiArrowLeft className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
          </motion.button>

          {/* Dots Indicator */}
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-primary scale-125' 
                    : 'bg-primary/30 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>

          <motion.button
            onClick={nextTestimonial}
            className="w-12 h-12 bg-surface hover:bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 hover:border-primary/40 transition-all duration-300 group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <HiArrowRight className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
          </motion.button>
        </div>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`card-modern p-6 cursor-pointer transition-all duration-300 ${
                index === currentIndex 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setCurrentIndex(index)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-base-content text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-muted text-xs">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <HiStar key={i} className="w-4 h-4 text-yellow-500" />
                ))}
              </div>
              
              <p className="text-muted text-sm line-clamp-3">
                {testimonial.comment}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold text-base-content mb-4">
              Ready to Join Our Happy Customers?
            </h3>
            <p className="text-muted mb-6 max-w-2xl mx-auto">
              Experience the joy of delicious, homemade meals delivered fresh to your door. 
              Join thousands of satisfied customers today!
            </p>
            
            <motion.a
              href="/meals"
              className="group relative inline-flex items-center justify-center bg-gradient-to-r from-primary via-yellow-400 to-accent text-black font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-2 border-primary/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Button Content */}
              <div className="relative flex items-center space-x-3 z-10">
                <span className="text-xl font-bold text-black">Order Your First Meal</span>
                <div className="flex items-center space-x-1">
                  <HiStar className="w-6 h-6 text-yellow-600 group-hover:text-black group-hover:rotate-12 transition-all duration-300" />
                  <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10"></div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
