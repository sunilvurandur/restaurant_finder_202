import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icons issue in Leaflet when using Webpack or CRA
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ restaurants, center }) => {
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "500px", width: "100%", borderRadius: "10px" }}
    >
      {/* OpenStreetMap Tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Restaurant Markers */}
      {restaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={[restaurant.lat, restaurant.lng]}
        >
          <Popup>
            <strong>{restaurant.name}</strong>
            <br />
            {restaurant.description}
          </Popup>
        </Marker>
      ))}

      {/* Current Location Marker */}
      {center && (
        <Marker position={center}>
          <Popup>
            <strong>Your Location</strong>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
