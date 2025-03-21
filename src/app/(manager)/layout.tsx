"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/containers/Sidebar";
import Header from "@/containers/Header";
import "../../styles/globals.css";
import { useEffect } from "react";
import Cookies from "js-cookie";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  let headerText = "Акт передачи документов";
  if (pathname === "/manager/create-act") {
    headerText = "Создать акт";
  } else if (/^\/act\/[^/]+$/.test(pathname)) {
    headerText = "Акт";
  } else if (pathname === "/manager/requests") {
    headerText = "Заявки";
  } else if (pathname === "/manager/cmp") {
    headerText = "CMP";
  } else if (pathname === "/manager/warehouse") {
    headerText = "На складе";
  } else if (pathname === "/manager/users") {
    headerText = "Пользователи";
  } else if (pathname === "/manager/cargo") {
    headerText = "Грузы";
  } else if (pathname === "/manager/partners") {
    headerText = "Партнеры";
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
