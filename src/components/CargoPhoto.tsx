import React, { useState, useEffect } from "react";
import { ActDataProps } from "@/helper/types";

const BASE_URL = "https://tasukaz.kz";

const getFullUrl = (url: any): string => {
  if (typeof url !== "string") return "";
  // Allow data URLs (Base64) or full HTTP URLs to pass through unchanged.
  if (url.startsWith("http") || url.startsWith("data:")) return url;
  return `${BASE_URL}${url}`;
};

const CargoPhoto: React.FC<ActDataProps> = ({ data, setData }) => {
  const [cargoPhotos, setCargoPhotos] = useState<string[]>([]);

  // Sync with parent data (only runs once when component mounts)
  useEffect(() => {
    if (data?.cargo_images && Array.isArray(data.cargo_images)) {
      const updatedPhotos = data.cargo_images
        .map((img: any) => (img?.image ? getFullUrl(img.image) : ""))
        .filter((url: string) => url !== "");

      setCargoPhotos(updatedPhotos);
    }
  }, [data?.cargo_images]);

  // Convert a file to a Base64 string.
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file uploads.
  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      try {
        const base64Strings = await Promise.all(
          fileArray.map((file) => convertFileToBase64(file))
        );

        setCargoPhotos((prevPhotos) => {
          const updatedPhotos = [...prevPhotos, ...base64Strings];

          // Update parent state **only if different**
          setData((prev: any) => {
            const newCargoImages = updatedPhotos.map((photo) => ({
              image: photo,
            }));
            if (
              JSON.stringify(prev.cargo_images) !==
              JSON.stringify(newCargoImages)
            ) {
              return { ...prev, cargo_images: newCargoImages };
            }
            return prev;
          });

          return updatedPhotos;
        });
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }
  };

  // Remove a photo.
  const handleRemovePhoto = (index: number) => {
    setCargoPhotos((prevPhotos) => {
      const updatedPhotos = prevPhotos.filter((_, i) => i !== index);

      // Update parent state **only if different**
      setData((prev: any) => {
        const newCargoImages = updatedPhotos.map((photo) => ({ image: photo }));
        if (
          JSON.stringify(prev.cargo_images) !== JSON.stringify(newCargoImages)
        ) {
          return { ...prev, cargo_images: newCargoImages };
        }
        return prev;
      });

      return updatedPhotos;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">Фото груза</h2>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cargoPhotos.map((photo, index) => (
          <div
            key={index}
            className="relative bg-gray-100 h-32 rounded-md flex items-center justify-center"
          >
            <img
              src={photo}
              alt={`Cargo Photo ${index + 1}`}
              className="object-cover h-full w-full rounded-md"
            />
            <button
              onClick={() => handleRemovePhoto(index)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
            >
              &times;
            </button>
          </div>
        ))}
        {cargoPhotos.length === 0 && (
          <div className="col-span-3 bg-gray-100 h-32 rounded-md flex items-center justify-center">
            <p className="text-gray-500">Нет загруженных фотографий</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CargoPhoto;
