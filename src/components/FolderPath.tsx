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
    <div className="overflow-x-auto">
      <div className="flex w-max min-w-full items-center gap-2 text-sm">
        {path.map((folder, index) => (
          <div
            key={folder.id}
            className="flex shrink-0 items-center gap-2"
          >
            {index > 0 && (
              <span className="text-slate-400">
                /
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                onNavigate(folder.id)
              }
              className="max-w-40 truncate rounded px-1 py-0.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 sm:max-w-none"
            >
              {folder.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FolderPath;