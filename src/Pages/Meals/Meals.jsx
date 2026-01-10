import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { 
  HiSearch, 
  HiLocationMarker, 
  HiSortAscending, 
  HiStar, 
  HiHeart, 
  HiChevronLeft,
  HiChevronRight,
  HiFilter,
  HiX,
  HiChevronDown,
  HiArrowUp,
  HiArrowDown,
  HiAdjustments,
  HiRefresh,
  HiClock,
  HiCurrencyDollar,
  HiSparkles,
  HiTag,
  HiCalendar,
  HiUserGroup,
  HiArrowRight
} from "react-icons/hi";
import { useLoadingState } from "../../hooks/useLoadingState";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [totalMeals, setTotalMeals] = useState(0);
  const { withLoading } = useLoadingState();
  const [page, setPage] = useState(1);
  const [limit] = useState(8); // Fixed at 8 items per page
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("price");
  
  // Enhanced filtering fields (at least 2 fields as required)
  const [search, setSearch] = useState(""); // Field 1: Search
  const [area, setArea] = useState(""); // Field 2: Location
  const [priceRange, setPriceRange] = useState({ min: "", max: "" }); // Field 3: Price
  const [ratingFilter, setRatingFilter] = useState(""); // Field 4: Rating
  const [categoryFilter, setCategoryFilter] = useState(""); // Field 5: Category
  const [chefExperienceFilter, setChefExperienceFilter] = useState(""); // Field 6: Chef Experience
  const [dateFilter, setDateFilter] = useState(""); // Field 7: Date (newest, oldest)
  
  const [showFilters, setShowFilters] = useState(false);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  // Fetch available filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch unique areas and categories for filter dropdowns
        const areasRes = await fetch(
          "https://local-chef-bazaar-server-flame.vercel.app/meals/areas"
        );
        const categoriesRes = await fetch(
          "https://local-chef-bazaar-server-flame.vercel.app/meals/categories"
        );
        
        if (areasRes.ok) {
          const areasData = await areasRes.json();
          setAvailableAreas(areasData.areas || []);
        }
        
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setAvailableCategories(categoriesData.categories || []);
        }
      } catch (error) {
        console.error("Error fetching filter options:", error);
        // Set fallback options if API fails
        setAvailableAreas(["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal"]);
        setAvailableCategories(["Bengali", "Chinese", "Indian", "Thai", "Italian", "Fast Food", "Dessert"]);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await withLoading(async () => {
          const queryParams = new URLSearchParams({
          page,
          limit,
          sort: sortOrder,
          sortBy,
          ...(search && { search }),
          ...(area && { area }),
          ...(priceRange.min && { minPrice: priceRange.min }),
          ...(priceRange.max && { maxPrice: priceRange.max }),
          ...(ratingFilter && { minRating: ratingFilter }),
          ...(categoryFilter && { category: categoryFilter }),
          ...(chefExperienceFilter && { minExperience: chefExperienceFilter }),
          ...(dateFilter && { dateSort: dateFilter }),
        });

        const res = await fetch(
          `https://local-chef-bazaar-server-flame.vercel.app/meals?${queryParams}`
        );
        const data = await res.json();
        setMeals(data.data || []);
        setTotalMeals(data.total || 0);
        }, "Searching for delicious meals...");
      } catch (error) {
        console.error("Error fetching meals:", error);
        setMeals([]);
        setTotalMeals(0);
      }
    };

    fetchData();
  }, [page, limit, sortOrder, sortBy, area, search, priceRange, ratingFilter, categoryFilter, chefExperienceFilter, dateFilter, withLoading]);

  const clearFilters = () => {
    setSearch("");
    setArea("");
    setCategoryFilter("");
    setChefExperienceFilter("");
    setDateFilter("");
    setSortOrder("asc");
    setSortBy("price");
    setPriceRange({ min: "", max: "" });
    setRatingFilter("");
    setPage(1);
  };

  const hasActiveFilters = search || area || categoryFilter || chefExperienceFilter || dateFilter || sortOrder !== "asc" || sortBy !== "price" || priceRange.min || priceRange.max || ratingFilter;

  // Calculate pagination
  const totalPages = Math.ceil(totalMeals / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const sortOptions = [
    { value: "price", label: "Price", icon: HiCurrencyDollar },
    { value: "rating", label: "Rating", icon: HiStar },
    { value: "chefExperience", label: "Chef Experience", icon: HiSparkles },
    { value: "createdAt", label: "Newest First", icon: HiClock },
  ];

  const ratingOptions = [
    { value: "", label: "All Ratings" },
    { value: "4", label: "4+ Stars" },
    { value: "3", label: "3+ Stars" },
    { value: "2", label: "2+ Stars" },
  ];

  const experienceOptions = [
    { value: "", label: "Any Experience" },
    { value: "1", label: "1+ Years" },
    { value: "3", label: "3+ Years" },
    { value: "5", label: "5+ Years" },
    { value: "10", label: "10+ Years" },
  ];

  const dateOptions = [
    { value: "", label: "Any Date" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ];

  return (
    <>
      <Helmet>
        <title>Meals | LocalChefBazaar</title>
        <meta name="description" content="Discover delicious homemade meals from local chefs in your area. Browse, filter, and order fresh, authentic dishes." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-8 bg-background">
          <div className="container-modern">
            <motion.div
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
                <HiStar className="w-4 h-4" />
                <span>Local Chef Meals</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-display font-bold text-base-content mb-4">
                Discover Amazing 
                <span className="text-primary"> Local Meals</span>
              </h1>
              
              <p className="text-xl text-muted leading-relaxed mb-6">
                Explore authentic homemade dishes crafted by passionate local chefs. 
                Fresh ingredients, traditional recipes, delivered to your door.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Sort Section - Combined for better alignment */}
        <section className="py-6 bg-background">
          <div className="container-modern">
            {/* Search Subsection */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-4">
                <HiSearch className="w-4 h-4" />
                <span>Search Meals</span>
              </div>
              <h2 className="text-3xl font-bold text-base-content mb-2">Find Your Perfect Meal</h2>
              <p className="text-muted">Search through hundreds of delicious homemade meals</p>
            </motion.div>

            {/* Prominent Search Bar */}
            <motion.div
              className="max-w-4xl mx-auto mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                
                {/* Search Container */}
                <div className="relative bg-background/80 backdrop-blur-sm border border-primary/20 hover:border-primary/40 focus-within:border-primary/60 rounded-3xl shadow-lg hover:shadow-xl focus-within:shadow-xl transition-all duration-300">
                  <div className="flex items-center">
                    {/* Search Icon */}
                    <div className="pl-8 pr-4">
                      <HiSearch className="w-7 h-7 text-muted group-focus-within:text-primary transition-colors duration-300" />
                    </div>
                    
                    {/* Search Input */}
                    <input
                      type="text"
                      placeholder="Search meals by name, cuisine, ingredients, chef name, or description..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="flex-1 py-6 text-lg bg-transparent text-base-content placeholder-muted focus:outline-none"
                    />
                    
                    {/* Clear Button */}
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="mr-4 p-2 hover:bg-hover rounded-full transition-colors duration-200"
                        aria-label="Clear search"
                      >
                        <HiX className="w-5 h-5 text-muted hover:text-error" />
                      </button>
                    )}
                    
                    {/* Search Button */}
                    <motion.button
                      className="mr-4 group/btn relative overflow-hidden bg-gradient-to-r from-primary to-yellow-400 text-black font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="relative flex items-center space-x-2">
                        <HiSearch className="w-5 h-5" />
                        <span>Search</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sort Subsection - Integrated without gap */}
            <motion.div
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-background/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Sort Header */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <HiSortAscending className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content">Sort Results</h3>
                  <p className="text-sm text-muted">Arrange meals by your preference</p>
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                {/* Sort By Dropdown */}
                <div className="min-w-[200px]">
                  <label className="block text-sm font-semibold text-base-content mb-2">Sort By</label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 pr-10 py-4 bg-background/50 border border-primary/20 hover:border-primary/40 focus:border-primary/60 rounded-xl transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium shadow-sm hover:shadow-md text-base-content"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <HiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                  </div>
                </div>

                {/* Sort Order Toggle */}
                <div className="min-w-[200px]">
                  <label className="block text-sm font-semibold text-base-content mb-2">Order</label>
                  <div className="flex bg-background/50 border border-primary/20 rounded-xl p-1 shadow-sm">
                    <button
                      onClick={() => setSortOrder("asc")}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        sortOrder === "asc"
                          ? "bg-primary text-black shadow-md transform scale-105"
                          : "text-base-content hover:bg-hover"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <HiArrowUp className="w-4 h-4" />
                        <span>Low to High</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setSortOrder("desc")}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        sortOrder === "desc"
                          ? "bg-primary text-black shadow-md transform scale-105"
                          : "text-base-content hover:bg-hover"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <HiArrowDown className="w-4 h-4" />
                        <span>High to Low</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        {/* Filter Section - Visually Distinct */}
        <section className="py-4 bg-background">
          <div className="container-modern">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-sm border border-accent/20 hover:border-accent/40 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <HiFilter className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base-content text-lg">Filter Meals</div>
                    <div className="text-sm text-muted">
                      {hasActiveFilters ? `${Object.values({area, ratingFilter, priceRange: priceRange.min || priceRange.max}).filter(Boolean).length} filters active` : 'Tap to set preferences'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {hasActiveFilters && (
                    <div className="w-4 h-4 bg-accent rounded-full animate-pulse"></div>
                  )}
                  <motion.div
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HiChevronDown className="w-6 h-6 text-muted" />
                  </motion.div>
                </div>
              </motion.button>
            </div>

            {/* Filter Cards Grid */}
            <motion.div
              className={`${showFilters ? 'block' : 'hidden'} lg:block`}
              initial={false}
              animate={{ 
                height: showFilters ? 'auto' : 0,
                opacity: showFilters ? 1 : 0 
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                
                {/* Location & Category Filter Card */}
                <motion.div
                  className="bg-background/30 backdrop-blur-sm border border-accent/20 hover:border-accent/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-accent/10 rounded-xl">
                      <HiLocationMarker className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-base-content">Location & Category</h3>
                      <p className="text-sm text-muted">Area and cuisine type</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Location Dropdown */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">Delivery Area</label>
                      <div className="relative">
                        <HiLocationMarker className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                        <select
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 bg-background/50 backdrop-blur-sm border border-accent/30 hover:border-accent/50 focus:border-accent rounded-xl transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium"
                        >
                          <option value="">All Areas</option>
                          {availableAreas.map((areaOption) => (
                            <option key={areaOption} value={areaOption}>
                              {areaOption}
                            </option>
                          ))}
                        </select>
                        <HiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                      </div>
                    </div>

                    {/* Category Dropdown */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">Category</label>
                      <div className="relative">
                        <HiTag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 bg-background/50 backdrop-blur-sm border border-accent/30 hover:border-accent/50 focus:border-accent rounded-xl transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium"
                        >
                          <option value="">All Categories</option>
                          {availableCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <HiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Price & Rating Filter Card */}
                <motion.div
                  className="bg-background/30 backdrop-blur-sm border border-secondary/20 hover:border-secondary/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-secondary/10 rounded-xl">
                      <HiCurrencyDollar className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-base-content">Price & Rating</h3>
                      <p className="text-sm text-muted">Budget and quality</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">Price Range (BDT)</label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                          className="px-3 py-3 bg-background/50 backdrop-blur-sm border border-secondary/30 hover:border-secondary/50 focus:border-secondary rounded-xl transition-all duration-300 focus:outline-none text-center font-medium"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                          className="px-3 py-3 bg-background/50 backdrop-blur-sm border border-secondary/30 hover:border-secondary/50 focus:border-secondary rounded-xl transition-all duration-300 focus:outline-none text-center font-medium"
                        />
                      </div>
                    </div>
                    
                    {/* Rating Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">Minimum Rating</label>
                      <div className="relative">
                        <HiStar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-400" />
                        <select
                          value={ratingFilter}
                          onChange={(e) => setRatingFilter(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 bg-background/50 backdrop-blur-sm border border-secondary/30 hover:border-secondary/50 focus:border-secondary rounded-xl transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium"
                        >
                          {ratingOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <HiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Chef Experience & Date Filter Card */}
                <motion.div
                  className="bg-background/30 backdrop-blur-sm border border-primary/20 hover:border-primary/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <HiUserGroup className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-base-content">Chef & Date</h3>
                      <p className="text-sm text-muted">Experience and recency</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Chef Experience Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">Chef Experience</label>
                      <div className="relative">
                        <HiSparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
                        <select
                          value={chefExperienceFilter}
                          onChange={(e) => setChefExperienceFilter(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/50 focus:border-primary rounded-xl transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium"
                        >
                          {experienceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <HiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                      </div>
                    </div>

                    {/* Date Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">Date Added</label>
                      <div className="relative">
                        <HiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/50 focus:border-primary rounded-xl transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium"
                        >
                          {dateOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <HiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Active Filters & Clear Card */}
                <motion.div
                  className="bg-background/30 backdrop-blur-sm border border-accent/20 hover:border-accent/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-accent/10 rounded-xl">
                      <HiAdjustments className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-base-content">Active Filters</h3>
                      <p className="text-sm text-muted">Current selections</p>
                    </div>
                  </div>

                  {hasActiveFilters ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                        {search && (
                          <motion.span
                            className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <HiSearch className="w-3 h-3" />
                            <span className="truncate max-w-20">{search}</span>
                            <button onClick={() => setSearch("")} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                              <HiX className="w-2.5 h-2.5" />
                            </button>
                          </motion.span>
                        )}
                        {area && (
                          <motion.span
                            className="inline-flex items-center space-x-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium border border-accent/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <HiLocationMarker className="w-3 h-3" />
                            <span>{area}</span>
                            <button onClick={() => setArea("")} className="hover:bg-accent/20 rounded-full p-0.5 transition-colors">
                              <HiX className="w-2.5 h-2.5" />
                            </button>
                          </motion.span>
                        )}
                        {categoryFilter && (
                          <motion.span
                            className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-full text-xs font-medium border border-blue-500/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <HiTag className="w-3 h-3" />
                            <span>{categoryFilter}</span>
                            <button onClick={() => setCategoryFilter("")} className="hover:bg-blue-500/20 rounded-full p-0.5 transition-colors">
                              <HiX className="w-2.5 h-2.5" />
                            </button>
                          </motion.span>
                        )}
                        {ratingFilter && (
                          <motion.span
                            className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-medium border border-yellow-500/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <HiStar className="w-3 h-3" />
                            <span>{ratingFilter}+ Stars</span>
                            <button onClick={() => setRatingFilter("")} className="hover:bg-yellow-500/20 rounded-full p-0.5 transition-colors">
                              <HiX className="w-2.5 h-2.5" />
                            </button>
                          </motion.span>
                        )}
                        {(priceRange.min || priceRange.max) && (
                          <motion.span
                            className="inline-flex items-center space-x-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium border border-secondary/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <HiCurrencyDollar className="w-3 h-3" />
                            <span>{priceRange.min || "0"} - {priceRange.max || "∞"} BDT</span>
                            <button onClick={() => setPriceRange({ min: "", max: "" })} className="hover:bg-secondary/20 rounded-full p-0.5 transition-colors">
                              <HiX className="w-2.5 h-2.5" />
                            </button>
                          </motion.span>
                        )}
                        {chefExperienceFilter && (
                          <motion.span
                            className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-xs font-medium border border-purple-500/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <HiSparkles className="w-3 h-3" />
                            <span>{chefExperienceFilter}+ Years</span>
                            <button onClick={() => setChefExperienceFilter("")} className="hover:bg-purple-500/20 rounded-full p-0.5 transition-colors">
                              <HiX className="w-2.5 h-2.5" />
                            </button>
                          </motion.span>
                        )}
                        {dateFilter && (
                          <motion.span
                            className="inline-flex items-center space-x-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium border border-green-500/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                          >
                            <HiCalendar className="w-3 h-3" />
                            <span>{dateOptions.find(opt => opt.value === dateFilter)?.label}</span>
                            <button onClick={() => setDateFilter("")} className="hover:bg-green-500/20 rounded-full p-0.5 transition-colors">
                              <HiX className="w-2.5 h-2.5" />
                            </button>
                          </motion.span>
                        )}
                      </div>
                      
                      <motion.button
                        onClick={clearFilters}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-error/10 hover:bg-error/20 text-error border-2 border-error/20 hover:border-error/40 rounded-xl font-semibold transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <HiRefresh className="w-5 h-5" />
                        <span>Clear All Filters</span>
                      </motion.button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <HiFilter className="w-6 h-6 text-muted" />
                      </div>
                      <p className="text-muted font-medium text-sm">No filters applied</p>
                      <p className="text-xs text-muted mt-1">Use filters above to refine search</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Meals Grid Section */}
        <section className="py-6 bg-background">
          <div className="container-modern">
            {meals.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HiSearch className="w-12 h-12 text-muted" />
                </div>
                <h3 className="text-2xl font-semibold text-base-content mb-4">No meals found</h3>
                <p className="text-muted mb-6">Try adjusting your search criteria or browse all available meals.</p>
                <button
                  onClick={clearFilters}
                  className="btn-primary-modern"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <>
                {/* Enhanced Results Count with Filter Summary */}
                <div className="bg-background/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 mb-6 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <p className="text-base-content font-medium">
                          Showing <span className="font-bold text-primary">{meals.length}</span> of <span className="font-bold text-primary">{totalMeals}</span> meals
                        </p>
                      </div>
                      
                      {hasActiveFilters && (
                        <div className="flex items-center space-x-2 text-sm">
                          <HiFilter className="w-4 h-4 text-accent" />
                          <span className="text-muted">
                            {Object.values({
                              search: search,
                              area: area,
                              category: categoryFilter,
                              rating: ratingFilter,
                              price: priceRange.min || priceRange.max,
                              experience: chefExperienceFilter,
                              date: dateFilter
                            }).filter(Boolean).length} filters applied
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted">
                      <div className="flex items-center space-x-2">
                        <HiSortAscending className="w-4 h-4" />
                        <span>Sorted by {sortOptions.find(opt => opt.value === sortBy)?.label} ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})</span>
                      </div>
                      <div className="hidden sm:block w-px h-4 bg-border"></div>
                      <span className="hidden sm:inline">Page {page} of {totalPages}</span>
                    </div>
                  </div>
                  
                  {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-color">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted">
                          {totalMeals === 0 ? 'No meals match your criteria' : 
                           totalMeals === 1 ? '1 meal matches your criteria' :
                           `${totalMeals} meals match your criteria`}
                        </p>
                        <button
                          onClick={clearFilters}
                          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Filter Bar */}
                <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-background/30 backdrop-blur-sm border border-primary/20 rounded-xl shadow-sm">
                  <span className="text-sm font-medium text-muted">Quick filters:</span>
                  
                  {/* Popular Categories */}
                  {['Bengali', 'Chinese', 'Indian', 'Fast Food'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(categoryFilter === category ? '' : category)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        categoryFilter === category
                          ? 'bg-primary text-black shadow-md'
                          : 'bg-background/30 backdrop-blur-sm border border-primary/20 hover:border-primary/40 text-base-content hover:bg-background/50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                  
                  <div className="w-px h-6 bg-border"></div>
                  
                  {/* Rating Quick Filters */}
                  {['4', '3'].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setRatingFilter(ratingFilter === rating ? '' : rating)}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        ratingFilter === rating
                          ? 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30'
                          : 'bg-background/30 backdrop-blur-sm border border-primary/20 hover:border-yellow-500/40 text-base-content hover:bg-background/50'
                      }`}
                    >
                      <HiStar className="w-3 h-3" />
                      <span>{rating}+</span>
                    </button>
                  ))}
                  
                  <div className="w-px h-6 bg-border"></div>
                  
                  {/* Price Quick Filters */}
                  <button
                    onClick={() => setPriceRange(priceRange.max === '200' ? { min: '', max: '' } : { min: '', max: '200' })}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      priceRange.max === '200'
                        ? 'bg-secondary/20 text-secondary border border-secondary/30'
                        : 'bg-background/30 backdrop-blur-sm border border-primary/20 hover:border-secondary/40 text-base-content hover:bg-background/50'
                    }`}
                  >
                    <HiCurrencyDollar className="w-3 h-3" />
                    <span>Under 200 BDT</span>
                  </button>
                  
                  <button
                    onClick={() => setPriceRange(priceRange.min === '200' ? { min: '', max: '' } : { min: '200', max: '' })}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      priceRange.min === '200'
                        ? 'bg-secondary/20 text-secondary border border-secondary/30'
                        : 'bg-background/30 backdrop-blur-sm border border-primary/20 hover:border-secondary/40 text-base-content hover:bg-background/50'
                    }`}
                  >
                    <HiCurrencyDollar className="w-3 h-3" />
                    <span>200+ BDT</span>
                  </button>
                </div>

                {/* Meals Grid - 4 cards per row on desktop with Daily Meals styling */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {meals.map((meal, index) => (
                    <motion.div
                      key={meal._id}
                      className="group card-modern overflow-hidden cursor-pointer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                      whileHover={{ y: -8 }}
                    >
                      {/* Image Container */}
                      <div className="relative overflow-hidden">
                        <img
                          src={meal.image}
                          alt={meal.foodName}
                          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        
                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Favorite Button */}
                        <motion.button 
                          className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95"
                          whileHover={{ rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <HiHeart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-200" />
                        </motion.button>

                        {/* Rating Badge */}
                        <motion.div 
                          className="absolute top-4 left-4 flex items-center space-x-1 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-yellow-200"
                          initial={{ scale: 0, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                          <HiStar className="w-4 h-4 text-yellow-500 drop-shadow-sm" />
                          <span className="text-sm font-bold text-gray-800">{meal.rating}</span>
                        </motion.div>

                        {/* Quick View Button */}
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <motion.button
                            onClick={() => window.location.href = `/meal-details/${meal._id}`}
                            className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-yellow-400 text-black font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Button Background Glow */}
                            <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                            
                            {/* Button Content */}
                            <div className="relative flex items-center justify-center space-x-2">
                              <span className="text-sm font-bold">View Details</span>
                              <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>
                            
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-500"></div>
                          </motion.button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Header */}
                        <div>
                          <h3 className="text-xl font-semibold text-base-content group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
                            {meal.foodName}
                          </h3>
                          <p className="text-sm text-muted mt-1">by {meal.chefName}</p>
                        </div>

                        {/* Details */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1 text-muted">
                              <HiLocationMarker className="w-4 h-4" />
                              <span className="truncate">{meal.deliveryArea}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-muted">
                              <HiSparkles className="w-4 h-4" />
                              <span>{meal.chefExperience}y exp</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center gap-3 pt-4 border-t border-color min-h-[60px] price-container">
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center">
                              <span className="text-xl sm:text-2xl font-bold text-primary price-with-currency transition-all duration-200">৳{meal.price}</span>
                            </div>
                            <span className="text-xs text-success font-medium mt-1">Free delivery</span>
                          </div>
                          
                          <motion.button
                            onClick={() => window.location.href = `/meal-details/${meal._id}`}
                            className="group/order relative bg-gradient-to-r from-accent to-green-500 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 overflow-hidden flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Button Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-accent opacity-0 group-hover/order:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Button Content */}
                            <div className="relative flex items-center space-x-1.5 sm:space-x-2">
                              <span className="text-xs sm:text-sm font-bold whitespace-nowrap">Order Now</span>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full opacity-0 group-hover/order:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            
                            {/* Pulse Effect */}
                            <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-hover/order:scale-100 opacity-0 group-hover/order:opacity-100 transition-all duration-300"></div>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Modern Pagination */}
            {totalMeals > 0 && (
              <motion.div
                className="mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {/* Pagination Info */}
                <div className="text-center mb-6">
                  <p className="text-muted">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalMeals)} of {totalMeals} meals
                  </p>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-center space-x-2">
                  {/* Previous Button */}
                  <motion.button
                    onClick={() => setPage(page - 1)}
                    disabled={!hasPrevPage}
                    className="group flex items-center space-x-2 px-4 py-3 bg-background/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 text-base-content hover:text-primary font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-primary/20 disabled:hover:text-base-content"
                    whileHover={{ scale: hasPrevPage ? 1.05 : 1 }}
                    whileTap={{ scale: hasPrevPage ? 0.95 : 1 }}
                  >
                    <HiChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </motion.button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {/* First Page */}
                    {page > 3 && (
                      <>
                        <motion.button
                          onClick={() => setPage(1)}
                          className="px-4 py-3 bg-surface border border-color hover:border-primary text-base-content hover:text-primary font-medium rounded-xl transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          1
                        </motion.button>
                        {page > 4 && (
                          <span className="px-2 text-muted">...</span>
                        )}
                      </>
                    )}

                    {/* Page Range */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      if (pageNum < 1 || pageNum > totalPages) return null;

                      return (
                        <motion.button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-3 font-medium rounded-xl transition-all duration-300 ${
                            pageNum === page
                              ? "pagination-active-dark shadow-lg scale-110"
                              : "bg-background/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 text-base-content hover:text-primary"
                          }`}
                          whileHover={{ scale: pageNum === page ? 1.1 : 1.05 }}
                          whileTap={{ scale: pageNum === page ? 1.1 : 0.95 }}
                        >
                          {pageNum}
                        </motion.button>
                      );
                    })}

                    {/* Last Page */}
                    {page < totalPages - 2 && totalPages > 5 && (
                      <>
                        {page < totalPages - 3 && (
                          <span className="px-2 text-muted">...</span>
                        )}
                        <motion.button
                          onClick={() => setPage(totalPages)}
                          className="px-4 py-3 bg-surface border border-color hover:border-primary text-base-content hover:text-primary font-medium rounded-xl transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {totalPages}
                        </motion.button>
                      </>
                    )}
                  </div>

                  {/* Next Button */}
                  <motion.button
                    onClick={() => setPage(page + 1)}
                    disabled={!hasNextPage}
                    className="group flex items-center space-x-2 px-4 py-3 bg-background/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 text-base-content hover:text-primary font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-primary/20 disabled:hover:text-base-content"
                    whileHover={{ scale: hasNextPage ? 1.05 : 1 }}
                    whileTap={{ scale: hasNextPage ? 0.95 : 1 }}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <HiChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Quick Jump (for large datasets) */}
                {totalPages > 10 && (
                  <div className="flex items-center justify-center mt-6 space-x-4">
                    <span className="text-sm text-muted">Jump to page:</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={page}
                        onChange={(e) => {
                          const newPage = parseInt(e.target.value);
                          if (newPage >= 1 && newPage <= totalPages) {
                            setPage(newPage);
                          }
                        }}
                        className="w-20 px-3 py-2 bg-surface border border-color hover:border-primary focus:border-primary rounded-lg transition-colors focus:outline-none text-center"
                      />
                      <span className="text-sm text-muted">of {totalPages}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Meals;
