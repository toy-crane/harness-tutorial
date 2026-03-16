"use client";

import { KanbanBoard } from "./kanban-board";

export default function KanbanPage() {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Kanban Board</h1>
      <KanbanBoard />
    </main>
  );
}
