"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Registration: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    middle_name: "",
    iin: "",
    role: "",
  });
  const [idCardImage, setIdCardImage] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdCardImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value as string);
    });
    if (idCardImage) {
      data.append("id_card_image", idCardImage);
    }

    try {
      const response = await axios.post(
        "https://tasu.ziz.kz/api/v1/register/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        router.push("/login");
      }
    } catch (err) {
      setError("Ошибка регистрации. Пожалуйста, проверьте свои данные.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d13] flex">
      <div className="w-full bg-[#131826] p-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mt-6 mb-4 text-white">
          Регистрация в TASU KAZAKHSTAN
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 mb-4">
            Регистрация успешна! Пожалуйста, войдите.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm mb-1 text-white">
              Адрес электронной почты
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-[#1f1f2e] p-3 rounded-lg text-white"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm mb-1 text-white">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full bg-[#1f1f2e] p-3 rounded-lg text-white"
              required
            />
          </div>

          {/* Repeat similar inputs for first_name, last_name, phone, etc. */}
          {/* Add file input for id_card_image */}
          <div className="mb-6">
            <label
              htmlFor="id_card_image"
              className="block text-sm mb-1 text-white"
            >
              Изображение удостоверения личности
            </label>
            <input
              type="file"
              id="id_card_image"
              name="id_card_image"
              onChange={handleFileChange}
              className="w-full bg-[#1f1f2e] p-3 rounded-lg text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#9a00ff] text-white rounded-lg py-3 font-semibold hover:bg-[#7b00cc]"
          >
            Зарегистрироваться &rarr;
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
