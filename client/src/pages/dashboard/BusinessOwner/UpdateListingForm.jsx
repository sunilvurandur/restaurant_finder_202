import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import API from "../../../services/API";
import InputType from "../../../components/shared/Form/InputType";

const UpdateListingForm = () => {
  const currentUser = useSelector((state) => state.auth.user); // Get current user from Redux
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [formData, setFormData] = useState({
    photos: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 5;
  const [loading, setLoading] = useState(false);

  // Fetch listings owned by the current user
  const getUserListings = async () => {
    if (!currentUser?.id) return; // Ensure the user is authenticated

    try {
      const { data } = await API.get(`/get-user-lisitngs/${currentUser.id}`); // Fetch listings for the current user
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

  // Pagination logic
  const totalPages = Math.ceil(listings.length / listingsPerPage);
  const currentListings = listings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  );

  const handleSelectListing = (listing) => {
    setSelectedListing(listing);
    const photosWithPreview = (listing.photos || []).map((file) => ({
      file,
      url: file, // Use existing URL for photos from the backend
    }));
    setFormData({ ...listing, photos: photosWithPreview });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length > 10) {
      alert("You can only upload a maximum of 10 photos");
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFormData({
      ...formData,
      photos: [...formData.photos, ...newPhotos],
    });
  };

  const handleImageDelete = (index) => {
    const updatedPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      photos: updatedPhotos,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "photos") {
          formData.photos.forEach((photo) =>
            formDataToSend.append("photos", photo.file || photo.url)
          );
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const { data } = await API.put(`/get-user-lisitngs/${selectedListing.id}`, formDataToSend);
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
              {/* Display listing cards */}
              <div className="listing-grid">
                {currentListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="listing-card"
                    onClick={() => handleSelectListing(listing)}
                  >
                    <h3>{listing.name}</h3>
                    <p>
                      <strong>Address:</strong> {listing.address}
                    </p>
                    <p>
                      <strong>Owner:</strong> {listing.ownerName}
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
        <form onSubmit={handleSubmit}>
          <h3>Update {formData.name}</h3>

          <InputType
            labelText="Name"
            labelFor="name"
            inputType="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <InputType
            labelText="Address"
            labelFor="address"
            inputType="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <InputType
            labelText="Contact Info"
            labelFor="contactInfo"
            inputType="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
          />
          <InputType
            labelText="Operating Hours"
            labelFor="hours"
            inputType="text"
            name="hours"
            value={formData.hours}
            onChange={handleChange}
          />

          <div className="mb-1">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="Description"
            />
          </div>

          <div className="mb-1">
            <label htmlFor="photos" className="form-label">
              Photos (Max 10)
            </label>
            <input
              type="file"
              name="photos"
              multiple
              onChange={handleImageUpload}
              className="form-control"
            />
            <div className="image-previews">
              {(formData.photos || []).map((photo, index) => (
                <div key={index} className="image-preview">
                  <img src={photo.url} alt={`preview ${index}`} />
                  <button type="button" onClick={() => handleImageDelete(index)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-1">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Category</option>
              <option value="Indian">Indian</option>
              <option value="Mexican">Mexican</option> <option value="Italian">Italian</option> </select>
               </div>
               <button type="submit" className="btn btn-primary">
        Update Listing
      </button>
      <button
        type="button"
        onClick={() => setSelectedListing(null)}
        className="btn btn-secondary"
      >
        Back to Listings
      </button>
    </form>
  )}

  {loading && <div className="spinner-border text-primary" role="status" />}
</div>
); };

export default UpdateListingForm;