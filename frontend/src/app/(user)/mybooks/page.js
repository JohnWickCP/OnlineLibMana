'use client';

import { Book, Plus } from 'lucide-react';

export default function ReadingListsPage() {
  const lists = [
    { name: 'Read', count: 3 },
    { name: 'Reading', count: 3 },
    { name: 'Want to read', count: 3 },
    { name: 'Favorite', count: 3 },
  ];

  return (
    <div className="min-h-[80vh] bg-[#e8e6e1] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-xl shadow-md w-full max-w-6xl px-10 py-12">
        {/* Grid container */}
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

          {/* Ô “Create new List” */}
          <div className="flex flex-col items-center justify-center px-6">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-sm text-sm transition">
              <Plus className="w-4 h-4" />
              Create new List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
