// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  HiDeviceMobile, 
  HiDownload, 
  HiBell, 
  HiStar,
  HiShoppingCart,
  HiHeart
} from "react-icons/hi";

const AppSection = () => {
  const features = [
    {
      icon: HiShoppingCart,
      title: "Easy Ordering",
      description: "Browse and order with just a few taps"
    },
    {
      icon: HiBell,
      title: "Real-time Updates",
      description: "Get notified about your order status"
    },
    {
      icon: HiHeart,
      title: "Save Favorites",
      description: "Keep track of your favorite meals and chefs"
    },
    {
      icon: HiStar,
      title: "Rate & Review",
      description: "Share your experience with the community"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container-modern">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
                <HiDeviceMobile className="w-4 h-4 text-accent mr-2" />
                <span className="text-sm font-medium text-accent">Mobile App</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold text-base-content mb-6">
                Order On-the-Go with Our 
                <span className="text-accent"> Mobile App</span>
              </h2>
              
              <p className="text-xl text-muted leading-relaxed">
                Download our mobile app for the ultimate convenience. Order your favorite meals, 
                track deliveries, and discover new chefs - all from your smartphone.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base-content mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Download Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.a
                href="#"
                className="group flex items-center justify-center space-x-3 bg-black text-white font-semibold px-6 py-4 rounded-xl hover:bg-gray-800 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiDownload className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-lg font-bold">App Store</div>
                </div>
              </motion.a>

              <motion.a
                href="#"
                className="group flex items-center justify-center space-x-3 bg-black text-white font-semibold px-6 py-4 rounded-xl hover:bg-gray-800 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiDownload className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-lg font-bold">Google Play</div>
                </div>
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex items-center space-x-8 pt-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary flex items-center justify-center space-x-1">
                  <span>4.8</span>
                  <HiStar className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="text-sm text-muted">App Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Phone Mockup Side */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Phone Frame */}
            <div className="relative mx-auto w-80 h-[600px] bg-gray-900 rounded-[3rem] p-4 shadow-2xl">
              {/* Screen */}
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-[2.5rem] overflow-hidden relative">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-3 bg-white/10 backdrop-blur-sm">
                  <div className="text-white text-sm font-medium">9:41</div>
                  <div className="flex space-x-1">
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                    <div className="w-4 h-2 bg-white rounded-sm"></div>
                  </div>
                </div>

                {/* App Content */}
                <div className="p-6 space-y-4">
                  {/* Header */}
                  <div className="text-center text-white">
                    <h3 className="text-xl font-bold mb-2">LocalChefBazaar</h3>
                    <p className="text-sm opacity-80">Delicious meals delivered</p>
                  </div>

                  {/* Mock Meal Cards */}
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-white/40 rounded mb-2"></div>
                          <div className="h-2 bg-white/30 rounded w-2/3"></div>
                        </div>
                        <div className="w-8 h-8 bg-primary/60 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute top-20 -right-4 w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center backdrop-blur-sm"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <HiHeart className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  className="absolute bottom-32 -left-4 w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center backdrop-blur-sm"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  <HiStar className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AppSection;