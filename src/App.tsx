import { useEffect, useState } from "react";
import type { WorkspaceItem } from "./types/workspace";
import MainPanel from "./components/MainPanel";
import SideBar from "./components/SideBar";
import {
  Menu,
  X,
} from "lucide-react";
import {
  createId,
  deleteItemAndNestedItems,
} from "./utils/workspace";
import {
  loadWorkspace,
  saveWorkspace,
} from "./utils/storage";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] =
  useState(false);

  const [items, setItems] = useState<WorkspaceItem[]>(
  () => {
    const storedWorkspace = loadWorkspace();

    if (
      storedWorkspace &&
      storedWorkspace.some(
        (item) => item.id === "root",
      )
    ) {
      return storedWorkspace;
    }

    return initialWorkspace;
  },
);

  const [selectedFolderId, setSelectedFolderId] =
    useState("root");

  const [expandedFolderIds, setExpandedFolderIds] =
    useState<Set<string>>(
      new Set(["root"]),
    );

  const [selectedFileId, setSelectedFileId] =
    useState<string | null>(null);

  const [hasUnsavedChanges, setHasUnsavedChanges] =
    useState(false);

  useEffect(() => {
    saveWorkspace(items);
  }, [items]);

  const canLeaveFile = () => {
    if (!hasUnsavedChanges) {
      return true;
    }

    return window.confirm(
      "You have unsaved changes. Are you sure you want to leave?",
    );
  };

const handleSelectFolder = (id: string) => {
  if (!canLeaveFile()) {
    return;
  }

  setSelectedFolderId(id);
  setSelectedFileId(null);
  setHasUnsavedChanges(false);
  setIsSidebarOpen(false);
};

const handleOpenFile = (id: string) => {
  if (selectedFileId === id) {
    return;
  }

  if (!canLeaveFile()) {
    return;
  }

  setSelectedFileId(id);
  setHasUnsavedChanges(false);
  setIsSidebarOpen(false);
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

  const handleNavigate = (id: string) => {
    if (!canLeaveFile()) {
      return;
    }

    setSelectedFolderId(id);
    setSelectedFileId(null);
    setHasUnsavedChanges(false);
  };

  const handleCreateFolder = () => {
    const name = window.prompt(
      "Enter folder name:",
    );

    if (!name) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const nameAlreadyExists = items.some(
      (item) =>
        item.parentId === selectedFolderId &&
        item.name.trim().toLowerCase() ===
          trimmedName.toLowerCase(),
    );

    if (nameAlreadyExists) {
      window.alert(
        "An item with this name already exists in this folder.",
      );
      return;
    }

    const newFolder: WorkspaceItem = {
      id: createId(),
      name: trimmedName,
      type: "folder",
      parentId: selectedFolderId,
    };

    setItems((currentItems) => [
      ...currentItems,
      newFolder,
    ]);
  };

  const handleCreateFile = () => {
    const name = window.prompt(
      "Enter file name:",
    );

    if (!name) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const nameAlreadyExists = items.some(
      (item) =>
        item.parentId === selectedFolderId &&
        item.name.trim().toLowerCase() ===
          trimmedName.toLowerCase(),
    );

    if (nameAlreadyExists) {
      window.alert(
        "An item with this name already exists in this folder.",
      );
      return;
    }

    const newFile: WorkspaceItem = {
      id: createId(),
      name: trimmedName,
      type: "file",
      parentId: selectedFolderId,
      content: "",
    };

    setItems((currentItems) => [
      ...currentItems,
      newFile,
    ]);
  };

  const handleRenameItem = (itemId: string) => {
    const item = items.find(
      (currentItem) =>
        currentItem.id === itemId,
    );

    if (!item) {
      return;
    }

    const name = window.prompt(
      "Enter new name:",
      item.name,
    );

    if (!name) {
      return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const nameAlreadyExists = items.some(
      (currentItem) =>
        currentItem.id !== itemId &&
        currentItem.parentId === item.parentId &&
        currentItem.name.trim().toLowerCase() ===
          trimmedName.toLowerCase(),
    );

    if (nameAlreadyExists) {
      window.alert(
        "An item with this name already exists in this folder.",
      );
      return;
    }

    setItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.id === itemId
          ? {
              ...currentItem,
              name: trimmedName,
            }
          : currentItem,
      ),
    );
  };

  const handleDeleteItem = (itemId: string) => {
    const item = items.find(
      (currentItem) =>
        currentItem.id === itemId,
    );

    if (!item) {
      return;
    }

    if (item.id === "root") {
      window.alert(
        "The root Workspace folder cannot be deleted.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete "${item.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setItems((currentItems) =>
      deleteItemAndNestedItems(
        currentItems,
        itemId,
      ),
    );

    if (selectedFolderId === itemId) {
      setSelectedFolderId(
        item.parentId ?? "root",
      );
    }

    if (selectedFileId === itemId) {
      setSelectedFileId(null);
      setHasUnsavedChanges(false);
    }
  };

  const handleSaveFile = (
    fileId: string,
    content: string,
  ) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === fileId
          ? {
              ...item,
              content,
            }
          : item,
      ),
    );

    setHasUnsavedChanges(false);
  };

return (
  <div className="min-h-screen bg-slate-100 text-slate-900">
    {/* Mobile Header */}
    <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden">
      <button
        type="button"
        onClick={() => setIsSidebarOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100"
        aria-label="Open sidebar"
      >
        <Menu size={22} />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-sm font-semibold text-slate-900">
          Workspace Explorer
        </h1>
      </div>
    </div>

    {/* Mobile Overlay */}
    {isSidebarOpen && (
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 md:hidden"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white transition-transform duration-200 md:static md:z-auto md:block md:w-72 md:translate-x-0 ${
        isSidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
      }`}
    >
      <div className="relative h-full">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>

        <SideBar
          items={items}
          selectedFolderId={selectedFolderId}
          expandedFolderIds={expandedFolderIds}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectFolder={handleSelectFolder}
          onOpenFile={handleOpenFile}
          onToggleFolder={handleToggleFolder}
        />
      </div>
    </div>

    <div className="min-w-0 md:flex">
      <MainPanel
        items={items}
        selectedFolderId={selectedFolderId}
        selectedFileId={selectedFileId}
        onNavigate={handleNavigate}
        onCreateFolder={handleCreateFolder}
        onCreateFile={handleCreateFile}
        onRenameItem={handleRenameItem}
        onDeleteItem={handleDeleteItem}
        onOpenFile={handleOpenFile}
        onSaveFile={handleSaveFile}
        onUnsavedChange={setHasUnsavedChanges}
      />
    </div>
  </div>
);
}

export default App;