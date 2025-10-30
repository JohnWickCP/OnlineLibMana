"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { booksAPI } from "@/lib/api";

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.title.trim()) {
      setError("Vui lòng nhập tên sách");
      return;
    }
    if (!form.author.trim()) {
      setError("Vui lòng nhập tên tác giả");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Chuẩn bị data theo đúng format API
      const bookData = {
        title: form.title.trim(),
        author: form.author.trim(),
        description: form.description.trim() || "Chưa có mô tả",
        category: form.category || "Chưa phân loại",
        coverImage: form.coverImage.trim() || "https://via.placeholder.com/400x600?text=No+Cover",
        fileUrl: form.fileUrl.trim(),
        language: form.language.trim() || "Vietnamese",
        subject: form.subject.trim() || "Chưa xác định",
        createdAt: new Date().toISOString(),
      };

      console.log("📤 Đang gửi data:", bookData);

      const response = await booksAPI.addBook(bookData);
      
      console.log("✅ Response:", response);

      setSuccess(true);

      // Chuyển về trang danh sách sau 1.5 giây
      setTimeout(() => {
        router.push('/admin/books');
      }, 1500);

    } catch (err) {
      console.error("❌ Lỗi khi thêm sách:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Không thể thêm sách. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      title: "",
      author: "",
      description: "",
      category: "",
      coverImage: "",
      fileUrl: "",
      language: "Vietnamese",
      subject: "",
    });
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7] p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Thêm sách mới
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Điền thông tin để thêm sách vào thư viện
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
              placeholder="Ví dụ: Harry Potter và Hòn đá Phù thủy"
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
              placeholder="Ví dụ: J.K. Rowling"
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
              placeholder="Ví dụ: Phiêu lưu, Giả tưởng, Học tập..."
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
              placeholder="Nhập mô tả ngắn gọn về nội dung sách..."
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
            <p className="text-xs text-gray-500 mt-1">
              Nếu để trống, sẽ sử dụng ảnh mặc định
            </p>
            {form.coverImage && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
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
            <p className="text-xs text-gray-500 mt-1">
              Link tới file PDF, EPUB hoặc MOBI
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-slideIn">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">Thêm sách thành công! Đang chuyển hướng...</span>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Thêm sách"
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 disabled:border-gray-200 disabled:text-gray-400 text-gray-700 font-medium rounded-lg transition"
            >
              Xóa
            </button>

            <button
              type="button"
              onClick={() => router.push('/admin/books')}
              disabled={loading}
              className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 disabled:border-gray-200 disabled:text-gray-400 text-gray-700 font-medium rounded-lg transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}