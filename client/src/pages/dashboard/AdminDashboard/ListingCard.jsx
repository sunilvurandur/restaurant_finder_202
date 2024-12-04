import React from "react";
import "../../../styles/Layout.css";

// Function to calculate the average rating if not pre-calculated
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return "No ratings";
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (totalRating / reviews.length).toFixed(1); // Rounded to 1 decimal place
};

const ListingCard = ({ listing, onDelete, highlight }) => {
  const avgRating = listing.avgRating || calculateAverageRating(listing.reviews);

  return (
    <div className={`listing-card ${highlight ? "highlight" : ""}`}>
      <h4>{listing.name}</h4>
      <p>
        <strong>Owner:</strong> {listing.ownerName}
      </p>
      <p>
        <strong>Address:</strong> {listing.address}
      </p>
      <p>
        <strong>Contact:</strong> {listing.contactInfo}
      </p>
      <p>
        <strong>Average Rating:</strong> {avgRating}
      </p>
      <button onClick={() => onDelete(listing.id)}>Delete</button>
    </div>
  );
};

export default ListingCard;
