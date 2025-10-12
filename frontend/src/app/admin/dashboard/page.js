
'use client';

import { useEffect } from "react";

export default function BookDashboard() {
  useEffect(() => {
    // Animate bars on load
    const bars = document.querySelectorAll(".bar");
    bars.forEach((bar, index) => {
      bar.style.height = "0";
      setTimeout(() => {
        bar.style.height = ["60%", "80%", "100%"][index];
      }, 100 * index);
    });
  }, []);

  const handleSee = (title) => {
    alert("Viewing details for: " + title);
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-[#e8e4dc] to-[#d4cfc7] p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-10">
        {/* === Stats Grid === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { title: "All Books", value: "321 books" },
            { title: "User", value: "123 user" },
            { title: "Views", value: "3 views" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="text-center relative border-r last:border-r-0 border-gray-200"
            >
              <div className="inline-block border-b-2 border-gray-800 text-lg font-medium mb-4 pb-2 min-w-[150px]">
                {item.title}
              </div>

              <div className="flex items-center justify-center mb-2">
                <div className="relative w-6 h-6 border-2 border-gray-600 rounded-sm mr-2">
                  <div className="absolute left-[6px] top-[2px] w-[8px] h-[16px] border-r-2 border-gray-600"></div>
                </div>
                <span className="text-gray-600 text-sm">{item.value}</span>
              </div>

              <div className="text-green-600 text-sm mb-4">
                +12% from last month
              </div>

              <button
                onClick={() => handleSee(item.title)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium text-sm transition"
              >
                See
              </button>
            </div>
          ))}
        </div>

        {/* === Charts === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
          {/* Bar Chart */}
          <div className="text-center">
            <div className="flex items-end justify-center h-[200px] gap-10 p-5">
              <div className="bar w-10 bg-gray-800 rounded-t-md transition-all"></div>
              <div className="bar w-10 bg-gray-800 rounded-t-md transition-all"></div>
              <div className="bar w-10 bg-gray-800 rounded-t-md transition-all"></div>
            </div>
            <div className="text-sm text-gray-600 mt-4">books for months</div>
          </div>

          {/* Pie Chart */}
          <div className="text-center">
            <div className="w-[200px] h-[200px] mx-auto relative mt-5">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className="transform -rotate-90"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  className="fill-none stroke-gray-800 stroke-[40] transition-all hover:stroke-[45]"
                  strokeDasharray="377 126"
                  strokeDashoffset="0"
                />
              </svg>
            </div>
            <div className="text-sm text-gray-600 mt-4">role</div>
          </div>
        </div>
      </div>
    </div>
  );
}
