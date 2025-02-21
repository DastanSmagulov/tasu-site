import React, { useState, useEffect } from "react";
import { ActDataProps } from "@/helper/types"; // { data: Act, setData: React.Dispatch<React.SetStateAction<Act>> }

const PaymentPhoto: React.FC<ActDataProps> = ({ data, setData }) => {
  // photos can be File objects (newly uploaded) or strings (URLs of existing photos)
  const [photos, setPhotos] = useState<any[]>([]);

  // Initialize photos once when the component mounts.
  useEffect(() => {
    if (data?.accountant_photo) {
      const initialPhotos = Array.isArray(data.accountant_photo)
        ? data.accountant_photo
        : [data.accountant_photo];
      setPhotos(initialPhotos);
    }
    // Run only once on mount.
  }, []);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos((prevPhotos) => {
        const updatedPhotos = [...prevPhotos, ...newPhotos];
        // Update parent's state directly here.
        setData((prev: any) => ({
          ...prev,
          accountant_photo: updatedPhotos,
        }));
        return updatedPhotos;
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prevPhotos) => {
      const updatedPhotos = prevPhotos.filter((_, i) => i !== index);
      setData((prev: any) => ({
        ...prev,
        accountant_photo: updatedPhotos,
      }));
      return updatedPhotos;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-[#1D1B23]">Фото оплаты</h2>

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

      {/* Display Uploaded Photos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative bg-gray-100 h-32 rounded-md flex items-center justify-center"
          >
            <img
              src={
                typeof photo === "string" ? photo : URL.createObjectURL(photo)
              }
              alt={`Payment Photo ${index + 1}`}
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
      </div>
    </div>
  );
};

export default PaymentPhoto;
