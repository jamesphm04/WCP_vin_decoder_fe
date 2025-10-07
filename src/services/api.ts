import axios, { AxiosInstance } from "axios";
import { LoginCredentials, AuthResponse } from "../types/auth";
import { Vehicle } from "../types/vehicle";

// handle 401 globally
let onUnauthorized: (() => void) | null = null;

export const setUnauthorizedHandler = (callback: () => void) => {
  onUnauthorized = callback;
};

const API_URL = "http://localhost:3000/api/v1";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    sessionStorage.setItem("authToken", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export const initializeAuth = () => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    setAuthToken(token);
  }
  return token;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status == 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

// APIs
export const loginApi = async (
  credential: LoginCredentials
): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/auth/login", credential);

  if (response.data.accessToken) {
    setAuthToken(response.data.accessToken);
  }

  return response.data;
};

export const searchByVINApi = async (vin: string): Promise<Vehicle[]> => {
  const response = await axiosInstance.get(`/vehicles/search/vin/${vin}`);
  return response.data;
};

export const searchByPlateAndStateApi = async (
  plate: string,
  state: string
): Promise<Vehicle[]> => {
  const response = await axiosInstance.get(
    `/vehicles/search/plate/${plate}/${state}`
  );
  return response.data;
};

export default axiosInstance;
