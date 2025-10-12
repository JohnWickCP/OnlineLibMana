"use client";

import { useState } from "react";
import { User, Users, UserPlus, Edit, Trash2 } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", date: "2024-01-15", books: 23, favorite: "Harry Potter", active: true },
    { id: 2, name: "Trần Thị B", date: "2024-02-20", books: 15, favorite: "The Great Gatsby", active: true },
    { id: 3, name: "Lê Văn C", date: "2023-12-10", books: 45, favorite: "1984", active: false },
    { id: 4, name: "Phạm Thị D", date: "2024-03-05", books: 8, favorite: "To Kill a Mockingbird", active: true },
    { id: 5, name: "Hoàng Văn E", date: "2024-01-28", books: 31, favorite: "The Lord of the Rings", active: true },
  ]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7] p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-10">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<Users className="w-6 h-6" />} title="User" number="321 users" />
          <StatCard icon={<UserPlus className="w-6 h-6" />} title="New User" number="123 users" />
          <StatCard icon={<User className="w-6 h-6" />} title="Active Users" number="3 users" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-300 text-gray-800">
              <tr>
                {["#", "Name", "Date of Joining", "Books Read", "Favorite Book", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium border-r border-gray-400 last:border-none">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u.id}
                  className="bg-gray-100 hover:bg-gray-200 transition-all border-b border-gray-300"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.date}</td>
                  <td className="px-4 py-3">{u.books}</td>
                  <td className="px-4 py-3">{u.favorite}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        u.active ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                      }`}
                    >
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs"
                        onClick={() => alert(`Edit user: ${u.id}`)}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs"
                        onClick={() => handleDelete(u.id)}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-600">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, number }) {
  return (
    <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="text-gray-700 mb-2">{icon}</div>
      <h2 className="font-semibold text-lg mb-1">{title}</h2>
      <p className="text-sm text-gray-600">{number}</p>
      <button
        onClick={() => alert(`Viewing details for: ${title}`)}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-medium transition"
      >
        See
      </button>
    </div>
  );
}
