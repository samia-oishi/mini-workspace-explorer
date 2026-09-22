import type { WorkspaceItem } from "../types/workspace";
import { getChildren } from "../utils/workspace";
import {
  FileText,
  Folder,
  FilePlus,
  Pencil,
  Trash2,
} from "lucide-react";
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
  onUnsavedChange: (hasUnsavedChanges: boolean) => void;
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
  onUnsavedChange,
}: MainPanelProps) {
  const selectedFolder = items.find(
    (item) => item.id === selectedFolderId,
  );

  const selectedFile = selectedFileId
    ? items.find(
        (item) => item.id === selectedFileId,
      )
    : null;

  if (!selectedFolder) {
    return null;
  }

  if (selectedFile) {
    return (
      <main className="min-w-0 flex-1 overflow-auto p-4 md:p-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <FileEditor
            key={selectedFile.id}
            file={selectedFile}
            onSave={onSaveFile}
            onUnsavedChange={onUnsavedChange}
            onDeleteItem={onDeleteItem}
          />
        </div>
      </main>
    );
  }

  const children = getChildren(
    items,
    selectedFolderId,
  );

  const isRootFolder =
    selectedFolder.id === "root";

  return (
    <main className="min-w-0 flex-1 overflow-auto p-4 md:p-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4 md:px-6">
          <FolderPath
            items={items}
            folderId={selectedFolderId}
            onNavigate={onNavigate}
          />
        </div>

        <div className="p-4 md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <Folder
                  size={22}
                  className="shrink-0 text-amber-600"
                />

                <h2 className="truncate text-2xl font-semibold tracking-tight text-slate-900">
                  {selectedFolder.name}
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {children.length}{" "}
                {children.length === 1
                  ? "item"
                  : "items"}
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              {!isRootFolder && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      onRenameItem(
                        selectedFolder.id,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil size={16} />
                    Rename
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDeleteItem(
                        selectedFolder.id,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={onCreateFolder}
                className="inline-flex items-center gap-2 rounded-md bg-blue-900/90 px-3 py-2 text-sm font-medium text-white hover:bg-blue-900"
              >
                <Folder size={16} />
                New Folder
              </button>

              <button
                type="button"
                onClick={onCreateFile}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
              >
                <FilePlus size={16} />
                New File
              </button>
            </div>
          </div>

          {children.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Folder size={24} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                This folder is empty
              </h3>

              <p className="mt-1 max-w-sm text-sm text-slate-500">
                Create a folder or text file to
                get started.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-2">
              {children.map((child) => (
                <div
                  key={child.id}
                  onClick={() => {
                    if (child.type === "folder") {
                      onNavigate(child.id);
                    } else {
                      onOpenFile(child.id);
                    }
                  }}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-3 hover:bg-slate-50 md:px-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={
                        child.type === "folder"
                          ? "shrink-0 text-amber-600"
                          : "shrink-0 text-blue-400"
                      }
                    >
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
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default MainPanel;