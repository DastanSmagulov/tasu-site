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

const AccountingAvr: React.FC<ActDataProps> = ({ data, setData }) => {
  // Initialize local state from parent data (if available)
  const [file, setFile] = useState<File | string>(data?.accounting_avr || "");

  // Synchronize local state if parent's data changes
  useEffect(() => {
    if (data?.accounting_avr) {
      setFile(data.accounting_avr);
    }
  }, [data?.accounting_avr]);

  // Compute a URL for displaying the file.
  let displayFileUrl = "";
  if (typeof file === "string") {
    displayFileUrl = file;
  } else if (file instanceof File) {
    displayFileUrl = URL.createObjectURL(file);
  }

  // Determine the PDF file name
  const getPdfFileName = (): string => {
    if (file instanceof File && file.type === "application/pdf") {
      return file.name;
    } else if (
      typeof file === "string" &&
      (file.startsWith("data:application/pdf") || file.endsWith(".pdf"))
    ) {
      // If it's a URL, attempt to extract the name from the URL.
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
      const base64String = await convertFileToBase64(newFile);
      setFile(base64String);
      // Update parent's data for AVR
      setData((prev: any) => ({
        ...prev,
        accounting_avr: newFile,
      }));
    }
  };

  const handleRemoveFile = () => {
    setFile("");
    // Update parent's data for AVR
    setData((prev: any) => ({
      ...prev,
      accounting_avr: "",
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">
        Бухгалтерия AVR
      </h2>

      {/* Drag-and-Drop / Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
        <p className="text-gray-500 mb-2">Перетащите сюда</p>
        <p className="text-gray-500 mb-4">или</p>
        <label className="bg-[#FDE107] hover:bg-[#efdc4b] px-4 py-2 rounded-md cursor-pointer">
          Загрузите AVR
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Display Uploaded File */}
      {file && (
        <div className="relative bg-gray-100 h-32 rounded-md flex items-center justify-center">
          {displayFileUrl &&
            // Check if the file is a PDF: either if it's a File with type "application/pdf"
            // or a Base64/URL string starting with "data:application/pdf" or ending with ".pdf"
            ((file instanceof File && file.type === "application/pdf") ||
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
                alt="AVR File"
                className="object-cover h-full w-full rounded-md"
              />
            ))}
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

export default AccountingAvr;
