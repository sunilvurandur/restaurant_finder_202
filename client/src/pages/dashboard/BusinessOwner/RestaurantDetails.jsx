import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

const RestaurantDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock login status for demonstration
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"; // Example login state

  // Mock restaurant data (fallback)
  const mockRestaurants = [
    {
      id: 1,
      name: "San Jose Diner",
      description: "Classic American diner with a twist.",
      lat: 37.3382,
      lng: -121.8863,
      foodType: "Non-Vegetarian",
      price: "Medium",
      rating: 4,
      address: "123 Main St, San Jose, CA",
      hours: "9 AM - 9 PM",
      contact: "123-456-7890",
      reviews: [
        { user: "John Doe", comment: "Great food!", stars: 4 },
        { user: "Jane Smith", comment: "Loved the ambiance.", stars: 5 },
      ],
    },
    {
      id: 2,
      name: "Milpitas Grille",
      description: "Delicious BBQ and smoked meats.",
      lat: 37.4323,
      lng: -121.8996,
      foodType: "Non-Vegetarian",
      price: "High",
      rating: 5,
      address: "456 Elm St, Milpitas, CA",
      hours: "11 AM - 10 PM",
      contact: "987-654-3210",
      reviews: [],
    },
  ];

  const restaurant =
    location.state?.restaurant ||
    mockRestaurants.find((r) => r.id === parseInt(id));

  // Random data generator for missing fields
  const generateRandomData = () => ({
    address: `Random Address ${Math.floor(Math.random() * 1000)}, CA`,
    hours: `${Math.floor(Math.random() * 12 + 1)} AM - ${
      Math.floor(Math.random() * 12 + 1)
    } PM`,
    contact: `Random Phone: ${Math.floor(1000000000 + Math.random() * 9000000000)}`,
  });

  const randomData = generateRandomData();

  const [reviews, setReviews] = useState(restaurant?.reviews || []);
  const [reviewText, setReviewText] = useState("");
  const [reviewStars, setReviewStars] = useState(1);

  if (!restaurant) {
    return <p>Restaurant not found.</p>;
  }

  // Handle review submission
  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("You must be logged in to submit a review.");
      navigate("/login"); // Redirect to login page
      return;
    }

    if (!reviewText.trim()) {
      alert("Please provide a review description.");
      return;
    }

    const newReview = {
      user: "Current User", // Replace with actual user info after integration
      comment: reviewText,
      stars: reviewStars,
    };

    setReviews((prevReviews) => [...prevReviews, newReview]);
    setReviewText("");
    setReviewStars(1);

    alert("Thank you for your review!");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>{restaurant.name}</h1>
      <p><strong>Description:</strong> {restaurant.description || "Description not available"}</p>
      <p><strong>Address:</strong> {restaurant.address || randomData.address}</p>
      <p><strong>Contact:</strong> {restaurant.contact || randomData.contact}</p>
      <p><strong>Hours:</strong> {restaurant.hours || null}</p>
      <p><strong>Food Type:</strong> {restaurant.foodType || "Unknown"}</p>
      <p><strong>Price:</strong> {restaurant.price_range || "Unknown"}</p>
      <p><strong>Rating:</strong> {restaurant.rating || "Unknown"} Stars</p>

      <h3>Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              background: "#f9f9f9",
            }}
          >
            <p><strong>User:</strong> {review.user}</p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Rating:</strong> {review.stars} Stars</p>
          </div>
        ))
      ) : (
        <p>No reviews yet. Be the first to leave a review!</p>
      )}

      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmitReview}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <strong>Rating:</strong>
            <select
              value={reviewStars}
              onChange={(e) => setReviewStars(parseInt(e.target.value))}
              style={{ marginLeft: "10px", padding: "5px" }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star} Star{star > 1 && "s"}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>
            <strong>Review:</strong>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            ></textarea>
          </label>
        </div>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default RestaurantDetails;
