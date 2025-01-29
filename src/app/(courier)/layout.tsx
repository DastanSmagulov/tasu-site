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
  if (/^\/act\/[^/]+$/.test(pathname)) {
    headerText = "Акт";
  }

  return (
    <html lang="en">
      <body className="flex">
        <SessionProvider>
          <Sidebar roleValue="курьер" roleKey="courier" />
          <div className="flex flex-col flex-1 px-4 md:px-10 py-4 lg:ml-64 overflow-auto h-screen">
            <Header role="courier" text={headerText} />
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
};

export default Layout;
