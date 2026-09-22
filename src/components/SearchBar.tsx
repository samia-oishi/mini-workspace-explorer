import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder="Search workspace..."
        className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-1 focus:ring-blue-400"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          title="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;