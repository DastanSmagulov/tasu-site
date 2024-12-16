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
    imageUrl: "/images/truck-console.png",
  },
  {
    id: "auto-separate",
    title: "Авто перевозки",
    description: "Отдельно",
    imageUrl: "/images/truck-separate.png",
  },
  {
    id: "airplane",
    title: "Самолет",
    description: "Рейс",
    imageUrl: "/images/airplane.png",
  },
  {
    id: "train",
    title: "Поезд",
    description: "Рейс",
    imageUrl: "/images/train.png",
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
      <div className="flex gap-4">
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
              className="w-24 h-24 mb-2"
              width={24}
              height={24}
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
