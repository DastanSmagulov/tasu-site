"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Logo from "../components/ui/Logo";
import MenuGroup from "../components/MenuGroup";
import Footer from "./Footer";
import { getRoutesForRole } from "@/helper/utils";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import Link from "next/link";

interface SidebarProps {
  roleValue: string;
  roleKey: string;
}

const Sidebar: React.FC<SidebarProps> = ({ roleValue, roleKey }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu
  const filteredRoutes = getRoutesForRole(roleKey);

  return (
    <>
      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex flex-col justify-between w-64 h-screen fixed shadow-md py-8 px-10 bg-white">
        <div>
          <Link href={"/"}>
            <Logo width={172} height={56} />
          </Link>
          <div className="space-y-6 mt-6">
            <MenuGroup title={roleValue} items={filteredRoutes} />
          </div>
        </div>
        <Footer />
      </div>

      {/* Sidebar for mobile screens */}
      <div className="lg:hidden">
        {/* Hamburger Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-4 left-4 p-2 rounded-md text-gray-700 bg-gray-100 shadow-md z-50"
          >
            {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        )}

        {/* Mobile Sidebar Drawer */}
        <div
          className={`fixed inset-y-0 left-0 bg-white shadow-lg z-40 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out w-64`}
        >
          <div className="flex flex-col justify-between h-full py-8 px-10">
            <div>
              <Logo width={172} height={56} />
              <div className="space-y-6 mt-6">
                <MenuGroup title={roleValue} items={filteredRoutes} />
              </div>
            </div>
            <Footer />
          </div>
        </div>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
