import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { AuthContext } from "../../../Context/AuthContext";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState({});
  const { user } = useContext(AuthContext);

  const fetchReviews = async () => {
    if (!user?.email) return;

    try {
      const res = await fetch(
        `https://local-chef-bazaar-server-flame.vercel.app/reviews/user/${user.email}`
      );
      const data = await res.json();
      if (data.success) setReviews(data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [user]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(
            `https://local-chef-bazaar-server-flame.vercel.app/reviews/${id}`,
            {
              method: "DELETE",
            }
          );
          const data = await res.json();
          if (data.success) {
            Swal.fire("Deleted!", "Your review has been deleted.", "success");
            fetchReviews();
          } else {
            Swal.fire("Error!", "Failed to delete review.", "error");
          }
        } catch (err) {
          console.error(err);
          Swal.fire("Error!", "Failed to delete review.", "error");
        }
      }
    });
  };

  const openUpdateModal = (review) => {
    setCurrentReview(review);
    setModalIsOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://local-chef-bazaar-server-flame.vercel.app/reviews/${currentReview._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: currentReview.rating,
            comment: currentReview.comment,
          }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Review updated!");
        fetchReviews();
        setModalIsOpen(false);
      } else {
        toast.error("Failed to update review!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update review!");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="p-4 border rounded-lg bg-gray-800 text-white"
            >
              <h2 className="font-semibold">{review.mealName}</h2>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
              <p>Date: {new Date(review.date).toLocaleDateString()}</p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleDelete(review._id)}
                  className="bg-red-600 px-2 py-1 rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => openUpdateModal(review)}
                  className="bg-blue-600 px-2 py-1 rounded"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="bg-gray-900 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
      >
        <h2 className="text-xl mb-4">Update Review</h2>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <input
            type="number"
            min="1"
            max="5"
            value={currentReview.rating || ""}
            onChange={(e) =>
              setCurrentReview({ ...currentReview, rating: e.target.value })
            }
            placeholder="Rating (1-5)"
            className="p-2 rounded text-white"
          />
          <textarea
            value={currentReview.comment || ""}
            onChange={(e) =>
              setCurrentReview({ ...currentReview, comment: e.target.value })
            }
            placeholder="Comment"
            className="p-2 rounded text-white"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalIsOpen(false)}
              className="bg-gray-600 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="bg-green-600 px-4 py-2 rounded">
              Update
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyReviews;
