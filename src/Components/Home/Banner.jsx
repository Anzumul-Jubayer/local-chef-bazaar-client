import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowRight, HiStar, HiUsers, HiTruck, HiChevronLeft, HiChevronRight, HiPlay } from "react-icons/hi";
import heroImage from "../../assets/hero-chef.jpg";
import homemadeImage from "../../assets/homemade.jpg";
import freshImage from "../../assets/fresh.avif";
import useSmoothScroll from "../../hooks/useSmoothScroll";

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { scrollToNextSection } = useSmoothScroll();

  const slides = [
    {
      title: "Taste the Homemade Magic",
      subtitle: "Connect with talented local chefs and enjoy fresh, authentic homemade meals delivered right to your doorstep.",
      cta: "Explore Meals",
      ctaLink: "/meals",
      badge: "Rated #1 Local Food Platform",
      image: homemadeImage,
      stats: { customers: "10K+", rating: "4.9", deliveries: "500+" }
    },
    {
      title: "Fresh Daily Ingredients",
      subtitle: "Our chefs use only the finest, locally-sourced ingredients to create meals that taste like home.",
      cta: "View Chefs",
      ctaLink: "/meals",
      badge: "100% Fresh & Organic",
      image: freshImage,
      stats: { customers: "15K+", rating: "4.8", deliveries: "750+" }
    },
    {
      title: "Become a Local Chef",
      subtitle: "Share your culinary passion with the community. Join our platform and start earning from your cooking skills.",
      cta: "Join as Chef",
      ctaLink: "/register",
      badge: "Earn from Your Passion",
      image: heroImage,
      stats: { customers: "500+", rating: "4.9", deliveries: "200+" }
    }
  ];

  const stats = [
    { icon: HiUsers, label: "Happy Customers", value: slides[currentSlide].stats.customers },
    { icon: HiStar, label: "5-Star Reviews", value: slides[currentSlide].stats.rating },
    { icon: HiTruck, label: "Daily Deliveries", value: slides[currentSlide].stats.deliveries },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative h-[70vh] min-h-[600px] max-h-[800px] flex items-center bg-gradient-to-br from-background via-surface to-surface-elevated overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container-modern relative z-10 h-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full py-12">
          
          {/* Content Section */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="space-y-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <HiStar className="w-4 h-4 text-primary mr-2" />
                  <span className="text-sm font-medium text-primary">{slides[currentSlide].badge}</span>
                </motion.div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <motion.h1
                    className="text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-tight"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    {slides[currentSlide].title.split(' ').map((word, index) => (
                      <span key={index} className={word === 'Homemade' || word === 'Fresh' || word === 'Chef' ? 'text-primary' : ''}>
                        {word}{' '}
                      </span>
                    ))}
                  </motion.h1>
                  
                  <motion.p
                    className="text-lg text-muted leading-relaxed max-w-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>
                </div>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {/* Primary CTA Button */}
                  <motion.a
                    href={slides[currentSlide].ctaLink}
                    className="group relative overflow-hidden bg-gradient-to-r from-primary via-primary to-yellow-400 text-black font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 min-w-[180px] text-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Button Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-yellow-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    
                    {/* Button Content */}
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-lg font-bold">{slides[currentSlide].cta}</span>
                      <div className="relative">
                        <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
                      </div>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </motion.a>

                  {/* Play Button for Interactive Demo */}
                  <motion.button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="group relative bg-surface border-2 border-primary/30 hover:border-primary text-base-content hover:text-primary font-semibold px-6 py-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Button Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                    
                    {/* Button Content */}
                    <div className="relative flex items-center justify-center space-x-3">
                      <HiPlay className={`w-5 h-5 transition-transform duration-300 ${isAutoPlaying ? 'animate-pulse' : ''}`} />
                      <span className="font-bold">{isAutoPlaying ? 'Auto Playing' : 'Play Demo'}</span>
                    </div>
                  </motion.button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  className="grid grid-cols-3 gap-4 pt-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={`${stat.label}-${currentSlide}`}
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <div className="flex justify-center mb-2">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <stat.icon className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <motion.div 
                        className="text-xl font-bold text-primary"
                        key={stat.value}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-xs text-muted">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <motion.div
              className="flex items-center justify-between pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {/* Navigation Buttons */}
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={prevSlide}
                  className="p-2 bg-surface hover:bg-hover border border-gray-200 rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiChevronLeft className="w-4 h-4 text-muted hover:text-primary" />
                </motion.button>
                
                <motion.button
                  onClick={nextSlide}
                  className="p-2 bg-surface hover:bg-hover border border-gray-200 rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <HiChevronRight className="w-4 h-4 text-muted hover:text-primary" />
                </motion.button>
              </div>

              {/* Slide Indicators */}
              <div className="flex items-center space-x-2">
                {slides.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'bg-primary w-6' : 'bg-muted hover:bg-primary/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </div>

              {/* Auto-play Progress */}
              <div className="flex items-center space-x-2">
                <div className="w-16 h-1 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: isAutoPlaying ? "100%" : "0%" }}
                    transition={{ duration: 5, ease: "linear", repeat: isAutoPlaying ? Infinity : 0 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image Section */}
          <motion.div
            className="relative h-full flex items-center justify-center py-20 px-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="relative w-full max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                {/* Top Card - Above Image */}
                <motion.div
                  key={`top-card-${currentSlide}`}
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20 w-48"
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 200 }}
                >
                  <div className="banner-floating-card p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-success/20 to-success/10 rounded-xl flex items-center justify-center shadow-sm card-icon-container">
                        <HiStar className="w-5 h-5 text-success relative z-10" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-base-content">
                          {currentSlide === 0 ? "100% Homemade" :
                           currentSlide === 1 ? "Farm Fresh Daily" :
                           "Expert Crafted"}
                        </div>
                        <div className="text-xs text-muted">
                          {currentSlide === 0 ? "Traditional Recipes" :
                           currentSlide === 1 ? "Organic Ingredients" :
                           "Professional Quality"}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Main Image Container */}
                <motion.div
                  className="relative z-10 mx-8"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img
                    key={slides[currentSlide].image}
                    src={slides[currentSlide].image}
                    alt={
                      currentSlide === 0 ? "Homemade meal preparation" :
                      currentSlide === 1 ? "Fresh ingredients and cooking" :
                      "Professional chef cooking"
                    }
                    className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                  
                  {/* Image Overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  
                  {/* Dynamic Image Badge */}
                  <motion.div
                    key={`badge-${currentSlide}`}
                    className="absolute top-4 right-4 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-full border border-white/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <span className="text-white text-sm font-semibold">
                      {currentSlide === 0 ? "Homemade" :
                       currentSlide === 1 ? "Fresh Daily" :
                       "Expert Chef"}
                    </span>
                  </motion.div>

                  {/* Rating Badge */}
                  <motion.div
                    key={`rating-${currentSlide}`}
                    className="absolute top-4 left-4 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-primary/20 shadow-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-1">
                      <HiStar className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-bold text-gray-800">
                        {slides[currentSlide].stats.rating}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Bottom Card - Below Image */}
                <motion.div
                  key={`bottom-card-${currentSlide}`}
                  className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-20 w-48"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1, duration: 0.6, type: "spring", stiffness: 200 }}
                >
                  <div className="banner-floating-card p-4 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center shadow-sm card-icon-container">
                        <HiTruck className="w-5 h-5 text-primary relative z-10" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-base-content">
                          {currentSlide === 0 ? "Fast Delivery" :
                           currentSlide === 1 ? "Same Day Fresh" :
                           "Quick Service"}
                        </div>
                        <div className="text-xs text-muted">
                          {currentSlide === 0 ? "30 min average" :
                           currentSlide === 1 ? "Delivered daily" :
                           "On-demand cooking"}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Side Decorative Elements */}
                <motion.div
                  className="absolute top-1/2 -left-6 transform -translate-y-1/2 w-3 h-16 bg-gradient-to-b from-primary/30 to-accent/30 rounded-full blur-sm"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <motion.div
                  className="absolute top-1/2 -right-6 transform -translate-y-1/2 w-3 h-16 bg-gradient-to-b from-accent/30 to-secondary/30 rounded-full blur-sm"
                  animate={{ 
                    scale: [1.1, 1, 1.1],
                    opacity: [0.8, 0.5, 0.8]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator with Visual Flow */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="flex flex-col items-center space-y-2 cursor-pointer group"
          onClick={scrollToNextSection}
        >
          <span className="text-xs text-muted group-hover:text-primary transition-colors">Explore More</span>
          <motion.div
            className="w-6 h-10 border-2 border-primary/30 group-hover:border-primary rounded-full flex justify-center transition-colors"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-primary rounded-full mt-2"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          <motion.div
            className="w-px h-8 bg-gradient-to-b from-primary/50 to-transparent"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 2, duration: 1 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Banner;
