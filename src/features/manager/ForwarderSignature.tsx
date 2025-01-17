import React, { useRef, useState } from "react";
import SignaturePadWrapper from "react-signature-pad-wrapper";

interface SignatureProps {
  onSubmit: (signatureDataUrl: string) => void;
  onUpload: (file: File) => void;
}

const ForwarderSignature: React.FC<SignatureProps> = ({
  onSubmit,
  onUpload,
}) => {
  const signaturePadRef = useRef<SignaturePadWrapper>(null);
  const [penColor, setPenColor] = useState<string>("blue");
  const [penSize, setPenSize] = useState<number>(2);

  const updateSignaturePadOptions = () => {
    const signaturePad = signaturePadRef.current?.instance; // Access the instance
    if (signaturePad) {
      signaturePad.penColor = penColor; // Update pen color
      signaturePad.minWidth = penSize; // Update pen size
    }
  };

  const handleClear = () => {
    signaturePadRef.current?.clear();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleSave = () => {
    const signatureDataUrl = signaturePadRef.current?.toDataURL();
    if (signatureDataUrl) {
      onSubmit(signatureDataUrl);
    }
  };

  const handlePenColorChange = (color: string) => {
    setPenColor(color);
    updateSignaturePadOptions();
  };

  const handlePenSizeChange = (size: number) => {
    setPenSize(size);
    updateSignaturePadOptions();
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-center md:text-left mb-6 text-[#1D1B23]">
        Подпись экспедитора
      </h2>
      <div className="border-2 border-gray-800 bg-white rounded-md w-full max-w-lg">
        <SignaturePadWrapper
          ref={signaturePadRef}
          options={{
            penColor,
            backgroundColor: "rgba(255,255,255,1)",
          }}
          canvasProps={{
            className: "bg-white w-full h-auto",
          }}
        />
        <div className="flex justify-between mt-2">
          <button
            onClick={handleClear}
            className="font-medium hover:underline m-4 bg-transparent hover:bg-transparent"
          >
            Сбросить
          </button>
          <button
            onClick={handleSave}
            className="font-medium hover:underline m-4 bg-transparent hover:bg-transparent"
          >
            Сохранить
          </button>
        </div>
      </div>

      {/* Brush Color and Size Options */}
      <div className="flex flex-col gap-6 mt-4 text-[#000000] md:flex-row md:justify-between">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <label className="font-semibold">Цвет кисти:</label>
          <div className="flex gap-2">
            {["blue", "red", "green", "black"].map((color) => (
              <button
                key={color}
                onClick={() => handlePenColorChange(color)}
                className={`w-6 h-6 rounded-full bg-${color}-500 ${
                  penColor === color ? "ring-2 ring-black" : ""
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center md:items-start">
          <label className="font-semibold">Размер кисти:</label>
          <div className="flex gap-2">
            {[2, 4, 6, 8].map((size) => (
              <button
                key={size}
                onClick={() => handlePenSizeChange(size)}
                className={`w-8 h-8 rounded-full bg-gray-300 text-sm flex items-center justify-center ${
                  penSize === size ? "ring-2 ring-black" : ""
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForwarderSignature;
