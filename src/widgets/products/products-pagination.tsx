"use client";

export function ProductsPagination() {
  return (
    <div className="flex justify-center mt-4">
      <ul className="flex items-center gap-1">
        <li>
          <button className="px-2 py-1 text-sm text-gray-400 cursor-not-allowed">←</button>
        </li>
        <li>
          <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
        </li>
        <li>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">2</button>
        </li>
        <li>
          <button className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">→</button>
        </li>
      </ul>
    </div>
  );
}


