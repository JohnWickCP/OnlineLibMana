"use client";

import { useEffect, useMemo, useState, useContext } from "react";
import { Book, User, Eye } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { adminAPI } from "@/lib/api";
import { AuthContext } from "@/components/provider/AuthProvider";
import { useRouter } from "next/navigation";

// ====== Helpers ======
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#94a3b8"];

function addMonths(date, months) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function StatCard({ icon, title, number, unit, description }) {
  return (
    <div className="flex flex-col items-center justify-between border-r last:border-none px-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="border-b border-gray-400 w-1/2 mb-3" />
      <div className="flex items-center gap-2 text-gray-700 mb-1">{icon}</div>
      <p className="text-xl font-bold text-gray-800 mb-1">
        {number} {unit}
      </p>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);

  const [data, setData] = useState(null); // server result
  const [loading, setLoading] = useState(true); // local loading for API fetch
  const [error, setError] = useState("");

  // Only fetch dashboard data when auth is resolved and user is authenticated
  useEffect(() => {
    let mounted = true;

    // If auth is still resolving, wait
    if (authLoading) {
      setLoading(true);
      return () => {
        mounted = false;
      };
    }

    // If not authenticated, don't call API — show prompt instead
    if (!isAuthenticated) {
      setData(null);
      setLoading(false);
      setError("");
      return () => {
        mounted = false;
      };
    }

    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await adminAPI.getDashboard(); // uses axios instance + interceptors
        if (res?.code !== 1000 || !res?.result) {
          throw new Error("Phản hồi không hợp lệ từ máy chủ");
        }
        if (mounted) setData(res.result);
      } catch (e) {
        if (mounted) {
          setError(e?.message || "Không thể tải dashboard");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isAuthenticated, authLoading]);

  const usersBarData = useMemo(() => {
    if (!data) return [];
    const start = data.startDay ? new Date(data.startDay) : null;
    const series = Array.isArray(data.users) ? data.users : [];
    return series.map((v, i) => {
      let label = `P${i + 1}`;
      if (start && !Number.isNaN(start.getTime())) {
        const d = addMonths(start, i);
        label =
          d.toLocaleString("en-US", { month: "short" }) +
          " " +
          d.getFullYear().toString().slice(-2);
      }
      return { period: label, users: v };
    });
  }, [data]);

  const ratingPieData = useMemo(() => {
    if (!data) return [];
    return (data.rating || []).map((r) => ({
      name: r.ratingRange,
      value: r.totalBooks,
    }));
  }, [data]);

  // If auth is still resolving, show spinner
  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-gray-600">Đang kiểm tra trạng thái đăng nhập...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show message and button to go to admin login
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7] p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-lg">
          <p className="text-yellow-600 mb-4">🔒 Bạn chưa đăng nhập vào khu vực Admin.</p>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập bằng tài khoản quản trị để truy cập dashboard.</p>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => router.push("/admin/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Đi đến trang đăng nhập Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // While fetching dashboard data
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7]">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-gray-600">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7] p-6">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-lg">
          <p className="text-red-600 mb-4">❌ {error || "Không có dữ liệu"}</p>
          <button
            type="button"
            onClick={() => location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-[#f5f3ef] p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* ===== TITLE ===== */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-10">
          Admin Dashboard
        </h1>

        {/* ===== STAT CARDS (API data) ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 border-b border-gray-200 pb-6">
          <StatCard
            icon={<Book className="w-5 h-5 text-gray-600" />}
            title="All Books"
            number={data.totalBooks}
            unit="books"
            description="+12% from last month"
          />
          <StatCard
            icon={<User className="w-5 h-5 text-gray-600" />}
            title="User"
            number={data.totalUsers}
            unit="users"
            description={`+${data.newUsersQuantity} new in period`}
          />
          <StatCard
            icon={<Eye className="w-5 h-5 text-gray-600" />}
            title="Views"
            number={data.view}
            unit="views"
            description="+12% from last month"
          />
        </div>

        {/* ===== CHART AREA (from API) ===== */}
        <div className="flex flex-wrap justify-between items-center gap-8">
          {/* Bar Chart: users series by period starting at startDay */}
          <div className="flex-1 min-w-[350px] h-[300px] border border-gray-200 rounded-xl flex flex-col justify-center items-center p-4">
            <h2 className="text-gray-700 font-semibold mb-2">
              New users by period
            </h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usersBarData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="period" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="users" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart: rating distribution */}
          <div className="flex-1 min-w-[350px] h-[300px] border border-gray-200 rounded-xl flex flex-col justify-center items-center p-4">
            <h2 className="text-gray-700 font-semibold mb-2">Books by rating</h2>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratingPieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {ratingPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-gray-400">
          Admin Dashboard © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}