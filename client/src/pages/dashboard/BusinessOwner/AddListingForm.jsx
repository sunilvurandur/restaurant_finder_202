import React, { useState } from "react";
import API from "../../../services/API";
import ListingFormFields from "./ListingFormFields";

const AddListingForm = () => {
  const businessOwnerData = JSON.parse(localStorage.getItem("businessOwnerData"));
  const [formData, setFormData] = useState({
    id:businessOwnerData.owner.id,
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
    file: null,
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);

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
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }
  
      // Log FormData contents for debugging
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`${key}:`, value);
      }
  
      const { data } = await API.post("/business-owner/createRestaurant", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (data?.success) {
        alert("Listing added successfully!");
        // Reset form data
        setFormData({
          id:businessOwnerData.owner.id,
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
          file: null,
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

  return (
    <ListingFormFields
      formData={formData}
      setFormData={setFormData}
      loading={loading}
      onSubmit={handleSubmit}
      mode="add"
    />
  );
};

export default AddListingForm;
