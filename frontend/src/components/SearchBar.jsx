const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search logs by sequence, room, size..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-slate-300 bg-white rounded-lg px-4 py-2 w-80 text-sm font-medium shadow-sm placeholder:text-slate-400 focus:w-96 focus:ring-2 focus:ring-red-900 focus:border-red-900 focus:outline-none transition-all"
      />
    </div>
  );
};

export default SearchBar;