"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { AxiosError } from "axios";
import { useState } from "react";

const RegistrationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Неверный формат электронной почты")
    .required("Обязательно для заполнения"),
  password: Yup.string()
    .min(6, "Пароль должен быть не менее 6 символов")
    .required("Обязательно для заполнения"),
  first_name: Yup.string().required("Обязательно для заполнения"),
  last_name: Yup.string().required("Обязательно для заполнения"),
  phone: Yup.string().required("Обязательно для заполнения"),
  middle_name: Yup.string(),
  iin: Yup.string()
    .length(12, "ИИН должен содержать 12 символов")
    .required("Обязательно для заполнения"),
  id_card_image: Yup.mixed().required(
    "Загрузите изображение удостоверения личности"
  ),
});

interface FormValues {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  middle_name: string;
  iin: string;
  role: string;
  id_card_image: File | null;
}

const Registration: React.FC = () => {
  const [apiErrors, setApiErrors] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const roles = [
    { key: "ADMIN", value: "Админ" },
    { key: "TRANSCEIVER", value: "Приемопередатчик" },
    { key: "MANAGER", value: "Менеджер" },
    { key: "ACCOUNTANT", value: "Бухгалтер" },
    { key: "CARRIER", value: "Перевозчик" },
    { key: "COURIER", value: "Курьер" },
    { key: "CUSTOMER", value: "Заказчик" },
    { key: "RECEIVER", value: "Получатель" },
  ];

  const handleSubmit = async (values: FormValues) => {
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value instanceof File) {
        data.append(key, value, value.name);
      } else {
        data.append(key, value);
      }
    });
    setLoading(true);
    try {
      const response = await axios.post("/api/register", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        router.push("/login");
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response && err.response.data) {
        setApiErrors(err.response.data);
        setTimeout(() => {
          setApiErrors({});
        }, 5000);
      } else {
        setApiErrors({});
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d13] flex overflow-hidden">
      <div className="hidden md:flex w-1/2 relative">
        <Image
          src="/images/login.jpg"
          alt="Registration"
          layout="fill"
          objectFit="cover"
          className="object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 bg-[#131826] px-6 py-auto flex flex-col justify-center overflow-auto rounded-lg">
        <h2 className="text-2xl font-bold mt-6 mb-4 text-white text-center">
          Регистрация в <span className="text-[#9a00ff]">TASU KAZAKHSTAN</span>
        </h2>

        {apiErrors?.error && (
          <div className="text-red-500 mb-4">
            {Object.keys(apiErrors.error).map((field) => (
              <div key={field}>
                {apiErrors.error[field]?.map(
                  (message: string, index: number) => (
                    <p key={index}>{message}</p>
                  )
                )}
              </div>
            ))}
          </div>
        )}

        <Formik
          initialValues={{
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            phone: "",
            middle_name: "",
            iin: "",
            role: "MANAGER",
            id_card_image: null,
          }}
          validationSchema={RegistrationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-grow">
                  <label
                    htmlFor="email"
                    className="block text-sm mb-1 text-white"
                  >
                    Адресс электронной почты{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Введите вашу почту"
                    className={`w-full bg-[#1f1f2e] p-3 rounded-lg text-white placeholder-gray-500 ${
                      apiErrors?.error?.email
                        ? "border border-red-500"
                        : "focus:ring-[#9a00ff]"
                    }`}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex-grow">
                  <label
                    htmlFor="password"
                    className="block text-sm mb-1 text-white"
                  >
                    Пароль <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Введите ваш пароль"
                    className={`w-full bg-[#1f1f2e] p-3 rounded-lg text-white placeholder-gray-500 ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "focus:ring-[#9a00ff]"
                    }`}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-grow">
                  <label
                    htmlFor="first_name"
                    className="block text-sm mb-1 text-white"
                  >
                    Имя <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    placeholder="Введите ваше имя"
                    name="first_name"
                    className={`w-full bg-[#1f1f2e] p-3 rounded-lg text-white placeholder-gray-500 ${
                      errors.first_name && touched.first_name
                        ? "border-red-500"
                        : "focus:ring-[#9a00ff]"
                    }`}
                  />
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex-grow">
                  <label
                    htmlFor="last_name"
                    className="block text-sm mb-1 text-white"
                  >
                    Фамилия <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="last_name"
                    placeholder="Введите вашу фамилию"
                    className={`w-full bg-[#1f1f2e] p-3 rounded-lg text-white placeholder-gray-500 ${
                      errors.last_name && touched.last_name
                        ? "border-red-500"
                        : "focus:ring-[#9a00ff]"
                    }`}
                  />
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-grow">
                  <label
                    htmlFor="phone"
                    className="block text-sm mb-1 text-white"
                  >
                    Телефон <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="tel"
                    name="phone"
                    placeholder="Введите ваш номер телефона"
                    className={`w-full bg-[#1f1f2e] p-3 rounded-lg text-white placeholder-gray-500 ${
                      apiErrors?.error?.phone
                        ? "border border-red-500"
                        : "focus:ring-[#9a00ff]"
                    }`}
                  />
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex-grow">
                  <label
                    htmlFor="middle_name"
                    className="block text-sm mb-1 text-white"
                  >
                    Отчество
                  </label>
                  <Field
                    type="text"
                    name="middle_name"
                    placeholder="Введите ваше отчество"
                    className={`w-full bg-[#1f1f2e] p-3 rounded-lg text-white placeholder-gray-500 ${
                      errors.middle_name && touched.middle_name
                        ? "border-red-500"
                        : "focus:ring-[#9a00ff]"
                    }`}
                  />
                  <ErrorMessage
                    name="middle_name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-grow">
                  <label
                    htmlFor="iin"
                    className="block text-sm mb-1 text-white"
                  >
                    ИИН <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="text"
                    name="iin"
                    placeholder="Введите ваш ИИН"
                    className={`w-full bg-[#1f1f2e] p-3 rounded-lg text-white placeholder-gray-500 ${
                      apiErrors?.error?.iin
                        ? "border border-red-500"
                        : "focus:ring-[#9a00ff]"
                    }`}
                  />
                  <ErrorMessage
                    name="iin"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="flex-grow">
                  <label
                    htmlFor="role"
                    className="block text-sm mb-1 text-white"
                  >
                    Роль <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="role"
                    className={`w-full bg-[#1f1f2e] p-3 rounded-lg text-white ${
                      errors.role && touched.role
                        ? "border-red-500"
                        : "focus:ring-[#9a00ff]"
                    }`}
                  >
                    {roles.map((role) => (
                      <option key={role.key} value={role.key}>
                        {role.value}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="id_card_image"
                  className="block text-sm mb-1 text-white"
                >
                  Изображение удостоверения личности{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="id_card_image"
                  onChange={(event) => {
                    if (event.currentTarget.files) {
                      setFieldValue(
                        "id_card_image",
                        event.currentTarget.files[0]
                      );
                    }
                  }}
                  className={`w-full bg-[#1f1f2e] p-3 rounded-lg text-white ${
                    errors.id_card_image && touched.id_card_image
                      ? "border-red-500"
                      : "focus:ring-[#9a00ff]"
                  }`}
                />
                <ErrorMessage
                  name="id_card_image"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#9a00ff] text-white rounded-lg py-3 font-semibold hover:bg-[#7b00cc]"
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Зарегестрироваться →"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-2 text-center">
          <p className="text-white text-sm">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-[#9a00ff] hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
