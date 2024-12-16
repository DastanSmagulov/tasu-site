import { useState } from "react";

const Shipping = () => {
  const [sender, setSender] = useState("");
  const [recipient, setRecipient] = useState("");
  const [city, setCity] = useState("");
  const [cargoCost, setCargoCost] = useState("");
  const [insurance, setInsurance] = useState("");

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Перевозка</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Белескызы Инжу</span>
          <select
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="">Отправитель</option>
            {/* Additional options */}
          </select>
          <button className="btn btn-icon p-2">
            {/* Add edit icon SVG */}
          </button>
          <button className="btn btn-icon p-2">
            {/* Add delete icon SVG */}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm">Равиль Абдрахман</span>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="">Получатель</option>
            {/* Additional options */}
          </select>
          <button className="btn btn-icon p-2">
            {/* Add edit icon SVG */}
          </button>
          <button className="btn btn-icon p-2">
            {/* Add delete icon SVG */}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center">
          <span className="text-sm mr-2">№</span>
          <input
            type="text"
            value="1"
            readOnly
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="flex items-center">
          <span className="text-sm mr-2">Город получателя</span>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="select select-bordered w-full max-w-xs"
          >
            <option value="">Выберите город</option>
            <option value="Astana">Астана</option>
            {/* Additional cities */}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <span className="text-sm mr-2">Стоимость груза</span>
          <input
            type="text"
            value={cargoCost}
            onChange={(e) => setCargoCost(e.target.value)}
            className="input input-bordered w-full max-w-xs"
            placeholder="2 030 000 тг"
          />
        </div>
        <div className="flex items-center">
          <span className="text-sm mr-2">Сумма страховки</span>
          <input
            type="text"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
            className="input input-bordered w-full max-w-xs"
            placeholder="35 000 тг"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button className="btn btn-outline">Edit</button>
        <button className="btn btn-danger">Delete</button>
      </div>
    </div>
  );
};

export default Shipping;
