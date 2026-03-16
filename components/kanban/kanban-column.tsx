"use client";

import type { Column, Card } from "@/lib/types";

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
}

export default function KanbanColumn({ column, cards }: KanbanColumnProps) {
  return (
    <div
      data-testid={`column-${column.title}`}
      className="flex min-w-72 flex-1 flex-col gap-3 rounded-lg bg-muted/50 p-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{column.title}</h2>
        <span className="text-xs text-muted-foreground">{cards.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {cards.map((card) => (
          <div key={card.id} data-testid={`card-${card.id}`} className="rounded-md border bg-card p-3 shadow-sm">
            <span className="text-sm">{card.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
