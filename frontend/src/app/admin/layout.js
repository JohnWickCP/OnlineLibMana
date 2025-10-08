// src/app/layout.js
"use client";

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <>{children}</>
      </body>
    </html>
  );
}