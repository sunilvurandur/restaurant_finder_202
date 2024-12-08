import axios from "axios";

const API = axios.create({ baseURL: "https://res-finder-1d53a1950fde.herokuapp.com/" });

// const API = axios.create({ baseURL: "http://localhost:8080/" });


API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.Authorization = `Bearer ${localStorage.getItem("token")} `;
  }
  return req;
});

export default API;
