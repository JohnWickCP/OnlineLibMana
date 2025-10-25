"use client";

import { useState, useEffect } from "react";
import { User, Users, UserPlus, Loader2 } from "lucide-react";
import { userAPI } from "@/lib/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    newUsers: 0,
    activeUsers: 0
  });

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userAPI.getAllUsers();
      console.log('API Response:', response);
      
      // Kiểm tra cấu trúc response
      const userData = response.result || response.data || response;
      
      if (Array.isArray(userData)) {
        setUsers(userData);
        calculateStats(userData);
      } else {
        console.error('Invalid data structure:', userData);
        setError('Dữ liệu không hợp lệ');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const calculateStats = (userData) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const newUsers = userData.filter(u => {
      const joinDate = new Date(u.createdAt || u.dateOfJoining || u.createdDate);
      return joinDate >= thirtyDaysAgo;
    }).length;

    const activeUsers = userData.filter(u => u.active || u.status === 'active').length;

    setStats({
      total: userData.length,
      newUsers: newUsers,
      activeUsers: activeUsers
    });
  };

  // Calculate time since joining
  const getTimeSinceJoining = (dateString) => {
    if (!dateString) return 'N/A';
    
    const joinDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return '1 ngày trước';
    if (diffDays < 30) return `${diffDays} ngày trước`;
    
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return '1 tháng trước';
    if (diffMonths < 12) return `${diffMonths} tháng trước`;
    
    const diffYears = Math.floor(diffMonths / 12);
    if (diffYears === 1) return '1 năm trước';
    return `${diffYears} năm trước`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7] p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7] p-8 flex items-center justify-center">
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
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7] p-8">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-xl p-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý người dùng</h1>
          <p className="text-gray-600">Danh sách và thống kê người dùng hệ thống</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard 
            icon={<Users className="w-6 h-6" />} 
            title="Tổng người dùng" 
            number={`${stats.total} users`}
            color="blue"
          />
          <StatCard 
            icon={<UserPlus className="w-6 h-6" />} 
            title="Người dùng mới (30 ngày)" 
            number={`${stats.newUsers} users`}
            color="green"
          />
          <StatCard 
            icon={<User className="w-6 h-6" />} 
            title="Đang hoạt động" 
            number={`${stats.activeUsers} users`}
            color="purple"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-300 text-gray-800">
              <tr>
                {["#", "Tên", "Email", "Ngày tham gia", "Thời gian", "Sách đã đọc", "Trạng thái"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium border-r border-gray-400 last:border-none">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u.id || u.userId || index}
                  className="bg-gray-100 hover:bg-gray-200 transition-all border-b border-gray-300"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">{u.name || u.username || 'N/A'}</td>
                  <td className="px-4 py-3">{u.email || 'N/A'}</td>
                  <td className="px-4 py-3">{formatDate(u.createdAt || u.dateOfJoining || u.createdDate)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {getTimeSinceJoining(u.createdAt || u.dateOfJoining || u.createdDate)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {u.booksRead || u.totalBooks || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        u.active || u.status === 'active'
                          ? "bg-green-500 text-white" 
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {u.active || u.status === 'active' ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-600">
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchUsers}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Làm mới
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, number, color = "blue" }) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-300",
    green: "text-green-600 bg-green-50 border-green-200 hover:border-green-300",
    purple: "text-purple-600 bg-purple-50 border-purple-200 hover:border-purple-300"
  };

  return (
    <div className={`flex flex-col items-center p-6 rounded-lg border-2 shadow-sm transition ${colorClasses[color]}`}>
      <div className="mb-3">{icon}</div>
      <h2 className="font-semibold text-lg mb-1 text-gray-800">{title}</h2>
      <p className="text-2xl font-bold">{number}</p>
    </div>
  );
}