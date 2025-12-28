/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { BASE_API } from "./config";
import type { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        if (config.headers) {
          config.headers["Authorization"] = `Bearer ${token}`;
        } else {
          config.headers = { Authorization: `Bearer ${token}` } as any;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosInstance;
