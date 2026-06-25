import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Cartage Tape Inventory
          </h1>
          <p className="text-sm text-gray-500">
            ONGC Internal Inventory Management
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-medium">
              {user?.name}
            </p>

            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                user?.role === "ADMIN"
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {user?.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;