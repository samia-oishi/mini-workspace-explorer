import type { WorkspaceItem } from "../types/workspace";
import { getChildren } from "../utils/workspace";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
} from "lucide-react";

interface FileTreeItemProps {
  item: WorkspaceItem;
  items: WorkspaceItem[];
  level: number;
  selectedFolderId: string | null;
  expandedFolderIds: Set<string>;
  onSelectFolder: (id: string) => void;
  onOpenFile: (id: string) => void;
  onToggleFolder: (id: string) => void;
}

function FileTreeItem({
  item,
  items,
  level,
  selectedFolderId,
  expandedFolderIds,
  onSelectFolder,
  onOpenFile,
  onToggleFolder,
}: FileTreeItemProps) {
  const isFolder = item.type === "folder";

  const isExpanded = expandedFolderIds.has(
    item.id,
  );

  const isSelected =
    selectedFolderId === item.id;

  const children = isFolder
    ? getChildren(items, item.id)
    : [];

  const handleClick = () => {
    if (isFolder) {
      onSelectFolder(item.id);
    } else {
      onOpenFile(item.id);
    }
  };

  return (
    <div className="min-w-0">
      <div
        onClick={handleClick}
        className={`flex min-w-0 cursor-pointer items-center gap-2 rounded-md py-1.5 pr-2 text-sm transition hover:bg-slate-100 ${
          isSelected
            ? "bg-slate-100 font-medium text-slate-900"
            : "text-slate-700"
        }`}
        style={{
          paddingLeft: `${level * 16 + 8}px`,
        }}
      >
        {isFolder ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleFolder(item.id);
            }}
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-500 hover:bg-slate-200"
          >
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}

        <span
          className={
            isFolder
              ? "shrink-0 text-amber-600"
              : "shrink-0 text-blue-400"
          }
        >
          {isFolder ? (
            <Folder size={18} />
          ) : (
            <FileText size={18} />
          )}
        </span>

        <span className="min-w-0 truncate">
          {item.name}
        </span>
      </div>

      {isFolder && isExpanded && (
        <div>
          {children.map((child) => (
            <FileTreeItem
              key={child.id}
              item={child}
              items={items}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              expandedFolderIds={expandedFolderIds}
              onSelectFolder={onSelectFolder}
              onOpenFile={onOpenFile}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FileTreeItem;