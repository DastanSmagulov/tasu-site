"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError("Login failed. Please check your credentials.");
    } else {
      console.log("Login successful");
      // Optionally redirect or update UI on successful login
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d13] flex">
      {/* Left side with image */}
      <div className="hidden md:flex w-1/2 relative">
        <Image
          src="/images/login.jpg"
          alt="Truck"
          layout="fill" // Fill the parent container
          objectFit="cover" // Ensure the image covers the container
          className="object-cover"
        />
      </div>

      {/* Right side with login form */}
      <div className="w-full md:w-1/2 bg-[#131826] p-8 flex flex-col justify-center">
        <a href="/" className="text-[#9a00ff] text-sm mb-4">
          &larr; Return to site
        </a>
        <h2 className="text-2xl font-bold mt-6 mb-4">
          Welcome back to{" "}
          <span className="text-[#9a00ff]">TASU KAZAKHSTAN</span>
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm mb-1">
              Адрес электронной почты
            </label>
            <input
              type="text"
              id="email"
              placeholder="Введите электронную почту"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1f1f2e] border-none rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9a00ff]"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm mb-1">
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
