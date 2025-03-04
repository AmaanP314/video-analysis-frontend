import { useState, useMemo } from "react";

export default function CommentsTable({ comments }) {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    let data = comments;
    if (search) {
      data = data.filter(
        (item) =>
          item.comment.toLowerCase().includes(search.toLowerCase()) ||
          item.sentiment.toLowerCase().includes(search.toLowerCase()) ||
          item.type.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sortColumn) {
      data = [...data].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [comments, search, sortColumn, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Search comments..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700"
        />
        <div>
          <label className="mr-2">Rows per page:</label>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-700"
          >
            {[5, 10, 20, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex">
          <div className="w-3/4 overflow-x-auto scrollbar-thin">
            <table className="w-full border-r border-gray-700">
              <thead>
                <tr className="bg-gray-800">
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleSort("comment")}
                  >
                    Comment{" "}
                    {sortColumn === "comment" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="px-4 py-2 whitespace-nowrap">
                      {item.comment}
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td className="px-4 py-2 text-center">No comments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="w-1/4">
            <table className="w-full border border-gray-700 border-l-0">
              <thead>
                <tr className="bg-gray-800">
                  <th
                    className="px-4 py-2 text-left cursor-pointer w-1/2"
                    onClick={() => handleSort("sentiment")}
                  >
                    Sentiment{" "}
                    {sortColumn === "sentiment" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer w-1/2"
                    onClick={() => handleSort("type")}
                  >
                    Type{" "}
                    {sortColumn === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="px-4 py-2">{item.sentiment}</td>
                    <td className="px-4 py-2">{item.type}</td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan="2" className="px-4 py-2 text-center">
                      No data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-800 text-white border border-gray-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-800 text-white border border-gray-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
