const TapeTable = ({ tapes, onEdit, onDelete, role, page, totalPages, setPage }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 border-b border-gray-200">
            <tr>
              <th className="p-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Sequence</th>
              <th className="p-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Location</th>
              <th className="p-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Size</th>
              <th className="p-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Remarks</th>
              <th className="p-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Created By</th>
              <th className="p-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Created At</th>
              <th className="p-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Updated By</th>
              <th className="p-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Updated At</th>
              <th className="p-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {tapes.map((tape) => (
              <tr key={tape.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-mono font-semibold text-slate-900">{tape.sequenceNumber}</td>
                <td className="p-3.5 text-gray-600">{tape.location}</td>
                <td className="p-3.5">
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-medium">
                    {tape.size}
                  </span>
                </td>
                <td className="p-3.5 max-w-xs truncate text-gray-500" title={tape.remarks}>
                  {tape.remarks || "-"}
                </td>
                <td className="p-3.5 text-xs font-medium text-gray-600">{tape.createdBy}</td>
                <td className="p-3.5 text-xs text-gray-400">
                  {tape.createdAt ? new Date(tape.createdAt).toLocaleString() : "-"}
                </td>
                <td className="p-3.5 text-xs font-medium text-gray-600">{tape.updatedBy || "-"}</td>
                <td className="p-3.5 text-xs text-gray-400">
                  {tape.updatedAt ? new Date(tape.updatedAt).toLocaleString() : "-"}
                </td>
                <td className="p-3.5 text-right">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => onEdit(tape)} 
                      className="text-red-800 hover:text-red-900 font-semibold text-xs uppercase tracking-wider"
                    >
                      Edit
                    </button>
                    {role === "ADMIN" && (
                      <button 
                        onClick={() => onDelete(tape)} 
                        className="text-slate-400 hover:text-red-600 font-medium text-xs uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-slate-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          Showing Page {page + 1} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-3 py-1.5 text-xs bg-white border border-gray-300 text-gray-700 rounded-md font-medium shadow-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-1.5 text-xs bg-white border border-gray-300 text-gray-700 rounded-md font-medium shadow-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TapeTable;