import React from "react";
import "../../styles/globals.css";

const CargoData: React.FC = () => {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Данные по Грузу</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Укажите груз"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <input
          type="number"
          placeholder="Введите сумму"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <input
          type="text"
          placeholder="Укажите тип упаковки"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <div className="grid grid-cols-4 gap-2 col-span-2">
          <input
            type="number"
            placeholder="Мест"
            className="input input-bordered bg-white border-gray-300"
          />
          <input
            type="number"
            placeholder="Вес (кг)"
            className="input input-bordered bg-white border-gray-300"
          />
          <input
            type="number"
            placeholder="Куб (м³)"
            className="input input-bordered bg-white border-gray-300"
          />
        </div>
      </form>
    </div>
  );
};

export default CargoData;
