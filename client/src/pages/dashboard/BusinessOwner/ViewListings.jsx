import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../../../services/API";
import "../../../styles/Layout.css";

const ViewListings = () => {
  const currentUser = useSelector((state) => state.auth.user); // Get current user from Redux
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 8;

  // Fetch listings for the current user
  const getUserListings = async () => {
    if (!currentUser?.id) return; // Ensure the user is authenticated

    try {
      const { data } = await API.get(`/listings?ownerId=${currentUser.id}`); // Fetch listings for the current user
      if (data?.success) {
        setListings(data.listings);
      }
    } catch (error) {
      console.error("Error fetching user listings:", error);
    }
  };

  useEffect(() => {
    getUserListings();
  }, [currentUser]);

  // Calculate total pages
  const totalPages = Math.ceil(listings.length / listingsPerPage);

  // Get the listings for the current page
  const currentListings = listings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  );

  // Function to calculate the average rating of reviews
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "No ratings";
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1); // Rounded to one decimal place
  };

  return (
    <div className="listing-page-container">
      <h2>Your Listings</h2>

      {!selectedListing ? (
        <div className="listing-grid-container">
          {listings.length === 0 ? (
            <div className="text-center mt-4">
              <h4>No Listings Found</h4>
              <p>You currently have no listings available.</p>
            </div>
          ) : (
            <>
              {/* Display listing cards */}
              <div className="listing-grid">
                {currentListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="listing-card"
                    onClick={() => setSelectedListing(listing)}
                  >
                    <h3>{listing.name}</h3>
                    <p>
                      <strong>Address:</strong> {listing.address}
                    </p>
                    <p>
                      <strong>Average Rating:</strong>{" "}
                      {calculateAverageRating(listing.reviews)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Conditionally render pagination */}
              {listings.length > 0 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn btn-previous"
                  >
                    Previous
                  </button>
                  <span className="page-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn btn-next"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div>
          <h3>{selectedListing.name}</h3>
          <p>Description: {selectedListing.description}</p>
          <p>Address: {selectedListing.address}</p>
          <p>Contact Info: {selectedListing.contactInfo}</p>
          <p>Operating Hours: {selectedListing.hours}</p>
          <p>Category: {selectedListing.category}</p>
          <p>Average Rating: {calculateAverageRating(selectedListing.reviews)}</p>

          <button
            onClick={() => setSelectedListing(null)}
            className="btn btn-secondary"
          >
            Back to Listings
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewListings;
