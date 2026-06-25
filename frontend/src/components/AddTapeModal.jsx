import { useState } from "react";

const AddTapeModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    sequenceNumber: "",
    location: "",
    size: "",
    remarks: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ sequenceNumber: "", location: "", size: "", remarks: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Register New Tape Allocation
          </h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mt-0.5">
            Cartage Inventory System Entry
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Sequence Number
            </label>
            <input
              type="text"
              placeholder="e.g., SEQ-104"
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm font-mono focus:ring-2 focus:ring-red-900 focus:outline-none transition-all"
              value={form.sequenceNumber}
              onChange={(e) => setForm({ ...form, sequenceNumber: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Storage Location
            </label>
            <input
              type="text"
              placeholder="e.g., Dehradun Vault, Box 4"
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-900 focus:outline-none transition-all"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Size / Capacity
            </label>
            <input
              type="text"
              placeholder="e.g., 2.5 TB"
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-900 focus:outline-none transition-all"
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Remarks
            </label>
            <textarea
              placeholder="Add purpose, backup project name or physical tape condition details..."
              rows={3}
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-900 focus:outline-none transition-all resize-none"
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-900 hover:bg-red-800 text-white px-5 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTapeModal;