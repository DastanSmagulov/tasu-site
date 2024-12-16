"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Logo from "../components/ui/Logo";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Validation schema for login form
const LoginSchema = Yup.object().shape({
  identifier: Yup.string().required("Обязательно для заполнения"),
  password: Yup.string().required("Обязательно для заполнения"),
});

const Login: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

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
    <div className="min-h-screen bg-[#0d0d13] relative">
      <Image
        src="/images/login.png"
        alt="Truck Background"
        fill
        priority
        className="object-cover absolute inset-0 z-0"
      />

      <div className="relative flex justify-center items-center min-h-screen z-10">
        <div className="w-full sm:w-1/2 lg:w-2/6 bg-white rounded-2xl shadow-xl px-10">
          <h2 className="text-center text-2xl font-bold text-gray-800 my-6">
            Авторизация в CRM
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
                    className="block text-sm font-medium text-gray-700"
                  >
                    Логин
                  </label>
                  <Field
                    id="identifier"
                    name="identifier"
                    type="text"
                    placeholder="Введите ваш логин"
                    className={`w-full p-3 bg-gray-50 border rounded-lg ${
                      errors.identifier && touched.identifier
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  <ErrorMessage
                    name="identifier"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="mb-6 relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Пароль
                  </label>
                  <div className="relative w-full">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Введите пароль"
                      className={`w-full p-3 bg-gray-50 border rounded-lg pr-10 ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 inset-y-0 text-gray-600"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FDE107] text-black rounded-lg py-3 hover:bg-[#e7cf1b] transition duration-200"
                  disabled={loading}
                >
                  Войти в систему
                </button>
              </Form>
            )}
          </Formik>
          <div className="mt-8 flex justify-center">
            <Logo width={172} height={56} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
