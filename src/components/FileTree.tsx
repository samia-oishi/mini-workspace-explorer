import type { WorkspaceItem } from "../types/workspace";
import FileTreeItem from "./FileTreeItem";

interface FileTreeProps {
  items: WorkspaceItem[];
  selectedFolderId: string | null;
  expandedFolderIds: Set<string>;
  onSelectFolder: (id: string) => void;
  onOpenFile: (id: string) => void;
  onToggleFolder: (id: string) => void;
}

function FileTree({
  items,
  selectedFolderId,
  expandedFolderIds,
  onSelectFolder,
  onOpenFile,
  onToggleFolder,
}: FileTreeProps) {
  const rootFolder = items.find(
    (item) => item.id === "root",
  );

  if (!rootFolder) {
    return null;
  }

  return (
    <div className="min-w-0 space-y-1 overflow-hidden">
      <FileTreeItem
        item={rootFolder}
        items={items}
        level={0}
        selectedFolderId={selectedFolderId}
        expandedFolderIds={expandedFolderIds}
        onSelectFolder={onSelectFolder}
        onOpenFile={onOpenFile}
        onToggleFolder={onToggleFolder}
      />
    </div>
  );
}

export default FileTree;