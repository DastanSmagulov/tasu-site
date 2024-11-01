"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Avatar from "../../public/images/avatar.svg";

const Header: React.FC = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
        <span className="w-3 h-3 bg-gray-700 rounded-full"></span>
        <nav className="text-sm text-gray-500">
          <span className="mr-1">My Property</span>
          <span className="text-yellow-500">/ New Property</span>
        </nav>
      </div>

      <h1 className="text-lg font-semibold">Акт передачи документов</h1>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Искать здесь..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
        />
        <button className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600">
          Создать акт
        </button>
        <div className="w-8 h-8">
          <Image src={Avatar} alt="User Avatar" className="rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;
