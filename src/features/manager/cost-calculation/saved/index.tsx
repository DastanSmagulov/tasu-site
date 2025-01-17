import React from "react";

const SavedPage = () => {
  const savedCalculations = [
    {
      id: 132,
      name: "Асылбекова Алина Ерлановна",
      date: "22.10.2024",
      time: "15:05",
    },
    {
      id: 132,
      name: "Асылбекова Алина Ерлановна",
      date: "22.10.2024",
      time: "15:05",
    },
    {
      id: 132,
      name: "Асылбекова Алина Ерлановна",
      date: "22.10.2024",
      time: "15:05",
    },
    {
      id: 132,
      name: "Асылбекова Алина Ерлановна",
      date: "22.10.2024",
      time: "15:05",
    },
    {
      id: 132,
      name: "Асылбекова Алина Ерлановна",
      date: "22.10.2024",
      time: "15:05",
    },
  ];

  return (
    <div className="min-h-screen mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedCalculations.map((calculation, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col relative"
          >
            <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-transparent hover:bg-transparent">
              ✖
            </button>
            <h2 className="text-lg font-semibold mb-2">
              Расчет №{calculation.id}
            </h2>
            <p className="text-gray-700">{calculation.name}</p>
            <div className="flex items-center justify-between mt-4 text-sm">
              <div>
                <span className="bg-gray-200 px-2 py-1 rounded-md text-gray-600">
                  {calculation.date}
                </span>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-gray-600">{calculation.time}</span>
              </div>
              <div>
                {" "}
                <button className="py-2 px-4 rounded-md">Открыть расчет</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPage;
