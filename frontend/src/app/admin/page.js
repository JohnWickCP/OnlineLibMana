// src/app/admin/page.js
import { redirect } from "next/navigation";

export default function AdminPage() {
  // Server-side redirect to the admin dashboard
  redirect("/admin/dashboard");
}
