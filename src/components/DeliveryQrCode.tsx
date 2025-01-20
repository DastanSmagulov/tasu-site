import React, { useState } from "react";
import QRCode from "react-qr-code";
import Logo from "@/components/ui/Logo";

const DeliveryQRCard: React.FC = () => {
  const [clientName, setClientName] = useState("");
  const [qrValue, setQrValue] = useState(""); // QR Code value

  const handleGenerateQR = () => {
    const actNumber = "12345"; // Example Act number
    setQrValue(`Act № ${actNumber} - Клиент: ${clientName}`);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = pngFile;
      link.download = "QR_Code.png";
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      {/* Logo */}
      <div className="mb-8">
        <Logo width={172} height={56} />
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg text-center">
        {/* Input Field */}
        <div className="mb-6">
          <label
            htmlFor="client-name"
            className="block text-sm font-medium text-gray-600 mb-2"
          >
            ФИО Клиента
          </label>
          <input
            id="client-name"
            type="text"
            placeholder="Введите ФИО клиента"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>

        {/* Generate QR Button */}
        <button
          onClick={handleGenerateQR}
          className="w-full font-semibold py-3 rounded-lg transition"
        >
          Товар передан Клиенту
        </button>

        {/* Agreement Text */}
        <p className="text-xs text-gray-500 mt-4">
          Нажимая кнопку, вы соглашаетесь передать курьеру товар в течение
          указанного времени.
        </p>

        {/* QR Code Section */}
        {qrValue && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              QR-код Акта № 12345
            </h2>
            <div className="inline-block p-4 bg-white rounded-lg shadow-md">
              <QRCode id="qr-code" value={qrValue} size={200} />
            </div>

            {/* Download QR Button */}
            <button
              onClick={handleDownloadQR}
              className="mt-4 font-semibold py-2 px-6 rounded-lg transition"
            >
              Скачать QR-код
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryQRCard;
