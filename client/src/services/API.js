import axios from "axios";

const API = axios.create({ baseURL: "https://restaurantfinder202-edqhq4gnm-mahesh-cheekuris-projects.vercel.app/" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")} `;
  }
  return req;
});

export default API;
