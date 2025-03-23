import React, { useState } from "react";

export default function ResponsiveTable({ columns, data, rowsPerPage = 5,actions }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Pagination Logic
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max w-full border-collapse border border-gray-200 bg-white">
        {/* Table Header */}
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-2 text-left text-gray-700 text-sm font-semibold border w-32">
                {column.label}
              </th>
            ))}
            {actions && <th className="px-4 py-2 text-base border w-24">Actions</th>}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 border-b">
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-4 py-2 border text-sm">
                    {column.key === "descriptions" ? (
                      <div className="max-w-xs truncate" title={row[column.key]}>
                        {row[column.key]}
                      </div>
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
                {actions && <td className="px-4 py-2 border">{actions(row)}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-4">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center p-4">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 text-sm rounded text-white ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 text-sm rounded text-white ${
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-primary hover:bg-green-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
