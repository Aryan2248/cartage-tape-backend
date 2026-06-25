import { useState } from "react";

const AddEmployeeModal = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[500px]">
        <h2 className="text-2xl font-bold mb-4">
          Create Employee
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            placeholder="Name"
            className="w-full border p-3 rounded"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Email"
            className="w-full border p-3 rounded"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
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
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;