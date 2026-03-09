# ASCII Component Vocabulary

와이어프레임은 Unicode box-drawing 문자를 사용하여 **시각적으로 렌더링**합니다.
`[Button: label]`, `[Input: placeholder]` 같은 시맨틱 레이블은 사용하지 않습니다.

## Component 치트시트

| Component | ASCII 표현 |
|-----------|-----------|
| Button | `[ Save Changes ]` |
| Button (destructive) | `[ Delete x ]` |
| Input | `┌──────────────────┐` / `│ Search...        │` / `└──────────────────┘` |
| Select | `┌──────────────┐` / `│ Priority   ▾ │` / `└──────────────┘` |
| Badge | `(High)` 또는 `(● High)` |
| Icon | 유니코드 직접 사용: `☰` `☀` `✕` `▶` `🗑` |
| Card | header + `├────────────────┤` separator + content |
| Toggle | `[●━━━]` on / `[━━━●]` off |
| Checkbox | `[✓]` checked / `[ ]` unchecked |
| Tab (active) | `[ Active ]  Inactive  Inactive` |
| Skeleton | `░░░░░░░░░░` |
| Empty state | 점선 테두리 `┌╌╌╌╌╌╌┐` / `╎ 메시지 ╎` / `└╌╌╌╌╌╌┘` |
| Modal overlay | `░░` 배경 + 중앙 박스 |
| Progress | `███████░░░░░ 58%` |
| Avatar | `(JD)` |
| Separator | `├──────────────────┤` 또는 `──────────` |
| Container | `┌─┐│└─┘` 일반, `┌══┐║└══┘` 강조/포커스, `┌╌╌┐╎└╌╌┘` 점선 |
| Annotation | `(← 설명)` — 렌더링 안 됨, 주석 용도 |
| Radio button | `(●) Selected  ( ) Unselected` |
| Textarea | `┌──────────────────┐` / `│ 여러 줄 입력...   │` / `│                  │` / `└──────────────────┘` |
| Table | `┌──────┬──────┬────────┐` / `│ Name │ Role │ Status │` / `├──────┼──────┼────────┤` / `│ …   │ …   │ …     │` / `└──────┴──────┴────────┘` |
| Breadcrumbs | `Home > Products > Detail` |
| Pagination | `< 1 2 [3] 4 5 >` |
| Accordion | `▸ Section (collapsed)` / `▾ Section (expanded)` + 들여쓴 내용 |
| Dropdown menu | 트리거 `[ Actions ▾ ]` + 떠있는 메뉴 `┌────────┐` / `│ Edit  │` / `│ Delete │` / `└────────┘` |
| Stepper | `(●)━━(2)━━(3)` 활성 스텝 강조 |
| Slider | `○━━━━━●━━━━━ 60` |
| Rating | `★★★★☆` |
| Toast | 화면 모서리 알림: `┌ ✓ ──────────┐` / `│ 저장 완료    │` / `└──────────────┘` |
| Spinner | `⟳` 인라인 로딩 표시 |

> 유니코드 심볼과 이모지 모두 허용하되, 모노스페이스에서 정렬이 깨지지 않도록 주의합니다.

## 상태 패턴

| 상태 | 표현 방식 |
|------|----------|
| Loading | `░░░░░░░░░░` skeleton 블록 |
| Empty | 점선 테두리 `┌╌╌┐` `╎  ╎` `└╌╌┘` + 안내 메시지 |
| Error | 이중선 테두리 `╔══╗` `║  ║` `╚══╝` + 에러 메시지 |
| Disabled | `[ - Save - ]` 또는 내용에 `(disabled)` 주석 |
| Success | `┌ ✓ ──────────┐` / `│ 성공 메시지  │` / `└──────────────┘` |
| Warning | `┌ ⚠ ──────────┐` / `│ 경고 메시지  │` / `└──────────────┘` |

> 한국어 문자는 모노스페이스에서 2칸(full-width)을 차지합니다. 정렬 시 글자 수가 아닌 표시 폭을 기준으로 계산하세요.
