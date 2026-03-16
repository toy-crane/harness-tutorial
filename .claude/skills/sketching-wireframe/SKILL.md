---
name: sketching-wireframe
description: spec을 기반으로 HTML 와이어프레임을 생성합니다. Tailwind + 시스템 monospace로 시각적 레이아웃을 빠르게 검증합니다. "/sketching-wireframe", "와이어프레임", "wireframe", "layout", "레이아웃 검증", "UI 구성", "화면 설계", "목업" 등으로 실행합니다. spec.md가 있는 기능의 UI를 시각적으로 확인하고 싶을 때 사용하세요.
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

전체 레이아웃을 먼저 확정하고, 시나리오별 화면을 생성한다.

## 전제 조건

1. `artifacts/<feature>/spec.md` 존재 확인. 없으면 "먼저 `/writing-spec <feature>`를 실행하세요." 출력 후 종료.
2. `artifacts/spec.yaml`에서 해당 feature의 시나리오를 확인한다.

## 화면 그룹핑

spec.md의 시나리오를 **시각적으로 구분되는 화면 상태**로 그룹핑하고 사용자에게 출력한다.

```
N개 화면으로 구성합니다:
1. 화면 이름 — FEATURE-001, 002, 003
   ↳ 반응형: 3칼럼 그리드 → 단일 칼럼 스택
2. 화면 이름 — FEATURE-004, 005
   ↳ 반응형: sidebar → bottom sheet
```

## 1단계: 기본 화면

그룹핑의 첫 번째 화면을 **상호작용 없는 기본 상태**로 생성한다.
- 대표 데이터가 채워진 평상시 모습 (드래그, 모달 등 상호작용 상태 없음)
- 전체 레이아웃을 한눈에 파악할 수 있는 뷰

**입력**: `assets/template.html`, `references/style-guide.md`
**출력**: `artifacts/<feature>/wireframe.html`

피드백 서버를 실행하고 레이아웃 피드백을 받는다:
```
Bash(run_in_background): bun run .claude/skills/sketching-wireframe/assets/feedback-server.ts <feature>
open http://localhost:3456
```

피드백 루프 (유저가 터미널에 입력할 때까지 자동 반복):
- `curl -s http://localhost:3456/api/next-feedback`로 블로킹 대기
- 피드백 수신 → wireframe.html 수정
- spec 변경이 필요하면 사용자 승인 후 `spec.md`와 `spec.yaml`을 함께 반영
- `curl -s -X POST http://localhost:3456/api/reload`로 브라우저 리로드

레이아웃이 확정되면 2단계로 진행한다.

## 2단계: 시나리오 화면

확정된 레이아웃 위에 나머지 시나리오별 화면을 추가한다.
- Screen Notes에 시나리오 ID(예: KANBAN-001)를 명시적으로 참조한다
- spec.md에서 구체적인 예시 데이터를 사용한다

동일한 피드백 루프로 시나리오 화면을 검증한다.

## 완료

완료 후 사용자에게 `/writing-plan <feature>` 진행 여부를 물어본다.
