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

const AccountingEsf: React.FC<ActDataProps> = ({ data, setData }) => {
  // Local state: either a File object or a Base64 string.
  const [file, setFile] = useState<File | string>(data?.accounting_esf || "");

  // Synchronize local state if parent's data changes.
  useEffect(() => {
    if (data?.accounting_esf) {
      setFile(data.accounting_esf);
    }
  }, [data?.accounting_esf]);

  // Compute a URL for displaying the file.
  let displayFileUrl = "";
  if (typeof file === "string") {
    displayFileUrl = file;
  } else if (file instanceof File) {
    // Create a blob URL for File objects.
    displayFileUrl = URL.createObjectURL(file);
  }

  // Helper: determine the PDF file name.
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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files;
    if (fileList && fileList[0]) {
      const newFile = fileList[0];
      try {
        // Convert file to Base64 if needed.
        const base64String = await convertFileToBase64(newFile);
        setFile(base64String);
        // Update parent's data for accounting_esf.
        setData((prev: any) => ({
          ...prev,
          accounting_esf: newFile,
        }));
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile("");
    // Update parent's data for accounting_esf.
    setData((prev: any) => ({
      ...prev,
      accounting_esf: "",
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
        Бухгалтерия ЭСФ
      </h2>

      {/* Drag-and-Drop / Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
        <p className="text-gray-500 mb-2">Перетащите сюда</p>
        <p className="text-gray-500 mb-4">или</p>
        <label className="bg-[#FDE107] hover:bg-[#efdc4b] px-4 py-2 rounded-md cursor-pointer">
          Загрузите ЭСФ
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Display Uploaded File */}
      {displayFileUrl && (
        <div className="relative bg-gray-100 h-32 rounded-md flex items-center justify-center">
          {(file instanceof File && file.type === "application/pdf") ||
          (typeof file === "string" &&
            (file.startsWith("data:application/pdf") ||
              file.endsWith(".pdf"))) ? (
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
      )}
    </div>
  );
};

export default AccountingEsf;
