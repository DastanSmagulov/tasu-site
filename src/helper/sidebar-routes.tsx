export type Route = {
  path: string;
  name: string;
  icon: string;
  submenu?: Route[];
  count?: number;
  highlight?: boolean;
  roles?: string[]; // Define roles that can access this route
};

const routes: Route[] = [
  {
    path: "/transceiver",
    name: "Акт",
    icon: "act",
    roles: ["transceiver"],
  },
  {
    path: "/forwarder",
    name: "Акт",
    icon: "act",
    roles: ["forwarder"],
  },
  {
    path: "/manager",
    name: "Акт",
    icon: "act",
    roles: ["manager"],
  },
  {
    path: "/accountant",
    name: "Акт",
    icon: "act",
    roles: ["accountant"],
  },
  {
    path: "/courier",
    name: "Акт",
    icon: "act",
    roles: ["courier"],
  },
  {
    path: "/manager/requests",
    name: "Заявки",
    icon: "requests",
    roles: ["manager"],
  },
  {
    path: "/manager/cmp",
    name: "CMP",
    icon: "cmp",
    roles: ["manager"],
  },
  {
    path: "/manager/statistics",
    name: "Статистика",
    icon: "statistics",
    roles: ["manager"],
  },
  {
    path: "/manager/users",
    name: "Пользователи",
    icon: "users",
    roles: ["manager"],
  },
  {
    path: "/manager/cost-calculation",
    name: "Расчет стоимости",
    icon: "cost",
    roles: ["manager"],
    submenu: [
      {
        path: "/manager/cost-calculation/calculator",
        name: "Калькулятор",
        icon: "",
        roles: ["manager"],
      },
      {
        path: "/manager/cost-calculation/saved",
        name: "Сохраненные",
        icon: "",
        roles: ["manager"],
      },
    ],
  },
  {
    path: "/transceiver/warehouse",
    name: "Склад",
    icon: "warehouse",
    // count: 14,
    roles: ["transceiver"],
  },
  {
    path: "/forwarder/warehouse",
    name: "Склад",
    icon: "warehouse",
    // count: 14,
    roles: ["forwarder"],
  },
  {
    path: "/admin/tariff",
    name: "Тарифы",
    icon: "tariff",
    // count: 14,
    roles: ["admin"],
  },
  {
    path: "/admin/cargo",
    name: "Грузы",
    icon: "cargo",
    roles: ["admin"],
  },
  {
    path: "/admin/users",
    name: "Пользователи",
    icon: "users",
    roles: ["admin"],
  },
  {
    path: "/admin/partners",
    name: "Партнеры",
    icon: "partners",
    roles: ["admin"],
  },
  {
    path: "/admin/flights",
    name: "Рейсы",
    icon: "flights",
    roles: ["admin"],
  },
  {
    path: "/admin/statistics",
    name: "Статистика",
    icon: "statistics",
    roles: ["admin"],
  },
];

export default routes;
