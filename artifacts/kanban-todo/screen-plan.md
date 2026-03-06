---
feature: kanban-todo
total_screens: 3
generated: 3
---
# Screen Plan: kanban-todo

### 01-board-default
- **Title:** 칸반 보드 기본 상태
- **Scenarios:** 1. 카드 추가, 4. 드래그 앤 드롭으로 칼럼 이동
- **Description:** 3칼럼(Todo, In Progress, Done) 트렐로 스타일 보드. 각 칼럼에 샘플 카드가 배치되고, Todo 칼럼 하단에 카드 추가 입력 영역이 있다. 헤더에 검색 입력, 우선순위/태그 필터 셀렉트, 다크모드 토글이 위치한다.
- **Mode:** light
- **Status:** [x] completed

### 02-card-edit-delete
- **Title:** 카드 편집 및 삭제 확인
- **Scenarios:** 2. 카드 인라인 편집, 3. 카드 삭제
- **Description:** In Progress 칼럼의 한 카드가 인라인 편집 모드로 전환된 상태. 제목 Input, 우선순위 Select, 태그 칩+입력이 보인다. 동시에 삭제 확인 AlertDialog가 오버레이로 표시된다.
- **Mode:** light
- **Status:** [x] completed

### 03-search-filter
- **Title:** 검색 및 필터링 활성 상태
- **Scenarios:** 5. 검색 및 필터링
- **Description:** 검색 입력에 "버그"가 입력되고, 우선순위 필터가 "High"로 설정된 상태. 활성 필터 칩이 표시되고, 조건에 맞는 카드만 보이며 나머지 칼럼은 빈 상태 메시지를 표시한다.
- **Mode:** light
- **Status:** [x] completed

### 참고: 다크모드 (시나리오 6)
- 01-board-default와 레이아웃 동일, 다크 테마 적용
- 색상 매핑: Background=#0A0A0A, Card=#171717, Text=#FAFAFA, Muted=#A3A3A3, Border=white/10%
