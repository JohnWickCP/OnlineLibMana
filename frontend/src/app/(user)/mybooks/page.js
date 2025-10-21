"use client";

import { useState } from "react";
import { Book, Plus, X } from "lucide-react";

export default function ReadingListsPage() {
  const [lists, setLists] = useState([
    { name: "Read", count: 3 },
    { name: "Reading", count: 3 },
    { name: "Want to read", count: 3 },
    { name: "Favorite", count: 3 },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState("");

  const handleAddList = () => {
    if (newListName.trim()) {
      setLists([...lists, { name: newListName, count: 0 }]);
      setNewListName("");
      setShowModal(false);
    }
  };

  return (
    <>
      {/* Main Content */}
      <div className="min-h-[80vh] bg-[#e8e6e1] px-4 py-10 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md w-full max-w-6xl px-10 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-12 divide-x divide-neutral-300">
            {lists.map((list, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-start px-6"
              >
                <h2 className="text-xl font-semibold mb-4 border-b border-neutral-800 w-full text-center pb-1">
                  {list.name}
                </h2>
                <div className="flex items-center gap-2 text-neutral-700 mb-6">
                  <Book className="w-5 h-5 text-neutral-600" />
                  <span>{list.count} books</span>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-sm text-sm transition">
                  See
                </button>
              </div>
            ))}

            <div className="flex flex-col items-center justify-center px-6">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-sm text-sm transition"
              >
                <Plus className="w-4 h-4" />
                Create new List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal + Overlay - chỉ mờ từ dưới header */}
      {showModal && (
        <>
          {/* Overlay mờ - chỉ phía dưới header */}
          <div
            className="fixed top-0 left-0 right-0 bottom-0 z-40 backdrop-blur-sm pointer-events-auto"
            onClick={() => setShowModal(false)}
            style={{ marginTop: "0" }}
          ></div>

          {/* Modal - giữa màn hình */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white rounded-lg p-6 w-80 shadow-xl">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold mb-4 text-center">
                Create New List
              </h2>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddList}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition"
              >
                Add List
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}