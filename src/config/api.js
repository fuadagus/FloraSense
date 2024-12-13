// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from "react-native-config";

const BASE_SERVER_API_URL = Config.BASE_SERVER_API_URL;
const api = axios.create({
  baseURL: `${BASE_SERVER_API_URL}`,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token'); // Get the token from async storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
