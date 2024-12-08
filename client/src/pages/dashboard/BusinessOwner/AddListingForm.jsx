import React, { useState } from "react";
import { Form, Row, Col, Carousel, Button, Dropdown } from "react-bootstrap";
import API from "../../../services/API";

const AddListingForm = () => {
  // Retrieve business owner data from localStorage
  const businessOwnerData = JSON.parse(localStorage.getItem("businessOwnerData"));

  // Initialize form data state
  const [formData, setFormData] = useState({
    id: businessOwnerData.owner.id,
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

  // State for loading indicator
  const [loading, setLoading] = useState(false);

  // States for address suggestions dropdown
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("id", formData.id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("contactInfo", formData.contactInfo);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("hours", JSON.stringify(formData.hours));
      formDataToSend.append("category", JSON.stringify(formData.category));
      formDataToSend.append("priceRange", formData.priceRange);
      formDataToSend.append("latitude", formData.latitude);
      formDataToSend.append("longitude", formData.longitude);

      // Append photos
      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });

      // Append cover photo
      if (formData.coverPhoto) {
        formDataToSend.append("coverPhoto", formData.coverPhoto);
      }

      // Log FormData contents for debugging
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }

      // Send POST request to create a new restaurant listing
      const { data } = await API.post("/business-owner/createRestaurant", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data?.success) {
        alert("Listing added successfully!");
        // Reset form data
        setFormData({
          id: businessOwnerData.owner.id,
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
      }
    } catch (error) {
      console.error("Error submitting form data:", error.response || error);
      alert(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
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

  return (
    <Form onSubmit={handleSubmit}>
      {/* Cover Photo Upload */}
      <Form.Group controlId="coverPhoto" className="mb-3">
        <Form.Label>Cover Photo</Form.Label>
        <Form.Control type="file" onChange={handleCoverPhotoUpload} />
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
      <Form.Group controlId="address" className="mb-3" style={{ position: "relative" }}>
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
          {["Vegan", "Vegetarian", "Non-Veg", "Gluten Free", "American", "Indian", "Mexican", "Italian"].map((cat) => (
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
                photo instanceof File ? URL.createObjectURL(photo) : photo;
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
        {loading ? "Submitting..." : "Add Listing"}
      </Button>
    </Form>
  );
};

export default AddListingForm;
