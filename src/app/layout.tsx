import { Metadata } from "next";
import "./global.css";
import React from "react";

export const metadata: Metadata = {
  title: "EP-modpack",
  description: "My App is a...",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          {children}
        </div>
        <script type="module" src="../main.tsx"></script>
      </body>
    </html>
  );
}