import React, { useState } from "react";

const AccountSettings: React.FC = () => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [apartment, setApartment] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      profileImage,
      fullName,
      firstName,
      phoneNumber,
      email,
      country,
      street,
      city,
      apartment,
      postalCode,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6">
          Аккаунт {/* Role can be dynamically inserted here */}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Картинка профиля
            </label>
            <div className="mt-2 flex items-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 mr-4">
                {/* {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )} */}
              </div>
              <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md">
                Загрузить фотографию
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Полное имя
            </label>
            <div className="mt-2">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ФИО"
              />
            </div>
          </div>

          {/* First Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <div className="mt-2">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="First name"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Контактная информация
            </label>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+7"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="@mail"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Место жительства
            </label>
            <div className="mt-2">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Страна"
              />
            </div>
            <div className="mt-2">
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Улица"
              />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Город"
              />
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Дом/Квартира"
              />
            </div>
            <div className="mt-2">
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Почтовый индекс"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => alert("Выйти из системы")}
            >
              Выйти из системы
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Изменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
