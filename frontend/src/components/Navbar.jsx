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
    <div className="bg-white border-l-4 border-red-800 shadow-sm rounded-xl p-5 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Cartage Tape Inventory
            </h1>
            <span className="bg-red-50 text-red-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-200">
              INTERNAL USE ONLY
            </span>
          </div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">
            Oil and Natural Gas Corporation Limited
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right border-r pr-6 border-gray-200">
            <p className="font-semibold text-gray-800 text-sm">
              {user?.name}
            </p>
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 ${
                user?.role === "ADMIN"
                  ? "bg-red-800 text-white"
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {user?.role}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="border border-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-gray-700 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          >
            Logout System
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;