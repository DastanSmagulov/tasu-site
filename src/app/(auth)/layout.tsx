"use client";
import "../../styles/globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<LayoutProps> = ({ children }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default AuthLayout;
