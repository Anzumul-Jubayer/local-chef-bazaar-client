import React, { useEffect, useState } from "react";

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [sortOrder, setSortOrder] = useState("asc");
  const [area, setArea] = useState("");
  const [search, setSearch] = useState("");

  const fetchMeals = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page,
        limit,
        sort: sortOrder,
        area,
        search,
      });

      const res = await fetch(`http://localhost:3000/meals?${queryParams}`);
      const data = await res.json();
      setMeals(data.data);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [page, sortOrder, area, search]);

  return (
    <div className="min-h-screen px-4 py-10 bg-neutral text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Meals</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Search Food"
          className="p-2 rounded text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Delivery Area"
          className="p-2 rounded text-white"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
        <select
          className="p-2 rounded text-white"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Price Low → High</option>
          <option value="desc">Price High → Low</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center">
          Loading meals{" "}
          <span className="loading loading-dots loading-xs"></span>
        </p>
      ) : meals.length === 0 ? (
        <p className="text-center">No meals found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div
              key={meal._id}
              className="bg-neutral/80 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={meal.image}
                alt={meal.foodName}
                className="w-full h-40 object-cover rounded mb-3"
              />
              <h3 className="text-xl font-semibold">{meal.foodName}</h3>
              <p>Chef: {meal.chefName}</p>
              <p>Price: {meal.price} BDT</p>
              <p>Rating: {meal.rating} ⭐</p>
              <p>Delivery Area: {meal.deliveryArea}</p>
              <button
                className="mt-3 w-full py-2 bg-primary rounded hover:bg-[#b9932c] transition"
                onClick={() => {
                  window.location.href = `/meals/${meal._id}`;
                }}
              >
                See Details
              </button>
            </div>
          ))}
        </div>
      )}

      
      <div className="flex justify-center mt-6 gap-3">
        <button
          className="px-4 py-2 bg-primary rounded disabled:bg-gray-500"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-4 py-2">{page}</span>
        <button
          className="px-4 py-2 bg-primary rounded"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Meals;
