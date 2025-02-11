import { ActDataProps } from "@/helper/types";
import React, { useState } from "react";

const Agreement: React.FC<ActDataProps & { original: boolean }> = ({
  data,
  setData,
  original,
}) => {
  // Determine which key to use based on the original prop.
  const contractKey = original
    ? "contract_original_act"
    : "contract_mercenary_and_warehouse";

  // Local state to store a single contract file (as a File object)
  const [contractFile, setContractFile] = useState<File | null>(null);

  // When a file is selected, update local state and parent state using the appropriate key.
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      setContractFile(file);
      setData((prevData: any) => ({
        ...prevData,
        [contractKey]: file,
      }));
    }
  };

  // Remove the file from local state and update parent state using the appropriate key.
  const handleRemovePhoto = () => {
    setContractFile(null);
    setData((prevData: any) => ({
      ...prevData,
      [contractKey]: null,
    }));
  };

  // Determine which file URL to display.
  // If a new file is uploaded, use URL.createObjectURL(contractFile).
  // Otherwise, if there is an already submitted file in data (and it is a string), display that.
  const displayFileUrl =
    contractFile !== null
      ? URL.createObjectURL(contractFile)
      : typeof data?.[contractKey] === "string"
      ? data[contractKey]
      : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
        Договор{" "}
        {original
          ? "между Наемником и Складом(оригинал)"
          : "между Наемником и Складом"}
      </h2>

      {/* Drag-and-Drop / File Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
        <p className="text-gray-500 mb-2">Перетащите сюда</p>
        <p className="text-gray-500 mb-4">или</p>
        <label className="bg-[#FDE107] hover:bg-[#efdc4b] px-4 py-2 rounded-md cursor-pointer">
          Загрузите договор
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Display the contract file (either new or already submitted) */}
      {displayFileUrl ? (
        <div className="relative bg-gray-100 h-32 rounded-md flex items-center justify-center">
          <img
            src={displayFileUrl}
            alt="Contract"
            className="object-cover h-full w-full rounded-md"
          />
          <button
            onClick={handleRemovePhoto}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
          >
            &times;
          </button>
        </div>
      ) : (
        <div className="bg-gray-100 h-32 rounded-md flex items-center justify-center">
          <p className="text-gray-500">Нет загруженного договора</p>
        </div>
      )}
    </div>
  );
};

export default Agreement;
