import { useEffect, useState } from "react";
import { getAllTapes, searchTapes } from "../api/tapeApi";
import TapeTable from "../components/TapeTable";
import SearchBar from "../components/SearchBar";
import { createTape } from "../api/tapeApi";
import AddTapeModal from "../components/AddTapeModal";
import { updateTape } from "../api/tapeApi";
import EditTapeModal from "../components/EditTapeModal";
import { deleteTape } from "../api/tapeApi";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [tapes, setTapes] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] =  useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTape, setSelectedTape] = useState(null);


  const { user } = useAuth();
  
  const fetchTapes = async (query = "") => {
      try {
          const res = query
          ? await searchTapes(query)
          : await getAllTapes();
          
          setTapes(res.data.content);
        } catch (err) {
            console.log(err);
        }
    };
    
    useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTapes(search);
    }, 500);
  
    return () => clearTimeout(timeout);
  }, [search]);

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
        <h1 className="text-3xl font-bold mb-6">
          Cartage Tape Inventory
        </h1>
        <div className="flex justify-between mb-6">
  <SearchBar
    value={search}
    onChange={setSearch}
  />

  <button
  onClick={() => setOpenModal(true)}
  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
>
  + Add Tape
</button>
</div>

        <TapeTable
  tapes={tapes}
  role={user?.role}
  onEdit={(tape) => {
    setSelectedTape(tape);
    setEditOpen(true);
  }}
  onDelete={handleDeleteTape}
/>

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