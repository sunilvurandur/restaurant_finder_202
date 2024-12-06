import React, { useState, useEffect, useRef } from "react"; 
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import RestaurantModal from "./RestaurentModal"; // Ensure the correct path
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix marker icons for Leaflet
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

// RatingDropdown Component
const RatingDropdown = ({
  selectedRating,
  setSelectedRating,
  isOpen,
  setOpenDropdown,
}) => {
  const dropdownRef = useRef(null);

  const handleRatingFilter = (rating) => {
    setSelectedRating(rating);
    setOpenDropdown(null);
  };

  const resetFilter = () => {
    setSelectedRating(null);
    setOpenDropdown(null);
  };

  const toggleDropdown = () => {
    setOpenDropdown(isOpen ? null : "rating");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setOpenDropdown]);

  return (
    <div style={{ position: "relative", margin: "10px" }} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        style={{
          padding: "10px 15px",
          borderRadius: "15px",
          border: "1px solid #ddd",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {selectedRating ? `Rating: ${selectedRating}★` : "Rating"}
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "0px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <div
              key={rating}
              onClick={() => handleRatingFilter(rating)}
              style={{
                padding: "5px 10px",
                cursor: "pointer",
                borderBottom: rating < 5 ? "1px solid #ddd" : "none",
              }}
            >
              {rating}★
            </div>
          ))}
          <div
            onClick={resetFilter}
            style={{
              padding: "5px 10px",
              cursor: "pointer",
              color: "red",
              textAlign: "center",
            }}
          >
            Reset
          </div>
        </div>
      )}
    </div>
  );
};

// PriceDropdown Component
const PriceDropdown = ({
  selectedPrice,
  setSelectedPrice,
  isOpen,
  setOpenDropdown,
}) => {
  const dropdownRef = useRef(null);

  const handlePriceFilter = (price) => {
    setSelectedPrice(price);
    setOpenDropdown(null);
  };

  const resetFilter = () => {
    setSelectedPrice(null);
    setOpenDropdown(null);
  };

  const toggleDropdown = () => {
    setOpenDropdown(isOpen ? null : "price");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setOpenDropdown]);

  return (
    <div style={{ position: "relative", margin: "10px" }} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        style={{
          padding: "10px 15px",
          borderRadius: "15px",
          border: "1px solid #ddd",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {selectedPrice ? `Price: ${selectedPrice}` : "Price"}
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "0px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          {["Low", "Medium", "High"].map((price) => (
            <div
              key={price}
              onClick={() => handlePriceFilter(price)}
              style={{
                padding: "5px 10px",
                cursor: "pointer",
                borderBottom: price !== "High" ? "1px solid #ddd" : "none",
              }}
            >
              {price}
            </div>
          ))}
          <div
            onClick={resetFilter}
            style={{
              padding: "5px 10px",
              cursor: "pointer",
              color: "red",
              textAlign: "center",
            }}
          >
            Reset
          </div>
        </div>
      )}
    </div>
  );
};

// FoodTypeDropdown Component
const FoodTypeDropdown = ({
  selectedFoodType,
  setSelectedFoodType,
  isOpen,
  setOpenDropdown,
}) => {
  const dropdownRef = useRef(null);

  const handleFoodTypeFilter = (foodType) => {
    setSelectedFoodType(foodType);
    setOpenDropdown(null);
  };

  const resetFilter = () => {
    setSelectedFoodType(null);
    setOpenDropdown(null);
  };

  const toggleDropdown = () => {
    setOpenDropdown(isOpen ? null : "foodType");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setOpenDropdown]);

  return (
    <div style={{ position: "relative", margin: "10px" }} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        style={{
          padding: "10px 15px",
          borderRadius: "15px",
          border: "1px solid #ddd",
          backgroundColor: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {selectedFoodType ? `Food Type: ${selectedFoodType}` : "Food Type"}
      </button>
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "0px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          {["Vegetarian", "Non-Vegetarian"].map((foodType) => (
            <div
              key={foodType}
              onClick={() => handleFoodTypeFilter(foodType)}
              style={{
                padding: "5px 10px",
                cursor: "pointer",
                borderBottom:
                  foodType !== "Non-Vegetarian" ? "1px solid #ddd" : "none",
              }}
            >
              {foodType}
            </div>
          ))}
          <div
            onClick={resetFilter}
            style={{
              padding: "5px 10px",
              cursor: "pointer",
              color: "red",
              textAlign: "center",
            }}
          >
            Reset
          </div>
        </div>
      )}
    </div>
  );
};

