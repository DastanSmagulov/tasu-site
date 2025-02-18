import Image from "next/image";
import React, { useRef, useState } from "react";
import SignaturePadWrapper from "react-signature-pad-wrapper";

interface SignatureProps {
  onSubmit: (signatureDataUrl: string) => void;
  onUpload: (file: File) => void;
  initialDataUrl?: string | null;
}

const Signature: React.FC<SignatureProps> = ({
  onSubmit,
  onUpload,
  initialDataUrl,
}) => {
  const signaturePadRef = useRef<SignaturePadWrapper>(null);
  const [penColor, setPenColor] = useState<string>("blue");
  const [penSize, setPenSize] = useState<number>(2);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [submittedSignature, setSubmittedSignature] = useState<string | null>(
    initialDataUrl || null
  );

  const updateSignaturePadOptions = () => {
    const signaturePad = signaturePadRef.current?.instance;
    if (signaturePad) {
      signaturePad.penColor = penColor;
      signaturePad.minWidth = penSize;
    }
  };

  const handleClear = () => {
    signaturePadRef.current?.clear();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result as string;
        setUploadedImage(imageUrl);
        setSubmittedSignature(null); // Clear any submitted signature
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  };

  const handleSave = () => {
    const signatureDataUrl = signaturePadRef.current?.toDataURL();
    if (signatureDataUrl) {
      setSubmittedSignature(signatureDataUrl);
      setUploadedImage(null); // Clear any uploaded image
      onSubmit(signatureDataUrl);
    }
  };

  const handleRemoveSignature = () => {
    setSubmittedSignature(null);
    setUploadedImage(null);
    handleClear();
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
        Подпись заказчика
      </h2>
      <div className="border-2 border-gray-800 bg-white rounded-md w-full max-w-lg relative">
        {submittedSignature ? (
          <div className="relative">
            <Image
              src={submittedSignature}
              alt="Submitted Signature"
              width={100}
              height={100}
              className="w-full h-auto object-contain"
            />
            <button
              onClick={handleRemoveSignature}
              className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 p-2 rounded-full"
            >
              Удалить подпись
            </button>
          </div>
        ) : uploadedImage ? (
          <div className="relative">
            <Image
              src={uploadedImage}
              alt="Uploaded Signature"
              width={100}
              height={100}
              className="w-full h-auto object-contain"
            />
            <button
              onClick={handleRemoveSignature}
              className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 p-2 rounded-full"
            >
              X
            </button>
          </div>
        ) : (
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
        )}
        {!submittedSignature && !uploadedImage && (
          <div className="flex justify-between mt-2 sm:flex-row flex-col">
            <button
              onClick={handleClear}
              className="font-medium hover:underline m-4 bg-transparent hover:bg-transparent"
            >
              Очистить
            </button>
            <button
              onClick={handleSave}
              className="font-medium hover:underline m-4 bg-transparent hover:bg-transparent"
            >
              Подтвердить
            </button>
          </div>
        )}
      </div>

      {/* Brush Color and Size Options */}
      <div className="flex flex-col gap-6 mt-4 text-[#000000] 2xl:flex-row md:justify-between">
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

        {/* File Upload */}
        <div className="flex flex-col gap-2 items-center md:items-start w-full md:w-auto">
          <label className="font-semibold text-center md:text-left">
            Загрузить подпись:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="cursor-pointer w-full md:w-auto file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-300 file:text-sm file:font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default Signature;
