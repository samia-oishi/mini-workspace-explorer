import type { WorkspaceItem } from "../types/workspace";
import FileTree from "./FileTree";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import { Layers3 } from "lucide-react";

interface SideBarProps {
  items: WorkspaceItem[];
  selectedFolderId: string | null;
  expandedFolderIds: Set<string>;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectFolder: (id: string) => void;
  onOpenFile: (id: string) => void;
  onToggleFolder: (id: string) => void;
}

function SideBar({
  items,
  selectedFolderId,
  expandedFolderIds,
  searchQuery,
  onSearchChange,
  onSelectFolder,
  onOpenFile,
  onToggleFolder,
}: SideBarProps) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = normalizedQuery
    ? items.filter((item) => item.name.toLowerCase().includes(normalizedQuery))
    : [];

  return (
    <aside className="h-full w-full shrink-0 bg-white md:w-72">
      <div className="border-b border-slate-200 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-900 text-white shadow-sm">
            <Layers3 size={20} />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold tracking-tight text-slate-900">
              Workspace Explorer
            </h1>

            <p className="mt-0.5 text-xs text-slate-500">Mini Workspace</p>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 p-3">
        <SearchBar value={searchQuery} onChange={onSearchChange} />
      </div>

      {normalizedQuery ? (
        <div className="p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Search Results
          </p>

          <SearchResults
            results={searchResults}
            onSelectFolder={onSelectFolder}
            onOpenFile={onOpenFile}
          />
        </div>
      ) : (
        <div className="p-3">
          <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Files
          </p>

          <FileTree
            items={items}
            selectedFolderId={selectedFolderId}
            expandedFolderIds={expandedFolderIds}
            onSelectFolder={onSelectFolder}
            onOpenFile={onOpenFile}
            onToggleFolder={onToggleFolder}
          />
        </div>
      )}
    </aside>
  );
}

export default SideBar;
