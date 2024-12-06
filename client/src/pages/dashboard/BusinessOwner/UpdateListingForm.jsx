import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../../../services/API";
import ListingFormFields from "./ListingFormFields";

const UpdateListingForm = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactInfo: "",
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
    category: "",
    foodType: [],
    priceRange: "",
    coverPhoto: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 5;
  const [loading, setLoading] = useState(false);

  const getUserListings = async () => {
    if (!currentUser?.id) return;

    try {
      const { data } = await API.get(`/get-user-listings/${currentUser.id}`);
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

  const totalPages = Math.ceil(listings.length / listingsPerPage);
  const currentListings = listings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  );

  const handleSelectListing = (listing) => {
    setSelectedListing(listing);

    // Initialize formData from the selected listing
    setFormData({
      name: listing.name || "",
      address: listing.address || "",
      contactInfo: listing.contactInfo || "",
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
      category: listing.category || "",
      foodType: listing.foodType || [],
      priceRange: listing.priceRange || "",
      coverPhoto: listing.coverPhoto || null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      const serializedHours = JSON.stringify(formData.hours);
      const serializedFoodType = JSON.stringify(formData.foodType);

      formData.photos.forEach((photo) => {
        // If the photo is already a URL string, we may need logic on the backend
        // to handle existing photos. For simplicity, assume they are File objects now.
        // If they are URLs, the server should handle them accordingly.
        if (photo instanceof File) {
          formDataToSend.append("photos", photo);
        } else {
          // For existing URLs, append them differently or send in JSON
          // E.g., formDataToSend.append("existingPhotos", photo);
        }
      });

      if (formData.coverPhoto) {
        if (formData.coverPhoto instanceof File) {
          formDataToSend.append("coverPhoto", formData.coverPhoto);
        } else {
          // If it's a URL string (existing photo), handle accordingly
          // e.g. formDataToSend.append("existingCoverPhoto", formData.coverPhoto);
        }
      }

      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("contactInfo", formData.contactInfo);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("hours", serializedHours);
      formDataToSend.append("foodType", serializedFoodType);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("priceRange", formData.priceRange);

      const { data } = await API.put(`/update-listing/${selectedListing.id}`, formDataToSend,{
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
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      alert("Failed to update listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Update Your Listings</h2>
      {!selectedListing ? (
        <div>
          {listings.length === 0 ? (
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
                    <p><strong>Owner:</strong> {listing.ownerName}</p>
                  </div>
                ))}
              </div>

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
          <ListingFormFields
            formData={formData}
            setFormData={setFormData}
            loading={loading}
            onSubmit={handleSubmit}
            mode="update"
          />
          <button
            type="button"
            onClick={() => setSelectedListing(null)}
            className="btn btn-secondary mt-2"
          >
            Back to Listings
          </button>
        </>
      )}
      {loading && <div className="spinner-border text-primary" role="status" />}
    </div>
  );
};

export default UpdateListingForm;
