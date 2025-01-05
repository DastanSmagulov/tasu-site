"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import "../../styles/globals.css";
import Sidebar from "@/containers/Sidebar";
import Header from "@/containers/Header";
import TabsNavigation from "@/shared/TabsNavigation";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  let headerText = "Акт передачи документов";
  if (pathname === "/transceiver/create-act") {
    headerText = "Создать акт";
  } else if (/^\/act\/[^/]+$/.test(pathname)) {
    headerText = "Акт";
  } else if (pathname === "/transceiver/warehouse") {
    headerText = "Склад";
  }

  let roleValue = "приемсдатчик";
  let roleKey = "transceiver";

  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          <Sidebar roleValue={roleValue} roleKey={roleKey} />
          <div className="flex flex-col flex-1 px-4 md:px-10 py-4 lg:ml-64 overflow-auto h-screen">
            <Header role={roleKey} text={headerText} />
            <TabsNavigation role="transceiver" />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;