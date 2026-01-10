// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  HiShieldCheck, 
  HiClock, 
  HiStar, 
  HiHeart, 
  HiTruck, 
  HiCurrencyDollar 
} from "react-icons/hi";

const FeaturesSection = () => {
  const features = [
    {
      icon: HiShieldCheck,
      title: "Quality Assured",
      description: "All our chefs are verified and meals are prepared with the highest quality standards.",
      color: "text-green-500"
    },
    {
      icon: HiClock,
      title: "Fast Delivery",
      description: "Get your favorite meals delivered fresh and hot within 30-45 minutes.",
      color: "text-blue-500"
    },
    {
      icon: HiStar,
      title: "Top Rated",
      description: "Enjoy meals from highly rated local chefs with excellent customer reviews.",
      color: "text-yellow-500"
    },
    {
      icon: HiHeart,
      title: "Made with Love",
      description: "Every meal is prepared with passion and care by dedicated local chefs.",
      color: "text-red-500"
    },
    {
      icon: HiTruck,
      title: "Free Delivery",
      description: "Enjoy free delivery on all orders above ৳200. No hidden charges.",
      color: "text-purple-500"
    },
    {
      icon: HiCurrencyDollar,
      title: "Best Prices",
      description: "Affordable homemade meals without compromising on quality and taste.",
      color: "text-primary"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container-modern">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <span className="text-sm font-medium text-primary">Why Choose Us</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-base-content mb-6">
            Experience the 
            <span className="text-primary"> Best</span>
          </h2>
          
          <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
            Discover why thousands of food lovers trust LocalChefBazaar for their daily meals. 
            Quality, convenience, and taste - all in one place.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group card-modern p-8 text-center hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              {/* Icon */}
              <div className="relative mb-6">
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-${feature.color.split('-')[1]}-100 to-${feature.color.split('-')[1]}-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <div className={`absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-${feature.color.split('-')[1]}-500/20 to-${feature.color.split('-')[1]}-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}></div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-base-content mb-4 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.a
            href="/meals"
            className="group relative inline-flex items-center justify-center bg-gradient-to-r from-primary to-yellow-400 text-black font-bold px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 active:translate-y-0 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Button Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button Content */}
            <div className="relative flex items-center space-x-3">
              <span className="text-lg">Explore Our Meals</span>
              <div className="w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;