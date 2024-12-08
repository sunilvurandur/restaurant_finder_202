import React, { useState } from "react";
import { Form, Row, Col, Carousel, Button, Dropdown } from "react-bootstrap";
import API from "../../../services/API";

const ListingFormFields = ({
  formData,
  setFormData,
  loading,
  onSubmit,
  mode = "add",
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleAddressSearch(formData.address);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({
      ...formData,
      address: suggestion.formattedAddress,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
    setShowDropdown(false);
  };

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      coverPhoto: file,
    });
  };

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

  const toggleCategory = (cat, checked) => {
    const newCategory = checked
      ? [...formData.category, cat]
      : formData.category.filter((item) => item !== cat);
    setFormData({ ...formData, category: newCategory });
  };

  return (
    <>
      {/* Cover photo upload */}
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

      {/* Restaurant name */}
      <Form.Group controlId="name" className="mb-3">
        <Form.Label>Restaurant Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter restaurant name"
        />
      </Form.Group>

      {/* Address */}
      <Form.Group controlId="address" className="mb-3" style={{ position: "relative" }}>
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter restaurant address"
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
          required
        />
      </Form.Group>

      {/* Hours */}
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
                />
              </Col>
              <Col>
                <Form.Control
                  type="time"
                  placeholder="Closing"
                  value={formData.hours[day].closing}
                  name={`${day}_closing`}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Col>
        ))}
      </Row>

      {/* Category */}
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

      {/* Price range */}
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
          <Carousel>
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
      
      {mode === "add" && (
  <Button variant="primary" onClick={onSubmit} disabled={loading}>
    {loading ? "Submitting..." : "Add Listing"}
  </Button>
)}
    </>
  );
};

export default ListingFormFields;
