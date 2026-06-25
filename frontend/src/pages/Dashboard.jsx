import { useEffect, useState } from "react";
import { getAllTapes, searchTapes } from "../api/tapeApi";
import TapeTable from "../components/TapeTable";
import SearchBar from "../components/SearchBar";
import { createTape } from "../api/tapeApi";
import AddTapeModal from "../components/AddTapeModal";
import { updateTape } from "../api/tapeApi";
import EditTapeModal from "../components/EditTapeModal";
import { deleteTape } from "../api/tapeApi";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [tapes, setTapes] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] =  useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTape, setSelectedTape] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);


  const { user } = useAuth();
  
  const fetchTapes = async (
  query = "",
  currentPage = page
) => {
  try {
    setLoading(true);

    const res = query
      ? await searchTapes(
          query,
          currentPage
        )
      : await getAllTapes(currentPage);

    setTapes(res.data.content);
    setTotalPages(res.data.totalPages);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
    
    useEffect(() => {
  const timeout = setTimeout(() => {
    fetchTapes(search, page);
  }, 500);

  return () => clearTimeout(timeout);
}, 
[search, page]);


  const handleCreateTape = async (
  tapeData
) => {
  try {
    await createTape(tapeData);

    setOpenModal(false);

    fetchTapes();
  } catch (err) {
    console.log(err);
  }
};
    const handleUpdateTape = async (
  id,
  tapeData
) => {
  try {
    await updateTape(id, tapeData);

    setEditOpen(false);
    fetchTapes();
  } catch (err) {
    console.log(err);
  }
};
    const handleDeleteTape = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this tape?"
  );

  if (!confirmDelete) return;

  try {
    await deleteTape(id);
    fetchTapes();
  } catch (err) {
    console.log(err);
  }
};

    
  return (
    
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <Navbar />
        <div className="mb-6">
  <h2 className="text-3xl font-bold">
    Inventory Management
  </h2>

  <p className="text-gray-500">
    Track and manage cartridge tapes across locations.
  </p>
</div>
        <div className="flex justify-between mb-6">
  <SearchBar
    value={search}
    onChange={(value) => {
  setSearch(value);
  setPage(0);
}}
  />

  <button
  onClick={() => setOpenModal(true)}
  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
>
  + Add Tape
</button>
</div>

        {tapes.length === 0 ? (
  <div className="bg-white rounded-xl p-12 text-center shadow">
    <h3 className="text-xl font-semibold">
      No tapes found
    </h3>

    <p className="text-gray-500 mt-2">
      Create your first tape record.
    </p>
  </div>
) : (
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
  onDelete={handleDeleteTape}
/>
)}

      </div>
      <AddTapeModal
  isOpen={openModal}
  onClose={() => setOpenModal(false)}
  onSubmit={handleCreateTape}
/>
<EditTapeModal
  isOpen={editOpen}
  onClose={() => setEditOpen(false)}
  onSubmit={handleUpdateTape}
  tape={selectedTape}
/>
    </div>
  );
};

export default Dashboard;