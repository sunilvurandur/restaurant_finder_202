import React, { useState } from "react";
import API from "../../../services/API";
import InputType from "../../../components/shared/Form/InputType";

const AddListingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactInfo: "",
    hours: "",
    description: "",
    photos: [],
    category: "",
    reviews: [],
  });
  const [loading, setLoading] = useState(false); // Loader for API calls

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.photos.length + files.length > 10) {
      alert("You can only upload a maximum of 10 photos");
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setFormData({
      ...formData,
      photos: [...formData.photos, ...newPhotos],
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "photos") {
          formData.photos.forEach((photo) => formDataToSend.append("photos", photo.file));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const { data } = await API.post("/listings", formDataToSend); // Replace with your API endpoint
      if (data?.success) {
        alert("Listing added successfully!");
        setFormData({
          name: "",
          address: "",
          contactInfo: "",
          hours: "",
          description: "",
          photos: [],
          category: "",
          reviews: [],
        });
      }
    } catch (error) {
      console.error("Error adding listing:", error);
      alert("Failed to add listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add New Listing</h2>
      {loading && <div className="spinner-border text-primary" role="status" />}
      <form onSubmit={handleSubmit}>
        <InputType
          labelText="Name"
          labelFor="name"
          inputType="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <InputType
          labelText="Address"
          labelFor="address"
          inputType="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <InputType
          labelText="Contact Info"
          labelFor="contactInfo"
          inputType="text"
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleChange}
        />
        <InputType
          labelText="Operating Hours"
          labelFor="hours"
          inputType="text"
          name="hours"
          value={formData.hours}
          onChange={handleChange}
        />

        <div className="mb-1">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Description"
          />
        </div>

        <div className="mb-1">
          <label htmlFor="photos" className="form-label">
            Photos (Max 10)
          </label>
          <input
            type="file"
            name="photos"
            multiple
            onChange={handleImageUpload}
            className="form-control"
          />
        </div>

        <div className="mb-1">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Category</option>
            <option value="Indian">Indian</option>
            <option value="Mexican">Mexican</option>
            <option value="Italian">Italian</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Listing
        </button>
      </form>
    </div>
  );
};

export default AddListingForm;
