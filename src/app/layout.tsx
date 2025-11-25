import { Metadata } from "next";
import "./global.css";
import React from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "EP-modpack",
  description: "Официальный мод-пак сервера ElectroPlay",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}