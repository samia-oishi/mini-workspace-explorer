import type { WorkspaceItem } from "../types/workspace";
import FileTree from "./FileTree";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

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
    ? items.filter((item) =>
        item.name
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : [];

  return (
    <aside className="w-72 border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-4">
        <h1 className="text-lg font-semibold">
          Workspace Explorer
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Mini Workspace
        </p>
      </div>

      <div className="border-b border-slate-200 p-3">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
        />
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
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Explorer
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