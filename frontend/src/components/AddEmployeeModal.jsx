import { useState } from "react";

const AddEmployeeModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ name: "", email: "", password: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[500px] overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Accent Warning Border indicating Admin control action */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 border-l-4 border-amber-500">
          <h2 className="text-lg font-bold text-slate-900">
            Provision Employee Credential
          </h2>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
            Privileged Operator Administrative Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              placeholder="e.g., Rajesh Kumar"
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-900 focus:outline-none transition-all"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Official ONGC Email Identifier
            </label>
            <input
              type="email"
              placeholder="username@ongc.co.in"
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-red-900 focus:outline-none transition-all"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Initial Security Password
            </label>
            <input
              type="password"
              placeholder="••••••••••••"
              className="w-full border border-slate-300 p-2.5 rounded-lg text-sm font-mono focus:ring-2 focus:ring-red-900 focus:outline-none transition-all"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
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
              Authorize & Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;