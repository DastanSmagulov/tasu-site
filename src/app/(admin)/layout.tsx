"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Sidebar from "@/containers/Sidebar";
import Header from "@/containers/Header";
import "../../styles/globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  let headerText = "Акт передачи документов";
  if (pathname === "/admin/create-act") {
    headerText = "Создать акт";
  } else if (pathname === "/admin/tariff") {
    headerText = "Тарифы";
  } else if (/^\/act\/[^/]+$/.test(pathname)) {
    headerText = "Акт";
  } else if (pathname === "/admin/cargo") {
    headerText = "Грузы";
  } else if (pathname === "/admin/users") {
    headerText = "Пользователи";
  } else if (pathname === "/admin/partners") {
    headerText = "Партнеры";
  } else if (pathname === "/admin/statistics") {
    headerText = "Статистика";
  }

  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          {/* Sidebar */}
          <Sidebar roleValue="админ" roleKey="admin" />
          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:ml-64 px-6 py-4 h-screen overflow-auto">
            <Header role="admin" text={headerText} />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;
