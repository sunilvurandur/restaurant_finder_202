import React, { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import API from "../../../services/API";

const AdminDashboardApp = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all listings from the backend
  const fetchListings = async () => {
    try {
      const { data } = await API.get("/listings"); // Fetch all listings
      if (data) {
        setListings(data.listings);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Delete a listing by ID
  const handleDelete = async (id) => {
    try {
      const { data } = await API.delete(`/listings/${id}`);
      if (data?.success) {
        setListings((prev) => prev.filter((listing) => listing.id !== id));
        alert("Listing deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete the listing.");
    }
  };

  // Find duplicates based on name and address
  const findDuplicates = (listings) => {
    const duplicates = [];
    const seen = new Map();

    listings.forEach((listing) => {
      const key = `${listing.name}-${listing.address}`.toLowerCase();
      if (seen.has(key)) {
        duplicates.push(listing);
      } else {
        seen.set(key, listing);
      }
    });

    return duplicates;
  };

  return (
    <>
      {loading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <AdminDashboard
          listings={listings}
          onDelete={handleDelete}
          onFindDuplicates={findDuplicates}
        />
      )}
    </>
  );
};

export default AdminDashboardApp;
