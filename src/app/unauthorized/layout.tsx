"use client";

import "../../styles/globals.css";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body className="flex justify-center items-center">{children}</body>
    </html>
  );
};

export default Layout;
