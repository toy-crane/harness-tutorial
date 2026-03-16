import { create } from "zustand";

export type Priority = "상" | "중" | "하";
export type ColumnId = "todo" | "in-progress" | "done";

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  tags: string[];
  dueDate: string;
}

export interface KanbanState {
  cards: Record<string, Card>;
  columns: Record<ColumnId, string[]>;
  addCard: (title: string, column: ColumnId) => string;
  updateCard: (id: string, updates: Partial<Omit<Card, "id">>) => void;
  deleteCard: (id: string, column: ColumnId) => void;
  moveCard: (cardId: string, from: ColumnId, to: ColumnId) => void;
  reorderCard: (column: ColumnId, cardId: string, newIndex: number) => void;
  importData: (data: { cards: Record<string, Card>; columns: Record<ColumnId, string[]> }) => void;
  reset: () => void;
}

const initialState = {
  cards: {} as Record<string, Card>,
  columns: {
    todo: [] as string[],
    "in-progress": [] as string[],
    done: [] as string[],
  },
};

export const useKanbanStore = create<KanbanState>()((set) => ({
  ...initialState,
  addCard: () => "",
  updateCard: () => {},
  deleteCard: () => {},
  moveCard: () => {},
  reorderCard: () => {},
  importData: () => {},
  reset: () => set({ ...structuredClone(initialState) }),
}));
