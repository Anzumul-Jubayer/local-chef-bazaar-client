import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";

const FavoriteMeals = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const res = await fetch(`http://localhost:3000/favorites?userEmail=${user?.email}`);
      const data = await res.json();
      if (data.success) setFavorites(data.data);
    };
    fetchFavorites();
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Favorite Meals</h2>
      {favorites.length === 0 ? (
        <p>No favorite meals yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {favorites.map(fav => (
            <div key={fav._id} className="bg-neutral/80 p-4 rounded-xl shadow-md">
              <p><strong>Meal:</strong> {fav.mealName}</p>
              <p><strong>Chef:</strong> {fav.chefName}</p>
              <p><strong>Price:</strong> {fav.price} BDT</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteMeals;
