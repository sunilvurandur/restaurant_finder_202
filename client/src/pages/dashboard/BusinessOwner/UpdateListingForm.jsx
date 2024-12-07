import React, { useState, useEffect } from "react";
import API from "../../../services/API";
import ListingFormFields from "./ListingFormFields";
import "../../../styles/Layout.css";

const UpdateListingForm = () => {
  // Initialize businessOwnerData once and ensure it's stable
  const [businessOwnerData, setBusinessOwnerData] = useState(() => {
    try {
      const data = localStorage.getItem("businessOwnerData");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to parse businessOwnerData:", error);
      return null;
    }
  });

  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [formData, setFormData] = useState({
    id: "", // Will be set when a listing is selected
    name: "",
    address: "",
    description: "",
    hours: {
      sunday: { opening: "", closing: "" },
      monday: { opening: "", closing: "" },
      tuesday: { opening: "", closing: "" },
      wednesday: { opening: "", closing: "" },
      thursday: { opening: "", closing: "" },
      friday: { opening: "", closing: "" },
      saturday: { opening: "", closing: "" },
    },
    photos: [],
    category: [],
    priceRange: "",
    coverPhoto: null,
    latitude: "",
    longitude: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 5;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state

  // Fetch listings for the current user
  const getUserListings = async () => {
    if (!businessOwnerData) {
      console.error("Business owner data is missing.");
      setError("Business owner data is missing.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/business-owner/getRestaurants/${businessOwnerData.owner.id}`);
      
      // Debugging: Log the entire response
      console.log("API Response:", response);

      // Ensure that data.lisiting exists and is an array (due to typo)
      const fetchedListings = Array.isArray(response.data.lisiting) ? response.data.lisiting : [];
      
      // Debugging: Log the fetched listings
      console.log("Fetched Listings:", fetchedListings);

      setListings(fetchedListings);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      setError("Failed to load listings. Please try again later.");
      setListings([]); // Default to an empty array on error
    } finally {
      setLoading(false); // Data fetching is complete
    }
  };

  useEffect(() => {
    if (businessOwnerData) {
      getUserListings();
    } else {
      console.warn("No business owner data found in localStorage.");
      setError("No business owner data found.");
    }
    // The dependency array is intentionally left empty to run once on mount
  }, []); // Removed businessOwnerData from dependencies to prevent infinite loop

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
  const handleSelectListing = (listing) => {
    setSelectedListing(listing);

    // Initialize formData from the selected listing
    setFormData({
      id: listing.id || "",
      name: listing.name || "",
      address: listing.address || "",
      description: listing.description || "",
      hours: listing.hours || {
        sunday: { opening: "", closing: "" },
        monday: { opening: "", closing: "" },
        tuesday: { opening: "", closing: "" },
        wednesday: { opening: "", closing: "" },
        thursday: { opening: "", closing: "" },
        friday: { opening: "", closing: "" },
        saturday: { opening: "", closing: "" },
      },
      photos: listing.photos || [],
      category: listing.category || [],
      priceRange: listing.price_range || "", // Match API field name
      coverPhoto: listing.coverPhoto || null,
      latitude: listing.latitude || "",
      longitude: listing.longitude || "",
    });
  };

  // Handle form submission to update the listing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      const serializedHours = JSON.stringify(formData.hours);
      const serializedCategory = JSON.stringify(formData.category);

      formData.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formDataToSend.append("photos", photo);
        } else if (typeof photo === "string") {
          // Handle existing photo URLs if necessary
          formDataToSend.append("existingPhotos", photo);
        }
      });

      if (formData.coverPhoto) {
        if (formData.coverPhoto instanceof File) {
          formDataToSend.append("coverPhoto", formData.coverPhoto);
        } else if (typeof formData.coverPhoto === "string") {
          // Handle existing cover photo URL if necessary
          formDataToSend.append("existingCoverPhoto", formData.coverPhoto);
        }
      }

      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("hours", serializedHours);
      formDataToSend.append("category", serializedCategory);
      formDataToSend.append("priceRange", formData.priceRange);
      formDataToSend.append("latitude", formData.latitude);
      formDataToSend.append("longitude", formData.longitude);

      // Make sure selectedListing is defined
      if (!selectedListing) {
        throw new Error("No listing selected for update.");
      }

      const { data } = await API.put(`/business-owner/update-listing/${selectedListing.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data?.success) {
        alert("Listing updated successfully!");
        const updatedListings = listings.map((listing) =>
          listing.id === selectedListing.id ? data.listing : listing
        );
        setListings(updatedListings);
        setSelectedListing(null);
      } else {
        throw new Error(data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      alert("Failed to update listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-listing-container">
      <h2>Update Your Listings</h2>
      {!selectedListing ? (
        <div>
          {loading ? (
            <div className="text-center mt-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center mt-4">
              <h4>Error</h4>
              <p>{error}</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center mt-4">
              <h4>No Listings Found</h4>
              <p>You currently have no listings available for update.</p>
            </div>
          ) : (
            <>
              <div className="listing-grid">
                {currentListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="listing-card"
                    onClick={() => handleSelectListing(listing)}
                  >
                    <h3>{listing.name}</h3>
                    <p><strong>Address:</strong> {listing.address}</p>
                    {/* Removed ownerName as it's not in the API response */}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {listings.length > listingsPerPage && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn btn-secondary"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          <h3>Update {formData.name}</h3>
          <form onSubmit={handleSubmit}>
            <ListingFormFields
              formData={formData}
              setFormData={setFormData}
              loading={loading}
              mode="update"
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Listing"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setSelectedListing(null)}
            className="btn btn-secondary mt-2"
          >
            Back to Listings
          </button>
        </>
      )}
      {/* Optional: Display a spinner while loading */}
      {loading && selectedListing && (
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Updating...</span>
        </div>
      )}
    </div>
  );
};

export default UpdateListingForm;
