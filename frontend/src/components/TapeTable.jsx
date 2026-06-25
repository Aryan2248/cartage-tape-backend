const TapeTable = ({ tapes, onEdit, onDelete, role}) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-100">
  <tr>
    <th className="p-4 text-left">Sequence</th>
    <th className="p-4 text-left">Location</th>
    <th className="p-4 text-left">Size</th>
    <th className="p-4 text-left">Remarks</th>
    <th className="p-4 text-left">Created By</th>
    <th className="p-4 text-left">Created At</th>
    <th className="p-4 text-left">Updated By</th>
    <th className="p-4 text-left">Updated At</th>
    <th className="p-4 text-left">Actions</th>
  </tr>
</thead>

        <tbody>
          {tapes.map((tape) => (
            <tr
              key={tape.id}
              className="border-t hover:bg-slate-50"
            >
              <td className="p-4">
                {tape.sequenceNumber}
              </td>

              <td className="p-4">
                {tape.location}
              </td>

              <td className="p-4">
                {tape.size}
              </td>

              <td className="p-4">
                {tape.remarks}
              </td>

              <td className="p-4">
                {tape.createdBy}
              </td>
              <td className="p-4">
  {tape.updatedBy || "-"}
</td>
<td className="p-4">
  {tape.createdAt
    ? new Date(tape.createdAt).toLocaleString()
    : "-"}
</td>

<td className="p-4">
  {tape.updatedAt
    ? new Date(tape.updatedAt).toLocaleString()
    : "-"}
</td>
              <td className="p-4">
  <div className="flex gap-4">
    <button
      onClick={() => onEdit(tape)}
      className="text-blue-600 font-medium"
    >
      Edit
    </button>

    {role === "ADMIN" && (
      <button
        onClick={() => onDelete(tape.id)}
        className="text-red-600 font-medium"
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
  );
};

export default TapeTable;