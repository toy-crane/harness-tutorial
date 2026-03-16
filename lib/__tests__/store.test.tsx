import { describe, it, expect, beforeEach } from "vitest";
import { useKanbanStore } from "@/lib/store";

describe("Kanban Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useKanbanStore.getState().reset();
  });

  describe("초기 상태", () => {
    it("3개 칼럼 (todo, in-progress, done)이 존재하고 cardIds가 빈 배열", () => {
      const { columns, columnOrder } = useKanbanStore.getState();
      expect(columnOrder).toEqual(["todo", "in-progress", "done"]);
      expect(columns["todo"].title).toBe("Todo");
      expect(columns["in-progress"].title).toBe("In Progress");
      expect(columns["done"].title).toBe("Done");
      expect(columns["todo"].cardIds).toEqual([]);
      expect(columns["in-progress"].cardIds).toEqual([]);
      expect(columns["done"].cardIds).toEqual([]);
    });

    it("cards가 빈 객체", () => {
      expect(useKanbanStore.getState().cards).toEqual({});
    });
  });

  describe("addCard", () => {
    it("Todo 칼럼에 카드를 추가하면 cards와 todo cardIds에 반영", () => {
      const id = useKanbanStore.getState().addCard("Todo", "회의록 작성");
      const { cards, columns } = useKanbanStore.getState();

      expect(cards[id]).toBeDefined();
      expect(cards[id].title).toBe("회의록 작성");
      expect(cards[id].columnId).toBe("todo");
      expect(cards[id].priority).toBe("None");
      expect(cards[id].tags).toEqual([]);
      expect(cards[id].subtasks).toEqual([]);
      expect(columns["todo"].cardIds).toContain(id);
    });

    it("빈 제목이면 에러 throw, cards 변경 없음", () => {
      expect(() => useKanbanStore.getState().addCard("Todo", "")).toThrow("제목을 입력해주세요");
      expect(Object.keys(useKanbanStore.getState().cards)).toHaveLength(0);
    });

    it("공백만 있는 제목도 에러 throw", () => {
      expect(() => useKanbanStore.getState().addCard("Todo", "   ")).toThrow("제목을 입력해주세요");
    });
  });

  describe("updateCard", () => {
    it("카드 제목을 업데이트", () => {
      const id = useKanbanStore.getState().addCard("Todo", "원래 제목");
      useKanbanStore.getState().updateCard(id, { title: "새 제목" });
      expect(useKanbanStore.getState().cards[id].title).toBe("새 제목");
    });

    it("우선순위를 업데이트", () => {
      const id = useKanbanStore.getState().addCard("Todo", "작업");
      useKanbanStore.getState().updateCard(id, { priority: "High" });
      expect(useKanbanStore.getState().cards[id].priority).toBe("High");
    });

    it("태그를 업데이트", () => {
      const id = useKanbanStore.getState().addCard("Todo", "작업");
      useKanbanStore.getState().updateCard(id, { tags: ["긴급", "중요"] });
      expect(useKanbanStore.getState().cards[id].tags).toEqual(["긴급", "중요"]);
    });
  });

  describe("deleteCard", () => {
    it("카드를 삭제하면 cards와 칼럼 cardIds에서 제거", () => {
      const id = useKanbanStore.getState().addCard("Todo", "삭제할 카드");
      useKanbanStore.getState().deleteCard(id);
      const { cards, columns } = useKanbanStore.getState();

      expect(cards[id]).toBeUndefined();
      expect(columns["todo"].cardIds).not.toContain(id);
    });
  });

  describe("moveCard", () => {
    it("칼럼 간 이동", () => {
      const id = useKanbanStore.getState().addCard("Todo", "이동 카드");
      useKanbanStore.getState().moveCard(id, "todo", "in-progress", 0);

      const { cards, columns } = useKanbanStore.getState();
      expect(columns["todo"].cardIds).not.toContain(id);
      expect(columns["in-progress"].cardIds).toContain(id);
      expect(cards[id].columnId).toBe("in-progress");
    });

    it("같은 칼럼 내 순서 변경", () => {
      const id1 = useKanbanStore.getState().addCard("Todo", "카드A");
      const id2 = useKanbanStore.getState().addCard("Todo", "카드B");
      const id3 = useKanbanStore.getState().addCard("Todo", "카드C");

      useKanbanStore.getState().moveCard(id3, "todo", "todo", 0);

      const cardIds = useKanbanStore.getState().columns["todo"].cardIds;
      expect(cardIds).toEqual([id3, id1, id2]);
    });
  });

  describe("subtasks", () => {
    it("서브태스크 추가", () => {
      const cardId = useKanbanStore.getState().addCard("Todo", "작업");
      useKanbanStore.getState().addSubtask(cardId, "자료 준비");

      const subtasks = useKanbanStore.getState().cards[cardId].subtasks;
      expect(subtasks).toHaveLength(1);
      expect(subtasks[0].title).toBe("자료 준비");
      expect(subtasks[0].completed).toBe(false);
    });

    it("서브태스크 토글", () => {
      const cardId = useKanbanStore.getState().addCard("Todo", "작업");
      const subtaskId = useKanbanStore.getState().addSubtask(cardId, "자료 준비");
      useKanbanStore.getState().toggleSubtask(cardId, subtaskId);

      expect(useKanbanStore.getState().cards[cardId].subtasks[0].completed).toBe(true);
    });

    it("서브태스크 삭제", () => {
      const cardId = useKanbanStore.getState().addCard("Todo", "작업");
      const subtaskId = useKanbanStore.getState().addSubtask(cardId, "자료 준비");
      useKanbanStore.getState().deleteSubtask(cardId, subtaskId);

      expect(useKanbanStore.getState().cards[cardId].subtasks).toHaveLength(0);
    });
  });

  describe("exportData / importData", () => {
    it("내보내기 후 가져오기하면 데이터 일치", () => {
      useKanbanStore.getState().addCard("Todo", "카드1");
      useKanbanStore.getState().addCard("In Progress", "카드2");
      const exported = useKanbanStore.getState().exportData();

      useKanbanStore.getState().reset();
      useKanbanStore.getState().importData(exported);

      const cards = Object.values(useKanbanStore.getState().cards);
      expect(cards).toHaveLength(2);
    });

    it("잘못된 JSON이면 에러 throw", () => {
      expect(() => useKanbanStore.getState().importData("invalid")).toThrow("올바른 형식이 아닙니다");
    });

    it("필수 필드가 없으면 에러 throw", () => {
      expect(() => useKanbanStore.getState().importData(JSON.stringify({ foo: "bar" }))).toThrow("올바른 형식이 아닙니다");
    });
  });
});
