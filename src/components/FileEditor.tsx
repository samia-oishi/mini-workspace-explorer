import { useEffect, useState } from "react";
import type { WorkspaceItem } from "../types/workspace";
import {
  FileText,
  Save,
  RotateCcw,
  Trash2,
} from "lucide-react";

interface FileEditorProps {
  file: WorkspaceItem;
  onSave: (fileId: string, content: string) => void;
  onUnsavedChange: (hasUnsavedChanges: boolean) => void;
  onDeleteItem: (itemId: string) => void;
}

function FileEditor({
  file,
  onSave,
  onUnsavedChange,
  onDeleteItem,
}: FileEditorProps) {
  const [content, setContent] = useState(
    file.content ?? "",
  );

  const originalContent = file.content ?? "";

  const hasUnsavedChanges =
    content !== originalContent;

  useEffect(() => {
    onUnsavedChange(hasUnsavedChanges);
  }, [
    hasUnsavedChanges,
    onUnsavedChange,
  ]);

  const handleSave = () => {
    onSave(file.id, content);
    onUnsavedChange(false);
  };

  const handleDiscard = () => {
    setContent(originalContent);
    onUnsavedChange(false);
  };

  const handleDelete = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to delete this file?",
      );

      if (!confirmed) {
        return;
      }
    }

    onDeleteItem(file.id);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <FileText
            size={20}
            className="shrink-0 text-blue-500"
          />

          <h2 className="truncate text-xl font-semibold text-slate-900">
            {file.name}
          </h2>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!hasUnsavedChanges}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={16} />
            Discard
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={16} />
            Save
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
        }}
        className="mt-5 min-h-80 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 font-mono text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 md:mt-6 md:p-4"
        placeholder="Start writing..."
      />
    </div>
  );
}

export default FileEditor;