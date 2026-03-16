# Kanban Board 구현 계획

## Architecture Decisions

| 결정 사항 | 선택 | 사유 |
|-----------|------|------|
| 상태 관리 | zustand | 이미 설치됨. 보일러플레이트 적고 localStorage 미들웨어 내장 |
| 드래그&드롭 | @atlaskit/pragmatic-drag-and-drop | 이미 설치됨. 프레임워크 무관, 가볍고 접근성 우수 |
| 카드 상세 UI | Dialog (중앙 오버레이 모달) | Trello 스타일 UX, 사용자 선택 |
| 삭제 확인 | AlertDialog | 파괴적 액션에 적합한 시맨틱 컴포넌트 |
| ID 생성 | nanoid | 이미 설치됨. 가볍고 충돌 없는 고유 ID |

## Required Skills

| 스킬 | 용도 |
|------|------|
| vercel-react-best-practices | React 성능 최적화 규칙 준수 |
| web-design-guidelines | Web Interface Guidelines 준수 |
| shadcn | UI 컴포넌트 규칙 및 패턴 준수 |

## UI Components

### 설치 필요

| 컴포넌트 | 설치 명령 |
|----------|-----------|
| Dialog | `bunx --bun shadcn@latest add dialog` |
| Checkbox | `bunx --bun shadcn@latest add checkbox` |

### 커스텀 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| KanbanBoard | 3칼럼 레이아웃 + 검색/필터 헤더 |
| KanbanColumn | 단일 칼럼 (드롭 영역) |
| KanbanCard | 카드 UI (드래그 소스) |
| CardDetailModal | 카드 상세 편집 Dialog |
| SubtaskList | 서브태스크 체크리스트 |
| ThemeToggle | 다크모드 토글 버튼 |

## 실행 프로토콜

- 각 task 시작 전, **참조 규칙**에 나열된 파일을 반드시 읽고 규칙을 준수하며 구현한다

## Tasks

### Task 0: shadcn 컴포넌트 설치

- **시나리오**: 전체 (선행 작업)
- **참조 규칙**: `.claude/skills/shadcn/SKILL.md`
- **구현 대상**: Dialog, Checkbox 컴포넌트가 `components/ui/`에 설치됨
- **수용 기준**:
  - [ ] `bunx --bun shadcn@latest add dialog checkbox` 실행 → 에러 없이 완료
  - [ ] `components/ui/dialog.tsx`, `components/ui/checkbox.tsx` 파일 존재
- **커밋**: `chore: add dialog, checkbox shadcn components`

---

### Task 1: spec 테스트 생성

- **시나리오**: KANBAN-001 ~ KANBAN-029
- **참조 규칙**: `artifacts/spec.yaml`, `artifacts/kanban/spec.md`
- **구현 대상**: `__tests__/kanban.spec.test.tsx` — spec.yaml의 모든 시나리오를 커버하는 수용 기준 테스트
- **수용 기준**:
  - [ ] `bun test kanban.spec` 실행 → 29개 테스트 케이스 존재 (모두 실패 — Red)
  - [ ] 각 테스트가 spec.yaml의 시나리오 ID를 describe/test명에 포함
- **커밋**: `test: add kanban spec tests for all scenarios`

---

### Task 2: 데이터 모델 및 zustand 스토어

- **시나리오**: KANBAN-001, KANBAN-002, KANBAN-003, KANBAN-007, KANBAN-008, KANBAN-012
- **참조 규칙**: `.claude/skills/vercel-react-best-practices/rules/client-localstorage-schema.md`, `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md`, `.claude/skills/vercel-react-best-practices/rules/js-cache-storage.md`
- **구현 대상**:
  - `lib/types.ts` — Card, Column, BoardState 타입 정의
  - `lib/store.ts` — zustand 스토어 (CRUD, 이동, localStorage persist 미들웨어)
  - `__tests__/store.test.tsx` — 스토어 단위 테스트
- **수용 기준**:
  - [ ] Card 타입에 id, title, description, priority, tags, subtasks, columnId, order 필드 포함
  - [ ] `addCard("Todo", "회의록 작성")` → Todo 칼럼에 카드 1개 추가
  - [ ] `addCard("Todo", "")` → 에러 throw, 카드 추가 안 됨
  - [ ] `deleteCard(cardId)` → 해당 카드 제거
  - [ ] `moveCard(cardId, "In Progress", 0)` → 카드 칼럼/순서 변경
  - [ ] 스토어 변경 → localStorage에 자동 영속
  - [ ] `bun test store` → 모든 단위 테스트 통과
