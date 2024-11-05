import React, { useState } from "react";

const CargoPhoto: React.FC = () => {
  const [photos, setPhotos] = useState<File[]>([]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Фото груза</h2>
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="grid grid-cols-3 gap-4">
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <div
                key={index}
                className="bg-yellow-200 h-32 rounded-md flex items-center justify-center relative"
              >
                <img
                  src={URL.createObjectURL(photo)}
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
            ))
          ) : (
            <div className="col-span-3 bg-yellow-200 h-32 rounded-md flex items-center justify-center">
              Нет загруженных фотографий
            </div>
          )}
        </div>
      </div>
      <label className="flex items-center justify-center w-full h-10 bg-gray-100 border-dashed border-2 border-gray-300 rounded-md cursor-pointer">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="hidden"
        />
        <span className="text-gray-500">Загрузите фотографию</span>
      </label>
    </div>
  );
};

export default CargoPhoto;
