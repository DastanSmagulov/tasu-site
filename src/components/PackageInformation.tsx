import Signature from "@/components/Signature";
import React, { useState } from "react";

const InformationPackage: React.FC = () => {
  const [issuedBy, setIssuedBy] = useState("");
  const [issuedStatus, setIssuedStatus] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [receivedStatus, setReceivedStatus] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [uploadedSignature, setUploadedSignature] = useState<File | null>(null);
  const [dateTime, setDateTime] = useState<string>(""); // State for date and time

  const handleSignatureSubmit = (signatureDataUrl: string) => {
    setSignatureDataUrl(signatureDataUrl);
  };

  const handleSignatureUpload = (file: File) => {
    setUploadedSignature(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSignatureDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateTime(e.target.value);
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} • ${hours}:${minutes}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      issuedBy,
      issuedStatus,
      receivedBy,
      receivedStatus,
      dateTime: formatDateTime(dateTime),
      signatureDataUrl,
      uploadedSignature,
    });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Информация о получении груза</h1>

      <form onSubmit={handleSubmit}>
        {/* Issued By */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Выдал
          </label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <input
              type="text"
              value={issuedBy}
              onChange={(e) => setIssuedBy(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Укажите ФИО"
            />
            <select
              value={issuedStatus}
              onChange={(e) => setIssuedStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите статус</option>
              <option value="issued">Выдан</option>
              <option value="pending">Ожидает</option>
            </select>
          </div>
        </div>

        {/* Received By */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Принял
          </label>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <input
              type="text"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Укажите ФИО"
            />
            <select
              value={receivedStatus}
              onChange={(e) => setReceivedStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите статус</option>
              <option value="received">Принят</option>
              <option value="pending">Ожидает</option>
            </select>
          </div>
        </div>

        {/* Date and Time */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Дата и время получения:
          </label>
          <div className="mt-2 flex items-center gap-4">
            <input
              type="datetime-local"
              value={dateTime}
              onChange={handleDateTimeChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700">{formatDateTime(dateTime)}</span>
          </div>
        </div>

        {/* Signature */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Подпись Заказчика</h2>
          <Signature
            onSubmit={handleSignatureSubmit}
            onUpload={handleSignatureUpload}
          />
          {signatureDataUrl && (
            <div className="mt-4">
              <img
                src={signatureDataUrl}
                alt="Подпись"
                className="max-w-full"
              />
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default InformationPackage;