const RestaurantSearch = () => {
  const [restaurants, setRestaurants] = useState([]); // All data from backend
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); // Filtered data
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.33723535164518,
    longitude: -121.88143561435668,
  }); // Fixed location
  const [streetName, setStreetName] = useState("Fetching location...");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 2 rows * 3 columns

  // Filters
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedFoodType, setSelectedFoodType] = useState(null);

  // Dropdown State
  const [openDropdown, setOpenDropdown] = useState(null); // 'rating', 'price', 'foodType', or null

  const navigate = useNavigate();
  const defaultCenter = [37.3382, -121.8863]; // Backup location for map

  const cuisines = [
    "Mexican",
    "American",
    "Italian",
    "fast food",
    "asian",
    "japanese",
    "Pho",
    "Breakfast",
    "Sushi",
    "Soup",
  ];

  // Function to randomly assign foodType if not present
  const getRandomFoodType = () => {
    const types = ["Vegetarian", "Non-Vegetarian"];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Define handleCuisineClick to manage cuisine filters
  const handleCuisineClick = (cuisine) => {
    if (selectedCuisine === cuisine) {
      setSelectedCuisine(null); // Toggle off if already selected
    } else {
      setSelectedCuisine(cuisine);
    }
  };

  // Fetch restaurants from backend
  const fetchRestaurants = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/users/getRestaurants",
        {
          latitude: 37.33723535164518,
          longitude: -121.88143561435668,
          radius: "4000", // in meters
        });
      // Assuming backend returns an array of restaurants
      const data = response.data.map((restaurant) => ({
        ...restaurant,
        foodType: restaurant.foodType || getRandomFoodType(),
      }));
      setRestaurants(data);
      setFilteredRestaurants(data); // Initialize filteredRestaurants
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      // setErrorMessage("Failed to fetch restaurants. Please try again later.");
    }
  };

  // Fetch fixed location address and nearby restaurants
  useEffect(() => {
    const fetchLocationAndRestaurants = async () => {
      try {
        const { latitude, longitude } = currentLocation;

        // Reverse geocoding to get street name
        const addressResponse = await axios.get(
          `https://nominatim.openstreetmap.org/reverse`,
          {
            params: {
              format: "json",
              lat: latitude, // Nominatim expects 'lat' and 'lon'
              lon: longitude,
            },
          }
        );
        const data = addressResponse.data;
        const street =
          data.address.road || data.address.suburb || "Unknown Street";
        const city = data.address.city || data.address.town || "Unknown City";
        const state = data.address.state || "CA";
        setStreetName(`${street}, ${city}, ${state}`);

        // Fetch nearby restaurants from backend based on fixed location and radius
        const nearbyResponse = await axios.post(
          "http://localhost:8080/users/getRestaurants",
          {
            latitude: 37.33723535164518,
            longitude: -121.88143561435668,
            radius: "4000", // in meters
          }
        );
        const nearbyData = nearbyResponse.data.map((restaurant) => ({
          ...restaurant,
          foodType: restaurant.foodType || getRandomFoodType(),
        }));
        setRestaurants(nearbyData);
        setFilteredRestaurants(nearbyData);
      } catch (error) {
        console.error("Error fetching location or restaurants:", error);
        
        setCurrentLocation({ latitude: defaultCenter[0], longitude: defaultCenter[1] });
        setStreetName("Default Street, San Jose, CA");
        fetchRestaurants(); // Fetch all restaurants without location
      }
    };

    fetchLocationAndRestaurants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to apply all current filters
  const applyFilters = async () => {
    try {
      // Construct query parameters based on filters
      const params = {
        // name: searchQuery || undefined,
        // location: locationQuery || undefined,
        // category: [selectedCuisine || undefined],
        // price_range: selectedPrice || undefined,
        rating: selectedRating || undefined,
        latitude: 37.33723535164518,
        longitude: -121.88143561435668,
          radius: "4000",
      };
      if(searchQuery) params['name'] = searchQuery;
      if(locationQuery) params['location'] = locationQuery;
      if(selectedCuisine) params['category'] = [selectedCuisine];
      if(selectedPrice) params['price_range'] = selectedPrice;
      if(selectedFoodType){
        if(selectedFoodType == 'Vegetarian') params['category'] = ['vegetarian', 'vegan']
        else params['category'] = [selectedFoodType]
      }



      const nearbyResponse = await axios.post(
        "http://localhost:8080/users/search",
        params
      );
      const filteredData = nearbyResponse.data.data.map((restaurant) => ({
        ...restaurant,
        foodType: restaurant.foodType || getRandomFoodType(),
      }));
      setFilteredRestaurants(filteredData);
      setCurrentPage(1); // Reset to first page

      // Set error message if no restaurants match the criteria
      if (filteredData.length === 0) {
        setErrorMessage("No restaurants found matching your criteria.");
      } else {
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      // setErrorMessage("Failed to apply filters. Please try again.");
    }
  };

  // Apply filters whenever any filter or query changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchQuery,
    locationQuery,
    selectedCuisine,
    selectedPrice,
    selectedRating,
    selectedFoodType,
  ]);

  // Handle location search (if you still want to allow searching, otherwise you can disable this)
  const handleLocationSearch = async () => {
    if (!locationQuery.trim()) {
      setErrorMessage("Please enter a location.");
      setFilteredRestaurants([]);
      setCurrentPage(1); // Reset to first page
      setOpenDropdown(null);
      return;
    }

    try {
      // Geocoding to get latitude and longitude from locationQuery
      const geocodeResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search`,
        {
          params: {
            q: locationQuery,
            format: "json",
            limit: 1,
          },
        }
      );

      if (geocodeResponse.data.length === 0) {
        setErrorMessage("Location not found.");
        return;
      }

      const { lat, lon } = geocodeResponse.data[0]; // Nominatim returns 'lat' and 'lon'
      setCurrentLocation({ latitude: parseFloat(lat), longitude: parseFloat(lon) });

      // Update street name
      const reverseResponse = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: "json",
            lat: lat, // Nominatim expects 'lat' and 'lon'
            lon: lon,
          },
        }
      );

      const addr = reverseResponse.data.address;
      const street =
        addr.road || addr.suburb || "Unknown Street";
      const city = addr.city || addr.town || "Unknown City";
      const state = addr.state || "Unknown State";
      setStreetName(`${street}, ${city}, ${state}`);

      // Fetch restaurants near the new location with radius 4000 meters
      const nearbyResponse = await axios.post(
        "http://localhost:8080/users/getRestaurants",
        {
          latitude: 37.33723535164518,
          longitude: -121.88143561435668,
          radius: "4000", // in meters
        }
      );
      const nearbyData = nearbyResponse.data.data.map((restaurant) => ({
        ...restaurant,
        foodType: restaurant.category || getRandomFoodType(),
      }));
      setRestaurants(nearbyData);
      setFilteredRestaurants(nearbyData);
      setErrorMessage("");
    } catch (error) {
      console.error("Error searching location:", error);
      setErrorMessage("Failed to search location. Please try again.");
    }
  };

  // Handle restaurant name search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setErrorMessage("Please enter a restaurant name.");
      setFilteredRestaurants([]);
      setCurrentPage(1); // Reset to first page
      setOpenDropdown(null);
      return;
    }

    applyFilters();
  };

  // Handle Near Me button
  const handleNearMe = async () => {
    if (!currentLocation) return;

    try {
      const nearbyResponse = await axios.post(
        "http://localhost:8080/users/getRestaurants",
        {
          latitude: 37.33723535164518,
          longitude: -121.88143561435668,
          radius: "4000", // in meters
        }
      );

      // console.log(response)
      const nearbyData = nearbyResponse.data.data.map((restaurant) => ({
        ...restaurant,
        foodType: restaurant.category || getRandomFoodType(),
      }));
      console.log(nearbyData)
      setFilteredRestaurants(nearbyData);
      setCurrentPage(1); // Reset to first page
      setErrorMessage(
        nearbyData.length === 0
          ? "No nearby restaurants found."
          : ""
      );
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
      setErrorMessage("Failed to fetch nearby restaurants.");
    }
  };

  // Handle restaurant click to show modal
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null);
  };

  // Pagination Calculations
  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);
  const indexOfLastRestaurant = currentPage * itemsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - itemsPerPage;
  const currentRestaurants = filteredRestaurants.slice(
    indexOfFirstRestaurant,
    indexOfLastRestaurant
  );

  // Function to handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* Logo and Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/cad72f16211207.562a6e3bb04cc.png"
            alt="App Logo"
            style={{
              height: "70px",
              width: "50px",
              borderRadius: "50%",
            }}
          />
          <h2 style={{ fontSize: "15px", margin: "0", color: "#333" }}>
            Restaurant Finder
          </h2>
        </div>

        {/* Search by Location and Restaurant Name */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* Search by Location */}
          <input
            type="text"
            placeholder="Search by Location"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              width: "200px",
              marginRight: "10px",
            }}
          />
          <button
            onClick={handleLocationSearch}
            style={{
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            Search
          </button>

          {/* Search by Restaurant Name */}
          <input
            type="text"
            placeholder="Search Restaurant"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              width: "200px",
              marginRight: "10px",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

        {/* Near Me Button and Current Location */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={handleNearMe}
            style={{
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              backgroundColor: "#28a745",
              color: "#fff",
              cursor: "pointer",
              marginRight: "10px",
              marginLeft: "10px",
            }}
          >
            Near
          </button>
          <button
            style={{
              padding: "10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              cursor: "pointer",
            }}
          >
            📍 {streetName}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p
          style={{
            color: "red",
            textAlign: "center",
            margin: "10px 0",
          }}
        >
          {errorMessage}
        </p>
      )}

      {/* Cuisines */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "10px",
        }}
      >
        {cuisines.map((cuisine, index) => (
          <button
            key={index}
            onClick={() => handleCuisineClick(cuisine)}
            style={{
              padding: "15px 20px",
              borderRadius: "15px",
              border: "1px solid #ddd",
              marginRight: "10px",
              backgroundColor:
                selectedCuisine === cuisine ? "#007bff" : "#ffffff",
              color:
                selectedCuisine === cuisine ? "#fff" : "#000000",
              cursor: "pointer",
            }}
          >
            {cuisine}
          </button>
        ))}
        <button
          onClick={() => {
            setSelectedCuisine(null);
            setOpenDropdown(null);
            // Apply filters via useEffect
          }}
          style={{
            padding: "15px 28px",
            borderRadius: "15px",
            border: "1px solid #ddd",
            backgroundColor: "#fff",
            color: "red",
            cursor: "pointer",
          }}
        >
          Reset Cuisine
        </button>
      </div>

      {/* Dropdowns for Rating, Price, and Food Type */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <RatingDropdown
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          isOpen={openDropdown === "rating"}
          setOpenDropdown={setOpenDropdown}
        />
        <PriceDropdown
          selectedPrice={selectedPrice}
          setSelectedPrice={setSelectedPrice}
          isOpen={openDropdown === "price"}
          setOpenDropdown={setOpenDropdown}
        />
        <FoodTypeDropdown
          selectedFoodType={selectedFoodType}
          setSelectedFoodType={setSelectedFoodType}
          isOpen={openDropdown === "foodType"}
          setOpenDropdown={setOpenDropdown}
        />
      </div>

      {/* Restaurant List */}
      <div style={{ padding: "20px" }}>
        <h3>Restaurants</h3>
        {currentRestaurants.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Responsive columns
              gap: "15px",
            }}
          >
            {currentRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  padding: "10px",
                  background: "#f9f9f9",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => handleRestaurantClick(restaurant)}
              >
                <div>
                  <h4>{restaurant.name}</h4>
                  <p>{restaurant.description}</p>
                
                  <p>
                    <strong>Food Type:</strong> {restaurant.category}
                  </p>
                  <p>
                    <strong>Price:</strong> {restaurant.price_range}
                  </p>
                  <p>
                    <strong>Rating:</strong> {restaurant.rating}★
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          (!locationQuery &&
            !searchQuery &&
            !selectedCuisine &&
            !selectedPrice &&
            selectedRating === null &&
            !selectedFoodType) && (
            <p style={{ textAlign: "center" }}>
              Please select a filter, search by location, or search by restaurant
              name to see results.
            </p>
          )
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <nav>
              <ul
                className="pagination"
                style={{
                  display: "flex",
                  listStyle: "none",
                  padding: 0,
                }}
              >
                {/* Previous Button */}
                <li
                  className={`page-item ${
                    currentPage === 1 ? "disabled" : ""
                  }`}
                  style={{ margin: "0 5px" }}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      backgroundColor: "#fff",
                      cursor:
                        currentPage === 1 ? "not-allowed" : "pointer",
                    }}
                  >
                    Previous
                  </button>
                </li>

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    style={{ margin: "0 5px" }}
                  >
                    <button
                      onClick={() => paginate(index + 1)}
                      className="page-link"
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                        backgroundColor:
                          currentPage === index + 1
                            ? "#007bff"
                            : "#fff",
                        color:
                          currentPage === index + 1 ? "#fff" : "#000",
                        cursor: "pointer",
                      }}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}

                {/* Next Button */}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                  style={{ margin: "0 5px" }}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      backgroundColor: "#fff",
                      cursor:
                        currentPage === totalPages
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Map Section */}
      <MapContainer
        center={[currentLocation.latitude, currentLocation.longitude]}
        zoom={13}
        style={{ height: "400px", width: "100%", marginTop: "20px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        {filteredRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.latitude, restaurant.longitude]}
            eventHandlers={{
              click: () => handleRestaurantClick(restaurant),
            }}
          >
            <Popup>
              <strong>{restaurant.name}</strong>
              <br />
              {restaurant.description}
              <br />
              <strong>Cuisine:</strong> {restaurant.cuisine}
              <br />
              <strong>Food Type:</strong> {restaurant.foodType}
            </Popup>
          </Marker>
        ))}
        {currentLocation && (
          <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
            <Popup>{streetName}</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Reusable RestaurantModal Component */}
      <RestaurantModal
        show={showModal}
        onHide={handleCloseModal}
        restaurant={selectedRestaurant}
      />
    </div>
  );
};

export default RestaurantSearch;
