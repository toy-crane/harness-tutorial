---
description: shadcn 컴포넌트의 기본 스타일을 보호하는 규칙
globs:
  - "**/*.tsx"
  - "**/*.jsx"
---

# shadcn 컴포넌트 스타일 보호

## 허용되는 className

- 레이아웃 배치만 허용: `max-w-*`, `mx-auto`, `mt-*`, `flex`, `grid`, `gap-*`, `w-full` 등

## 금지 사항

- 컴포넌트 기본 패딩·마진·색상·타이포그래피를 `className`으로 덮어쓰지 않는다
- `components/ui/*` 소스 파일을 직접 수정하지 않는다

## 스타일 변경이 필요한 경우 (우선순위)

1. variant prop 활용
2. semantic token 활용
3. CSS variable 조정
4. 위 방법으로 불가능하면 사용자에게 확인

## 상세 규칙

shadcn 스킬의 `styling.md`를 참조한다.
