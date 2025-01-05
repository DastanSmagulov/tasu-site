import React, { useState } from "react";

const CargoDeliveryInfo = () => {
  const [date, setDate] = useState("22.10.2024");
  const [time, setTime] = useState("15:05");
  const [issuer, setIssuer] = useState("");
  const [receiver, setReceiver] = useState("");
  const [status, setStatus] = useState({ issued: false, received: false });

  return (
    <div className="cargo-delivery-info">
      <h3>Дата и время погрузки:</h3>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <h4>Информация о выдачи груза</h4>
      <div>
        <label>Выдал</label>
        <select value={issuer} onChange={(e) => setIssuer(e.target.value)}>
          <option value="">ФИО</option>
          <option value="Person 1">Person 1</option>
          <option value="Person 2">Person 2</option>
        </select>
        <button onClick={() => setStatus({ ...status, issued: true })}>
          выдал
        </button>
      </div>

      <div>
        <label>Принял</label>
        <input
          type="text"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />
        <button onClick={() => setStatus({ ...status, received: true })}>
          принял
        </button>
      </div>

      <div className="action-buttons">
        <button>Отправить</button>
        <button>Распечатать</button>
        <button>Сохранить</button>
      </div>
    </div>
  );
};

export default CargoDeliveryInfo;
