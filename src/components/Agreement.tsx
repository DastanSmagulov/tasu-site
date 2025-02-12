import { ActDataProps } from "@/helper/types";
import React, { useState } from "react";

// Helper function to convert a File to a Base64 string.
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const Agreement: React.FC<ActDataProps & { original: boolean }> = ({
  data,
  setData,
  original,
}) => {
  // Determine which key to use based on the original prop.
  const contractKey = original
    ? "contract_original_act"
    : "contract_mercenary_and_warehouse";

  // Local state to store the contract file as a Base64 string.
  const [contractFile, setContractFile] = useState<string | null>(null);

  // When a file is selected, convert it to Base64 and update local and parent state.
  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      const file = files[0];
      try {
        const base64String = await convertFileToBase64(file);
        setContractFile(base64String);
        setData((prevData: any) => ({
          ...prevData,
          [contractKey]: file,
        }));
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };

  // Remove the file from local state and update parent state.
  const handleRemovePhoto = () => {
    setContractFile(null);
    setData((prevData: any) => ({
      ...prevData,
      [contractKey]: null,
    }));
  };

  // Determine the URL to display. If a new file is uploaded, use contractFile.
  // Otherwise, if there's an existing Base64 string in data, use that.
  const displayFileUrl =
    contractFile !== null
      ? contractFile
      : typeof data?.[contractKey] === "string"
      ? data[contractKey]
      : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
        Договор{" "}
        {original
          ? "между Наемником и Складом (оригинал)"
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
            accept="application/pdf"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Display the contract file (either new or already submitted) */}
      {displayFileUrl ? (
        <div className="relative bg-gray-100 h-32 rounded-md flex items-center justify-center">
          {displayFileUrl.startsWith("data:application/pdf") ? (
            <a
              href={displayFileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Просмотреть договор (PDF)
            </a>
          ) : (
            <img
              src={displayFileUrl}
              alt="Contract"
              className="object-cover h-full w-full rounded-md"
            />
          )}
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
