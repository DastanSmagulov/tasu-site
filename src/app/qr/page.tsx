"use client";
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import { useRouter } from "next/navigation";

const QrCodePage: React.FC = () => {
  const [qrResult, setQrResult] = useState<string>("");
  const [hasRedirected, setHasRedirected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const handleResult = (result: any, error: any) => {
    if (result && !hasRedirected) {
      const decodedText = result?.text;
      if (decodedText) {
        setQrResult(decodedText);
        setHasRedirected(true);
        router.push(decodedText);
      }
    }
    if (error) {
      // Log error (or display a more descriptive message if needed)
      console.info("Scanning error:", error);
      setErrorMessage("QR-код не обнаружен. Попробуйте еще раз.");
    }
  };

  const handleRestartScan = () => {
    // Reset the state to allow a new scan
    setQrResult("");
    setHasRedirected(false);
    setErrorMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-semibold mb-4">Сканировать QR-код</h1>
      <div className="w-full max-w-md">
        <QrReader
          onResult={handleResult}
          constraints={{ facingMode: "environment" }}
        />
      </div>
      <div className="mt-4 text-center">
        {qrResult ? (
          <p className="text-green-700">Сканированный QR: {qrResult}</p>
        ) : (
          <p className="text-gray-600">
            Направьте камеру на QR-код для сканирования.
          </p>
        )}
        {errorMessage && <p className="mt-2 text-red-600">{errorMessage}</p>}
      </div>
      <div className="mt-4">
        <button
          onClick={handleRestartScan}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Перезапустить сканирование
        </button>
      </div>
    </div>
  );
};

export default QrCodePage;
