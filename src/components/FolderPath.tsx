import type { WorkspaceItem } from "../types/workspace";
import { getFolderPath } from "../utils/workspace";

interface FolderPathProps {
  items: WorkspaceItem[];
  folderId: string;
  onNavigate: (id: string) => void;
}

function FolderPath({
  items,
  folderId,
  onNavigate,
}: FolderPathProps) {
  const path = getFolderPath(items, folderId);

  return (
    <div className="flex items-center gap-2 text-sm">
      {path.map((folder, index) => (
        <div
          key={folder.id}
          className="flex items-center gap-2"
        >
          {index > 0 && (
            <span className="text-slate-400">
              /
            </span>
          )}

          <button
            type="button"
            onClick={() => onNavigate(folder.id)}
            className="rounded px-1 py-0.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            {folder.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default FolderPath;