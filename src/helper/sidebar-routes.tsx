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
    path: "/balance",
    name: "Баланс",
    icon: "balance",
  },
  {
    path: "/expenses",
    name: "Расходы",
    icon: "expences",
    highlight: true,
  },
  {
    path: "//employees",
    name: "Сотрудники",
    icon: "employees",
  },
  {
    path: "/partners",
    name: "Партнеры",
    icon: "partners",
    highlight: true,
  },
  {
    path: "/broker-tariffs",
    name: "Тарифы брокеров",
    icon: "brokers",
  },
  {
    path: "/statistics",
    name: "Статистика",
    icon: "stats",
  },
  {
    path: "/flights",
    name: "Рейсы",
    icon: "flights",
  },
  {
    path: "/finance",
    name: "Список",
    icon: "list",
  },
];

export default routes;
