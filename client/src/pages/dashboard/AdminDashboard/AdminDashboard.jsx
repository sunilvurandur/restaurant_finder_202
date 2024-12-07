import React, { useState } from "react";
import ListingCard from "./ListingCard";
import "../../../styles/Layout.css";
import Navbar from "../../../components/shared/Navbar";
import Footer from "../../../components/shared/Footer";

const AdminDashboard = ({ listings, onDelete, onFindDuplicates }) => {
  const [activeTab, setActiveTab] = useState("view");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 4;

  // Filter listings based on search query
  const filteredListings = listings.filter((listing) =>
    [listing.name, listing.address, listing.ownerName]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);
  const currentListings = filteredListings.slice(
    (currentPage - 1) * listingsPerPage,
    currentPage * listingsPerPage
  );

  const renderContent = () => {
    switch (activeTab) {
      case "view":
        return (
          <div>
            <h3>All Listings</h3>
            <div className="listing-grid">
              {currentListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onDelete={onDelete}
                />
              ))}
              {currentListings.length === 0 && (
                <p className="no-data-message">No listings found.</p>
              )}
            </div>
            {filteredListings.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        );
      case "duplicates":
        const duplicates = onFindDuplicates(filteredListings);
        return (
          <div>
            <h3>Duplicate Listings</h3>
            {duplicates.length > 0 ? (
              <div className="listing-grid">
                {duplicates.map((listing, index) => (
                  <ListingCard
                    key={listing.id + "-" + index}
                    listing={listing}
                    onDelete={onDelete}
                    highlight
                  />
                ))}
              </div>
            ) : (
              <p className="no-data-message">No duplicate listings found.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard">
        {/* Sidebar */}
        <div className="admin-sidebar">
          <h2>Admin Dashboard</h2>
          <button
            onClick={() => setActiveTab("view")}
            className={activeTab === "view" ? "active" : ""}
          >
            View Listings
          </button>
          <button
            onClick={() => setActiveTab("duplicates")}
            className={activeTab === "duplicates" ? "active" : ""}
          >
            Check Duplicates
          </button>
        </div>

        {/* Main Content Area */}
        <div className="admin-main">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, address, owner name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-secondary"
      >
        Previous
      </button>
      <span className="page-info">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-secondary"
      >
        Next
      </button>
    </div>
  );
};

export default AdminDashboard;
