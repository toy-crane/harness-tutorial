import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { Card, Column, BoardState, Priority, Subtask } from "./types";
import { COLUMN_DEFINITIONS } from "./types";

function createInitialColumns(): Record<string, Column> {
  const columns: Record<string, Column> = {};
  for (const def of COLUMN_DEFINITIONS) {
    columns[def.id] = { id: def.id, title: def.title, cardIds: [] };
  }
  return columns;
}

function createInitialState(): BoardState {
  return {
    cards: {},
    columns: createInitialColumns(),
    columnOrder: COLUMN_DEFINITIONS.map((d) => d.id),
  };
}

/** Map column display title to column id */
const COLUMN_TITLE_TO_ID: Record<string, string> = {};
for (const def of COLUMN_DEFINITIONS) {
  COLUMN_TITLE_TO_ID[def.title] = def.id;
}

interface KanbanActions {
  reset: () => void;
  addCard: (columnTitle: string, title: string) => string;
  updateCard: (cardId: string, updates: Partial<Pick<Card, "title" | "description" | "priority" | "tags">>) => void;
  deleteCard: (cardId: string) => void;
  moveCard: (cardId: string, fromColumnId: string, toColumnId: string, toIndex: number) => void;
  addSubtask: (cardId: string, title: string) => string;
  toggleSubtask: (cardId: string, subtaskId: string) => void;
  deleteSubtask: (cardId: string, subtaskId: string) => void;
  exportData: () => string;
  importData: (json: string) => void;

  // Filter/search state
  searchQuery: string;
  priorityFilter: Priority | "All";
  tagFilter: string;
  setSearchQuery: (query: string) => void;
  setPriorityFilter: (priority: Priority | "All") => void;
  setTagFilter: (tag: string) => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

type KanbanStore = BoardState & KanbanActions;

const STORAGE_KEY = "v1-kanban-board";

export const useKanbanStore = create<KanbanStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      searchQuery: "",
      priorityFilter: "All",
      tagFilter: "",
      theme: "system",

      reset: () => set({ ...createInitialState(), searchQuery: "", priorityFilter: "All", tagFilter: "", theme: "system" }),

      addCard: (columnTitle: string, title: string): string => {
        const trimmed = title.trim();
        if (!trimmed) {
          throw new Error("제목을 입력해주세요");
        }

        const columnId = COLUMN_TITLE_TO_ID[columnTitle] ?? columnTitle;
        const id = nanoid();
        const card: Card = {
          id,
          title: trimmed,
          description: "",
          priority: "None",
          tags: [],
          subtasks: [],
          columnId,
        };

        set((state) => ({
          cards: { ...state.cards, [id]: card },
          columns: {
            ...state.columns,
            [columnId]: {
              ...state.columns[columnId],
              cardIds: [...state.columns[columnId].cardIds, id],
            },
          },
        }));

        return id;
      },

      updateCard: (cardId, updates) => {
        set((state) => {
          const card = state.cards[cardId];
          if (!card) return state;
          return {
            cards: { ...state.cards, [cardId]: { ...card, ...updates } },
          };
        });
      },

      deleteCard: (cardId) => {
        set((state) => {
          const card = state.cards[cardId];
          if (!card) return state;
          const { [cardId]: _, ...remainingCards } = state.cards;
          return {
            cards: remainingCards,
            columns: {
              ...state.columns,
              [card.columnId]: {
                ...state.columns[card.columnId],
                cardIds: state.columns[card.columnId].cardIds.filter((id) => id !== cardId),
              },
            },
          };
        });
      },

      moveCard: (cardId, fromColumnId, toColumnId, toIndex) => {
        set((state) => {
          const fromColumn = state.columns[fromColumnId];
          const toColumn = state.columns[toColumnId];
          if (!fromColumn || !toColumn) return state;

          const fromCardIds = fromColumn.cardIds.filter((id) => id !== cardId);

          let toCardIds: string[];
          if (fromColumnId === toColumnId) {
            toCardIds = [...fromCardIds];
            toCardIds.splice(toIndex, 0, cardId);
          } else {
            toCardIds = [...toColumn.cardIds];
            toCardIds.splice(toIndex, 0, cardId);
          }

          const card = state.cards[cardId];
          return {
            cards: card
              ? { ...state.cards, [cardId]: { ...card, columnId: toColumnId } }
              : state.cards,
            columns: {
              ...state.columns,
              [fromColumnId]: { ...fromColumn, cardIds: fromColumnId === toColumnId ? toCardIds : fromCardIds },
              ...(fromColumnId !== toColumnId
                ? { [toColumnId]: { ...toColumn, cardIds: toCardIds } }
                : {}),
            },
          };
        });
      },

      addSubtask: (cardId, title) => {
        const subtaskId = nanoid();
        const subtask: Subtask = { id: subtaskId, title, completed: false };
        set((state) => {
          const card = state.cards[cardId];
          if (!card) return state;
          return {
            cards: {
              ...state.cards,
              [cardId]: { ...card, subtasks: [...card.subtasks, subtask] },
            },
          };
        });
        return subtaskId;
      },

      toggleSubtask: (cardId, subtaskId) => {
        set((state) => {
          const card = state.cards[cardId];
          if (!card) return state;
          return {
            cards: {
              ...state.cards,
              [cardId]: {
                ...card,
                subtasks: card.subtasks.map((st) =>
                  st.id === subtaskId ? { ...st, completed: !st.completed } : st
                ),
              },
            },
          };
        });
      },

      deleteSubtask: (cardId, subtaskId) => {
        set((state) => {
          const card = state.cards[cardId];
          if (!card) return state;
          return {
            cards: {
              ...state.cards,
              [cardId]: {
                ...card,
                subtasks: card.subtasks.filter((st) => st.id !== subtaskId),
              },
            },
          };
        });
      },

      exportData: () => {
        const { cards, columns, columnOrder } = get();
        return JSON.stringify({ cards, columns, columnOrder });
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (!data.cards || !data.columns || !data.columnOrder) {
            throw new Error("올바른 형식이 아닙니다");
          }
          set({ cards: data.cards, columns: data.columns, columnOrder: data.columnOrder });
        } catch {
          throw new Error("올바른 형식이 아닙니다");
        }
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setPriorityFilter: (priority) => set({ priorityFilter: priority }),
      setTagFilter: (tag) => set({ tagFilter: tag }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        cards: state.cards,
        columns: state.columns,
        columnOrder: state.columnOrder,
        theme: state.theme,
      }),
    }
  )
);
