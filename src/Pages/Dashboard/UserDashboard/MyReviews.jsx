import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(`http://localhost:3000/reviews?userEmail=${user?.email}`);
      const data = await res.json();
      if (data.success) setReviews(data.data);
    };
    fetchReviews();
  }, [user]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-neutral/80 p-4 rounded-xl shadow-md">
              <p><strong>Meal:</strong> {review.foodName}</p>
              <p><strong>Rating:</strong> {review.rating} ⭐</p>
              <p><strong>Comment:</strong> {review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
