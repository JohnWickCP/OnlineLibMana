// src/app/layout.js
import "./globals.css";
export const metadata = {
  title: "OnlineLibMana",
  description: "Online Library Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}