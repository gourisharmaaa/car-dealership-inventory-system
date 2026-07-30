import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setApiToken = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const clearApiToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export const registerUser = (payload) => api.post("/api/auth/register", payload);
export const loginUser = (payload) => api.post("/api/auth/login", payload);
export const fetchCurrentUser = () => api.get("/api/auth/me");
export const fetchVehicles = () => api.get("/api/vehicles");
export const searchVehicles = (params) => api.get("/api/vehicles/search", { params });
export const addVehicle = (payload) => api.post("/api/vehicles", payload);
export const updateVehicle = (id, payload) => api.put(`/api/vehicles/${id}`, payload);
export const deleteVehicle = (id) => api.delete(`/api/vehicles/${id}`);
export const purchaseVehicle = (id, quantity) => api.post(`/api/vehicles/${id}/purchase`, { quantity });
export const restockVehicle = (id, quantity) => api.post(`/api/vehicles/${id}/restock`, { quantity });

export default api;
