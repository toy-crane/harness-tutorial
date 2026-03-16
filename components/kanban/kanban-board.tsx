"use client";

import { useKanbanStore } from "@/lib/store";
import KanbanColumn from "./kanban-column";

export default function KanbanBoard() {
  const columns = useKanbanStore((s) => s.columns);
  const columnOrder = useKanbanStore((s) => s.columnOrder);
  const cards = useKanbanStore((s) => s.cards);

  return (
    <div className="flex gap-4 overflow-x-auto p-6">
      {columnOrder.map((colId) => {
        const column = columns[colId];
        const columnCards = column.cardIds.map((id) => cards[id]).filter(Boolean);
        return (
          <KanbanColumn key={colId} column={column} cards={columnCards} />
        );
      })}
    </div>
  );
}
