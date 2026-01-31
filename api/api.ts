import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const apiKey = process.env.EXPO_PUBLIC_API_KEY;
  if (apiKey) {
    config.headers["X-API-KEY"] = apiKey;
  }

  return config;
});
