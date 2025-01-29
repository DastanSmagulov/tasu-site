import routes from "./sidebar-routes";
import { Route } from "./types";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${Cookies.get("auth_token") || ""}`,
  },
});

export const getRoutesForRole = (role: string): Route[] => {
  const filterRoutes = (routes: Route[]): Route[] =>
    routes
      .filter((route) => !route.roles || route.roles.includes(role)) // Check if role matches
      .map((route) => ({
        ...route,
        submenu: route.submenu ? filterRoutes(route.submenu) : undefined, // Recursively filter submenus
      }));

  return filterRoutes(routes);
};

export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "long", // "Пятница"
    year: "numeric", // "2025"
    month: "long", // "Января"
    day: "numeric", // "24"
    hour: "numeric", // "13"
    minute: "numeric", // "49"
    second: "numeric", // "00"
    timeZone: "Asia/Almaty", // Часовой пояс Казахстана
  };

  const formattedDate = new Intl.DateTimeFormat("ru-KZ", options).format(date);
  return formattedDate;
};
