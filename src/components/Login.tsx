"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  identifier: Yup.string()
    .email("Неверный формат электронной почты")
    .required("Обязательно для заполнения"),
  password: Yup.string().required("Обязательно для заполнения"),
});

const Login: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (values: {
    identifier: string;
    password: string;
  }) => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: values.identifier,
      password: values.password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Ошибка входа. Пожалуйста, проверьте свои данные.");
    } else {
      console.log("Login successful:", result);
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d13] flex">
      <div className="hidden md:flex w-1/2 relative">
        <Image
          src="/images/login.jpg"
          alt="Truck"
          layout="fill"
          objectFit="cover"
          className="object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 bg-[#131826] p-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mt-6 mb-4">
          <span className="text-white">Войти в </span>
          <span className="text-[#9a00ff]">TASU KAZAKHSTAN</span>
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <Formik
          initialValues={{ identifier: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors }) => (
            <Form>
              <div className="mb-6">
                <label
                  htmlFor="identifier"
                  className="block text-sm mb-1 text-white"
                >
                  Адрес электронной почты
                </label>
                <Field
                  type="text"
                  id="identifier"
                  name="identifier"
                  placeholder="Введите электронную почту"
                  className={`w-full bg-[#1f1f2e] border-none rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a00ff] ${
                    errors.identifier && touched.identifier
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <ErrorMessage
                  name="identifier"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm mb-1 text-white"
                >
                  Пароль
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Введите пароль"
                  className={`w-full bg-[#1f1f2e] border-none rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a00ff] ${
                    errors.password && touched.password ? "border-red-500" : ""
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-2"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#9a00ff] text-white rounded-lg py-3 font-semibold hover:bg-[#7b00cc]"
                disabled={loading}
              >
                {loading ? "Загрузка..." : "Войти →"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-4 text-center text-white">
          <p>
            Нет аккаунта?{" "}
            <Link
              href="/register"
              className="text-[#9a00ff] hover:text-[#7b00cc]"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
