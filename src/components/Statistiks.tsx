"use client";

import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { axiosInstance } from "@/helper/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Mapping of status to colors (you can adjust these to your liking)
const STATUS_COLORS: Record<string, string> = {
  "Акт сформирован": "#4F9EFF",
  "Отправлен на хранение": "#FFB347",
  "Заявка сформирована": "#D891EF",
  "Ожидание оплаты": "#FF6961",
  "У перевозчика": "#77DD77",
  CREATED: "#AAAAAA",
};

const StatisticsComponent = () => {
  // State for API data
  const [baseStatistic, setBaseStatistic] = useState({
    total_income: 0,
    revenue: 0,
    transportation_count: 0,
    users_count: 0,
  });
  const [statusStatistic, setStatusStatistic] = useState<Record<string, any>>(
    {}
  );

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axiosInstance.get("/acts/statistics/");
        setBaseStatistic(response.data.base_statistic);
        setStatusStatistic(response.data.status_statistic);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  // Build pie chart data from statusStatistic
  const pieLabels = Object.keys(statusStatistic);
  const pieDataValues = pieLabels.map(
    (key) => statusStatistic[key]?.total || 0
  );
  const pieColors = pieLabels.map((key) => STATUS_COLORS[key] || "#CCCCCC");

  const lineData = {
    labels: [
      "Янв",
      "Февр",
      "Март",
      "Апр",
      "Май",
      "Июнь",
      "Июль",
      "Авг",
      "Сент",
      "Окт",
      "Нояб",
      "Дек",
    ],
    datasets: [
      {
        label: "Показатели Продаж",
        data: [50, 90, 80, 110, 146, 130, 170, 200, 180, 220, 210, 230],
        fill: true,
        backgroundColor: "rgba(255, 204, 0, 0.2)",
        borderColor: "#FFCC00",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: pieDataValues,
        backgroundColor: pieColors,
        borderWidth: 0,
      },
    ],
  };

  // Build stats for summary cards using baseStatistic values.
  const stats = [
    {
      title: "Общий доход",
      value: `${baseStatistic.total_income} тг.`,
      trend: "-",
      color: "green",
    },
    {
      title: "Общая выручка",
      value: `${baseStatistic.revenue} тг.`,
      trend: "-",
      color: "green",
    },
    {
      title: "Количество рейсов",
      value: `${baseStatistic.transportation_count} рейсов`,
      trend: "-",
      color: "green",
    },
    {
      title: "Количество пользователей",
      value: baseStatistic.users_count,
      trend: "-",
      color: "green",
    },
  ];

  // Build pie chart legend data
  const pieLegend = pieLabels.map((key) => ({
    label: key,
    value: `${statusStatistic[key]?.total || 0}`,
    color: STATUS_COLORS[key] || "#CCCCCC",
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-md flex flex-col justify-between"
            >
              <h3 className="text-sm text-gray-500 mb-2">{item.title}</h3>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                <span
                  className={`ml-2 text-sm font-medium ${
                    item.color === "red" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {item.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
        {/* Line Chart */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-gray-700 mb-4">
            Показатели Продаж
          </h3>
          <Line
            data={lineData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  backgroundColor: "#FFCC00",
                  titleColor: "#000",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Pie Chart */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-gray-700 mb-4">
            Действующие Заказы
          </h3>
          <div className="relative h-72">
            <Pie
              data={pieData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    backgroundColor: "#4F9EFF",
                    titleColor: "#FFF",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 bg-white rounded-lg shadow-md space-y-2">
          {pieLegend.map((item, index) => (
            <div key={index} className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-sm text-gray-600">{item.label}:</span>
              <span className="ml-1 text-gray-800 font-medium">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatisticsComponent;
