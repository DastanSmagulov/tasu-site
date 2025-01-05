import Checkbox from "@/components/ui/CheckBox";
import React from "react";

const RouteConditions: React.FC = () => {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Маршрут, Условия Перевозки</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Введите город отправителя"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <input
          type="text"
          placeholder="Введите город получателя"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <input
          type="text"
          placeholder="Грузополучатель"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <input
          type="text"
          placeholder="Страна"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <input
          type="text"
          placeholder="Адрес"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <input
          type="tel"
          placeholder="Телефон"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <input
          type="date"
          placeholder="Дата отправления"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <input
          type="text"
          placeholder="Срок доставки"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <div className="col-span-2 flex items-center gap-4">
          <label className="text-gray-700">Имеется ли страховка на груз?</label>
          <div className="flex mt-1">
            <label className="inline-flex">
              <Checkbox />
              <span className="ml-2">Да</span>
            </label>
            <label className="inline-flex items-center ml-4">
              <Checkbox />
              <span className="ml-2">Нет</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RouteConditions;
