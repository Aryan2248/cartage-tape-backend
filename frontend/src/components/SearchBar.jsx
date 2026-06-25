const SearchBar = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search tapes..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-4 py-2 w-80"
    />
  );
};

export default SearchBar;