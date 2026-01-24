import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

instance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
