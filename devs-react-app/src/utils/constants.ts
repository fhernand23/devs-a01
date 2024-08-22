import { ToastOptions } from "react-toastify";

export const BASE_PATH = process.env.REACT_APP_BASE_PATH || "/a01";

export const ROUTES = {
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  REGISTER: "/register",
  USERS: "/admin/users",
  MODELS: "/models",
  TAGS: "/admin/tags",
  SCHEMAS: "/admin/schemas",
  ARCHIVE: "/models/deleted",
};

export const TOAST_PROPS: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  progress: undefined,
  theme: "light",
};

export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const occupations = [
  { title: "Student", id: 1 },
  { title: "Professor", id: 2 },
  { title: "Researcher", id: 3 },
];
