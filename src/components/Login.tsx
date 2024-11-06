"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
    });

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
          <span className="text-white">Welcome back to </span>
          <span className="text-[#9a00ff]">TASU KAZAKHSTAN</span>
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="identifier"
              className="block text-sm mb-1 text-white"
            >
              Адрес электронной почты
            </label>
            <input
              type="text"
              id="identifier" // Renamed from `email` to `identifier`
              placeholder="Введите электронную почту"
              value={identifier} // Use identifier here
              onChange={(e) => setIdentifier(e.target.value)} // Update identifier
              className="w-full bg-[#1f1f2e] border-none rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a00ff]"
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
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#1f1f2e] border-none rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a00ff]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#9a00ff] text-white rounded-lg py-3 font-semibold hover:bg-[#7b00cc]"
          >
            Войти &rarr;
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
