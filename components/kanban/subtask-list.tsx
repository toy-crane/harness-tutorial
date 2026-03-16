"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useKanbanStore } from "@/lib/store";
import type { Subtask } from "@/lib/types";

interface SubtaskListProps {
  cardId: string;
  subtasks: Subtask[];
}

export default function SubtaskList({ cardId, subtasks }: SubtaskListProps) {
  const [newSubtask, setNewSubtask] = useState("");
  const addSubtask = useKanbanStore((s) => s.addSubtask);
  const toggleSubtask = useKanbanStore((s) => s.toggleSubtask);
  const deleteSubtask = useKanbanStore((s) => s.deleteSubtask);

  const completedCount = subtasks.filter((s) => s.completed).length;

  function handleAdd() {
    const trimmed = newSubtask.trim();
    if (trimmed) {
      addSubtask(cardId, trimmed);
      setNewSubtask("");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">서브태스크</span>
        {subtasks.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {completedCount}/{subtasks.length}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            data-testid={`subtask-${subtask.id}`}
            className="flex items-center gap-2"
          >
            <Checkbox
              checked={subtask.completed}
              onCheckedChange={() => toggleSubtask(cardId, subtask.id)}
            />
            <span className={subtask.completed ? "flex-1 text-sm line-through text-muted-foreground" : "flex-1 text-sm"}>
              {subtask.title}
            </span>
            <Button
              variant="ghost"
              size="sm"
              aria-label="서브태스크 삭제"
              onClick={() => deleteSubtask(cardId, subtask.id)}
            >
              ×
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="서브태스크를 입력하세요"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button size="sm" onClick={handleAdd}>
          추가
        </Button>
      </div>
    </div>
  );
}
