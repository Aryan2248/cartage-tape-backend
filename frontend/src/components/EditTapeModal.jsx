import { useEffect, useState } from "react";

const EditTapeModal = ({
  isOpen,
  onClose,
  onSubmit,
  tape,
}) => {
  const [form, setForm] = useState({
    sequenceNumber: "",
    location: "",
    size: "",
    remarks: "",
  });

  useEffect(() => {
    if (tape) {
      setForm({
        sequenceNumber: tape.sequenceNumber,
        location: tape.location,
        size: tape.size,
        remarks: tape.remarks,
      });
    }
  }, [tape]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(tape.id, form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[500px]">
        <h2 className="text-2xl font-bold mb-4">
          Edit Tape
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* Same inputs as AddTapeModal */}

          <input
            placeholder="Sequence Number"
            className="w-full border p-3 rounded"
            value={form.sequenceNumber}
            onChange={(e) =>
              setForm({
                ...form,
                sequenceNumber: e.target.value,
              })
            }
          />

          <input
            placeholder="Location"
            className="w-full border p-3 rounded"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
          />

          <input
            placeholder="Size"
            className="w-full border p-3 rounded"
            value={form.size}
            onChange={(e) =>
              setForm({
                ...form,
                size: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Remarks"
            className="w-full border p-3 rounded"
            value={form.remarks}
            onChange={(e) =>
              setForm({
                ...form,
                remarks: e.target.value,
              })
            }
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTapeModal;