"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { booksAPI } from "@/lib/api";

export default function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    coverImage: "",
    fileUrl: "",
    language: "Vietnamese",
    subject: "",
  });

  // ✅ Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    "Văn học",
    "Khoa học",
    "Lịch sử",
    "Triết học",
    "Kinh tế",
    "Tâm lý",
    "Kỹ năng",
    "Thiếu nhi",
    "Tiểu thuyết",
    "Truyện tranh",
  ];



  // 🔹 Load dữ liệu sách
  useEffect(() => {
    if (!mounted) return;
    
    const fetchBook = async () => {
      try {
        console.log("🔍 Đang tải thông tin sách ID:", id);
        const response = await booksAPI.getBookById(id);
        
        // ✅ Kiểm tra cấu trúc response
        console.log("📦 Response từ API:", response);
        
        // Xử lý cả 2 trường hợp: response.result hoặc response trực tiếp
        const data = response.result || response;
        
        console.log("📚 Dữ liệu sách:", data);
        
        if (!data) {
          throw new Error("Không tìm thấy thông tin sách");
        }

        // ✅ Cập nhật form với dữ liệu đã load
        setForm({
          title: data.title || "",
          author: data.author || "",
          description: data.description || "",
          category: data.category || "",
          coverImage: data.coverImage || "",
          fileUrl: data.fileUrl || "",
          language: data.language || "Vietnamese",
          subject: data.subject || "",
        });

        console.log("✅ Đã load dữ liệu vào form");
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu sách:", err);
        setError(err.message || "Không thể tải thông tin sách.");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchBook();
    }
  }, [id, mounted]);

  // 🔹 Cập nhật form khi người dùng chỉnh sửa
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  // 🔹 Gửi yêu cầu cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.author.trim()) {
      setError("Tên sách và tác giả là bắt buộc");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bookData = {
        title: form.title.trim(),
        author: form.author.trim(),
        description: form.description.trim() || "Chưa có mô tả",
        category: form.category || "Chưa phân loại",
        coverImage: form.coverImage.trim() || "https://via.placeholder.com/400x600?text=No+Cover",
        fileUrl: form.fileUrl.trim(),
        language: form.language,
        subject: form.subject || "Chưa xác định",
      };

      console.log("📤 Gửi dữ liệu update:", bookData);
      await booksAPI.editBook(id, bookData);

      setSuccess(true);
      setTimeout(() => {
        router.push(`/admin/books/${id}`);
      }, 1500);
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật sách:", err);
      setError(err.response?.data?.message || "Không thể cập nhật sách. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render null cho đến khi mounted
  if (!mounted || fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#e8e4dc]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin sách...</p>
        </div>
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#e8e4dc]">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Lỗi</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/books')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Quay về danh sách sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7] p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Chỉnh sửa sách
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Cập nhật thông tin chi tiết của sách
        </p>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Tên sách <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Tên sách..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          {/* Author */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Tác giả <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Tên tác giả..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          {/* Category & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Thể loại
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              >
                <option value="">-- Chọn thể loại --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Ngôn ngữ
              </label>
              <input
                type="text"
                name="language"
                value={form.language}
                onChange={handleChange}
                placeholder="Ví dụ: Vietnamese, English, Tiếng Việt..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
              />
            </div>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Chủ đề
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Chủ đề sách..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập mô tả sách..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
            />
          </div>

          {/* Cover Image URL */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              URL ảnh bìa
            </label>
            <input
              type="url"
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/book-cover.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
            {form.coverImage && (
              <div className="mt-3">
                <img 
                  src={form.coverImage} 
                  alt="Preview" 
                  className="w-32 h-48 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x600?text=Invalid+Image";
                  }}
                />
              </div>
            )}
          </div>

          {/* File URL */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">
              URL file E-book
            </label>
            <input
              type="url"
              name="fileUrl"
              value={form.fileUrl}
              onChange={handleChange}
              placeholder="https://example.com/book.pdf"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-slideIn">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Cập nhật sách thành công!</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật sách"
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push(`/books/${id}`)}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}