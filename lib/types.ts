export type Priority = "High" | "Medium" | "Low" | "None";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  subtasks: Subtask[];
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface BoardState {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

export const COLUMN_DEFINITIONS = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
] as const;
