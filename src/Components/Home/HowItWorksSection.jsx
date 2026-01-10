// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  HiSearch, 
  HiShoppingCart, 
  HiTruck, 
  HiArrowRight 
} from "react-icons/hi";

const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      icon: HiSearch,
      title: "Browse & Discover",
      description: "Explore hundreds of delicious homemade meals from verified local chefs in your area.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: "02",
      icon: HiShoppingCart,
      title: "Order Your Favorites",
      description: "Select your preferred meals, customize your order, and proceed to secure checkout.",
      color: "from-purple-500 to-pink-500"
    },
    {
      step: "03",
      icon: HiTruck,
      title: "Fast Delivery",
      description: "Sit back and relax while we deliver your fresh, hot meals right to your doorstep.",
      color: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
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
            <span className="text-sm font-medium text-accent">How It Works</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-base-content mb-6">
            Simple Steps to 
            <span className="text-accent"> Delicious Meals</span>
          </h2>
          
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Getting your favorite homemade meals has never been easier. 
            Follow these simple steps and enjoy restaurant-quality food at home.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Step Card */}
              <div className="group card-modern p-8 text-center hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                {/* Step Number */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.step}
                  </div>
                  <div className={`absolute inset-0 w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${step.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300`}></div>
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-surface-elevated rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-300">
                    <step.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-base-content mb-4 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <HiArrowRight className="w-6 h-6 text-primary" />
                  </div>
                </div>
              )}
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
          <div className="bg-surface card-modern p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-base-content mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-muted mb-6">
              Join thousands of satisfied customers who enjoy fresh, homemade meals daily.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/register"
                className="group relative inline-flex items-center justify-center bg-gradient-to-r from-primary via-yellow-400 to-accent text-black font-bold px-10 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden min-w-[180px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Pulsing Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500 -z-10"></div>
                
                {/* Button Content */}
                <div className="relative flex items-center space-x-3 z-10">
                  <span className="text-xl font-bold">Sign Up Now</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                    <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
                  </div>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Border Animation */}
                <div className="absolute inset-0 rounded-2xl border-4 border-white/20 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"></div>
              </motion.a>
              
              <motion.a
                href="/meals"
                className="group relative inline-flex items-center justify-center bg-surface-elevated hover:bg-primary/10 text-base-content font-bold px-10 py-5 rounded-2xl border-2 border-primary/30 hover:border-primary/60 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden min-w-[180px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Button Content */}
                <div className="relative flex items-center space-x-3 z-10">
                  <span className="text-xl font-bold group-hover:text-primary transition-colors duration-300">Browse Meals</span>
                  <div className="flex items-center space-x-2">
                    <HiArrowRight className="w-6 h-6 text-primary group-hover:translate-x-2 transition-transform duration-300" />
                    <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
                  </div>
                </div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-800"></div>
                
                {/* Border Glow */}
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300"></div>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;