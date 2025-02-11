import React, { useState, useEffect } from "react";
import { ActDataProps } from "@/helper/types";

// Define your base URL (could also come from an environment variable)
const BASE_URL = "https://tasukaz.kz";

// Helper function to get the full image URL.
// It now checks if the url is a string.
const getFullUrl = (url: any): string => {
  if (typeof url !== "string") return "";
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
};

const CargoPhoto: React.FC<ActDataProps> = ({ data, setData }) => {
  // Initialize existing photos from data.cargo_images.
  // Casting cargo_images as any[] prevents the TS error.
  const initialExistingPhotos = Array.isArray(data?.cargo_images)
    ? (data?.cargo_images as any[]).map((img) =>
        typeof img === "object" && img.image
          ? getFullUrl(img.image)
          : getFullUrl(img)
      )
    : data?.cargo_images
    ? [getFullUrl(data.cargo_images)]
    : [];

  const [existingPhotos, setExistingPhotos] = useState<string[]>(
    initialExistingPhotos
  );
  // New uploaded photos (File objects) are stored separately.
  const [photos, setPhotos] = useState<File[]>([]);

  // Update parent's state with only the new files.
  useEffect(() => {
    setData((prev: any) => ({
      ...prev,
      // Only sending new photos as File objects.
      cargo_images: photos,
    }));
  }, [photos, setData]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPhotos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">Фото груза</h2>

      {/* Drag-and-Drop / File Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
        <p className="text-gray-500 mb-2">Перетащите сюда</p>
        <p className="text-gray-500 mb-4">или</p>
        <label className="bg-[#FDE107] hover:bg-[#efdc4b] px-4 py-2 rounded-md cursor-pointer">
          Загрузите фото
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Display Existing and New Uploaded Photos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Existing photos from the server */}
        {existingPhotos.map((photo, index) => (
          <div
            key={`existing-${index}`}
            className="relative bg-gray-100 h-32 rounded-md flex items-center justify-center"
          >
            <img
              src={photo}
              alt={`Cargo Photo ${index + 1}`}
              className="object-cover h-full w-full rounded-md"
            />
            <button
              onClick={() => handleRemovePhoto(index, true)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
            >
              &times;
            </button>
          </div>
        ))}

        {/* New uploaded photos (File objects) */}
        {photos.map((photo, index) => (
          <div
            key={`uploaded-${index}`}
            className="relative bg-gray-100 h-32 rounded-md flex items-center justify-center"
          >
            <img
              src={URL.createObjectURL(photo)}
              alt={`Cargo Photo ${existingPhotos.length + index + 1}`}
              className="object-cover h-full w-full rounded-md"
            />
            <button
              onClick={() => handleRemovePhoto(index, false)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
            >
              &times;
            </button>
          </div>
        ))}

        {/* Message when there are no photos */}
        {existingPhotos.length === 0 && photos.length === 0 && (
          <div className="col-span-3 bg-gray-100 h-32 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Нет загруженных фотографий</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CargoPhoto;
