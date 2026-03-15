---
name: wireframe
description: spec을 기반으로 HTML 와이어프레임을 생성합니다. Tailwind + 시스템 monospace로 시각적 레이아웃을 빠르게 검증합니다. "/wireframe", "와이어프레임", "wireframe", "layout", "레이아웃 검증", "UI 구성", "화면 설계", "목업" 등으로 실행합니다. spec.md가 있는 기능의 UI를 시각적으로 확인하고 싶을 때 사용하세요.
argument-hint: "feature 이름"
allowed-tools:
  - "Read"
  - "Write"
  - "Edit"
  - "Glob"
  - "Bash"
  - "AskUserQuestion"
---

# Wireframe: Spec → HTML 와이어프레임

spec 문서로부터 HTML 와이어프레임을 생성한다. Tailwind CDN + CSS 변수로 최소 회색 톤 스타일 적용. 데스크톱/모바일 뷰포트 전환을 지원한다.

## Step 1: 전제 조건

$ARGUMENTS에서 feature명 추출 후:
1. `artifacts/<feature>/spec.md` 존재 확인. 없으면 "먼저 `/spec <feature>`를 실행하세요." 출력 후 종료.
2. `artifacts/spec.yaml`에서 해당 feature의 시나리오 ID 목록을 수집한다 (예: `KANBAN-001`, `KANBAN-002`, ...). spec.yaml은 전체 앱의 불변 계약이므로, 이 ID 목록이 커버리지 검증의 기준이 된다.

## Step 2: 시나리오 → 화면 그룹핑 + Layout Structure

spec.md의 `### N.` 시나리오를 파싱하고, **시각적으로 구분되는 화면 상태**로 그룹핑한다.

- 하나의 화면 = 하나의 시각적으로 구분되는 UI 상태
- 같은 베이스에서 작은 상태 차이만 있는 시나리오는 하나로 묶는다
- 시각적으로 완전히 다른 상태는 별도 화면으로 분리
- 모달/다이얼로그/시트가 열린 상태 → 별도 화면으로 분리 (기저 화면 + 오버레이)
- 모바일에서 레이아웃이 크게 달라지는 경우 → 별도 모바일 화면 추가 검토

각 화면의 **Layout Structure**를 들여쓰기 트리로 작성한다.

```
Screen: 기본 보드 [col]
├── Header [row] — 로고, 다크모드 토글
├── Toolbar [row] — 검색 input, Priority 필터, Tag 필터
└── Board [row → col on mobile, 1:1:1]
    ├── Column: Todo [col] — 카드 목록 + 추가 입력
    ├── Column: In Progress [col] — 카드 목록
    └── Column: Done [col] — 카드 목록
```

Layout Structure 규칙:
- `[row]` / `[col]`: 배치 방향
- `[row → col on mobile]`: 데스크톱에서 row, 모바일에서 col로 전환
- `1:1:1` 등 비율 힌트: 자식 요소 간 크기 비율
- `—` 뒤에 해당 영역의 핵심 내용 요약

그룹핑 결과 + Layout Structure를 사용자에게 보여주고 `AskUserQuestion`으로 승인받는다.

## Step 3: 전체 와이어프레임 생성

1. `assets/template.html`을 읽어서 HTML 보일러플레이트를 확보한다
2. `references/style-guide.md`를 읽어서 컴포넌트 패턴과 색상 규칙을 확인한다
3. **모든 화면을 한 번에 생성**하여 `artifacts/<feature>/wireframe.html`에 작성한다:

   ### 화면 삽입 패턴

   `<!-- NAV_BUTTONS -->` 위치에 각 화면의 nav 버튼을 삽입:
   ```html
   <button id="nav-0" onclick="show(0)" class="px-2 py-1">Screen Name</button>
   <button id="nav-1" onclick="show(1)" class="px-2 py-1">Screen Name</button>
   ```

   `<!-- SCREEN_CONTENT -->` 위치에 각 화면의 컨텐츠를 삽입:
   ```html
   <div id="screen-0" class="screen">
     <div class="screen-content max-w-6xl mx-auto p-6">

       <div class="screen-notes">
         <details open>
           <summary>Notes</summary>
           <p>이 화면의 목적과 사용자 행동 설명</p>
           <ul>
             <li>주요 인터랙션: 요소를 조작하면 일어나는 일</li>
             <li>상태 전환: 다른 화면으로 넘어가는 조건</li>
           </ul>
         </details>
       </div>

       <h2 class="text-lg font-bold mb-5" style="color:var(--w-muted); border-bottom:1px solid var(--w-border); padding-bottom:8px;">
         Screen Name
       </h2>

       <!-- 와이어프레임 컨텐츠 -->

     </div>
   </div>
   ```

   ### 작성 규칙

   - `{{FEATURE_NAME}}`을 실제 feature명으로 치환
   - Screen Notes에 화면의 목적, 주요 인터랙션, 상태 전환, 제약 사항을 자연어로 기술
   - style-guide.md의 컴포넌트 패턴을 사용하여 HTML 작성
   - style-guide.md의 컴포넌트 패턴을 사용할 때, 해당 요소 직전에 `<!-- [패턴명] 용도 -->` 주석을 추가한다
   - spec.md에서 구체적인 예시 데이터를 사용
   - 반응형 클래스 사용: 모바일 우선으로 작성하고 `md:` 접두사로 데스크톱 레이아웃 적용
     - 다단 레이아웃: `grid grid-cols-1 md:grid-cols-3`
     - 방향 전환: `flex flex-col md:flex-row`
     - 모바일에서 숨김: `hidden md:block`

4. 브라우저에서 파일을 연다:
   - macOS: `open artifacts/<feature>/wireframe.html`
   - Linux: `xdg-open artifacts/<feature>/wireframe.html`
   - 동작하지 않으면 파일 경로를 안내

5. `AskUserQuestion`으로 피드백을 수집한다
6. 피드백이 있으면 수정 후 재생성하고 다시 브라우저에서 연다

## Step 4: 커버리지 검증

`artifacts/spec.yaml`의 시나리오 ID를 기준으로 와이어프레임의 커버리지를 검증한다.

1. Step 1에서 수집한 시나리오 ID 목록을 기준으로 삼는다
2. 각 화면의 Screen Notes에서 해당 시나리오가 언급/반영되었는지 대조한다
3. 커버리지 결과를 표로 출력한다:
   ```
   | 시나리오 ID   | 이름           | 화면              | 상태 |
   |--------------|---------------|-------------------|------|
   | KANBAN-001   | 카드 생성       | 기본 보드          | ✓    |
   | KANBAN-003   | 카드 삭제       | 삭제 확인 다이얼로그 | ✓    |
   | KANBAN-008   | 다크모드 토글    | —                 | ✗    |
   ```
4. 누락된 시나리오(`✗`)가 있으면 사용자에게 알리고, 추가할지 확인

## Step 5: 완료

산출물: `artifacts/<feature>/wireframe.html`

다음 단계 안내: "구현을 시작하려면 plan mode로 전환하세요."
