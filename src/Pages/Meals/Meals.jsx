import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
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
  HiSparkles,
  HiArrowRight,
  HiUserGroup,
} from "react-icons/hi";
import { useLoadingState } from "../../hooks/useLoadingState";
import { buildApiUrl } from "../../config/api";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [totalMeals, setTotalMeals] = useState(0);
  const { withLoading } = useLoadingState();
  const [page, setPage] = useState(1);
  const [limit] = useState(8); // Fixed at 8 items per page
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy] = useState("price"); // Fixed to price only

  // Simplified filtering fields
  const [search, setSearch] = useState(""); // Field 1: Search
  const [area, setArea] = useState(""); // Field 2: Location
  const [ratingFilter, setRatingFilter] = useState(""); // Field 3: Rating Filter

  const [showFilters, setShowFilters] = useState(false);
  const [availableAreas] = useState([
    "Dhaka",
    "Chittagong",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barisal",
  ]);

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
            ...(ratingFilter && { minRating: ratingFilter }),
          });

          const res = await fetch(buildApiUrl(`/meals?${queryParams}`));
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
  }, [page, limit, sortOrder, sortBy, area, search, ratingFilter, withLoading]);

  const clearFilters = () => {
    setSearch("");
    setArea("");
    setRatingFilter("");
    setSortOrder("asc");
    setPage(1);
  };

  const hasActiveFilters =
    search || area || ratingFilter || sortOrder !== "asc";

  // Calculate pagination
  const totalPages = Math.ceil(totalMeals / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const ratingOptions = [
    { value: "", label: "Any Rating", description: "Meals with any rating" },
    { value: "4.5", label: "4.5+ Stars", description: "Excellent rated meals" },
    { value: "4.0", label: "4.0+ Stars", description: "Highly rated meals" },
    { value: "3.5", label: "3.5+ Stars", description: "Good rated meals" },
    { value: "3.0", label: "3.0+ Stars", description: "Average rated meals" },
    { value: "2.5", label: "2.5+ Stars", description: "Fair rated meals" },
  ];

  return (
    <>
      <Helmet>
        <title>Meals | LocalChefBazaar</title>
        <meta
          name="description"
          content="Discover delicious homemade meals from local chefs in your area. Browse, filter, and order fresh, authentic dishes."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-8 bg-background">
          <div className="container-modern">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
                <HiStar className="w-4 h-4" />
                <span>Local Chef Meals</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold text-base-content mb-4">
                Discover Amazing
                <span className="text-primary"> Local Meals</span>
              </h1>

              <p className="text-xl text-muted leading-relaxed mb-6">
                Explore authentic homemade dishes crafted by passionate local
                chefs. Fresh ingredients, traditional recipes, delivered to your
                door.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Sort Section */}
        <section className="py-6 bg-background">
          <div className="container-modern">
            {/* Search Subsection */}
            <div className="text-center mb-6 animate-fade-in">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-4">
                <HiSearch className="w-4 h-4" />
                <span>Search Meals</span>
              </div>
              <h2 className="text-3xl font-bold text-base-content mb-2">
                Find Your Perfect Meal
              </h2>
              <p className="text-muted">
                Search through hundreds of delicious homemade meals
              </p>
            </div>

            {/* Prominent Search Bar */}
            <div className="max-w-4xl mx-auto mb-6 animate-fade-in">
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
                      className="flex-1 py-6 text-lg bg-transparent text-base-content placeholder-gray-500 focus:outline-none"
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
                    <button className="mr-4 group/btn relative overflow-hidden bg-gradient-to-r from-primary to-yellow-400 text-black font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <div className="relative flex items-center space-x-2">
                        <HiSearch className="w-5 h-5" />
                        <span>Search</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-background/50 backdrop-blur-sm border border-primary/10 rounded-2xl p-6 shadow-sm animate-fade-in">
              {/* Sort Header */}
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <HiSortAscending className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content">
                    Sort Results
                  </h3>
                  <p className="text-sm text-muted">Arrange meals by price</p>
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                {/* Sort Order Toggle */}
                <div className="min-w-[220px]">
                  <label className="block text-sm font-semibold text-base-content mb-2">
                    Sort Order
                  </label>
                  <div className="flex bg-background/50 border border-primary/20 rounded-xl p-1 shadow-sm hover:shadow-md transition-all duration-300">
                    <button
                      onClick={() => setSortOrder("asc")}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        sortOrder === "asc"
                          ? "bg-primary text-black shadow-md transform scale-105"
                          : "text-base-content hover:bg-hover"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <HiArrowUp className="w-4 h-4" />
                        <span className="text-sm">Low to High</span>
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
                      <div className="flex items-center justify-center space-x-2">
                        <HiArrowDown className="w-4 h-4" />
                        <span className="text-sm">High to Low</span>
                      </div>
                    </button>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Currently showing{" "}
                    {sortOrder === "asc" ? "ascending" : "descending"} order
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-4 bg-background">
          <div className="container-modern">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-6 py-4 bg-background/50 backdrop-blur-sm border border-accent/20 hover:border-accent/40 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <HiFilter className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-base-content text-lg">
                      Filter Meals
                    </div>
                    <div className="text-sm text-muted">
                      {hasActiveFilters
                        ? `${
                            Object.values({ area, ratingFilter }).filter(
                              Boolean
                            ).length
                          } filters active`
                        : "Tap to set preferences"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {hasActiveFilters && (
                    <div className="w-4 h-4 bg-accent rounded-full animate-pulse"></div>
                  )}
                  <div
                    className={`transform transition-transform duration-300 ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  >
                    <HiChevronDown className="w-6 h-6 text-muted" />
                  </div>
                </div>
              </button>
            </div>

            {/* Filter Cards Grid */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } lg:block transition-all duration-400`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Location Filter Card */}
                <div className="bg-background/30 backdrop-blur-sm border border-accent/20 hover:border-accent/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-accent/10 rounded-xl">
                      <HiLocationMarker className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-base-content">
                        Location
                      </h3>
                      <p className="text-sm text-muted">
                        Filter by delivery area
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Location Dropdown */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">
                        Delivery Area
                      </label>
                      <div className="relative group">
                        <HiLocationMarker className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted group-hover:text-accent transition-colors" />
                        <select
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 bg-background/50 backdrop-blur-sm border border-accent/30 hover:border-accent/50 focus:border-accent rounded-xl transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium group-hover:bg-background/70"
                        >
                          <option value="">All Areas</option>
                          {availableAreas.map((areaOption) => (
                            <option key={areaOption} value={areaOption}>
                              {areaOption}
                            </option>
                          ))}
                        </select>
                        <HiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none group-hover:text-accent transition-colors" />
                      </div>
                      <p className="text-xs text-muted mt-1">
                        {area
                          ? `Showing meals available in ${area}`
                          : "Filter by delivery location"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Rating Filter Card */}
                <div className="bg-background/30 backdrop-blur-sm border border-primary/20 hover:border-primary/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <HiStar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-base-content">
                        Rating
                      </h3>
                      <p className="text-sm text-muted">
                        Filter by meal rating
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Rating Filter */}
                    <div>
                      <label className="block text-sm font-semibold text-base-content mb-2">
                        Minimum Rating
                      </label>
                      <div className="relative group">
                        <HiStar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary group-hover:text-primary/80 transition-colors" />
                        <select
                          value={ratingFilter}
                          onChange={(e) => setRatingFilter(e.target.value)}
                          className="w-full pl-12 pr-10 py-3 bg-background/50 backdrop-blur-sm border border-primary/30 hover:border-primary/50 focus:border-primary rounded-xl transition-all duration-300 focus:outline-none appearance-none cursor-pointer font-medium group-hover:bg-background/70"
                        >
                          {ratingOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              title={option.description}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <HiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted pointer-events-none group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs text-muted mt-1">
                        {ratingFilter
                          ? `Meals with ${ratingFilter}+ star rating`
                          : "Filter by minimum rating"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Active Filters & Clear Card */}
                <div className="bg-background/30 backdrop-blur-sm border border-accent/20 hover:border-accent/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-fade-in">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-accent/10 rounded-xl">
                      <HiAdjustments className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-base-content">
                        Active Filters
                      </h3>
                      <p className="text-sm text-muted">Current selections</p>
                    </div>
                  </div>

                  {hasActiveFilters ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                        {search && (
                          <span className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20 animate-fade-in">
                            <HiSearch className="w-3 h-3" />
                            <span className="truncate max-w-20">{search}</span>
                            <button
                              onClick={() => setSearch("")}
                              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                            >
                              <HiX className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        )}
                        {area && (
                          <span className="inline-flex items-center space-x-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium border border-accent/20 animate-fade-in">
                            <HiLocationMarker className="w-3 h-3" />
                            <span>{area}</span>
                            <button
                              onClick={() => setArea("")}
                              className="hover:bg-accent/20 rounded-full p-0.5 transition-colors"
                            >
                              <HiX className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        )}
                        {ratingFilter && (
                          <span className="inline-flex items-center space-x-2 px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-medium border border-yellow-500/20 animate-fade-in">
                            <HiStar className="w-3 h-3" />
                            <span>{ratingFilter}+ Stars</span>
                            <button
                              onClick={() => setRatingFilter("")}
                              className="hover:bg-yellow-500/20 rounded-full p-0.5 transition-colors"
                            >
                              <HiX className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={clearFilters}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-error/10 hover:bg-error/20 text-error border-2 border-error/20 hover:border-error/40 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                      >
                        <HiRefresh className="w-5 h-5" />
                        <span>Clear All Filters</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <HiFilter className="w-6 h-6 text-muted" />
                      </div>
                      <p className="text-muted font-medium text-sm">
                        No filters applied
                      </p>
                      <p className="text-xs text-muted mt-1">
                        Use filters above to refine search
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Meals Grid Section */}
        <section className="py-6 bg-background">
          <div className="container-modern">
            {meals.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-24 h-24 bg-muted/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HiSearch className="w-12 h-12 text-muted" />
                </div>
                <h3 className="text-2xl font-semibold text-base-content mb-4">
                  No meals found
                </h3>
                <p className="text-muted mb-6">
                  Try adjusting your search criteria or browse all available
                  meals.
                </p>
                <button onClick={clearFilters} className="btn-primary-modern">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Enhanced Results Count with Filter Summary */}
                <div className="bg-background/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 mb-6 shadow-sm animate-fade-in">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <p className="text-base-content font-medium">
                          Showing{" "}
                          <span className="font-bold text-primary">
                            {meals.length}
                          </span>{" "}
                          of{" "}
                          <span className="font-bold text-primary">
                            {totalMeals}
                          </span>{" "}
                          meals
                        </p>
                      </div>

                      {hasActiveFilters && (
                        <div className="flex items-center space-x-2 text-sm">
                          <HiFilter className="w-4 h-4 text-accent" />
                          <span className="text-muted">
                            {
                              Object.values({
                                search: search,
                                area: area,
                                rating: ratingFilter,
                              }).filter(Boolean).length
                            }{" "}
                            filters applied
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted">
                      <div className="flex items-center space-x-2">
                        <HiSortAscending className="w-4 h-4" />
                        <span>Sorted by Price</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {sortOrder === "asc" ? (
                          <HiArrowUp className="w-3 h-3" />
                        ) : (
                          <HiArrowDown className="w-3 h-3" />
                        )}
                        <span>
                          {sortOrder === "asc" ? "Low to High" : "High to Low"}
                        </span>
                      </div>
                      <div className="hidden sm:block w-px h-4 bg-border"></div>
                      <span className="hidden sm:inline">
                        Page {page} of {totalPages}
                      </span>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted">
                          {totalMeals === 0
                            ? "No meals match your criteria"
                            : totalMeals === 1
                            ? "1 meal matches your criteria"
                            : `${totalMeals} meals match your criteria`}
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

                {/* Meals Grid - 4 cards per row on desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {meals.map((meal, index) => (
                    <div
                      key={meal._id}
                      className="group card-modern overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
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
                        <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95">
                          <HiHeart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors duration-200" />
                        </button>

                        {/* Rating Badge - Enhanced to support float/decimal values */}
                        <div className="absolute top-4 left-4 flex items-center space-x-1 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-yellow-200 animate-fade-in">
                          <HiStar className="w-4 h-4 text-yellow-500 drop-shadow-sm" />
                          <span className="text-sm font-bold text-gray-800">
                            {typeof meal.rating === "number"
                              ? meal.rating.toFixed(1)
                              : meal.rating}
                          </span>
                        </div>

                        {/* Quick View Button */}
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <button
                            onClick={() =>
                              (window.location.href = `/meal-details/${meal._id}`)
                            }
                            className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-yellow-400 text-black font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 hover:-translate-y-1"
                          >
                            {/* Button Background Glow */}
                            <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>

                            {/* Button Content */}
                            <div className="relative flex items-center justify-center space-x-2">
                              <span className="text-sm font-bold">
                                View Details
                              </span>
                              <HiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </div>

                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-500"></div>
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        {/* Header */}
                        <div>
                          <h3 className="text-xl font-semibold text-base-content group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight">
                            {meal.foodName}
                          </h3>
                          <p className="text-sm text-muted mt-1">
                            by {meal.chefName}
                          </p>
                        </div>

                        {/* Details */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1 text-muted">
                              <HiLocationMarker className="w-4 h-4" />
                              <span className="truncate">
                                {meal.deliveryArea}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-muted">
                              <HiSparkles className="w-4 h-4" />
                              <span>{meal.chefExperience}y exp</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200 min-h-[60px] price-container">
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center">
                              <span className="text-xl sm:text-2xl font-bold text-primary price-with-currency transition-all duration-200">
                                ৳{meal.price}
                              </span>
                            </div>
                            <span className="text-xs text-success font-medium mt-1">
                              Free delivery
                            </span>
                          </div>

                          <button
                            onClick={() =>
                              (window.location.href = `/meal-details/${meal._id}`)
                            }
                            className="group/order relative bg-gradient-to-r from-accent to-green-500 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 overflow-hidden flex-shrink-0 hover:scale-105"
                          >
                            {/* Button Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-accent opacity-0 group-hover/order:opacity-100 transition-opacity duration-300"></div>

                            {/* Button Content */}
                            <div className="relative flex items-center space-x-1.5 sm:space-x-2">
                              <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
                                Order Now
                              </span>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full opacity-0 group-hover/order:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Pulse Effect */}
                            <div className="absolute inset-0 rounded-xl bg-white/20 scale-0 group-hover/order:scale-100 opacity-0 group-hover/order:opacity-100 transition-all duration-300"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Modern Pagination */}
            {totalMeals > 0 && (
              <div className="mt-12 animate-fade-in">
                {/* Pagination Info */}
                <div className="text-center mb-6">
                  <p className="text-muted">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, totalMeals)} of {totalMeals} meals
                  </p>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={!hasPrevPage}
                    className="group flex items-center space-x-2 px-4 py-3 bg-background/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 text-base-content hover:text-primary font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-primary/20 disabled:hover:text-base-content hover:scale-105 disabled:hover:scale-100"
                  >
                    <HiChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
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
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-3 font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
                            pageNum === page
                              ? "pagination-active-dark shadow-lg scale-110"
                              : "bg-background/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 text-base-content hover:text-primary"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={!hasNextPage}
                    className="group flex items-center space-x-2 px-4 py-3 bg-background/50 backdrop-blur-sm border border-primary/20 hover:border-primary/40 text-base-content hover:text-primary font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-primary/20 disabled:hover:text-base-content hover:scale-105 disabled:hover:scale-100"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <HiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Meals;
