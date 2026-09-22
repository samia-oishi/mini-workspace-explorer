import type { WorkspaceItem } from "../types/workspace";
import { FileText } from "lucide-react";

interface FileEditorProps {
  file: WorkspaceItem;
}

function FileEditor({ file }: FileEditorProps) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2">
        <FileText
          size={20}
          className="text-slate-500"
        />

        <h2 className="text-xl font-semibold text-slate-900">
          {file.name}
        </h2>
      </div>

      <textarea
        value={file.content ?? ""}
        readOnly
        className="mt-6 min-h-80 w-full resize-y rounded-lg border border-slate-300 bg-white p-4 font-mono text-sm text-slate-800 outline-none focus:border-slate-400"
      />
    </div>
  );
}

export default FileEditor;