import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SubmitReviewForm = ({ restaurantId }) => {
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Submitted review for ${restaurantId}: Rating - ${rating}, Review - ${review}`);
    // Add logic for submitting review
    setReview('');
    setRating(1);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3 style={{ textAlign: "center", marginBottom: "15px" }}>Submit a Review</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label style={{ fontWeight: "bold" }}>Rating:</label>
        <select 
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ padding: "8px", fontSize: "16px", borderRadius: "4px" }}
        >
          {[1, 2, 3, 4, 5].map((rate) => (
            <option key={rate} value={rate}>{rate}</option>
          ))}
        </select>
        
        <label style={{ fontWeight: "bold" }}>Review:</label>
        <textarea 
          placeholder="Write your review here..." 
          value={review} 
          onChange={(e) => setReview(e.target.value)}
          style={{ padding: "10px", fontSize: "16px", borderRadius: "4px", height: "100px", resize: "vertical" }}
        ></textarea>
        
        <button type="submit" style={{ padding: "10px", fontSize: "16px", fontWeight: "bold", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Submit
        </button>
      </form>
    </div>
  );
};

SubmitReviewForm.propTypes = {
  restaurantId: PropTypes.string.isRequired,
};

export default SubmitReviewForm;
