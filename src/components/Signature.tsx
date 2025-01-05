import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureProps {
  onSubmit: (signatureDataUrl: string) => void;
  onUpload: (file: File) => void;
}

const Signature: React.FC<SignatureProps> = ({ onSubmit, onUpload }) => {
  const signaturePadRef = useRef<SignatureCanvas>(null);
  const [penColor, setPenColor] = useState<string>("blue"); // Default pen color
  const [penSize, setPenSize] = useState<number>(2); // Default pen size

  const handleClear = () => {
    signaturePadRef.current?.clear();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handlePenColorChange = (color: string) => {
    setPenColor(color);
    if (signaturePadRef.current) {
      (signaturePadRef.current as any).penColor = color;
    }
  };

  const handlePenSizeChange = (size: number) => {
    setPenSize(size);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-center md:text-left mb-6 text-[#1D1B23]">
        Подпись заказчика
      </h2>
      <div className="border-2 border-gray-800 bg-white p-4 rounded-md mx-auto w-full max-w-lg">
        <SignatureCanvas
          ref={signaturePadRef}
          penColor={penColor}
          canvasProps={{
            width: 400, // Adjusts for smaller screens
            height: 200,
            className: "bg-white w-full h-auto",
          }}
        />
        <button
          onClick={handleClear}
          className="font-medium mt-2 hover:underline bg-transparent hover:bg-transparent"
        >
          Сбросить
        </button>
      </div>

      {/* Brush Color and Size Options */}
      <div className="flex flex-col gap-6 mt-4 text-[#000000] md:flex-row md:justify-between">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <label className="font-semibold">Цвет кисти:</label>
          <div className="flex gap-2">
            <button
              onClick={() => handlePenColorChange("blue")}
              className={`w-6 h-6 rounded-full bg-blue-500 ${
                penColor === "blue" ? "ring-2 ring-black" : ""
              }`}
            />
            <button
              onClick={() => handlePenColorChange("red")}
              className={`w-6 h-6 rounded-full bg-red-500 ${
                penColor === "red" ? "ring-2 ring-black" : ""
              }`}
            />
            <button
              onClick={() => handlePenColorChange("green")}
              className={`w-6 h-6 rounded-full bg-green-500 ${
                penColor === "green" ? "ring-2 ring-black" : ""
              }`}
            />
            <button
              onClick={() => handlePenColorChange("black")}
              className={`w-6 h-6 rounded-full bg-black ${
                penColor === "black" ? "ring-2 ring-white" : ""
              }`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center md:items-start">
          <label className="font-semibold">Размер кисти:</label>
          <div className="flex gap-2">
            <button
              onClick={() => handlePenSizeChange(2)}
              className={`w-8 h-8 rounded-full bg-gray-300 text-sm flex items-center justify-center ${
                penSize === 2 ? "ring-2 ring-black" : ""
              }`}
            >
              2
            </button>
            <button
              onClick={() => handlePenSizeChange(4)}
              className={`w-8 h-8 rounded-full bg-gray-300 text-sm flex items-center justify-center ${
                penSize === 4 ? "ring-2 ring-black" : ""
              }`}
            >
              4
            </button>
            <button
              onClick={() => handlePenSizeChange(6)}
              className={`w-8 h-8 rounded-full bg-gray-300 text-sm flex items-center justify-center ${
                penSize === 6 ? "ring-2 ring-black" : ""
              }`}
            >
              6
            </button>
            <button
              onClick={() => handlePenSizeChange(8)}
              className={`w-8 h-8 rounded-full bg-gray-300 text-sm flex items-center justify-center ${
                penSize === 8 ? "ring-2 ring-black" : ""
              }`}
            >
              8
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signature;
