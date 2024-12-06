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
    category: "",
    foodType: [],
    priceRange: "",
    coverPhoto: null,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      const serializedHours = JSON.stringify(formData.hours);
      const serializedFoodType = JSON.stringify(formData.foodType);

      formData.photos.forEach((photo) => formDataToSend.append("photos", photo));
      if (formData.coverPhoto) {
        formDataToSend.append("coverPhoto", formData.coverPhoto);
      }

      formDataToSend.append("name", formData.name);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("contactInfo", formData.contactInfo);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("hours", serializedHours);
      formDataToSend.append("foodType", serializedFoodType);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("priceRange", formData.priceRange);
      console.log (formDataToSend);
      const { data } = await API.post("/add-listing", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (data?.success) {
        alert("Listing added successfully!");
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
          category: "",
          foodType: [],
          priceRange: "",
          coverPhoto: null,
        });
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("")
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
