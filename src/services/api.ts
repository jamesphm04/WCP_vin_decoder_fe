import axios, { AxiosInstance } from "axios";
import { LoginCredentials, AuthResponse } from "../types/auth";
import { Vehicle, SearchParams } from "../types/vehicle";

const API_URL = "http://localhost:3000/api/v1";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status == 401) {
      window.location.href = "/login";
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

export const searchVehiclesApi = async (
  params: SearchParams
): Promise<Vehicle[]> => {
  const response = await axiosInstance.post("/search", params);
  return response.data;
};

export default axiosInstance;
