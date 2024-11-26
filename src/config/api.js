import axios from "axios";

export const API_BASE_URL = "https://flora-sense-backend.vercel.app/api"; // Replace with your API URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
