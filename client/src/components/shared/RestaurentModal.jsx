import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";

const RestaurentModal = ({ show, onHide, restaurant }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmitReview = async () => {
    if (!rating || !review.trim()) {
      setMessage("Please provide both a rating and a review.");
      return;
    }

    const payload = {
      user_id: "2", // Replace with dynamic user ID if available
      username: "sunil", // Replace with dynamic username if available
      review,
      restaurant_id: restaurant.id,
      rating,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/users/addReview",
        payload
      );
      setMessage(response.data.message);
      setReview("");
      setRating(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Failed to submit the review. Please try again.");
    }
  };

  if (!restaurant) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{restaurant.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Restaurant Details */}
        <div>
          <p><strong>Address:</strong> {restaurant.address}</p>
          <p><strong>Description:</strong> {restaurant.description}</p>
          <p><strong>Cuisine:</strong> {restaurant.category.join(", ")}</p>
          <p><strong>Price Range:</strong> {restaurant.price_range}</p>
          <p><strong>Operating Hours:</strong> {restaurant.hours?.sunday}</p>
        </div>

        {/* Reviews Section */}
        <div
          style={{
            marginTop: "20px",
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <h5>Reviews</h5>
          {restaurant.reviews?.length > 0 ? (
            restaurant.reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  marginBottom: "10px",
                  paddingBottom: "10px",
                }}
              >
                <p>
                  <strong>{review.username}</strong>{" "}
                  <span style={{ color: "#ffcc00" }}>
                    {"★".repeat(review.rating)}
                  </span>
                  <span style={{ color: "#ddd" }}>
                    {"★".repeat(5 - review.rating)}
                  </span>
                </p>
                <p>{review.review}</p>
                <p style={{ fontSize: "12px", color: "#999" }}>
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No reviews yet. Be the first to review!</p>
          )}
        </div>

        {/* Add Review Section */}
        <div style={{ marginTop: "20px" }}>
          <h5>Add a Review</h5>
          <textarea
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              marginBottom: "10px",
            }}
          />
          <div style={{ marginBottom: "10px" }}>
            <label style={{ marginRight: "10px" }}>Rating:</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                style={{
                  padding: "5px 10px",
                  marginRight: "5px",
                  borderRadius: "5px",
                  backgroundColor: rating === star ? "#007bff" : "#ddd",
                  color: rating === star ? "#fff" : "#000",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {star}★
              </button>
            ))}
          </div>
          <Button variant="primary" onClick={handleSubmitReview}>
            Submit Review
          </Button>
          {message && (
            <p style={{ color: message.includes("successfully") ? "green" : "red", marginTop: "10px" }}>
              {message}
            </p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RestaurentModal;
