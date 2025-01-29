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
  if (pathname === "/accountant/expenses") {
    headerText = "Расходы";
  } else if (/^\/act\/[^/]+$/.test(pathname)) {
    headerText = "Акт";
  }

  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          {/* Sidebar */}
          <Sidebar roleValue="бухгалтер" roleKey="accountant" />
          {/* Main Content */}
          <div className="flex-1 flex flex-col lg:ml-64 px-6 py-4 h-screen overflow-auto">
            <Header role="accountant" text={headerText} />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;
