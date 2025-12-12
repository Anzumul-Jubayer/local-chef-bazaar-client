import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { AuthContext } from "../../../Context/AuthContext";
import { Helmet } from "react-helmet";

const MyFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchFavorites = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:3000/favorites/${user.email}`);
      const data = await res.json();
      if (data.success) setFavorites(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load favorites!");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  // Delete favorite
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this meal from favorites?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:3000/favorites/${id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (data.success) {
            toast.success("Meal removed from favorites successfully!");
            fetchFavorites();
          } else {
            toast.error("Failed to remove meal!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Failed to remove meal!");
        }
      }
    });
  };

  if (!user)
    return (
      <p className="text-center text-white mt-20">
        Please log in to see your favorites.
      </p>
    );

  return (
    <>
      <Helmet>
        <title>Favorite Meals | Local Chef Bazar</title>
      </Helmet>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6 text-white">
          My Favorite Meals
        </h1>
        {favorites.length === 0 ? (
          <p className="text-white">No favorite meals yet.</p>
        ) : (
          <div className="w-full overflow-x-auto rounded-lg shadow-lg border border-gray-700">
            <table className="w-full min-w-[600px] table-auto text-white">
              <thead>
                <tr className="bg-gray-800 text-xs sm:text-sm">
                  <th className="px-3 sm:px-4 py-2 border border-gray-700">
                    Meal Name
                  </th>
                  <th className="px-3 sm:px-4 py-2 border border-gray-700">
                    Chef Name
                  </th>
                  <th className="px-3 sm:px-4 py-2 border border-gray-700">
                    Price
                  </th>
                  <th className="px-3 sm:px-4 py-2 border border-gray-700">
                    Date Added
                  </th>
                  <th className="px-3 sm:px-4 py-2 border border-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {favorites.map((fav) => (
                  <tr
                    key={fav._id}
                    className="bg-gray-900 text-xs sm:text-sm hover:bg-gray-800 transition"
                  >
                    <td className="px-3 sm:px-4 py-2 border border-gray-700">
                      {fav.mealName}
                    </td>
                    <td className="px-3 sm:px-4 py-2 border border-gray-700">
                      {fav.chefName}
                    </td>
                    <td className="px-3 sm:px-4 py-2 border border-gray-700">
                      ${fav.price}
                    </td>
                    <td className="px-3 sm:px-4 py-2 border border-gray-700">
                      {new Date(fav.addedTime).toLocaleDateString()}
                    </td>
                    <td className="px-3 sm:px-4 py-2 border border-gray-700 text-center">
                      <button
                        onClick={() => handleDelete(fav._id)}
                        className="bg-red-600 hover:bg-red-700 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
      </div>
    </>
  );
};

export default MyFavorites;
