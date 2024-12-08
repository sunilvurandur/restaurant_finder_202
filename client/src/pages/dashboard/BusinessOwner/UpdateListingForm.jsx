import React, { useState, useEffect } from "react";
import { Form, Row, Col, Carousel, Button, Dropdown } from "react-bootstrap";
import API from "../../../services/API";
import "../../../styles/Layout.css";

const UpdateListingForm = () => {
  // Retrieve business owner data from localStorage
  const [businessOwnerData, setBusinessOwnerData] = useState(() => {
    try {
      const data = localStorage.getItem("businessOwnerData");
      const parsedData = data ? JSON.parse(data) : null;
      console.log("Retrieved businessOwnerData:", parsedData); // Debugging log
      return parsedData;
    } catch (error) {
      console.error("Failed to parse businessOwnerData:", error);
      return null;
    }
  });

  // State to hold all listings
  const [listings, setListings] = useState([]);
  // State for the currently selected listing
  const [selectedListing, setSelectedListing] = useState(null);
  // State for form data
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
    description: "",
    contactInfo: "",
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 5;

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // States for address suggestions dropdown
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch listings for the current user
  const getUserListings = async () => {
    if (!businessOwnerData) {
      console.error("Business owner data is missing.");
      setError("Business owner data is missing.");
      return;
    }

    try {
      console.log("Fetching user listings for owner ID:", businessOwnerData.owner.id); // Debugging log
      setLoading(true);
      const response = await API.get(
        `/business-owner/getRestaurants/${businessOwnerData.owner.id}`
      );

      console.log("API Response Data:", response.data); // Debugging log

      // Corrected key (assuming 'listings' is the correct key)
      let fetchedListings = [];
      if (Array.isArray(response.data.listings)) {
        fetchedListings = response.data.listings;
      } else if (Array.isArray(response.data.listing)) {
        fetchedListings = response.data.listing;
      } else if (Array.isArray(response.data.data?.restaurants)) {
        fetchedListings = response.data.data.restaurants;
      } else {
        console.warn("Unexpected API response structure:", response.data);
        setError("Unexpected response from server.");
      }

      console.log("Fetched Listings:", fetchedListings); // Debugging log

      setListings(fetchedListings);
    } catch (error) {
      console.error("Error fetching user listings:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        setError(
          `Error: ${error.response.data.message || "Failed to load listings."}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("No response from server. Please try again later.");
      } else {
        console.error("Error Message:", error.message);
        setError("An unexpected error occurred.");
      }
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessOwnerData) {
      getUserListings();
    } else {
      console.warn("No business owner data found in localStorage.");
      setError("No business owner data found.");
    }
  }, []); // Run once on mount

  const totalPages = Math.ceil(listings.length / listingsPerPage);

  const currentListings = listings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  );

  const calculateAverageRating = (reviews) => {
    if (!Array.isArray(reviews) || reviews.length === 0) return "No ratings";
    const total = reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    return (total / reviews.length).toFixed(1);
  };

  const handleSelectListing = (listing) => {
    setSelectedListing(listing);

    setFormData({
      id: listing.id || "",
      name: listing.name || "",
      address: listing.address || "",
      description: listing.description || "",
      contactInfo: listing.contactInfo || "",
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
      priceRange: listing.price_range || "",
      coverPhoto: listing.coverPhoto || null,
      latitude: listing.latitude || "",
      longitude: listing.longitude || "",
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "address") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (name.includes("_")) {
      const [day, timeOfDay] = name.split("_");
      setFormData((prevState) => ({
        ...prevState,
        hours: {
          ...prevState.hours,
          [day]: {
            ...prevState.hours[day],
            [timeOfDay]: value,
          },
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle address search for suggestions
  const handleAddressSearch = async (query) => {
    try {
      const response = await API.post("/users/searchAddress", {
        address: query,
      });
      if (response.data && response.data.data.length > 0) {
        setSuggestions(response.data.data);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  // Handle key press in address input
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddressSearch(formData.address);
    }
  };

  // Handle clicking on an address suggestion
  const handleSuggestionClick = (suggestion) => {
    setFormData({
      ...formData,
      address: suggestion.formattedAddress,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
    setShowDropdown(false);
  };

  // Handle cover photo upload
  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      coverPhoto: file,
    });
  };

  // Handle additional photos upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      if (formData.photos.length + files.length > 10) {
        alert("You can only upload a maximum of 10 photos");
        return;
      }
      setFormData({
        ...formData,
        photos: [...formData.photos, ...files],
      });
    }
  };

  // Toggle category selection
  const toggleCategory = (cat, checked) => {
    const newCategory = checked
      ? [...formData.category, cat]
      : formData.category.filter((item) => item !== cat);
    setFormData({ ...formData, category: newCategory });
  };

  // Handle form submission to update the listing
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered"); // Debugging log
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      const serializedHours = JSON.stringify(formData.hours);
      const serializedCategory = JSON.stringify(formData.category);

      // Append each field
      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("contactInfo", formData.contactInfo);
      formDataToSend.append("hours", serializedHours);
      formDataToSend.append("category", serializedCategory);
      formDataToSend.append("priceRange", formData.priceRange);
      formDataToSend.append("latitude", formData.latitude);
      formDataToSend.append("longitude", formData.longitude);

      // Append photos
      formData.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formDataToSend.append("photos", photo);
        } else if (typeof photo === "string") {
          // Handle existing photo URLs if necessary
          formDataToSend.append("existingPhotos", photo);
        }
      });

      // Append cover photo
      if (formData.coverPhoto) {
        if (formData.coverPhoto instanceof File) {
          formDataToSend.append("coverPhoto", formData.coverPhoto);
        } else if (typeof formData.coverPhoto === "string") {
          // Handle existing cover photo URL if necessary
          formDataToSend.append("existingCoverPhoto", formData.coverPhoto);
        }
      }

      // Debugging: Log FormData entries
      for (let pair of formDataToSend.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Make sure selectedListing is defined
      if (!selectedListing) {
        throw new Error("No listing selected for update.");
      }
      console.log(formDataToSend);

      const { data } = await API.put(
        `/business-owner/update-listing/${selectedListing.id}`,
        formDataToSend,
        {
          // Let Axios set the Content-Type automatically
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Update API Response:", data); // Debugging log

      if (data?.success) {
        alert("Listing updated successfully!");
        const updatedListings = listings.map((listing) =>
          listing.id === selectedListing.id ? data.listing : listing
        );
        setListings(updatedListings);
        setSelectedListing(null);
        // Optionally, reset form data
        setFormData({
          id: "",
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
          category: [],
          priceRange: "",
          coverPhoto: null,
          latitude: "",
          longitude: "",
        });
      } else {
        throw new Error(data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
        alert(
          `Failed to update listing: ${
            error.response.data.message || "Unknown error."
          }`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Please try again later.");
      } else {
        console.error("Error Message:", error.message);
        alert("Failed to update listing. Please try again.");
      }
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
              <div
                className="spinner-border text-primary"
                role="status"
              >
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
                    <p>
                      <strong>Address:</strong> {listing.address}
                    </p>
                    {/* Optionally display average rating */}
                    <p>
                      <strong>Average Rating:</strong>{" "}
                      {calculateAverageRating(listing.reviews)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {listings.length > listingsPerPage && (
                <div className="pagination d-flex justify-content-center align-items-center mt-3">
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="me-2"
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="ms-2"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          <h3>Update {formData.name}</h3>
          <Form onSubmit={handleSubmit}>
            {/* Cover Photo Upload */}
            <Form.Group controlId="coverPhoto" className="mb-3">
              <Form.Label>Cover Photo</Form.Label>
              <Form.Control
                type="file"
                onChange={handleCoverPhotoUpload}
                accept="image/*"
              />
              {formData.coverPhoto && (
                <img
                  src={
                    formData.coverPhoto instanceof File
                      ? URL.createObjectURL(formData.coverPhoto)
                      : formData.coverPhoto
                  }
                  alt="Cover"
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}
            </Form.Group>

            {/* Restaurant Name */}
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Restaurant Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter restaurant name"
                required
              />
            </Form.Group>

            {/* Address with Suggestions Dropdown */}
            <Form.Group
              controlId="address"
              className="mb-3"
              style={{ position: "relative" }}
            >
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter restaurant address"
                required
              />
              {showDropdown && suggestions.length > 0 && (
                <Dropdown.Menu
                  show
                  style={{
                    position: "absolute",
                    zIndex: 10,
                    width: "100%",
                  }}
                >
                  {suggestions.map((suggestion, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.formattedAddress}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              )}
            </Form.Group>

            {/* Description */}
            <Form.Group controlId="description" className="mb-3">
              <Form.Label>Restaurant Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your restaurant"
                required
              />
            </Form.Group>

            {/* Contact Info */}
            <Form.Group className="mb-3">
              <Form.Label>Contact Info</Form.Label>
              <Form.Control
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="Enter contact information"
                required
              />
            </Form.Group>

            {/* Operating Hours */}
            <Row>
              {Object.keys(formData.hours).map((day) => (
                <Col key={day} sm={4} className="mb-3">
                  <Form.Label>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="time"
                        placeholder="Opening"
                        value={formData.hours[day].opening}
                        name={`${day}_opening`}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        type="time"
                        placeholder="Closing"
                        value={formData.hours[day].closing}
                        name={`${day}_closing`}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>

            {/* Category Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Row>
                {[
                  "Vegan",
                  "Vegetarian",
                  "Non-Veg",
                  "Gluten Free",
                  "American",
                  "Indian",
                  "Mexican",
                  "Italian",
                ].map((cat) => (
                  <Col key={cat} sm={3}>
                    <Form.Check
                      type="checkbox"
                      label={cat}
                      value={cat}
                      onChange={(e) => toggleCategory(cat, e.target.checked)}
                      checked={formData.category.includes(cat)}
                    />
                  </Col>
                ))}
              </Row>
            </Form.Group>

            {/* Price Range Selection */}
            <Form.Group className="mb-3">
              <Form.Label>Price Range</Form.Label>
              <Form.Control
                as="select"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                required
              >
                <option value="">Select Price Range</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Control>
            </Form.Group>

            {/* Photos Upload */}
            <Form.Group controlId="photos" className="mb-3">
              <Form.Label>Upload Photos (Max 10)</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={handleImageUpload}
                accept="image/*"
              />
              {formData.photos.length > 0 && (
                <Carousel className="mt-3">
                  {formData.photos.map((photo, index) => {
                    const photoURL =
                      photo instanceof File
                        ? URL.createObjectURL(photo)
                        : photo;
                    return (
                      <Carousel.Item key={index}>
                        <img
                          className="d-block w-100"
                          src={photoURL}
                          alt={`Slide ${index}`}
                        />
                      </Carousel.Item>
                    );
                  })}
                </Carousel>
              )}
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Update Listing"}
            </Button>
          </Form>
        </>
      )}
      {loading && selectedListing && (
        <div className="spinner-border text-primary mt-3" role="status">
          <span className="visually-hidden">Updating...</span>
        </div>
      )}
    </div>
  );
};

export default UpdateListingForm;
