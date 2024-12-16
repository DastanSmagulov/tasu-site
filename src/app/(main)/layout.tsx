"use client";

import { SessionProvider } from "next-auth/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import "../../styles/globals.css";
import Sidebar from "@/containers/Sidebar";
import Header from "@/containers/Header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  let headerText = "Акт передачи документов";
  if (pathname === "/create-act") {
    headerText = "Создать акт";
  } else if (pathname === "/cost-calculation") {
    headerText = "Расчет стоимости";
  } else if (/^\/act\/[^/]+$/.test(pathname)) {
    headerText = "Акт";
  } else if (pathname === "/warehouse") {
    headerText = "Склад";
  }

  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          <Sidebar />
          <div className="flex flex-col flex-1 px-10 py-4 ml-64 overflow-auto h-screen">
            <Header text={headerText} />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;
