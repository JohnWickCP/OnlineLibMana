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
  const [errors, setErrors] = useState({}); // per-field inline errors

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    category: "",
    coverImage: "",
    coverImageFile: null,
    fileUrl: "",
    ebookFile: null,
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
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files && files[0] ? files[0] : null;
    setForm((prev) => ({ ...prev, [name]: file }));
    setError(null);
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Per-field validation
    const newErrors = {};
    if (!form.title || !form.title.trim()) {
      newErrors.title = "Trường này là bắt buộc.";
    }
    if (!form.author || !form.author.trim()) {
      newErrors.author = "Trường này là bắt buộc.";
    }

    // cover image URL is required
    if (!form.coverImage || !form.coverImage.trim()) {
      newErrors.coverImage = "Trường này là bắt buộc. Vui lòng nhập URL ảnh bìa.";
    }

    // ebook URL is required
    if (!form.fileUrl || !form.fileUrl.trim()) {
      newErrors.fileUrl = "Trường này là bắt buộc. Vui lòng nhập URL file ebook.";
    }

    // Validate file formats if files provided
    if (form.coverImageFile) {
      const f = form.coverImageFile;
      if (!f.type.startsWith("image/")) {
        const ext = f.name.split('.').pop()?.toLowerCase();
        if (!['jpg','jpeg','png','gif','webp'].includes(ext)) {
          newErrors.coverImageFile = 'Ảnh bìa phải là file hình (jpg, png, gif, webp).';
        }
      }
    }

    if (form.ebookFile) {
      const f = form.ebookFile;
      const allowedTypes = ['application/pdf','application/epub+zip','application/x-mobipocket-ebook'];
      const ext = f.name.split('.').pop()?.toLowerCase();
      const allowedExt = ['pdf','epub','mobi'];
      if (!allowedTypes.includes(f.type) && !allowedExt.includes(ext)) {
        newErrors.ebookFile = 'File ebook phải là PDF / EPUB / MOBI.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Prepare data. If files uploaded, send as FormData (multipart).
      let response;
      if (form.coverImageFile || form.ebookFile) {
        const fd = new FormData();
        fd.append('title', form.title.trim());
        fd.append('author', form.author.trim());
        fd.append('description', form.description.trim() || 'Chưa có mô tả');
        fd.append('category', form.category || 'Chưa phân loại');

        if (form.coverImageFile) {
          fd.append('coverImageFile', form.coverImageFile);
        } else if (form.coverImage && form.coverImage.trim()) {
          fd.append('coverImage', form.coverImage.trim());
        } else {
          fd.append('coverImage', 'https://via.placeholder.com/400x600?text=No+Cover');
        }

        if (form.ebookFile) {
          fd.append('ebookFile', form.ebookFile);
        } else if (form.fileUrl && form.fileUrl.trim()) {
          fd.append('fileUrl', form.fileUrl.trim());
        }

        fd.append('language', form.language.trim() || 'Vietnamese');
        fd.append('subject', (() => {
          const raw = form.subject || '';
          const parts = raw
            .split(/(?:\s*,\s*|\-\-|\s*;\s*|\/)/)
            .map((s) => s.trim())
            .filter(Boolean);
          return parts.join('--');
        })());
        fd.append('createdAt', new Date().toISOString());

        console.log('📤 Đang gửi FormData (có file)');
        response = await booksAPI.addBook(fd);
      } else {
        const bookData = {
          title: form.title.trim(),
          author: form.author.trim(),
          description: form.description.trim() || 'Chưa có mô tả',
          category: form.category || 'Chưa phân loại',
          coverImage:
            form.coverImage.trim() ||
            'https://via.placeholder.com/400x600?text=No+Cover',
          fileUrl: form.fileUrl.trim(),
          language: form.language.trim() || 'Vietnamese',
          subject: (() => {
            const raw = form.subject || '';
            const parts = raw
              .split(/(?:\s*,\s*|\-\-|\s*;\s*|\/)/)
              .map((s) => s.trim())
              .filter(Boolean);
            return parts.join('--');
          })(),
          createdAt: new Date().toISOString(),
        };

        console.log('📤 Đang gửi data:', bookData);
        response = await booksAPI.addBook(bookData);
      }

      console.log("✅ Response:", response);

      setSuccess(true);

      // Chuyển về trang danh sách sau 1.5 giây
      setTimeout(() => {
        router.push("/admin/books");
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
      coverImageFile: null,
      fileUrl: "",
      ebookFile: null,
      language: "Vietnamese",
      subject: "",
    });
    setError(null);
    setSuccess(false);
    setErrors({});
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

          {/* Cover Image URL / Upload */}
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
            {/* Inline validation for cover */}
            {errors.coverImage && (
              <p className="text-sm text-red-600 mt-1">{errors.coverImage}</p>
            )}

            <p className="text-xs text-gray-500 mt-1">Hoặc upload ảnh bìa (jpg/png/gif/webp)</p>
            <input
              type="file"
              name="coverImageFile"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2"
            />
            {errors.coverImageFile && (
              <p className="text-sm text-red-600 mt-1">{errors.coverImageFile}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Nếu để trống, sẽ sử dụng ảnh mặc định
            </p>
            {/* preview either from URL or uploaded file */}
            {(form.coverImage || form.coverImageFile) && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={
                    form.coverImageFile
                      ? URL.createObjectURL(form.coverImageFile)
                      : form.coverImage
                  }
                  alt="Preview"
                  className="w-32 h-48 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x600?text=Invalid+Image";
                  }}
                />
              </div>
            )}
          </div>

          {/* File URL or upload */}
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
            {errors.fileUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.fileUrl}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Hoặc upload file (PDF / EPUB / MOBI)</p>
            <input
              type="file"
              name="ebookFile"
              accept=".pdf,application/pdf, .epub, .mobi"
              onChange={handleFileChange}
              className="mt-2"
            />
            {errors.ebookFile && (
              <p className="text-sm text-red-600 mt-1">{errors.ebookFile}</p>
            )}
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
              <span className="text-sm font-medium">
                Thêm sách thành công! Đang chuyển hướng...
              </span>
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
              onClick={() => router.push("/admin/books")}
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
