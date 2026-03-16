"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useKanbanStore } from "@/lib/store";

export default function ExportImport() {
  const exportData = useKanbanStore((s) => s.exportData);
  const importData = useKanbanStore((s) => s.importData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function handleExport() {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "kanban-board.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      importData(text);
    } catch {
      setError("올바른 형식이 아닙니다");
    }

    // Reset input so the same file can be re-imported
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleExport}>
        내보내기
      </Button>
      <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
        가져오기
      </Button>
      <input
        ref={fileInputRef}
        data-testid="import-file-input"
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
