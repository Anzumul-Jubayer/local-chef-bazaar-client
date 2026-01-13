import React from "react";
import { Helmet } from "react-helmet";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  HiHeart, 
  HiUsers, 
  HiStar, 
  HiShieldCheck,
  HiCake,
  HiGlobeAlt,
  HiSparkles
} from "react-icons/hi";

const About = () => {
  const features = [
    {
      icon: HiCake,
      title: "Local Chefs",
      description: "Connect with talented home chefs in your neighborhood who create authentic, homemade meals with love and passion."
    },
    {
      icon: HiHeart,
      title: "Made with Love",
      description: "Every meal is prepared with care, using fresh ingredients and traditional recipes passed down through generations."
    },
    {
      icon: HiShieldCheck,
      title: "Quality Assured",
      description: "All our chefs are verified and follow strict hygiene standards to ensure you get safe, delicious meals every time."
    },
    {
      icon: HiUsers,
      title: "Community Driven",
      description: "We're building a community where food lovers and talented cooks come together to share amazing culinary experiences."
    }
  ];

  const stats = [
    { number: "500+", label: "Local Chefs", icon: HiCake },
    { number: "10K+", label: "Happy Customers", icon: HiUsers },
    { number: "50K+", label: "Meals Delivered", icon: HiHeart },
    { number: "4.8", label: "Average Rating", icon: HiStar }
  ];

  return (
    <>
      <Helmet>
        <title>About Us | LocalChefBazaar</title>
        <meta name="description" content="Learn about LocalChefBazaar - connecting food lovers with talented local chefs for authentic homemade meals." />
      </Helmet>

      <div className="min-h-screen bg-background">
        
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container-modern">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
                <HiSparkles className="w-4 h-4" />
                <span>About LocalChefBazaar</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold text-base-content mb-6">
                Connecting Food Lovers with 
                <span className="text-primary"> Local Chefs</span>
              </h1>
              
              <p className="text-xl text-muted leading-relaxed mb-8">
                We believe that the best meals come from the heart. LocalChefBazaar bridges the gap between 
                talented home chefs and food enthusiasts, creating a community where authentic flavors and 
                culinary traditions thrive.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-gray-200">
          <div className="container-modern">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-base-content mb-2">{stat.number}</div>
                  <div className="text-muted font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container-modern">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-base-content mb-4">
                Why Choose LocalChefBazaar?
              </h2>
              <p className="text-xl text-muted max-w-2xl mx-auto">
                We're more than just a food delivery platform. We're a community that celebrates 
                culinary diversity and supports local talent.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="card-modern p-8 group hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-base-content mb-3">{feature.title}</h3>
                      <p className="text-muted leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-surface-elevated">
          <div className="container-modern">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent/10 rounded-full text-accent font-medium mb-6">
                  <HiGlobeAlt className="w-4 h-4" />
                  <span>Our Mission</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-display font-bold text-base-content mb-6">
                  Empowering Local Food Culture
                </h2>
                
                <p className="text-lg text-muted leading-relaxed mb-6">
                  Our mission is to create a sustainable ecosystem where local chefs can showcase their 
                  culinary skills while providing food lovers access to authentic, homemade meals that 
                  tell a story.
                </p>
                
                <p className="text-lg text-muted leading-relaxed mb-8">
                  We believe in supporting local economies, preserving culinary traditions, and building 
                  meaningful connections through the universal language of food.
                </p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2 text-success">
                    <HiShieldCheck className="w-5 h-5" />
                    <span className="font-medium">Verified Chefs</span>
                  </div>
                  <div className="flex items-center space-x-2 text-success">
                    <HiShieldCheck className="w-5 h-5" />
                    <span className="font-medium">Quality Ingredients</span>
                  </div>
                  <div className="flex items-center space-x-2 text-success">
                    <HiShieldCheck className="w-5 h-5" />
                    <span className="font-medium">Community Support</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="card-elevated p-8 bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <HiHeart className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-base-content mb-4">Made with Passion</h3>
                    <p className="text-muted leading-relaxed">
                      Every meal on our platform represents hours of preparation, years of experience, 
                      and generations of culinary knowledge passed down through families.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container-modern">
            <motion.div
              className="card-elevated p-12 text-center bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-base-content mb-4">
                Join Our Culinary Community
              </h2>
              <p className="text-xl text-muted mb-8 max-w-2xl mx-auto">
                Whether you're a food lover looking for authentic meals or a talented chef ready to share 
                your culinary creations, there's a place for you at LocalChefBazaar.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a 
                    href="/meals" 
                    className="group relative inline-flex items-center justify-center bg-gradient-to-r from-primary via-yellow-400 to-accent text-black font-bold px-12 py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 overflow-hidden min-w-[200px]"
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Pulsing Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
                    
                    {/* Button Content */}
                    <div className="relative flex items-center space-x-3 z-10">
                      <span className="text-xl font-bold">Explore Meals</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                        <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
                      </div>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    {/* Border Animation */}
                    <div className="absolute inset-0 rounded-2xl border-4 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"></div>
                  </a>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a 
                    href="/register" 
                    className="group relative inline-flex items-center justify-center bg-surface-elevated hover:bg-primary/10 text-base-content font-bold px-12 py-6 rounded-2xl border-2 border-primary/30 hover:border-primary/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-3 overflow-hidden min-w-[200px]"
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Button Content */}
                    <div className="relative flex items-center space-x-3 z-10">
                      <span className="text-xl font-bold group-hover:text-primary transition-colors duration-300">Become a Chef</span>
                      <div className="flex items-center space-x-1">
                        <HiCake className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform duration-300" />
                        <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                      </div>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-800"></div>
                    
                    {/* Border Animation */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300"></div>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
