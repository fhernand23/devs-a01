import axios from "axios";

// export const apiBaseUrl = "http://localhost:8091/b01/api";

export const API = axios.create({
  baseURL: "/b01/api",
});

export const token = localStorage.getItem("jwt");

export const POSTFormHeader = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "multipart/form-data",
};

export const GETHeader = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};
