"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/globals.css";
import { ThemeProvider } from "../context/ThemeContext";

type LayoutProps = {
  children: React.ReactNode;
};

const inter = Inter({ subsets: ["latin"] });

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <html lang="en">
    <ThemeProvider>
      <body className={`${inter.className} flex`}>
        <Sidebar />
        <div className="flex flex-col flex-1 px-10 py-4">
          <Header />
          {children}
        </div>
      </body>
    </ThemeProvider>
  </html>
);

export default Layout;
