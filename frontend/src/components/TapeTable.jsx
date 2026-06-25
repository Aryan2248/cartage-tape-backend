const TapeTable = ({ tapes }) => {
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TapeTable;