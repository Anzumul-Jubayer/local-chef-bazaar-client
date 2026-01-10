import { useState } from "react";
import { Helmet } from "react-helmet";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  HiBookOpen, 
  HiClock, 
  HiArrowRight,
  HiSearch,
  HiHeart,
  HiEye
} from "react-icons/hi";
import sarahImage from "../../assets/Sara.webp";

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Homemade Pasta: A Chef's Guide",
      excerpt: "Discover the secrets behind creating perfect pasta from scratch, with tips from our local Italian chefs.",
      content: "Learn the traditional techniques that have been passed down through generations...",
      author: "Maria Rossi",
      authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      date: "2024-01-08",
      readTime: "8 min read",
      category: "cooking-tips",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800",
      tags: ["pasta", "italian", "cooking", "homemade"],
      views: 1250,
      likes: 89
    },
    {
      id: 2,
      title: "Supporting Local Chefs: Building Community Through Food",
      excerpt: "How LocalChefBazaar is creating opportunities for home cooks to share their culinary passion with the community.",
      content: "In today's fast-paced world, there's something special about homemade food...",
      author: "David Chen",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "community",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
      tags: ["community", "local-chefs", "support"],
      views: 890,
      likes: 67
    },
    {
      id: 3,
      title: "Seasonal Cooking: Winter Comfort Foods That Warm the Soul",
      excerpt: "Explore hearty winter recipes that bring comfort and warmth to cold days, featuring dishes from our chef community.",
      content: "Winter is the perfect time to embrace comfort cooking...",
      author: "Sarah Johnson",
      authorImage: sarahImage,
      date: "2024-01-03",
      readTime: "10 min read",
      category: "recipes",
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
      tags: ["winter", "comfort-food", "seasonal", "recipes"],
      views: 1456,
      likes: 123
    },
    {
      id: 4,
      title: "Food Safety in Home Kitchens: Essential Guidelines",
      excerpt: "Important food safety practices every home chef should follow to ensure delicious and safe meals.",
      content: "Food safety is paramount when preparing meals for others...",
      author: "Dr. Emily Rodriguez",
      authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150",
      date: "2024-01-01",
      readTime: "12 min read",
      category: "food-safety",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
      tags: ["food-safety", "guidelines", "health", "kitchen"],
      views: 2103,
      likes: 156
    },
    {
      id: 5,
      title: "The Rise of Plant-Based Cooking in Local Communities",
      excerpt: "How plant-based cuisine is gaining popularity among home chefs and creating new culinary opportunities.",
      content: "Plant-based cooking has evolved from a niche interest to a mainstream movement...",
      author: "Alex Green",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      date: "2023-12-28",
      readTime: "7 min read",
      category: "trends",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
      tags: ["plant-based", "trends", "healthy", "sustainable"],
      views: 987,
      likes: 78
    },
    {
      id: 6,
      title: "Mastering Spice Blends: Creating Flavor Profiles",
      excerpt: "Learn how to create your own spice blends and understand the art of balancing flavors in your cooking.",
      content: "Spices are the soul of cooking, transforming simple ingredients into extraordinary dishes...",
      author: "Raj Patel",
      authorImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
      date: "2023-12-25",
      readTime: "9 min read",
      category: "cooking-tips",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800",
      tags: ["spices", "flavors", "cooking-tips", "techniques"],
      views: 1334,
      likes: 94
    }
  ];

  const categories = [
    { id: "all", label: "All Posts", count: blogPosts.length },
    { id: "cooking-tips", label: "Cooking Tips", count: blogPosts.filter(post => post.category === "cooking-tips").length },
    { id: "recipes", label: "Recipes", count: blogPosts.filter(post => post.category === "recipes").length },
    { id: "community", label: "Community", count: blogPosts.filter(post => post.category === "community").length },
    { id: "food-safety", label: "Food Safety", count: blogPosts.filter(post => post.category === "food-safety").length },
    { id: "trends", label: "Trends", count: blogPosts.filter(post => post.category === "trends").length }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Helmet>
        <title>Blog | LocalChefBazaar</title>
        <meta name="description" content="Discover cooking tips, recipes, and stories from our community of local chefs. Learn about food trends, safety, and culinary techniques." />
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
                <HiBookOpen className="w-4 h-4" />
                <span>LocalChef Blog</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold text-base-content mb-6">
                Culinary Stories & 
                <span className="text-primary"> Cooking Wisdom</span>
              </h1>
              
              <p className="text-xl text-muted leading-relaxed mb-8">
                Discover cooking tips, recipes, and inspiring stories from our community of passionate local chefs. 
                Learn, cook, and connect through the art of food.
              </p>

              {/* Search Bar */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                  <input
                    type="text"
                    placeholder="Search articles, recipes, tips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-modern pl-12 pr-4 py-3 w-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-8 border-b border-color">
          <div className="container-modern">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-3 min-w-[120px] justify-center ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-primary to-yellow-400 text-black shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      : "bg-surface-elevated text-base-content hover:bg-hover border-2 border-transparent hover:border-primary/30 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Button Background Glow for Active State */}
                  {selectedCategory === category.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-yellow-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  )}
                  
                  {/* Button Content */}
                  <span className="relative z-10">{category.label}</span>
                  <div className={`relative z-10 px-2 py-1 rounded-full text-xs font-bold ${
                    selectedCategory === category.id
                      ? "bg-black/20 text-black"
                      : "bg-primary/10 text-primary border border-primary/20"
                  }`}>
                    {category.count}
                  </div>
                  
                  {/* Shine Effect for Active Buttons */}
                  {selectedCategory === category.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container-modern">
            {filteredPosts.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiBookOpen className="w-12 h-12 text-muted" />
                </div>
                <h3 className="text-xl font-semibold text-base-content mb-2">No articles found</h3>
                <p className="text-muted">Try adjusting your search or category filter.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    className="card-modern overflow-hidden group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    {/* Post Image */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-primary/90 backdrop-blur-sm rounded-full">
                        <span className="text-xs font-semibold text-black capitalize">
                          {post.category.replace('-', ' ')}
                        </span>
                      </div>

                      {/* Engagement Stats */}
                      <div className="absolute bottom-4 right-4 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center space-x-1 text-white text-xs">
                          <HiEye className="w-3 h-3" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-white text-xs">
                          <HiHeart className="w-3 h-3" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="p-6 space-y-4">
                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-sm text-muted">
                        <div className="flex items-center space-x-2">
                          <img
                            src={post.authorImage}
                            alt={post.author}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <HiClock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      {/* Title and Excerpt */}
                      <div>
                        <h3 className="text-xl font-semibold text-base-content group-hover:text-primary transition-colors duration-200 line-clamp-2 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-muted line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-surface-elevated text-xs text-muted rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-color">
                        <span className="text-sm text-muted">
                          {formatDate(post.date)}
                        </span>
                        <motion.button 
                          className="group relative overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 text-primary hover:text-primary font-semibold px-4 py-2 rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Button Background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                          
                          {/* Button Content */}
                          <div className="relative flex items-center space-x-2">
                            <span className="text-sm font-semibold">Read More</span>
                            <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                          
                          {/* Subtle Glow Effect */}
                          <div className="absolute inset-0 rounded-xl bg-primary/10 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                        </motion.button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredPosts.length > 0 && (
              <motion.div
                className="text-center mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button 
                  className="group relative overflow-hidden bg-surface border-2 border-primary/30 hover:border-primary text-base-content hover:text-primary font-bold px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 active:translate-y-0 min-w-[220px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Button Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  
                  {/* Button Content */}
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-lg font-bold">Load More Articles</span>
                    <div className="relative">
                      <HiArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-primary/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-primary/50 scale-100 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  
                  {/* Pulse Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/5 scale-100 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </motion.button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-surface-elevated">
          <div className="container-modern">
            <motion.div
              className="card-elevated p-8 text-center bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-display font-bold text-base-content mb-4">
                  Stay Updated with Culinary Insights
                </h3>
                <p className="text-muted mb-6">
                  Get the latest cooking tips, recipes, and stories from our chef community 
                  delivered straight to your inbox.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="input-modern flex-1"
                  />
                  <motion.button 
                    className="group relative overflow-hidden btn-primary-modern min-w-[140px] font-bold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Button Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-yellow-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    
                    {/* Button Content */}
                    <div className="relative flex items-center justify-center space-x-2">
                      <span>Subscribe</span>
                      <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;