import React, { useState } from "react";
import { Modal, Button, Row, Col, Carousel, Card, Form } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css'; 
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix marker icons for Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Ensure the default icon is set for all markers
L.Marker.prototype.options.icon = DefaultIcon;

const daysOfWeek = [
  "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"
];

const RestaurantModal = ({ show, onHide, restaurant, currentLocation }) => {
  // If restaurant or fields are missing, provide defaults
  const {
    name = "",
    address = "",
    contactInfo = "",
    description = "",
    hours = {},
    category = [],
    priceRange = "",
    coverPhoto = null,
    reviews = [], // assume we get reviews array here for demonstration
    latitude = 37.3382,
    longitude = -121.8863,
    photos = [],
  } = restaurant || {};

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // Implement review submission logic here
    alert("Review submitted!");
    setRating(0);
    setReviewText("");
  };

  // Fallback cover image if none provided
  const fallbackCover = "https://via.placeholder.com/800x300.png?text=Restaurant+Cover+Image";

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={false}
      size="xl"
      dialogClassName="modal-dialog modal-dialog-end modal-dialog-scrollable"
    >
      <Modal.Header closeButton>
        <Modal.Title>Restaurant Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Cover Photo */}
        <div className="mb-3">
          <img
            src={coverPhoto || fallbackCover}
            alt="Cover"
            className="img-fluid w-100"
            style={{ maxHeight: '300px', objectFit: 'cover' }}
          />
        </div>

        {/* Info Section */}
        <Row className="mb-4" style={{ minHeight: '200px' }}>
          {/* Left Column: Name, Description, Contact, Address */}
          <Col md={6} className="d-flex flex-column justify-content-between">
            <div>
              <h3>{name}</h3>
              <p><strong>Description:</strong> {description}</p>
              <p><strong>Contact Info:</strong> {contactInfo}</p>
              <p><strong>Address:</strong> {address}</p>
            </div>
          </Col>

          {/* Right Column: Opening Hours, Category, Type, Price */}
          <Col md={6} className="d-flex flex-column justify-content-between">
            <div>
              <h5>Hours</h5>
              {daysOfWeek.map((day) => {
                const dayHours = hours[day] || { opening: "", closing: "" };
                return (
                  <p key={day} style={{ marginBottom: '5px' }}>
                    <strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong>{" "}
                    {dayHours.opening && dayHours.closing
                      ? `${dayHours.opening} - ${dayHours.closing}`
                      : " Closed"}
                  </p>
                );
              })}
              <hr />
              <p><strong>Category:</strong> {category.join(", ")}</p>
              <p><strong>Cost for 2 people:</strong> {priceRange}</p>
            </div>
          </Col>
        </Row>

        {/* Photos Carousel and Map Side by Side */}
        <Row className="mb-4" style={{ minHeight: '300px' }}>
          <Col md={6}>
            {photos.length > 0 ? (
              <Carousel variant="dark">
                {photos.map((photoUrl, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={photoUrl}
                      alt={`Slide ${index + 1}`}
                      style={{ objectFit: "cover", maxHeight: "300px" }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <p>No photos available.</p>
            )}
          </Col>
          <Col md={6}>
            <h5>Location</h5>
            <div style={{ width: '100%', height: '300px' }}>
              <MapContainer 
                center={[latitude, longitude]} 
                zoom={14} 
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[latitude, longitude]}>
                  <Popup>{name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </Col>
        </Row>

        {/* Review Submission Form */}
        <Row className="mb-4">
          <h5>Leave a Review</h5>
          <Form onSubmit={handleSubmitReview}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <div>
                {[...Array(5)].map((star, index) => {
                  index += 1;
                  return (
                    <span
                      key={index}
                      onClick={() => setRating(index)}
                      onMouseEnter={() => setHover(index)}
                      onMouseLeave={() => setHover(rating)}
                      style={{
                        cursor: 'pointer',
                        color: (index <= (hover || rating)) ? "#ffc107" : "#e4e5e9",
                        fontSize: '1.5rem',
                        marginRight: '5px'
                      }}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
              />
            </Form.Group>

            <Button type="submit" variant="primary">Submit Review</Button>
          </Form>
        </Row>

        {/* Existing Reviews */}
        <Row>
          <h5>Reviews</h5>
          {reviews.length > 0 ? (
            reviews.map((rev, idx) => (
              <Card className="mb-3" key={idx}>
                <Card.Body>
                  <Card.Title>{rev.userName}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {[...Array(5)].map((star, i) => {
                      i += 1;
                      return (
                        <span key={i} style={{ color: (i <= rev.rating) ? "#ffc107" : "#e4e5e9" }}>
                          ★
                        </span>
                      );
                    })}
                  </Card.Subtitle>
                  <Card.Text>{rev.reviewText}</Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RestaurantModal;