import React, { useState } from "react";
import AddListingForm from "./AddListingForm";
import UpdateListingForm from "./UpdateListingForm";
import ViewListings from "./ViewListings";
import Navbar from "../../components/shared/Navbar";
import Footer from "../../components/shared/Footer";

const BusinessOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState("view"); // State to control the active view

  // Render the selected component based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case "add":
        return <AddListingForm />;
      case "update":
        return <UpdateListingForm />;
      case "view":
        return <ViewListings />;
      default:
        return <ViewListings />;
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
        {/* Sidebar */}
        <div
          style={{
            width: "250px",
            background: "#2c3e50",
            color: "#ecf0f1",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h2>Business Owner Dashboard</h2>
          <button
            onClick={() => setActiveTab("add")}
            style={{
              background: activeTab === "add" ? "#3498db" : "transparent",
              color: "#ecf0f1",
              border: "none",
              padding: "10px 15px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Add Listing
          </button>
          <button
            onClick={() => setActiveTab("update")}
            style={{
              background: activeTab === "update" ? "#3498db" : "transparent",
              color: "#ecf0f1",
              border: "none",
              padding: "10px 15px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Update Listing
          </button>
          <button
            onClick={() => setActiveTab("view")}
            style={{
              background: activeTab === "view" ? "#3498db" : "transparent",
              color: "#ecf0f1",
              border: "none",
              padding: "10px 15px",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            View Listings
          </button>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, padding: "20px" }}>{renderContent()}</div>
      </div>
      <Footer />
    </div>
  );
};

export default BusinessOwnerDashboard;
