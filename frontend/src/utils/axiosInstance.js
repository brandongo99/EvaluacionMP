import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "./authService";
import { applyInterceptors } from "./axiosConfig";
import { navigateTo } from "./navigateService";

const baseURL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: baseURL,
});

// Agrega el token a cada request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // ---- REFRESH TOKEN CORRECTO ----
        const res = await axios.post(`${baseURL}/auth/refresh`, {
          refresh_token: getRefreshToken(),
        });

        const { access_token, refresh_token } = res.data.data;

        saveTokens({ access_token, refresh_token });

        api.defaults.headers.common["Authorization"] =
          "Bearer " + access_token;

        processQueue(null, access_token);

        originalRequest.headers["Authorization"] =
          "Bearer " + access_token;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();
        navigateTo("/");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

applyInterceptors(api);

export default api;