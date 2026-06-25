import { useEffect, useState } from "react";
import { getAllTapes, searchTapes } from "../api/tapeApi";
import { createTape, updateTape, deleteTape } from "../api/tapeApi";
import { registerEmployee } from "../api/authApi";

import TapeTable from "../components/TapeTable";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import AddTapeModal from "../components/AddTapeModal";
import EditTapeModal from "../components/EditTapeModal";
import AddEmployeeModal from "../components/AddEmployeeModal";

import { useAuth } from "../context/AuthContext";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, sequenceNumber }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[440px] overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Confirm Asset Removal</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to remove tape record <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">{sequenceNumber || "Selected Asset"}</span> from the internal catalog system? This operation cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [tapes, setTapes] = useState([]);
  const [search, setSearch] = useState("");

  const [openModal, setOpenModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedTape, setSelectedTape] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchTapes = async (query = "", currentPage = page) => {
    try {
      setLoading(true);
      const res = query.trim()
        ? await searchTapes(query.trim(), currentPage)
        : await getAllTapes(currentPage);

      if (res && res.data) {
        setTapes(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      }
    } catch (err) {
      console.error("ONGC Central Inventory Catalog Query Failure:", err);
      setTapes([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTapes(search, page);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, page]);

  const handleCreateTape = async (tapeData) => {
    try {
      await createTape(tapeData);
      setOpenModal(false);
      setPage(0);
      fetchTapes(search, 0);
    } catch (err) {
      console.error("Failed to append asset record:", err);
    }
  };

  const handleUpdateTape = async (id, tapeData) => {
    try {
      await updateTape(id, tapeData);
      setEditOpen(false);
      setSelectedTape(null);
      fetchTapes(search, page);
    } catch (err) {
      console.error("Failed to modify asset record:", err);
    }
  };

  const handleOpenDeleteConfirm = (tape) => {
    setSelectedTape(tape);
    setDeleteOpen(true);
  };

  const handleExecuteDelete = async () => {
    if (!selectedTape) return;
    try {
      await deleteTape(selectedTape.id);
      setDeleteOpen(false);
      setSelectedTape(null);
      fetchTapes(search, page);
    } catch (err) {
      console.error("Failed to eliminate catalog item index:", err);
    }
  };

  const handleCreateEmployee = async (employeeData) => {
    try {
      await registerEmployee(employeeData);
      alert("Employee created successfully.");
      setEmployeeModalOpen(false);
    } catch (err) {
      console.error("Operator registration exception:", err);
      alert("Failed to create employee.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans p-6">
      <div className="max-w-7xl mx-auto">
        <Navbar />

        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-5">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl tracking-tight">
              Inventory Management Desk
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Real-time auditing, tracking, and deployment verification of cartridge tapes.
            </p>
          </div>
          
          <div className="flex items-center justify-center bg-white border border-slate-200 rounded-xl p-2 shadow-sm h-16 w-16 select-none shrink-0 ml-4">
            <img 
              src="/ongc-logo.png" 
              alt="ONGC Logo" 
              className="h-full w-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span class="text-red-900 font-extrabold text-xs tracking-tighter">ONGC</span>';
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cataloged Media Assets</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{loading && tapes.length === 0 ? "..." : tapes.length}</p>
          </div>
          
          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access Authorization</p>
            <p className="mt-2 text-xl font-bold text-red-900 tracking-wide uppercase">
              {user?.role || "GUEST"} ACCESS
            </p>
          </div>

          <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 p-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Active Session</p>
            <p className="mt-2 text-sm font-semibold text-slate-700 truncate bg-slate-100 inline-block px-2.5 py-1 rounded border border-slate-200">
              {user?.email || "System Operator"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto">
            <SearchBar
              value={search}
              onChange={(value) => {
                setSearch(value);
                setPage(0);
              }}
            />
          </div>

          <div className="flex w-full sm:w-auto justify-end gap-3">
            {user?.role === "ADMIN" && (
              <button
                onClick={() => setEmployeeModalOpen(true)}
                className="inline-flex items-center justify-center bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all focus:outline-none"
              >
                + Provision Operator
              </button>
            )}

            <button
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center justify-center bg-red-900 hover:bg-red-800 text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition-all focus:outline-none"
            >
              + Add Tape Record
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-red-900 mb-4"></div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Querying Central Catalogs...
            </h3>
          </div>
        ) : tapes.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-800">No Tapes Found</h3>
          </div>
        ) : (
          <div className="transition-all duration-200">
            <TapeTable
              tapes={tapes}
              role={user?.role}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              onEdit={(tape) => {
                setSelectedTape(tape);
                setEditOpen(true);
              }}
              onDelete={handleOpenDeleteConfirm}
            />
          </div>
        )}
      </div>

      {/* Forms Overlay Controllers Injections */}
      <AddTapeModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreateTape}
      />

      <EditTapeModal
        isOpen={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedTape(null);
        }}
        onSubmit={handleUpdateTape}
        tape={selectedTape}
      />

      <AddEmployeeModal
        isOpen={employeeModalOpen}
        onClose={() => setEmployeeModalOpen(false)}
        onSubmit={handleCreateEmployee}
      />

      <DeleteConfirmationModal
        isOpen={deleteOpen}
        sequenceNumber={selectedTape?.sequenceNumber}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedTape(null);
        }}
        onConfirm={handleExecuteDelete}
      />
    </div>
  );
};

export default Dashboard;