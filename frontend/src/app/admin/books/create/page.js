"use client";

import { useState } from "react";
import { Upload, CheckCircle } from "lucide-react";

export default function AddBookPage() {
  const [images, setImages] = useState([]);
  const [ebook, setEbook] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    author: "",
    date: "",
    genre: "",
    title: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleEbook = (e) => {
    setEbook(e.target.files[0] || null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      ...form,
      images: images.length,
      ebook: ebook?.name || null,
    };

    console.log("Book data:", data);
    setSuccess(true);

    // reset form after 3s
    setTimeout(() => {
      setSuccess(false);
      setForm({ name: "", author: "", date: "", genre: "", title: "" });
      setImages([]);
      setEbook(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7] p-6">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-lg">
        <h1 className="text-2xl font-semibold mb-10 text-center">Add New Book</h1>

        <form onSubmit={handleSubmit}>
          {/* Inputs */}
          {["name", "author", "date", "genre", "title"].map((field) => (
            <div key={field} className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 capitalize">
                {field}
              </label>
              <input
                type={field === "date" ? "date" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 focus:bg-white focus:border-blue-500 outline-none transition"
              />
            </div>
          ))}

          {/* Upload Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
            {/* Upload Images */}
            <div className="text-center">
              <label className="block text-gray-700 font-medium mb-2">Images</label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImages}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById("images").click()}
                className="flex items-center justify-center gap-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md transition"
              >
                <Upload size={18} /> Upload
              </button>
              <div className="text-xs text-gray-500 mt-2 min-h-[20px]">
                {images.length > 0
                  ? images.length === 1
                    ? images[0].name
                    : `${images.length} files selected`
                  : ""}
              </div>
            </div>

            {/* Upload Ebook */}
            <div className="text-center">
              <label className="block text-gray-700 font-medium mb-2">File E-book</label>
              <input
                type="file"
                id="ebook"
                accept=".pdf,.epub,.mobi"
                onChange={handleEbook}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => document.getElementById("ebook").click()}
                className="flex items-center justify-center gap-2 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md transition"
              >
                <Upload size={18} /> Upload
              </button>
              <div className="text-xs text-gray-500 mt-2 min-h-[20px]">
                {ebook ? ebook.name : ""}
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="text-center mt-10">
            <button
              type="submit"
              className="border-2 border-gray-800 px-10 py-3 rounded-md font-medium hover:bg-gray-800 hover:text-white transition"
            >
              Save
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mt-6 bg-green-500 text-white py-3 rounded-md flex items-center justify-center gap-2 animate-slideIn">
              <CheckCircle size={18} /> Book added successfully!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
