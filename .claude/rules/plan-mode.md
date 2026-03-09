---
description: plan mode에서 구현 계획을 수립할 때 적용되는 규칙
globs: []
---

# Plan Mode 구현 가이드

plan mode에서는 wireframe의 배치를 실제 코드로 변환하는 **컴포넌트 매핑**을 수행한다.

## 역할

1. **프로젝트 코드 읽기**: 실제 사용 중인 컴포넌트, 유틸리티, 패턴을 파악한다
2. **컴포넌트 매핑**: wireframe의 일반 명사("버튼", "카드", "목록")를 프로젝트의 실제 컴포넌트로 매핑한다
3. **구현 순서 결정**: 화면별 의존성을 고려해 구현 순서를 정한다

## 참조할 artifacts

- `artifacts/<feature>/spec.md` — 행동 명세와 성공 기준
- `artifacts/<feature>/wireframe.md` — 배치와 컴포넌트 인벤토리

## React/Next.js Best Practices 참조

필요 시 `.claude/skills/vercel-react-best-practices/rules/` 카테고리를 참조한다:

| 카테고리 | 적용 상황 |
|---|---|
| `async-*` | 데이터 페칭이 있는 화면 |
| `bundle-*` | 번들 최적화가 필요한 경우 |
| `server-*` | Server Component 사용 시 |
| `client-*` | Client Component 사용 시 |
| `rerender-*` | 상태 변경이 잦은 인터랙티브 화면 |
| `rendering-*` | 렌더링 최적화가 필요한 경우 |
| `js-*` | JavaScript 성능 최적화 |
| `advanced-*` | 고급 패턴 (이벤트 핸들러 refs, 초기화 등) |
