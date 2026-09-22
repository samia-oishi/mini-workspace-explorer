import type { WorkspaceItem } from "../types/workspace";
import { FileText, Folder } from "lucide-react";

interface SearchResultsProps {
  results: WorkspaceItem[];
  onSelectFolder: (id: string) => void;
  onOpenFile: (id: string) => void;
}

function SearchResults({
  results,
  onSelectFolder,
  onOpenFile,
}: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <p className="px-2 py-3 text-sm text-slate-500">
        No results found.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {results.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            if (item.type === "folder") {
              onSelectFolder(item.id);
            } else {
              onOpenFile(item.id);
            }
          }}
          className="flex w-full min-w-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100"
        >
          <span
            className={`shrink-0 ${
              item.type === "folder"
                ? "text-amber-600"
                : "text-blue-400"
            }`}
          >
            {item.type === "folder" ? (
              <Folder size={17} />
            ) : (
              <FileText size={17} />
            )}
          </span>

          <span className="min-w-0 truncate">
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
}

export default SearchResults;