import type { WorkspaceItem } from "../types/workspace";
import { getChildren } from "../utils/workspace";
import { FileText, Folder, FilePlus } from "lucide-react";
import FolderPath from "./FolderPath";

interface MainPanelProps {
  items: WorkspaceItem[];
  selectedFolderId: string;
  onNavigate: (id: string) => void;
  onCreateFolder: () => void;
  onCreateFile: () => void;
}
function MainPanel({
  items,
  selectedFolderId,
  onNavigate,
  onCreateFolder,
  onCreateFile,
}: MainPanelProps) {
  const selectedFolder = items.find((item) => item.id === selectedFolderId);

  if (!selectedFolder) {
    return null;
  }

  const children = getChildren(items, selectedFolderId);

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <FolderPath
            items={items}
            folderId={selectedFolderId}
            onNavigate={onNavigate}
          />
        </div>

        <div className="p-6">
          <h2 className="text-xl font-semibold text-slate-900">
            {selectedFolder.name}
          </h2>
          <div className="mt-4 flex gap-2">
  <button
    type="button"
    onClick={onCreateFolder}
    className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
  >
    <Folder size={16} />
    New Folder
  </button>

  <button
    type="button"
    onClick={onCreateFile}
    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
  >
    <FilePlus size={16} />
    New File
  </button>
</div>

          <div className="mt-6 space-y-2">
            {children.length === 0 ? (
              <p className="text-sm text-slate-500">This folder is empty.</p>
            ) : (
              children.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50"
                >
                  <span className="text-slate-500">
                    {child.type === "folder" ? (
                      <Folder size={18} />
                    ) : (
                      <FileText size={18} />
                    )}
                  </span>

                  <span className="text-sm font-medium text-slate-700">
                    {child.name}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default MainPanel;
