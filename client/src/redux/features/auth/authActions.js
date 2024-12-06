import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../../services/API";
import { toast } from "react-toastify";

export const userLogin = createAsyncThunk(
  "auth/login",
  async ({ role, email, password }, { rejectWithValue }) => {
    try {
      
      const endpoint = role === "businessOwner" ? "/bussiness_owner/login" : "/users/login";
      const { data } = await API.post(endpoint, { email, password });
      
      if (data.message == "Login successful.") {
        localStorage.setItem("token", data.token);
        toast.success(data.message);
        window.location.replace("/");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const userRegister = createAsyncThunk(
  "auth/register",
  async ({ name, role, email, password, phone }, { rejectWithValue }) => {
    try {
      
      const endpoint = role === "businessOwner" ? "/bussiness_owner/register" : "/users/register";
      const { data } = await API.post(endpoint, { name, email, password, phone });
      
      if (data.message == "Business owner registered successfully.") {
        toast.success(data.message);
        window.location.replace("/login");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/auth/current-user");
      console.log("Response from /auth/current-user:", res.data); // Debug log
      if (res?.data) {
        return res.data;
      }
    } catch (error) {
      console.error("Error in getCurrentUser:", error.response || error.message); // Debug log
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
