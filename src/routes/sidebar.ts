export type Route = {
  path: string;
  name: string;
  icon: string;
  submenu?: Route[];
  count?: number;
  highlight?: boolean;
};

const routes: Route[] = [
  {
    path: "/act",
    name: "Акт",
    icon: "act",
    submenu: [
      {
        path: "/app/act/sub1",
        name: "Подакт 1",
        icon: "arrow-right",
      },
    ],
  },
  {
    path: "/warehouse",
    name: "Склад",
    icon: "warehouse",
    count: 14,
  },
  {
    path: "/cost-calculation",
    name: "Расчет стоимости",
    icon: "cost",
  },
  {
    path: "/app/balance",
    name: "Баланс",
    icon: "balance",
  },
  {
    path: "/app/admin/expenses",
    name: "Расходы",
    icon: "expences",
    highlight: true,
  },
  {
    path: "/app/admin/employees",
    name: "Сотрудники",
    icon: "employees",
  },
  {
    path: "/app/admin/partners",
    name: "Партнеры",
    icon: "partners",
    highlight: true,
  },
  {
    path: "/app/admin/broker-tariffs",
    name: "Тарифы брокеров",
    icon: "brokers",
  },
  {
    path: "/app/admin/statistics",
    name: "Статистика",
    icon: "stats",
  },
  {
    path: "/app/admin/flights",
    name: "Рейсы",
    icon: "flights",
  },
  {
    path: "/app/finance",
    name: "Список",
    icon: "list",
  },
];

export default routes;
