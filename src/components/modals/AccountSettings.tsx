"use client";
import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { FaSignOutAlt, FaArrowCircleDown } from "react-icons/fa";
import { AiOutlineCloseCircle } from "react-icons/ai";

interface AccountSettingsProps {
  setModalOpen: (value: boolean) => void;
}

interface ProfileData {
  role?: string;
  id_card_image?: string;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ setModalOpen }) => {
  const [profileImage, setProfileImage] = useState<string | null | File>(null);
  const [data, setData] = useState<ProfileData>({});
  const token = Cookies.get("auth_token");

  const [initialValues, setInitialValues] = useState({
    full_name: "",
    phone: "",
    email: "",
    country: "",
    street: "",
    city: "",
    apartment: "",
    postal_code: "",
  });

  useEffect(() => {
    return () => {
      if (profileImage && typeof profileImage !== "string") {
        URL.revokeObjectURL(profileImage as unknown as string);
      }
    };
  }, [profileImage]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const validationSchema = Yup.object().shape({
    full_name: Yup.string()
      .min(1, "Required")
      .max(150, "Max 150 characters")
      .required("Required"),
    phone: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    country: Yup.string().nullable(),
    street: Yup.string().nullable(),
    city: Yup.string().nullable(),
    apartment: Yup.string().nullable(),
    postal_code: Yup.string().nullable(),
  });

  const fetchProfileInfo = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-profile-info/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInitialValues({
        full_name: data.full_name || "",
        phone: data.phone || "",
        email: data.email || "",
        country: data.country || "",
        street: data.street || "",
        city: data.city || "",
        apartment: data.building_number || "",
        postal_code: data.postal_code || "",
      });
      setData({ role: data.role });
      setProfileImage(data.id_card_image);
    } catch (error) {
      console.error("Error fetching profile info", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value || "");
      });
      if (profileImage) formData.append("profile_image", profileImage);

      await axios.patch(`${API_BASE_URL}/edit-profile/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      closeModal();

      console.log("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  console.log(profileImage);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="w-full max-w-3xl p-6 bg-white shadow-md rounded-lg relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 bg-transparent"
        >
          <AiOutlineCloseCircle className="h-6 w-6 text-gray-500" />
        </button>

        <h1 className="text-lg md:text-xl font-semibold mb-6 text-center">
          Настройки аккаунта {data.role && `(${data.role})`}
        </h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              {/* Profile Picture Section */}
              <div className="mb-6">
                <h2 className="text-sm font-medium mb-2">Картинка профиля</h2>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    {profileImage ? (
                      <img
                        src={
                          typeof profileImage === "string"
                            ? profileImage // Display fetched URL
                            : URL.createObjectURL(profileImage) // Display uploaded file preview
                        }
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-gray-400 text-center">
                        PNG, JPEG до 15 МБ
                      </span>
                    )}
                  </div>
                  <label className="cursor-pointer text-gray-500 flex items-center space-x-2">
                    <FaArrowCircleDown className="h-5 w-5" />
                    <span>Загрузить фотографию</span>
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
              <div className="mb-4">
                <label className="text-sm font-medium block mb-2">
                  Полное имя
                </label>
                <Field
                  name="full_name"
                  placeholder="Введите имя"
                  className="w-full px-4 text-black py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="full_name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Номер телефона
                  </label>
                  <Field
                    name="phone"
                    placeholder="+7"
                    className="w-full text-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    E-mail
                  </label>
                  <Field
                    name="email"
                    placeholder="@mail"
                    className="w-full text-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div className="mb-4">
                <label className="text-sm font-medium block mb-2">Страна</label>
                <Field
                  name="country"
                  placeholder="Введите страну"
                  className="w-full text-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="country"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Улица
                  </label>
                  <Field
                    name="street"
                    placeholder="Введите улицу"
                    className="w-full text-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="street"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Город
                  </label>
                  <Field
                    name="city"
                    placeholder="Введите город"
                    className="w-full text-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="city"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Дом/Квартира
                  </label>
                  <Field
                    name="apartment"
                    placeholder="Введите номер дома/квартиры"
                    className="w-full text-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="apartment"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Почтовый индекс
                  </label>
                  <Field
                    name="postal_code"
                    placeholder="Введите индекс"
                    className="w-full text-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="postal_code"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between items-center sm:flex-row flex-col gap-4 sm:gap-0">
                <button
                  type="button"
                  className="px-4 py-2 text-gray-500 bg-transparent hover:bg-gray-100 border border-gray-500 rounded-lg flex items-center"
                  onClick={handleSignOut}
                >
                  <FaSignOutAlt className="h-5 w-5 mr-2" /> Выйти
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg flex items-center"
                  disabled={isSubmitting}
                >
                  Сохранить изменения
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AccountSettings;
