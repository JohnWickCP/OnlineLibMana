"use client";

import { useState, useEffect } from "react";
import { Book, Plus, X, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { userAPI } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function MyBooksListsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // State quản lý danh sách
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho modal
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // Default lists - 3 list mặc định (match với backend enum StatusBook)
  const DEFAULT_LISTS = [
    {
      name: "Already Read",
      status: "COMPLETED",
      isDefault: true,
      color: "bg-green-500",
    },
    {
      name: "Currently Reading",
      status: "READING",
      isDefault: true,
      color: "bg-blue-500",
    },
    {
      name: "Want to Read",
      status: "WANT",
      isDefault: true,
      color: "bg-yellow-500",
    },
  ];

  // Load danh sách khi component mount
  useEffect(() => {
    // Wait until auth state is resolved. Some auth hooks initialize with
    // undefined/null while checking session; don't redirect during that time.
    if (typeof isAuthenticated === "undefined" || isAuthenticated === null) {
      return;
    }

    // If not authenticated, redirect user to login page.
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // Authenticated -> load lists
    fetchAllLists();
  }, [isAuthenticated, router]);

  /**
   * Fetch tất cả các list (default + custom)
   */
  const fetchAllLists = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📚 Đang tải danh sách reading lists...");

      // Fetch song song số lượng sách trong mỗi default list
      const [alreadyRead, currentlyReading, wantToRead] = await Promise.all([
        userAPI.getCountBook("COMPLETED").catch(() => []),
        userAPI.getCountBook("READING").catch(() => []),
        userAPI.getCountBook("WANT").catch(() => []),
      ]);

      // Tạo default lists với count thực tế
      const defaultListsWithCount = [
        {
          name: "Already Read",
          status: "COMPLETED",
          isDefault: true,
          count: alreadyRead.result || 0,
          color: "bg-green-500",
        },
        {
          name: "Currently Reading",
          status: "READING",
          isDefault: true,
          count: currentlyReading.result || 0,
          color: "bg-blue-500",
        },
        {
          name: "Want to Read",
          status: "WANT",
          isDefault: true,
          count: wantToRead.result || 0,
          color: "bg-yellow-500",
        },
      ];

      // TODO: Fetch custom lists khi backend có API
      // const customLists = await userAPI.getCustomLists();
      const customListsResponse = await userAPI.getAllFolders();
      const customLists = customListsResponse?.result || [];

      // Định dạng lại nếu cần (tuỳ backend trả về)
      const formattedCustomLists = customLists.map((folder) => ({
        id: folder.id,
        name: folder.title,
        isDefault: false,
        count: folder.count || 0, // Nếu backend có số lượng
        color: "bg-purple-500",
      }));
      // Combine default + custom
      setLists([...defaultListsWithCount, ...formattedCustomLists]);

    } catch (err) {
      console.error("❌ Lỗi khi tải reading lists:", err);
      setError("Failed to load reading lists");

      // Fallback: Hiển thị default lists với count = 0
      setLists(DEFAULT_LISTS.map((list) => ({ ...list, count: 0 })));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Tạo list mới (custom list/folder)
   */
  const handleAddList = async () => {
    if (!newListName.trim()) {
      alert("⚠️ Please enter a list name");
      return;
    }

    if (!isAuthenticated) {
      alert("⚠️ Please login to create custom lists");
      router.push("/auth/login");
      return;
    }

    // Client-side check: nếu custom list cùng tên đã tồn tại thì báo lỗi ngay
    // So sánh case-insensitive và bỏ khoảng trắng 2 đầu
    const normalizedNewName = newListName.trim().toLowerCase();
    const duplicate = lists.some(
      (l) =>
        !l.isDefault &&
        l.name &&
        l.name.trim().toLowerCase() === normalizedNewName
    );

    if (duplicate) {
      alert(`❌ A custom list named "${newListName.trim()}" already exists.`);
      return;
    }

    try {
      setCreating(true);

      console.log("📝 Đang tạo folder mới:", newListName);

      // Gọi API tạo folder với đúng format backend expects
      await userAPI.addFolder({
        title: newListName,
        description: newListDescription || "",
      });

      // Reload lists
      await fetchAllLists();

      // Reset form
      setNewListName("");
      setNewListDescription("");
      setShowModal(false);

      alert(`✅ Successfully created list "${newListName}"!`);

      console.log("✅ Đã tạo folder mới");
    } catch (err) {
      console.error("❌ Lỗi khi tạo folder:", err);

      let errorMessage = "Failed to create list. Please try again.";

      if (err.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
      } else if (err.response?.status === 409) {
        errorMessage = "List with this name already exists.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      alert(`❌ ${errorMessage}`);
    } finally {
      setCreating(false);
    }
  };

  /**
   * Xem chi tiết list
   */
  const handleViewList = (list) => {
    if (!isAuthenticated) {
      alert("⚠️ Please login to view your reading lists");
      router.push("/auth/login");
      return;
    }

    let path;

  if (list.id) {
    path = `/mybooks/${list.id}`;
  } else {
    path = `/mybooks/status/${list.status}`;
  }

  router.push(path);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] bg-[#e8e6e1] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#62BFA3] mx-auto mb-4" />
          <p className="text-neutral-600">Loading your reading lists...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="min-h-[80vh] bg-[#e8e6e1] px-4 py-10 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md w-full max-w-6xl px-10 py-12">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              My Reading Lists
            </h1>
            <p className="text-neutral-600">
              Organize your books into collections
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Lists Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-12 divide-x divide-neutral-300">
            {lists.map((list, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-start px-6"
              >
                
                {/* List Icon - màu sắc khác nhau cho mỗi default list */}
                {list.isDefault && (
                  <div
                    className={`${list.color} w-12 h-12 rounded-full flex items-center justify-center mb-3`}
                  >
                    <Book className="w-6 h-6 text-white" />
                  </div>
                )}

                <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 w-full text-center pb-1">
                  {list.name}
                </h2>

                <div className="flex items-center gap-2 text-neutral-700 mb-6">
                  <Book className="w-5 h-5 text-neutral-600" />
                  <span>
                    {list.count} book{list.count !== 1 ? "s" : ""}
                  </span>
                </div>

                <button
                  onClick={() => handleViewList(list)}
                  disabled={!isAuthenticated}
                  className={`px-8 py-2 rounded-md text-sm transition ${
                    isAuthenticated
                      ? "bg-[#608075] hover:bg-[#608075] text-white"
                      : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                  }`}
                >
                  {isAuthenticated ? "View" : "Login to View"}
                </button>
              </div>
            ))}

            {/* Create New List Button (only show when authenticated) */}
            {isAuthenticated && (
              <div className="flex flex-col items-center justify-center px-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 bg-[#608075] hover:bg-[#608075] text-white px-6 py-3 rounded-xl text-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  Create new List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal + Overlay */}
      {showModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold mb-4 text-center">
                Create New List
              </h2>

              <div className="space-y-4">
                {/* Title input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    List Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddList();
                      }
                    }}
                    placeholder="e.g., Summer Reading 2024"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#62BFA3]"
                    autoFocus
                  />
                </div>

                {/* Description input (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description{" "}
                    <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <textarea
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                    placeholder="Add a description for this list..."
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#62BFA3] resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleAddList}
                disabled={creating || !newListName.trim()}
                className="w-full mt-6 bg-[#608075] hover:bg-[#608075] text-white px-3 py-2.5 rounded transition disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create List"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}