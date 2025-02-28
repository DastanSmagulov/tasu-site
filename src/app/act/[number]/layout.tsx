"use client";

import { SessionProvider } from "next-auth/react";
import Sidebar from "@/containers/Sidebar";
import "../../../styles/globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          <Sidebar roleValue={""} roleKey={""} />
          <div className="flex flex-col flex-1 px-4 md:px-10 py-4 lg:ml-64 overflow-auto h-screen">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;
