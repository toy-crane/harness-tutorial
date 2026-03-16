"use client";

import { useState, useRef, useEffect } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KanbanCard } from "./kanban-card";
import { useKanbanStore, type ColumnId } from "./store";

const COLUMN_NAMES: Record<ColumnId, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

interface KanbanColumnProps {
  columnId: ColumnId;
  cardIds: string[];
  editingCardId: string | null;
  onCardEdit: (cardId: string) => void;
  onCardEditEnd: () => void;
  onDeleteRequest: (cardId: string, columnId: ColumnId) => void;
}

export function KanbanColumn({ columnId, cardIds, editingCardId, onCardEdit, onCardEditEnd, onDeleteRequest }: KanbanColumnProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const cards = useKanbanStore((s) => s.cards);
  const addCard = useKanbanStore((s) => s.addCard);
  const moveCard = useKanbanStore((s) => s.moveCard);
  const reorderCard = useKanbanStore((s) => s.reorderCard);
  const columnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = columnRef.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      getData: () => ({ columnId }),
      canDrop: ({ source }) => source.data.type === "card",
      onDragEnter: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: ({ source }) => {
        setIsDragOver(false);
        const cardId = source.data.cardId as string;
        const fromColumn = source.data.columnId as ColumnId;
        if (fromColumn === columnId) return;
        moveCard(cardId, fromColumn, columnId);
      },
    });
  }, [columnId, moveCard]);

  const handleAdd = () => {
    if (!title.trim()) {
      setError("제목을 입력해주세요");
      return;
    }
    addCard(title.trim(), columnId);
    setTitle("");
    setError("");
  };

  return (
    <div
      ref={columnRef}
      data-testid={`column-${columnId}`}
      className={`flex flex-col gap-3 rounded-lg p-3 ${isDragOver ? "bg-accent" : "bg-muted/30"}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{COLUMN_NAMES[columnId]}</h2>
        <Badge variant="secondary">{cardIds.length}</Badge>
      </div>
      <div className="flex min-h-[100px] flex-col gap-2">
        {cardIds.map((id, index) => {
          const card = cards[id];
          if (!card) return null;
          return (
            <KanbanCard
              key={id}
              card={card}
              column={columnId}
              index={index}
              isEditing={editingCardId === id}
              onEdit={() => onCardEdit(id)}
              onEditEnd={onCardEditEnd}
              onDelete={() => onDeleteRequest(id, columnId)}
              onReorder={(cardId, newIndex) => reorderCard(columnId, cardId, newIndex)}
            />
          );
        })}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="카드 제목 입력"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <Button onClick={handleAdd}>추가</Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
