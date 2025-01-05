"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import "../../../styles/globals.css";
import Sidebar from "@/containers/Sidebar";
import Header from "@/containers/Header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isActRoute = /^\/carrier\/act\/[^/]+$/.test(pathname);

  let headerText = "";
  if (isActRoute) {
    headerText = "Акт";
  }

  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          {/*  */}
          {/* Main Content */}
          <div className="flex-1 flex flex-col px-6 py-4 h-screen overflow-auto">
            <Header role="carrier" text={headerText} />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;
