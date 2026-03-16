# Kanban Board 구현 계획

## Architecture Decisions

| 결정 사항 | 선택 | 사유 |
|-----------|------|------|
| 상태 관리 | zustand (이미 설치됨) | 경량, 보일러플레이트 최소 |
| 데이터 모델 | 정규화 (`cards: Record<id, Card>`, `columns: Record<id, { cardIds[] }>`) | DnD 시 ID 배열만 변경, 카드 조회 O(1) |
| 드래그&드롭 | @atlaskit/pragmatic-drag-and-drop (이미 설치됨) | React 19 호환, 경량 |
| 영속화 | zustand persist middleware → localStorage | 별도 라이브러리 불필요 |
| ID 생성 | nanoid (이미 설치됨) | 경량, 충돌 안전 |
| 다크모드 | CSS class 전략 (html에 `dark` class 토글) | Tailwind v4 + shadcn 표준 방식 |

## Required Skills

| 스킬 | 용도 |
|------|------|
| vercel-react-best-practices | React 성능 최적화 규칙 준수 |
| web-design-guidelines | Web Interface Guidelines 준수 |
| shadcn | UI 컴포넌트 사용 규칙 준수 |

## UI Components

### 설치 필요

| 컴포넌트 | 설치 명령 |
|----------|-----------|
| Dialog | `bunx --bun shadcn@latest add dialog` |
| Checkbox | `bunx --bun shadcn@latest add checkbox` |

### 이미 설치됨

| 컴포넌트 | 용도 |
|----------|------|
| Card | 칸반 카드 |
| Button | 추가/삭제 등 액션 |
| Input | 검색, 제목 입력 |
| Badge | 우선순위, 태그 표시 |
| AlertDialog | 삭제 확인 |
| Select | 우선순위/태그 필터 |
| Textarea | 카드 설명 편집 |
| DropdownMenu | 카드 액션 메뉴 |

### 커스텀 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| KanbanBoard | 3칼럼 레이아웃 + DnD 컨텍스트 |
| KanbanColumn | 칼럼 드롭 영역 + 카드 목록 |
| KanbanCard | 드래그 가능한 카드 |
| CardDetailModal | 카드 상세 편집 모달 |
| SearchBar | 검색 입력 |
| FilterBar | 우선순위/태그 필터 |
| ThemeToggle | 다크모드 토글 |
| SubtaskList | 서브태스크 체크리스트 |

## 실행 프로토콜

- 각 task 시작 전, **참조 규칙**에 나열된 파일을 반드시 읽고 규칙을 준수하며 구현한다

## Tasks

### Task 0: shadcn 컴포넌트 설치

- **시나리오**: (선행 작업)
- **참조 규칙**: `.claude/skills/shadcn/SKILL.md`
- **구현 대상**: Dialog, Checkbox 컴포넌트가 `components/ui/`에 설치됨
- **수용 기준**:
  - [ ] `bunx --bun shadcn@latest add dialog checkbox` 실행 → 에러 없이 설치 완료
  - [ ] `components/ui/dialog.tsx`, `components/ui/checkbox.tsx` 파일 존재
- **커밋**: `chore: add dialog and checkbox shadcn components`

---

### Task 1: spec 테스트 생성 (Red)

- **시나리오**: KANBAN-001 ~ KANBAN-029
- **참조 규칙**: `artifacts/spec.yaml`, `artifacts/kanban/spec.md`
- **구현 대상**: `app/kanban/__tests__/kanban.spec.test.tsx` — spec.yaml의 모든 시나리오를 커버하는 수용 기준 테스트
- **수용 기준**:
  - [ ] `bun run test kanban.spec` 실행 → 29개 테스트 케이스가 존재 (모두 fail)
  - [ ] 각 테스트는 대응하는 시나리오 ID를 describe/test 이름에 포함
- **커밋**: `test: add kanban spec tests (red)`

---

### Task 2: 데이터 모델 + zustand store

- **시나리오**: KANBAN-001, KANBAN-002, KANBAN-003, KANBAN-012, KANBAN-018
- **참조 규칙**:
  - `.claude/skills/vercel-react-best-practices/rules/client-localstorage-schema.md`
  - `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md`
  - `.claude/skills/vercel-react-best-practices/rules/js-set-map-lookups.md`
- **구현 대상**:
  - `lib/types.ts` — Card, Column, BoardState 타입 정의
  - `lib/store.ts` — zustand store (persist middleware, 정규화 구조)
  - `lib/__tests__/store.test.tsx` — store 단위 테스트
- **수용 기준**:
  - [ ] Card 타입에 id, title, description, priority, tags, subtasks, columnId 필드 존재
  - [ ] 초기 상태: 3개 칼럼 (todo, in-progress, done), cardIds 빈 배열
  - [ ] `addCard("Todo", "회의록 작성")` → cards에 새 카드 추가, todo 칼럼의 cardIds에 ID 추가
  - [ ] `addCard("Todo", "")` → 에러 throw, cards 변경 없음
  - [ ] localStorage persist: store 변경 → 새로고침 후 데이터 유지
  - [ ] `bun run test store` → 모든 단위 테스트 통과