- **커밋**: `feat: add kanban data model and zustand store with localStorage persistence`

---

### Task 3: 칸반 보드 초기 표시 + 카드 생성

- **시나리오**: KANBAN-001, KANBAN-002, KANBAN-003
- **참조 규칙**: `.claude/skills/shadcn/rules/styling.md`, `.claude/skills/shadcn/rules/composition.md`, `.claude/skills/shadcn/rules/forms.md`, `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`, `.claude/skills/vercel-react-best-practices/rules/rerender-no-inline-components.md`, `.claude/skills/vercel-react-best-practices/rules/rendering-conditional-render.md`
- **구현 대상**:
  - `components/kanban/KanbanBoard.tsx` — 3칼럼 레이아웃
  - `components/kanban/KanbanColumn.tsx` — 칼럼 + 카드 추가 UI
  - `components/kanban/KanbanCard.tsx` — 카드 표시
  - `app/page.tsx` — KanbanBoard 렌더링
- **수용 기준**:
  - [ ] 앱 진입 → "Todo", "In Progress", "Done" 3칼럼 가로 나열
  - [ ] localStorage 비어 있으면 → 각 칼럼 카드 0개
  - [ ] Todo "추가" 클릭 → 제목 입력 필드 표시
  - [ ] "회의록 작성" 입력 후 확인 → Todo 칼럼에 카드 표시
  - [ ] 빈 제목으로 확인 → "제목을 입력해주세요" 에러 표시
  - [ ] `bun test kanban.spec` → KANBAN-001, 002, 003 통과
- **커밋**: `feat: implement kanban board layout and card creation`

---

### Task 4: 카드 인라인 편집 + 삭제

- **시나리오**: KANBAN-004, KANBAN-007, KANBAN-008
- **참조 규칙**: `.claude/skills/shadcn/rules/composition.md`, `.claude/skills/shadcn/rules/forms.md`, `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- **구현 대상**:
  - KanbanCard에 인라인 제목 편집 기능 추가
  - AlertDialog 기반 삭제 확인 UI
- **수용 기준**:
  - [ ] 카드 제목 클릭 → 입력 필드로 전환, 현재 값 표시
  - [ ] "주간 회의록 작성"으로 수정 후 확인 → 제목 변경 반영
  - [ ] 삭제 버튼 클릭 → "삭제하시겠습니까?" 확인 다이얼로그
  - [ ] 확인 → 카드 삭제 / 취소 → 카드 유지
  - [ ] `bun test kanban.spec` → KANBAN-004, 007, 008 통과
- **커밋**: `feat: add inline title editing and card deletion with confirmation`

---

### Task 5: 카드 상세 모달

- **시나리오**: KANBAN-022, KANBAN-023, KANBAN-024, KANBAN-005, KANBAN-006
- **참조 규칙**: `.claude/skills/shadcn/rules/composition.md`, `.claude/skills/shadcn/rules/forms.md`, `.claude/skills/shadcn/rules/icons.md`, `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`, `.claude/skills/vercel-react-best-practices/rules/rerender-no-inline-components.md`
- **구현 대상**:
  - `components/kanban/CardDetailModal.tsx` — Dialog 기반 상세 편집 모달 (제목, 설명, 우선순위, 태그)
- **수용 기준**:
  - [ ] 카드 클릭 → 상세 모달 열림, 현재 제목 표시
  - [ ] 모달에서 제목 수정 → 변경 반영
  - [ ] 설명 입력 후 저장 → 설명 반영
  - [ ] 우선순위 High/Medium/Low 선택 가능
  - [ ] 태그 "긴급" 입력 → 태그 추가 표시
  - [ ] 모달 닫기 → 카드에 변경사항 반영
  - [ ] `bun test kanban.spec` → KANBAN-005, 006, 022, 023, 024 통과
- **커밋**: `feat: add card detail modal with title, description, priority, and tags`

---

### Task 6: 서브태스크(체크리스트)

- **시나리오**: KANBAN-009, KANBAN-010, KANBAN-025
- **참조 규칙**: `.claude/skills/shadcn/rules/composition.md`, `.claude/skills/shadcn/rules/forms.md`, `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- **구현 대상**:
  - `components/kanban/SubtaskList.tsx` — Checkbox 기반 서브태스크 목록
  - CardDetailModal에 서브태스크 섹션 추가
  - KanbanCard에 진행률 표시
