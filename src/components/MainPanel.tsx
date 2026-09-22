import type { WorkspaceItem } from "../types/workspace";
import { getChildren } from "../utils/workspace";
import { FileText, Folder, FilePlus, Pencil, Trash2 } from "lucide-react";
import FolderPath from "./FolderPath";
import FileEditor from "./FileEditor";

interface MainPanelProps {
  items: WorkspaceItem[];
  selectedFolderId: string;
  selectedFileId: string | null;
  onNavigate: (id: string) => void;
  onCreateFolder: () => void;
  onCreateFile: () => void;
  onRenameItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenFile: (id: string) => void;
  onSaveFile: (fileId: string, content: string) => void;
}

function MainPanel({
  items,
  selectedFolderId,
  selectedFileId,
  onNavigate,
  onCreateFolder,
  onCreateFile,
  onRenameItem,
  onDeleteItem,
  onOpenFile,
  onSaveFile,
}: MainPanelProps) {
  const selectedFolder = items.find((item) => item.id === selectedFolderId);

  const selectedFile = selectedFileId
    ? items.find((item) => item.id === selectedFileId)
    : null;

  if (!selectedFolder) {
    return null;
  }

  if (selectedFile) {
    return (
      <main className="flex-1 overflow-auto p-6">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <FileEditor
            key={selectedFile.id}
            file={selectedFile}
            onSave={onSaveFile}
          />
        </div>
      </main>
    );
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
                  onClick={() => {
                    if (child.type === "folder") {
                      onNavigate(child.id);
                    } else {
                      onOpenFile(child.id);
                    }
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="text-slate-500">
                      {child.type === "folder" ? (
                        <Folder size={18} />
                      ) : (
                        <FileText size={18} />
                      )}
                    </span>

                    <span className="truncate text-sm font-medium text-slate-700">
                      {child.name}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRenameItem(child.id);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      title="Rename"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteItem(child.id);
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
