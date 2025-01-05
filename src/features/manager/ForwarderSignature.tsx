import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignatureProps {
  onSubmit: (signatureDataUrl: string) => void;
  onUpload: (file: File) => void;
}

const ForwarderSignature: React.FC<SignatureProps> = ({
  onSubmit,
  onUpload,
}) => {
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
      <h2 className="text-lg font-semibold mb-6 text-[#1D1B23]">
        Подпись Экспедитора
      </h2>
      <div className="border-2 border-gray-800 bg-white pt-1 pb-1 px-3">
        {/* <label className="text-gray-300">Подпись заказчика:</label> */}
        <SignatureCanvas
          ref={signaturePadRef}
          penColor={penColor}
          canvasProps={{
            width: 500,
            height: 200,
            className: "bg-white",
          }}
        />
        <label onClick={handleClear} className="text-gray-700">
          Сбросить
        </label>
      </div>

      {/* Brush Color and Size Options */}
      <div className="flex items-center gap-4 mt-4 text-[#000000]">
        <div className="flex items-center gap-2">
          <label className="font-semibold">Цвет кисти:</label>
          <div className="flex gap-1">
            <button
              onClick={() => handlePenColorChange("blue")}
              className={`w-6 h-6 rounded-full bg-blue-500 ${
                penColor === "blue" ? "border-2 border-black" : ""
              }`}
            />
            <button
              onClick={() => handlePenColorChange("red")}
              className={`w-6 h-6 rounded-full bg-red-500 ${
                penColor === "red" ? "border-2 border-black" : ""
              }`}
            />
            <button
              onClick={() => handlePenColorChange("green")}
              className={`w-6 h-6 rounded-full bg-green-500 ${
                penColor === "green" ? "border-2 border-black" : ""
              }`}
            />
            <button
              onClick={() => handlePenColorChange("black")}
              className={`w-6 h-6 rounded-full bg-black ${
                penColor === "black" ? "border-2 border-white" : ""
              }`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-semibold">Размер кисти:</label>
          <div className="flex gap-1">
            <button
              onClick={() => handlePenSizeChange(2)}
              className={`w-6 h-6 rounded-full bg-gray-300 text-xs flex items-center justify-center ${
                penSize === 2 ? "border-2 border-black" : ""
              }`}
            >
              2
            </button>
            <button
              onClick={() => handlePenSizeChange(4)}
              className={`w-6 h-6 rounded-full bg-gray-300 text-xs flex items-center justify-center ${
                penSize === 4 ? "border-2 border-black" : ""
              }`}
            >
              4
            </button>
            <button
              onClick={() => handlePenSizeChange(6)}
              className={`w-6 h-6 rounded-full bg-gray-300 text-xs flex items-center justify-center ${
                penSize === 6 ? "border-2 border-black" : ""
              }`}
            >
              6
            </button>
            <button
              onClick={() => handlePenSizeChange(8)}
              className={`w-6 h-6 rounded-full bg-gray-300 text-xs flex items-center justify-center ${
                penSize === 8 ? "border-2 border-black" : ""
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

export default ForwarderSignature;
