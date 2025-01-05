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
    <>
      <div className="mb-8 flex justify-center">
        <Logo width={172} height={56} />
      </div>
      <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
        {/* Logo Section */}
        {/* Input Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            ФИО
          </label>
          <input
            type="text"
            placeholder="Введите ФИО клиента"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleGenerateQR}
          className="w-full text-white font-semibold py-3 rounded-lg transition"
        >
          Товар передан Клиенту
        </button>

        {/* Agreement Text */}
        <p className="text-xs text-gray-500 mt-4">
          Данным соглашением нажатием кнопки внизу вы соглашаетесь передать
          курьеру товар в течение ____ времени
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

            {/* Download Button */}
            <button
              onClick={handleDownloadQR}
              className="mt-4 text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              Скачать QR-код
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryQRCard;
