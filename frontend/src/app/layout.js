// src/app/layout.js
"use client";
import { usePathname } from "next/navigation";

import Header from "@/components/layout/user/Header";
import Footer from "@/components/layout/user/Footer";
import HeaderAdmin from "@/components/layout/admin/HeaderAdmin";

import "./globals.css";
import { AuthProvider } from "@/components/provider/AuthProvider";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html>
  <body className="inter.className">
    <AuthProvider>
      {isAdmin ? <HeaderAdmin /> : <Header />}
      <main>{children}</main>
      <Footer />
    </AuthProvider>
  </body>
</html>

  );
}
