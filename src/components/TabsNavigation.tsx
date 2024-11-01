// components/TabsNavigation.tsx
import React from "react";

const TabsNavigation = () => {
  return (
    <div className="flex gap-2 p-4 bg-white shadow rounded-t-lg">
      {["TTN", "CMP", "QR", "Заявка", "Excell", "Акт сдачи", "Акт приема"].map(
        (tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 ${
              tab === "Акт приема"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-md`}
          >
            {tab}
          </button>
        )
      )}
      <button className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md">
        Отправить на хранение
      </button>
      <button className="ml-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
        Новые
      </button>
    </div>
  );
};

export default TabsNavigation;
