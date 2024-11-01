"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Avatar from "../../public/images/avatar.svg";
import { FiPlus, FiSearch } from "react-icons/fi";

const Header: React.FC = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="flex flex-wrap items-center sm:gap-5 justify-between py-3">
      <div className="flex flex-col space-y-2">
        <h1 className="text-lg sm:text-2xl font-semibold">
          Акт передачи документов
        </h1>
        <div className="flex items-center mt-2 mb-4 sm:mb-6">
          <span className="w-3 h-3 bg-[#3D516E] rounded-full"></span>
          <nav className="text-xs sm:text-sm text-[#3D516E] flex font-medium ml-2">
            <p className="mr-1">
              <span className="mx-1">/</span>My Property
            </p>
            <p className="text-[#FDE016]">
              <span className="text-[#3D516E] mr-1">/</span>New Property
            </p>
          </nav>
        </div>
      </div>
      <div className="flex items-center space-x-4 flex-wrap mt-4 sm:mt-0">
        <div className="relative w-full sm:w-auto mb-3 sm:mb-0">
          <input
            type="text"
            placeholder="Искать здесь..."
            className="px-4 py-2 pl-5 border text-[#717579] font-semibold border-[#ddd] bg-white rounded-lg focus:outline-none focus:ring focus:ring-gray-300 w-full sm:w-72 h-10 sm:h-12"
          />
          <FiSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>
        <button className="flex items-center justify-center w-full sm:w-auto px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 h-10 sm:h-12">
          <FiPlus className="mr-2 w-5 sm:w-7 h-5 sm:h-7" />
          <p className="font-semibold text-sm">Создать акт</p>
        </button>
        <div className="w-10 sm:w-12 h-10 sm:h-12">
          <Image src={Avatar} alt="User Avatar" className="rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;
