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
  if (pathname === "manager/create-act") {
    headerText = "Создать акт";
  } else if (/^\/act\/[^/]+$/.test(pathname)) {
    headerText = "Акт";
  } else if (pathname === "/manager/requests") {
    headerText = "Заявки";
  } else if (pathname === "/manager/cmp") {
    headerText = "CMP";
  } else if (pathname === "/manager/statistics") {
    headerText = "Статистика";
  } else if (pathname === "/manager/users") {
    headerText = "Пользователи";
  } else if (pathname === "/manager/cost-calculation") {
    headerText = "Расчет стоимости";
  } else if (pathname === "/manager/cost-calculation/calculator") {
    headerText = "Калькулятор";
  } else if (pathname === "/manager/cost-calculation/saved") {
    headerText = "Сохраненные";
  }

  let roleValue = "Менеджер";
  let roleKey = "manager";

  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          <Sidebar roleValue={roleValue} roleKey={roleKey} />
          <div className="flex flex-col flex-1 px-4 md:px-10 py-4 lg:ml-64 overflow-auto h-screen">
            <Header role={roleKey} text={headerText} />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;
