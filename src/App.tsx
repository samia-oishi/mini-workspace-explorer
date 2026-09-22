import { useEffect, useState } from "react";
import type { WorkspaceItem } from "./types/workspace";
import FileTree from "./components/FileTree";

import { loadWorkspace, saveWorkspace } from "./utils/storage";

const initialWorkspace: WorkspaceItem[] = [
  {
    id: "root",
    name: "Workspace",
    type: "folder",
    parentId: null,
  },
  {
    id: "projects",
    name: "Projects",
    type: "folder",
    parentId: "root",
  },
  {
    id: "webbly",
    name: "Webbly",
    type: "folder",
    parentId: "projects",
  },
  {
    id: "notes",
    name: "notes.txt",
    type: "file",
    parentId: "webbly",
    content: "Welcome to your workspace.",
  },
  {
    id: "readme",
    name: "README.txt",
    type: "file",
    parentId: "root",
    content: "This is your workspace.",
  },
];

function App() {
  const [items, setItems] = useState<WorkspaceItem[]>(
    () => loadWorkspace() ?? initialWorkspace,
  );

  const [selectedFolderId, setSelectedFolderId] = useState("root");

  useEffect(() => {
    saveWorkspace(items);
  }, [items]);
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(
    new Set(["root"]),
  );
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const handleSelectFolder = (id: string) => {
    setSelectedFolderId(id);
    setSelectedFileId(null);
  };
  const handleOpenFile = (id: string) => {
    setSelectedFileId(id);
  };
  const handleToggleFolder = (id: string) => {
    setExpandedFolderIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };
  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
      <aside className="w-72 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-4">
          <h1 className="text-lg font-semibold">Workspace Explorer</h1>

          <p className="mt-1 text-sm text-slate-500">Mini Workspace</p>
        </div>

        <div className="p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Explorer
          </p>

          <FileTree
            items={items}
            selectedFolderId={selectedFolderId}
            expandedFolderIds={expandedFolderIds}
            onSelectFolder={handleSelectFolder}
            onOpenFile={handleOpenFile}
            onToggleFolder={handleToggleFolder}
          />
        </div>
      </aside>

      <main className="flex-1 p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Workspace</h2>

          <p className="mt-2 text-sm text-slate-500">
            Select a file or folder from the explorer.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