- **수용 기준**:
  - [ ] 서브태스크 "자료 준비" 추가 → 체크리스트에 항목 표시
  - [ ] 서브태스크 2개 중 1개 체크 → 진행률 "1/2" 표시
  - [ ] 서브태스크 삭제 버튼 클릭 → 해당 항목 제거
  - [ ] `bun test kanban.spec` → KANBAN-009, 010, 025 통과
- **커밋**: `feat: add subtask checklist with progress tracking`

---

### Task 7: 드래그&드롭

- **시나리오**: KANBAN-011, KANBAN-012, KANBAN-026
- **참조 규칙**: `.claude/skills/vercel-react-best-practices/rules/rerender-memo.md`, `.claude/skills/vercel-react-best-practices/rules/rerender-use-ref-transient-values.md`, `.claude/skills/vercel-react-best-practices/rules/client-event-listeners.md`, `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- **구현 대상**:
  - KanbanCard에 pragmatic-drag-and-drop draggable 적용
  - KanbanColumn에 droppable 적용
  - 드롭 시 스토어 moveCard 호출 → localStorage 영속
- **수용 기준**:
  - [ ] Todo 카드를 In Progress로 드래그 → In Progress에 카드 표시
  - [ ] 같은 칼럼 내 카드 순서 변경 → 변경된 순서 유지
  - [ ] 이동 후 새로고침 → 이동된 위치 그대로
  - [ ] `bun test kanban.spec` → KANBAN-011, 012, 026 통과
- **커밋**: `feat: implement drag and drop with pragmatic-drag-and-drop`

---

### Task 8: 검색 + 필터

- **시나리오**: KANBAN-013, KANBAN-014, KANBAN-015, KANBAN-016, KANBAN-027, KANBAN-028
- **참조 규칙**: `.claude/skills/shadcn/rules/styling.md`, `.claude/skills/shadcn/rules/forms.md`, `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md`, `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state.md`, `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- **구현 대상**:
  - KanbanBoard 헤더에 검색 Input, 우선순위 Select, 태그 Select 추가
  - zustand 스토어에 searchQuery, priorityFilter, tagFilter 상태 추가
  - 필터링된 카드 목록을 파생 상태로 계산
- **수용 기준**:
  - [ ] "작성" 입력 → 제목에 "작성" 포함된 카드만 표시
  - [ ] "존재하지않는단어" 입력 → 카드 0개 표시
  - [ ] 검색어 삭제 → 전체 카드 표시
  - [ ] 우선순위 "High" 필터 → High 카드만 표시
  - [ ] 태그 "긴급" 필터 → 해당 태그 카드만 표시
  - [ ] 필터 해제 → 전체 카드 표시
  - [ ] `bun test kanban.spec` → KANBAN-013~016, 027, 028 통과
- **커밋**: `feat: add search and priority/tag filtering`

---

### Task 9: 다크모드

- **시나리오**: KANBAN-017, KANBAN-018, KANBAN-029
- **참조 규칙**: `.claude/skills/shadcn/rules/styling.md`, `.claude/skills/vercel-react-best-practices/rules/rendering-hydration-no-flicker.md`, `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- **구현 대상**:
  - `components/kanban/ThemeToggle.tsx` — 다크모드 토글 버튼
  - 시스템 설정 기반 초기 테마 적용
  - localStorage에 테마 선택 영속
- **수용 기준**:
  - [ ] 초기 진입 → 시스템 설정에 따른 테마 적용
  - [ ] 토글 클릭 → 반대 테마로 전환
  - [ ] 새로고침 → 선택한 테마 유지
  - [ ] `bun test kanban.spec` → KANBAN-017, 018, 029 통과
- **커밋**: `feat: add dark mode toggle with system preference detection`

---

### Task 10: 데이터 내보내기/가져오기

- **시나리오**: KANBAN-019, KANBAN-020, KANBAN-021
- **참조 규칙**: `.claude/skills/shadcn/rules/composition.md`, `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- **구현 대상**:
  - KanbanBoard 헤더에 내보내기/가져오기 버튼 추가
  - 내보내기: 스토어 데이터 → JSON 파일 다운로드
  - 가져오기: JSON 파일 읽기 → 검증 → 스토어 교체
- **수용 기준**:
  - [ ] 내보내기 클릭 → .json 파일 다운로드, 모든 칼럼/카드 데이터 포함
  - [ ] 유효한 JSON 가져오기 → 기존 데이터 교체, 보드 갱신
  - [ ] 잘못된 형식 가져오기 → "올바른 형식이 아닙니다" 에러
  - [ ] `bun test kanban.spec` → KANBAN-019, 020, 021 통과
- **커밋**: `feat: add JSON export and import functionality`

---

## 미결정 사항

- 없음
