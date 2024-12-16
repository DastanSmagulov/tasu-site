import { useState } from "react";

type CargoFormProps = {
  onSubmit: () => void;
  onPrint: () => void;
  onSave: () => void;
};

const CargoForm: React.FC<CargoFormProps> = ({ onSubmit, onPrint, onSave }) => {
  const [date, setDate] = useState<string>("22.10.2024");
  const [time, setTime] = useState<string>("15:05");
  const [issuer, setIssuer] = useState<string>("");
  const [receiver, setReceiver] = useState<string>("");
  const [status, setStatus] = useState<string>("выдал");

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h3>Дата и время погрузки:</h3>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ width: "60%" }}
        />
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ width: "35%" }}
        />
      </div>

      <h3>Информация о выдаче груза</h3>
      <div style={{ marginBottom: "12px" }}>
        <label>Выдал</label>
        <input
          type="text"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          placeholder="ФИО"
          style={{ width: "100%", marginBottom: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label>Принял</label>
        <input
          type="text"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          placeholder="ФИО"
          style={{ width: "100%" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <label>Статус</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ flex: 1 }}
        >
          <option value="выдал">выдал</option>
          <option value="принял">принял</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={onSubmit}
          style={{
            padding: "8px 12px",
            background: "lightgreen",
            border: "1px solid lightgreen",
            borderRadius: "4px",
          }}
        >
          Отправить
        </button>
        <button
          onClick={onPrint}
          style={{
            padding: "8px 12px",
            border: "1px solid black",
            borderRadius: "4px",
          }}
        >
          Распечатать
        </button>
        <button
          onClick={onSave}
          style={{
            padding: "8px 12px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default CargoForm;
