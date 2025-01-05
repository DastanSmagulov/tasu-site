import React from "react";
import Image from "next/image";

interface QrActProps {
  qrCodeUrl: string; // URL of the QR code image
  actNumber: string; // Act number (e.g., "####")
  description: string; // Description text
}

const QrAct: React.FC<QrActProps> = ({ qrCodeUrl, actNumber, description }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `QR-code-${actNumber}.png`; // Set the download file name
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        {/* QR Code */}
        <div className="mb-6">
          <Image
            src={qrCodeUrl}
            alt="QR Code"
            width={200}
            height={200}
            className="mx-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#1D1B23] mb-4">
          QR-код Акта №{actNumber}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">{description}</p>

        {/* Button to Download QR Code */}
        <button
          onClick={handleDownload}
          className="px-6 py-2 rounded-md transition-colors"
        >
          Скачать QR-код
        </button>
      </div>
    </div>
  );
};

export default QrAct;
