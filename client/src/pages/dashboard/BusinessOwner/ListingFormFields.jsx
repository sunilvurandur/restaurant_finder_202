import React from "react";
import { Form, Row, Col, Carousel, Button } from "react-bootstrap";

const ListingFormFields = ({
  formData,
  setFormData,
  loading,
  onSubmit,
  mode = "add",
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("_")) {
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

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0];
    console.log(file);
  
    setFormData({
      ...formData,
      coverPhoto: file,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    if (files.length > 0) {
      // For updates, ensure not to exceed 10 images total
      if ((formData.photos.length + files.length) > 10) {
        alert("You can only upload a maximum of 10 photos");
        return;
      }

      setFormData({
        ...formData,
        photos: [...formData.photos, ...files],
      });
    }
  };

  const toggleFoodType = (food, checked) => {
    const newFoodType = checked
      ? [...formData.foodType, food]
      : formData.foodType.filter((item) => item !== food);
    setFormData({ ...formData, foodType: newFoodType });
  };

  return (
    <Form onSubmit={onSubmit}>
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
      <Form.Group controlId="address" className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter restaurant address"
        />
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

      {/* Food Type (Checkboxes) */}
      <Form.Group className="mb-3">
        <Form.Label>Food Type</Form.Label>
        <Row>
          {["Vegan", "Vegetarian", "Non-Veg", "Gluten Free"].map((food) => (
            <Col key={food} sm={3}>
              <Form.Check
                type="checkbox"
                label={food}
                value={food}
                onChange={(e) => toggleFoodType(food, e.target.checked)}
                checked={formData.foodType.includes(food)}
              />
            </Col>
          ))}
        </Row>
      </Form.Group>

      {/* Category */}
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="American">American</option>
          <option value="Indian">Indian</option>
          <option value="Mexican">Mexican</option>
          <option value="Italian">Italian</option>
          <option value="Chinese">Chinese</option>
        </Form.Control>
      </Form.Group>

      {/* Price Range */}
      <Form.Group controlId="priceRange" className="mb-3">
        <Form.Label>Price Range</Form.Label>
        <Form.Control
          type="number"
          name="priceRange"
          value={formData.priceRange}
          onChange={handleChange}
          placeholder="Average price for two people"
        />
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
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? "Submitting..." : mode === "add" ? "Add Listing" : "Update Listing"}
      </Button>
    </Form>
  );
};

export default ListingFormFields;
