import { ActDataProps } from "@/helper/types";
import React, { useState, useEffect } from "react";

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

  // Local state: either a File object or a Base64 string.
  const [file, setFile] = useState<File | string>(data?.[contractKey] || "");

  // Synchronize local state if parent's data changes.
  useEffect(() => {
    if (data?.[contractKey]) {
      setFile(data[contractKey]);
    }
  }, [data, contractKey]);

  // Compute a URL for displaying the file.
  let displayFileUrl = "";
  if (typeof file === "string") {
    displayFileUrl = file;
  } else if (file instanceof File) {
    displayFileUrl = URL.createObjectURL(file);
  }

  // Helper: determine the PDF file name (if applicable).
  const getPdfFileName = (): string => {
    if (file instanceof File && file.type === "application/pdf") {
      return file.name;
    } else if (
      typeof file === "string" &&
      (file.startsWith("data:application/pdf") || file.endsWith(".pdf"))
    ) {
      const parts = file.split("/");
      return parts[parts.length - 1];
    }
    return "";
  };

  // Handle file upload.
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files[0]) {
      const newFile = files[0];
      try {
        const base64String = await convertFileToBase64(newFile);
        setFile(base64String);
        // Update parent's data with the new file.
        setData((prevData: any) => ({
          ...prevData,
          [contractKey]: newFile,
        }));
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };

  // Handle removal of file.
  const handleRemoveFile = () => {
    setFile("");
    setData((prevData: any) => ({
      ...prevData,
      [contractKey]: "",
    }));
  };

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
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Display Uploaded File */}
      {displayFileUrl ? (
        <div className="relative bg-gray-100 h-32 rounded-md flex items-center justify-center">
          {!displayFileUrl.startsWith("application/pdf") ? (
            <div className="flex flex-col items-center">
              <a
                href={displayFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Просмотреть договор (PDF)
              </a>
              <p className="text-xs text-gray-500 mt-2">{getPdfFileName()}</p>
            </div>
          ) : (
            <img
              src={displayFileUrl}
              alt="Contract"
              className="object-cover h-full w-full rounded-md"
            />
          )}
          <button
            onClick={handleRemoveFile}
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
