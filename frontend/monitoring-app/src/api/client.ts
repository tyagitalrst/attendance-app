import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";

function createClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Token expired or invalid
      if (error?.response?.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    },
  );

  return client;
}

export const apiClient = createClient(
  import.meta.env.VITE_API_URL || "http://localhost:3000",
);
export const monitorClient = createClient(
  import.meta.env.VITE_MONITOR_API_URL || "http://localhost:3001",
);
export const loggerClient = createClient(
  import.meta.env.VITE_LOGGER_API_URL || "http://localhost:3002",
);
