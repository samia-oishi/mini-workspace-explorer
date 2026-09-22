import type { WorkspaceItem } from "../types/workspace";

const STORAGE_KEY = "mini-workspace-items";

export function loadWorkspace(): WorkspaceItem[] | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return null;
    }

    return parsed as WorkspaceItem[];
  } catch {
    return null;
  }
}

export function saveWorkspace(
  items: WorkspaceItem[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(items),
  );
}

export function clearWorkspace(): void {
  localStorage.removeItem(STORAGE_KEY);
}