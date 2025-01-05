import React from "react";
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

const StatisticsComponent = () => {
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
    labels: [
      "Акт сформирован",
      "В пути",
      "Готов к отправке",
      "Не готов",
      "Доставлен",
    ],
    datasets: [
      {
        data: [32, 28, 9, 14, 17],
        backgroundColor: [
          "#4F9EFF",
          "#FFB347",
          "#D891EF",
          "#FF6961",
          "#77DD77",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Общий доход",
              value: "46 млн ₸",
              trend: "↓ 16%",
              color: "red",
            },
            {
              title: "Общая выручка",
              value: "3 млн ₸",
              trend: "↑ 16%",
              color: "green",
            },
            {
              title: "Количество рейсов",
              value: "124 рейсов",
              trend: "↑ 16%",
              color: "green",
            },
            {
              title: "Количество пользователей",
              value: "1,643",
              trend: "↑ 16%",
              color: "green",
            },
          ].map((item, index) => (
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
          <Pie
            data={pieData}
            options={{
              responsive: true,
              plugins: {
                tooltip: {
                  backgroundColor: "#4F9EFF",
                  titleColor: "#FFF",
                },
              },
            }}
          />
        </div>
        {/* Legend */}
        <div className="p-4 bg-white rounded-lg shadow-md space-y-2">
          {[
            { label: "Акт сформирован", value: "32 000", color: "#4F9EFF" },
            { label: "В пути", value: "28 000", color: "#FFB347" },
            { label: "Готов к отправке", value: "9 000", color: "#D891EF" },
            { label: "Не готов", value: "14 000", color: "#FF6961" },
            { label: "Доставлен", value: "17 000", color: "#77DD77" },
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-sm text-gray-600">{item.label}: </span>
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
