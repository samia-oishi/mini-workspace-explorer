export type ItemType = "folder" | "file";

export interface WorkspaceItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null;
  content?: string;
}