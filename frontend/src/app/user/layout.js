// src/app/layout.js

"use client";
import Header from "../../components/user/shared/Header.js";
import Footer from "../../components/user/shared/Footer.js";


export default function UserLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}