"use client";

import { useState, useEffect } from "react";
import { User, Users, UserPlus, Loader2 } from "lucide-react";
import { userAPI } from "@/lib/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [stats, setStats] = useState({
    total: 0,
    newUsers: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [page, size]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userAPI.getAllUsers(page, size);
      const userData = response?.result || response?.data || [];
      if (!Array.isArray(userData)) throw new Error("Dữ liệu không hợp lệ");
      setUsers(userData);
      calculateStats(userData);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      setError(
        err.response?.data?.message || "Không thể tải danh sách người dùng"
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const newUsers = userData.filter((u) => {
      if (!u.createdAt) return false;
      const joinDate = new Date(u.createdAt);
      return joinDate >= thirtyDaysAgo;
    }).length;

    const activeUsers = userData.filter((u) => u.active === true).length;

    setStats({
      total: userData.length,
      newUsers,
      activeUsers,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7]">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-red-600 mb-4">❌ {error}</p>
          <button
            onClick={fetchUsers}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-[80vh] bg-[#f5f3ef] p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-3 gap-6 mb-10 border-b border-gray-200 pb-6">
          <StatCard
            icon={<Users className="w-5 h-5 text-gray-600" />}
            title="User"
            number={stats.total}
            unit="books"
            description="+12% from last month"
          />
          <StatCard
            icon={<UserPlus className="w-5 h-5 text-gray-600" />}
            title="New User"
            number={stats.newUsers}
            unit="user"
            description="+12% from last month"
          />
          <StatCard
            icon={<User className="w-5 h-5 text-gray-600" />}
            title="Active users"
            number={stats.activeUsers}
            unit="user"
            description="+12% from last month"
          />
        </div>

        {/* ===== USER TABLE ===== */}
        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-gray-300 text-gray-800">
              <tr>
                <th className="px-4 py-3 text-left border-r border-gray-400">number</th>
                <th className="px-4 py-3 text-left border-r border-gray-400">name</th>
                <th className="px-4 py-3 text-left border-r border-gray-400">Date of Joining</th>
                <th className="px-4 py-3 text-left border-r border-gray-400">reading</th>
                <th className="px-4 py-3 text-left border-r border-gray-400">want</th>
                <th className="px-4 py-3 text-left border-r border-gray-400">completed</th>
                <th className="px-4 py-3 text-left">state</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u, index) => (
                  <tr key={u.id || index} className="bg-gray-100 border-b border-gray-300">
                    <td className="px-4 py-3">{page * size + index + 1}</td>
                    <td className="px-4 py-3">{u.username || "N/A"}</td>
                    <td className="px-4 py-3">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">{u.readingQuantity ?? 0}</td>
                    <td className="px-4 py-3">{u.wantQuantity ?? 0}</td>
                    <td className="px-4 py-3">{u.completedQuantity ?? 0}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.active ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                        }`}
                      >
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-600">
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== PAGINATION ===== */}
        {users.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị <span className="font-medium">{users.length}</span> người dùng
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
              >
                Trước
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={users.length < size}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, number, unit, description }) {
  return (
    <div className="flex flex-col items-center justify-between border-r last:border-none px-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="border-b border-gray-400 w-1/2 mb-3"></div>
      <div className="flex items-center gap-2 text-gray-700 mb-1">{icon}</div>
      <p className="text-xl font-bold text-gray-800 mb-1">
        {number} {unit}
      </p>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      
    </div>
  );
}