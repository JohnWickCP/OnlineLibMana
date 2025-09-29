// src/app/layout.js

"use client";
import Header from "../../components/admin/shared/Header.js";
import Footer from "../../components/user/shared/Footer.js";


export default function AdminLayout({ children }) {
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