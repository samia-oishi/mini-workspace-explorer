import { useState } from "react";
import type { WorkspaceItem } from "../types/workspace";
import {
  FileText,
  Save,
  RotateCcw,
} from "lucide-react";

interface FileEditorProps {
  file: WorkspaceItem;
  onSave: (fileId: string, content: string) => void;
}

function FileEditor({
  file,
  onSave,
}: FileEditorProps) {
  const [content, setContent] = useState(
    file.content ?? "",
  );

  const handleSave = () => {
    onSave(file.id, content);
  };

  const handleDiscard = () => {
    setContent(file.content ?? "");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText
            size={20}
            className="text-slate-500"
          />

          <h2 className="text-xl font-semibold text-slate-900">
            {file.name}
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDiscard}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            Discard
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
        }}
        className="mt-6 min-h-80 w-full resize-y rounded-lg border border-slate-300 bg-white p-4 font-mono text-sm text-slate-800 outline-none focus:border-slate-400"
        placeholder="Start writing..."
      />
    </div>
  );
}

export default FileEditor;