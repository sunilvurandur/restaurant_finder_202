import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../../../services/API";
import RestaurantModal from "../../../components/shared/RestaurantModal"; // Import the modal component
import "../../../styles/Layout.css";


const ViewListings = () => {
  // const currentUser = useSelector((state) => state.auth.user); // Get current user from Redux
  const businessOwnerData = JSON.parse(localStorage.getItem("businessOwnerData"));
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null); // Track the selected listing
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 8;

  // Fetch listings for the current user
  const getUserListings = async () => {
    if (!businessOwnerData) return;

    try {
      const { data } = await API.get(`/business-owner/getRestaurants/${businessOwnerData.owner.id}`);
      if (data) {
        setListings(data.listing);
      }
    } catch (error) {
      console.error("Error fetching user listings:", error);
      
    }
  };

  useEffect(() => {
    if(businessOwnerData)
    getUserListings();
  }, []);

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