- **커밋**: `feat: add kanban data model and zustand store`

---

### Task 3: 칸반 보드 초기 렌더링

- **시나리오**: KANBAN-001
- **참조 규칙**:
  - `.claude/skills/shadcn/rules/styling.md`
  - `.claude/skills/vercel-react-best-practices/rules/rerender-no-inline-components.md`
  - `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
- **구현 대상**:
  - `app/kanban/page.tsx` — 칸반 페이지 (Server Component wrapper)
  - `components/kanban/kanban-board.tsx` — 3칼럼 레이아웃
  - `components/kanban/kanban-column.tsx` — 칼럼 컴포넌트
- **수용 기준**:
  - [ ] `/kanban` 접속 → "Todo", "In Progress", "Done" 3칼럼이 순서대로 표시
  - [ ] localStorage 비어있으면 → 각 칼럼에 카드 0개
  - [ ] KANBAN-001 spec 테스트 통과
- **커밋**: `feat: add kanban board initial rendering`

---

### Task 4: 카드 생성

- **시나리오**: KANBAN-002, KANBAN-003
- **참조 규칙**:
  - `.claude/skills/shadcn/rules/forms.md`
  - `.claude/skills/shadcn/rules/composition.md`
  - `.claude/skills/vercel-react-best-practices/rules/rerender-functional-setstate.md`
- **구현 대상**:
  - `components/kanban/add-card-form.tsx` — 칼럼 하단 카드 추가 폼
  - `components/kanban/kanban-card.tsx` — 카드 컴포넌트
- **수용 기준**:
  - [ ] Todo 칼럼 "추가" 클릭 → 제목 입력 필드 표시
  - [ ] "회의록 작성" 입력 후 확인 → Todo 칼럼에 카드 표시, todoCardCount === 1
  - [ ] 빈 제목으로 확인 → "제목을 입력해주세요" 에러 표시, 카드 생성 안 됨
  - [ ] KANBAN-002, KANBAN-003 spec 테스트 통과
- **커밋**: `feat: add card creation with validation`

---

### Task 5: 카드 인라인 편집 + 삭제

- **시나리오**: KANBAN-004, KANBAN-007, KANBAN-008
- **참조 규칙**:
  - `.claude/skills/shadcn/rules/composition.md` (AlertDialog)
  - `.claude/skills/vercel-react-best-practices/rules/rerender-move-effect-to-event.md`
- **구현 대상**:
  - `components/kanban/kanban-card.tsx` — 인라인 제목 편집 기능 추가
  - `components/kanban/delete-card-dialog.tsx` — 삭제 확인 다이얼로그
- **수용 기준**:
  - [ ] 카드 제목 클릭 → 입력 필드 전환, 현재 값 표시
  - [ ] "주간 회의록 작성" 수정 후 확인 → 제목 변경 반영
  - [ ] 삭제 버튼 클릭 → "삭제하시겠습니까?" 다이얼로그 표시
  - [ ] 확인 → 카드 제거 / 취소 → 카드 유지
  - [ ] KANBAN-004, KANBAN-007, KANBAN-008 spec 테스트 통과
- **커밋**: `feat: add card inline edit and delete`

---

### Task 6: 카드 상세 모달

- **시나리오**: KANBAN-005, KANBAN-006, KANBAN-022, KANBAN-023, KANBAN-024
- **참조 규칙**:
  - `.claude/skills/shadcn/rules/composition.md` (Dialog Title 필수)
  - `.claude/skills/shadcn/rules/forms.md`
  - `.claude/skills/shadcn/rules/icons.md`
- **구현 대상**:
  - `components/kanban/card-detail-modal.tsx` — 제목, 설명, 우선순위, 태그 편집 모달
- **수용 기준**:
  - [ ] 카드 클릭 → 상세 모달 열림, 모달 제목 === 카드 제목
  - [ ] 모달에서 제목 수정 → 변경 반영
  - [ ] 설명 "회의 안건 정리" 입력 → 저장됨
  - [ ] 우선순위 High 선택 → 카드에 High 표시
  - [ ] 태그 "긴급" 추가 → 카드에 "긴급" 태그 표시
  - [ ] KANBAN-005, KANBAN-006, KANBAN-022, KANBAN-023, KANBAN-024 spec 테스트 통과
- **커밋**: `feat: add card detail modal`

---

### Task 7: 서브태스크 관리

- **시나리오**: KANBAN-009, KANBAN-010, KANBAN-025
- **참조 규칙**:
  - `.claude/skills/shadcn/rules/composition.md`
  - `.claude/skills/shadcn/rules/forms.md`
- **구현 대상**:
  - `components/kanban/subtask-list.tsx` — 체크리스트 UI (추가/체크/삭제)
  - 카드 상세 모달에 서브태스크 섹션 통합
- **수용 기준**:
  - [ ] 서브태스크 "자료 준비" 추가 → 체크리스트에 항목 표시
  - [ ] 2개 중 1개 체크 → 진행률 "1/2" 표시
  - [ ] 삭제 버튼 클릭 → 해당 서브태스크 제거
  - [ ] KANBAN-009, KANBAN-010, KANBAN-025 spec 테스트 통과
- **커밋**: `feat: add subtask management`

---

### Task 8: 드래그&드롭

- **시나리오**: KANBAN-011, KANBAN-012, KANBAN-026
- **참조 규칙**:
  - `.claude/skills/vercel-react-best-practices/rules/rerender-memo.md`
  - `.claude/skills/vercel-react-best-practices/rules/js-index-maps.md`
- **구현 대상**:
  - `components/kanban/kanban-board.tsx` — pragmatic-drag-and-drop 모니터 설정
  - `components/kanban/kanban-column.tsx` — 드롭 영역
  - `components/kanban/kanban-card.tsx` — 드래그 소스
  - store에 `moveCard(cardId, fromCol, toCol, index)` 액션 추가
- **수용 기준**:
  - [ ] Todo → In Progress 드래그 → 카드 이동, todoCardCount 0, inProgressCardCount 1
  - [ ] 같은 칼럼 내 순서 변경 → 변경된 순서 유지
  - [ ] 이동 후 새로고침 → 위치 그대로 (localStorage 영속)
  - [ ] KANBAN-011, KANBAN-012, KANBAN-026 spec 테스트 통과
- **커밋**: `feat: add drag and drop`

---

### Task 9: 검색 + 필터

- **시나리오**: KANBAN-013, KANBAN-014, KANBAN-015, KANBAN-016, KANBAN-027, KANBAN-028
- **참조 규칙**:
  - `.claude/skills/shadcn/rules/styling.md`
  - `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state.md`
  - `.claude/skills/vercel-react-best-practices/rules/rerender-derived-state-no-effect.md`
- **구현 대상**:
  - `components/kanban/search-bar.tsx` — 실시간 제목 검색
  - `components/kanban/filter-bar.tsx` — 우선순위/태그 필터
  - store에 검색/필터 상태 + 파생 셀렉터 추가
- **수용 기준**:
  - [ ] "작성" 검색 → 매칭 카드만 표시 (visibleCardCount 2)
  - [ ] "존재하지않는단어" 검색 → 0개 표시
  - [ ] 검색어 삭제 → 전체 카드 표시
  - [ ] 우선순위 "High" 필터 → High 카드만 표시
  - [ ] 태그 "긴급" 필터 → 긴급 태그 카드만 표시
  - [ ] 필터 해제 → 전체 카드 표시
  - [ ] KANBAN-013~016, KANBAN-027, KANBAN-028 spec 테스트 통과
- **커밋**: `feat: add search and filter`

---

### Task 10: 다크모드

- **시나리오**: KANBAN-017, KANBAN-018, KANBAN-029
- **참조 규칙**:
  - `.claude/skills/shadcn/rules/styling.md` (dark: 수동 오버라이드 금지)
  - `.claude/skills/vercel-react-best-practices/rules/rendering-hydration-no-flicker.md`
- **구현 대상**:
  - `components/kanban/theme-toggle.tsx` — 다크모드 토글 버튼
  - `lib/store.ts` — 테마 상태 추가 (persist)
- **수용 기준**:
  - [ ] 시스템 다크모드 + localStorage 없음 → 다크 테마 적용
  - [ ] 토글 클릭 → 반대 테마 전환
  - [ ] 새로고침 → 선택한 테마 유지
  - [ ] KANBAN-017, KANBAN-018, KANBAN-029 spec 테스트 통과
- **커밋**: `feat: add dark mode toggle`

---

### Task 11: 데이터 내보내기/가져오기

- **시나리오**: KANBAN-019, KANBAN-020, KANBAN-021
- **참조 규칙**:
  - `.claude/skills/vercel-react-best-practices/rules/js-early-exit.md`
- **구현 대상**:
  - `components/kanban/export-import.tsx` — 내보내기/가져오기 버튼
  - store에 `exportData()`, `importData(json)` 액션 추가
- **수용 기준**:
  - [ ] 내보내기 클릭 → .json 파일 다운로드, 모든 칼럼/카드 데이터 포함
  - [ ] 유효한 JSON 가져오기 → 기존 데이터 교체, 보드 갱신
  - [ ] 잘못된 형식 가져오기 → "올바른 형식이 아닙니다" 에러, 기존 데이터 유지
  - [ ] KANBAN-019, KANBAN-020, KANBAN-021 spec 테스트 통과
- **커밋**: `feat: add data export and import`

---

## 미결정 사항

- 없음
