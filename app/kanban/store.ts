import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

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

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set) => ({
      ...structuredClone(initialState),

      addCard: (title, column) => {
        const id = nanoid();
        const card: Card = {
          id,
          title,
          description: "",
          priority: "중",
          tags: [],
          dueDate: "",
        };
        set((state) => ({
          cards: { ...state.cards, [id]: card },
          columns: {
            ...state.columns,
            [column]: [...state.columns[column], id],
          },
        }));
        return id;
      },

      updateCard: (id, updates) => {
        set((state) => ({
          cards: {
            ...state.cards,
            [id]: { ...state.cards[id], ...updates },
          },
        }));
      },

      deleteCard: (id, column) => {
        set((state) => {
          const { [id]: _, ...remainingCards } = state.cards;
          return {
            cards: remainingCards,
            columns: {
              ...state.columns,
              [column]: state.columns[column].filter((cId) => cId !== id),
            },
          };
        });
      },

      moveCard: (cardId, from, to) => {
        set((state) => ({
          columns: {
            ...state.columns,
            [from]: state.columns[from].filter((id) => id !== cardId),
            [to]: [...state.columns[to], cardId],
          },
        }));
      },

      reorderCard: (column, cardId, newIndex) => {
        set((state) => {
          const list = state.columns[column].filter((id) => id !== cardId);
          list.splice(newIndex, 0, cardId);
          return {
            columns: { ...state.columns, [column]: list },
          };
        });
      },

      importData: (data) => {
        set({ cards: data.cards, columns: data.columns });
      },

      reset: () => set({ ...structuredClone(initialState) }),
    }),
    { name: "kanban-storage" }
  )
);
