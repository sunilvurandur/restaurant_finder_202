import React, { useState } from "react";
import API from "../../../services/API";
import ListingFormFields from "./ListingFormFields";

const AddListingForm = () => {
  const [formData, setFormData] = useState({
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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
  
      // Append all form fields
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
  
      const { data } = await API.post("/bussiness_owner/createRestaurant", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (data?.success) {
        alert("Listing added successfully!");
        // Reset form data
        setFormData({
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
