import Image from "next/image";
import React, { useState } from "react";

interface TransportType {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const transportOptions: TransportType[] = [
  {
    id: "auto-console",
    title: "Авто перевозки",
    description: "Консол",
    imageUrl: "/images/transportAuto.png",
  },
  {
    id: "auto-separate",
    title: "Авто перевозки",
    description: "Отдельно",
    imageUrl: "/images/transportAuto.png",
  },
  {
    id: "airplane",
    title: "Самолет",
    description: "Рейс",
    imageUrl: "/images/transportPlane.png",
  },
  {
    id: "train",
    title: "Поезд",
    description: "Рейс",
    imageUrl: "/images/transportTrain.png",
  },
];

const TransportationTypes: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleSelect = (id: string) => {
    setSelectedOption(id);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Вид перевозки</h2>
      <div className="flex gap-4 max-xl:flex-col">
        {transportOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center transition-all ${
              selectedOption === option.id
                ? "border-blue-500 shadow-lg"
                : "border-gray-300"
            }`}
          >
            <Image
              src={option.imageUrl}
              alt={option.title}
              className="mb-2"
              width={80}
              height={80}
            />
            <h3 className="text-lg font-semibold text-gray-700">
              {option.title}
            </h3>
            <p className="text-gray-500">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportationTypes;
