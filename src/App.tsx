import { useEffect, useState } from "react";
import type { WorkspaceItem } from "./types/workspace";
import MainPanel from "./components/MainPanel";
import {
  createId,
  deleteItemAndNestedItems,
} from "./utils/workspace";
import {
  loadWorkspace,
  saveWorkspace,
} from "./utils/storage";
import SideBar from "./components/SideBar";

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

  const [items, setItems] = useState<WorkspaceItem[]>(
    () => loadWorkspace() ?? initialWorkspace,
  );

  const [selectedFolderId, setSelectedFolderId] =
    useState("root");

  const [expandedFolderIds, setExpandedFolderIds] =
    useState<Set<string>>(
      new Set(["root"]),
    );

  const [selectedFileId, setSelectedFileId] =
    useState<string | null>(null);

  useEffect(() => {
    saveWorkspace(items);
  }, [items]);

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

  const handleNavigate = (id: string) => {
    setSelectedFolderId(id);
    setSelectedFileId(null);
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
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900">
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
      />
    </div>
  );
}

export default App;