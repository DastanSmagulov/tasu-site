import routes from "./sidebar-routes";
import { Route } from "./types";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const STATUS_STYLES: Record<
  string,
  {
    label: string;
    textColor: string; // Класс Tailwind для цвета текста
    bgColor: string; // Класс Tailwind для цвета фона
    circleColor: string; // Класс для цвета кружка слева
    borderColor: string; // Класс для обводки
  }
> = {
  "Акт сформирован": {
    label: "Акт сформирован",
    textColor: "text-[#0D47A1]", // Blue-900
    bgColor: "bg-[#BBDEFB]", // Blue-100
    circleColor: "bg-[#2196F3]", // Blue-500
    borderColor: "border border-[#90CAF9]", // Blue-200
  },
  "Заявка сформирована": {
    label: "Заявка сформирована",
    textColor: "text-[#0D47A1]", // Blue-900
    bgColor: "bg-[#BBDEFB]", // Blue-100
    circleColor: "bg-[#2196F3]", // Blue-500
    borderColor: "border border-[#90CAF9]", // Blue-200
  },
  "Отправлен на хранение": {
    label: "Отправлен на хранение",
    textColor: "text-[#F57F17]", // Yellow-900
    bgColor: "bg-[#FFF9C4]", // Yellow-100
    circleColor: "bg-[#FFEB3B]", // Yellow-500
    borderColor: "border border-[#FFF176]", // Yellow-300
  },
  "Ожидание оплаты": {
    label: "Ожидание оплаты",
    textColor: "text-[#B71C1C]", // Red-900
    bgColor: "bg-[#FFCDD2]", // Red-100
    circleColor: "bg-[#F44336]", // Red-500
    borderColor: "border border-[#E57373]", // Red-300
  },
  "Готов к отправке": {
    label: "Готов к отправке",
    textColor: "text-[#1B5E20]", // Green-900
    bgColor: "bg-[#C8E6C9]", // Green-100
    circleColor: "bg-[#4CAF50]", // Green-500
    borderColor: "border border-[#81C784]", // Green-300
  },
  "У перевозчика": {
    label: "У перевозчика",
    textColor: "text-[#0D47A1]", // Blue-900
    bgColor: "bg-[#90CAF9]", // Blue-200
    circleColor: "bg-[#2196F3]", // Blue-500
    borderColor: "border border-[#64B5F6]", // Blue-300
  },
  "Передан курьеру": {
    label: "Передан курьеру",
    textColor: "text-[#0D47A1]", // Blue-900
    bgColor: "bg-[#64B5F6]", // Blue-300
    circleColor: "bg-[#2196F3]", // Blue-500
    borderColor: "border border-[#42A5F5]", // Blue-400
  },
  Доставлен: {
    label: "Доставлен",
    textColor: "text-[#1B5E20]", // Green-900
    bgColor: "bg-[#A5D6A7]", // Green-200
    circleColor: "bg-[#4CAF50]", // Green-500
    borderColor: "border border-[#81C784]", // Green-300
  },
};

export default STATUS_STYLES;

export function getStatusBadge(statusKey: string): JSX.Element {
  // Fallback styles if the statusKey is not recognized
  const defaultStyles = {
    label: statusKey,
    textColor: "text-gray-600",
    bgColor: "bg-gray-100",
    circleColor: "bg-gray-500",
    borderColor: "border border-gray-300",
  };

  const { label, textColor, bgColor, circleColor, borderColor } =
    STATUS_STYLES[statusKey] || defaultStyles;

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${textColor} ${bgColor} ${borderColor}`}
    >
      <span
        className={`inline-block w-2 h-2 rounded-full mr-2 ${circleColor}`}
      />
      {label}
    </span>
  );
}

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
