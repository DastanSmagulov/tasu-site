"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "../../styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  let headerText = "Акт передачи документов";
  if (pathname === "/create-act") {
    headerText = "Создать акт";
  } else if (pathname === "/warehouse") {
    headerText = "Склад";
  }

  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />
        <div className="flex flex-col flex-1 px-10 py-4 ml-64 overflow-auto h-screen">
          <Header text={headerText} />
          {children}
        </div>
      </body>
    </html>
  );
};

export default Layout;
