import React from "react";

const ServiceCosts: React.FC = () => {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Стоимость услуг и порядок расчетов
      </h2>
      <form className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="Укажите стоимость"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <input
          type="text"
          placeholder="Общая стоимость услуг экспедитора"
          className="input input-bordered w-full bg-white border-gray-300"
        />
        <textarea
          placeholder="Любые дополнения относительно особых условий"
          className="textarea textarea-bordered w-full bg-white border-gray-300"
        ></textarea>
      </form>
    </div>
  );
};

export default ServiceCosts;
