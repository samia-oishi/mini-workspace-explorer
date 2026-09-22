import type { WorkspaceItem } from "../types/workspace";

export function getChildren(
  items: WorkspaceItem[],
  parentId: string
): WorkspaceItem[] {
  return items.filter((item) => item.parentId === parentId);
}

export function getItemById(
  items: WorkspaceItem[],
  id: string
): WorkspaceItem | undefined {
  return items.find((item) => item.id === id);
}

export function getNestedItemIds(
  items: WorkspaceItem[],
  parentId: string
): string[] {
  const children = getChildren(items, parentId);

  let nestedItemIds: string[] = [];

  for (const child of children) {
    nestedItemIds.push(child.id);

    if (child.type === "folder") {
      nestedItemIds = [
        ...nestedItemIds,
        ...getNestedItemIds(items, child.id),
      ];
    }
  }

  return nestedItemIds;
}

export function deleteItemAndNestedItems(
  items: WorkspaceItem[],
  itemId: string
): WorkspaceItem[] {
  const nestedItemIds = getNestedItemIds(items, itemId);

  const idsToDelete = new Set([
    itemId,
    ...nestedItemIds,
  ]);

  return items.filter(
    (item) => !idsToDelete.has(item.id)
  );
}

export function getFolderPath(
  items: WorkspaceItem[],
  folderId: string
): WorkspaceItem[] {
  const path: WorkspaceItem[] = [];

  let current = getItemById(items, folderId);

  while (current) {
    path.unshift(current);

    if (current.parentId === null) {
      break;
    }

    current = getItemById(items, current.parentId);
  }

  return path;
}

export function createId(): string {
  return crypto.randomUUID();
}