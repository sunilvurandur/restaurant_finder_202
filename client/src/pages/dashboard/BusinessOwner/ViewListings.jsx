import React, { useState, useEffect } from "react";
import API from "../../../services/API";
import RestaurantModal from "../../../components/shared/RestaurantModal"; // Import the modal component
import "../../../styles/Layout.css";

const ViewListings = () => {
  // Initialize businessOwnerData once
  const [businessOwnerData, setBusinessOwnerData] = useState(() => {
    const data = localStorage.getItem("businessOwnerData");
    return data ? JSON.parse(data) : null;
  });
  
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null); // Track the selected listing
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const listingsPerPage = 8;

  // Fetch listings for the current user
  const getUserListings = async () => {
    if (!businessOwnerData) {
      console.error("Business owner data is missing.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await API.get(`/business-owner/getRestaurants/${businessOwnerData.owner.id}`);
      
      // Debugging: Log the entire response
      console.log("API Response:", response);

      // Ensure that data.lisiting exists and is an array
      const fetchedListings = Array.isArray(response.data.listing) ? response.data.listing : [];
      
      // Debugging: Log the fetched listings
      console.log("Fetched Listings:", fetchedListings);

      setListings(fetchedListings);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      setError("Failed to load listings. Please try again later.");
      setListings([]); // Default to an empty array on error
    } finally {
      setIsLoading(false); // Data fetching is complete
    }
  };

  useEffect(() => {
    if (businessOwnerData) {
      getUserListings();
    } else {
      console.warn("No business owner data found in localStorage.");
      setIsLoading(false);
    }
  }, [businessOwnerData]);

  // Calculate total pages
  const totalPages = Math.ceil(listings.length / listingsPerPage);

  // Get the listings for the current page
  const currentListings = listings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  );

  // Function to calculate the average rating of reviews
  const calculateAverageRating = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return "No ratings";
    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1); // Rounded to one decimal place
  };

  // Open modal with selected listing
  const handleListingClick = (listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedListing(null);
  };

  return (
    <div className="listing-page-container">
      <h2>Your Listings</h2>

      <div className="listing-grid-container">
        {isLoading ? (
          <div className="text-center mt-4">
            <h4>Loading Listings...</h4>
          </div>
        ) : error ? (
          <div className="text-center mt-4">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
        ) : Array.isArray(listings) && listings.length === 0 ? (
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
                  onClick={() => handleListingClick(listing)} // Open modal on click
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
            {listings.length > listingsPerPage && (
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

      {/* Render the modal */}
      {selectedListing && (
        <RestaurantModal
          show={showModal}
          onHide={handleCloseModal}
          restaurant={selectedListing}
        />
      )}
    </div>
  );
};

export default ViewListings;
