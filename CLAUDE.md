## 개발 워크플로우

### TDD
1. spec 테스트(*.spec.test.tsx)로 수용 기준 정의 (Red)
2. 구현 테스트(*.test.tsx)로 순수 로직 단위 테스트 작성 (Red)
3. 테스트를 통과하는 최소 코드 구현 (Green)
4. 양쪽 테스트 통과를 유지하며 리팩터링

### 테스트 파일 컨벤션

| 파일 패턴 | 용도 | 수정 권한 |
|---|---|---|
| `*.spec.test.tsx` | 수용 기준 테스트 (spec에서 도출) | 요구사항 변경 시에만, 사용자 확인 필수 |
| `*.test.tsx` | 구현 테스트 (단위/통합) | 자유롭게 수정 가능 |

### 커밋 규칙
- 기능 단위로 커밋, 여러 기능을 섞지 않는다
- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`

## Plan Mode 규칙

- 수용 기준이 있으면 spec 테스트 작성을 첫 번째 task로 배치한다. 선행 작업이 필요하면 사유를 명시한다.
- 순수 로직의 구현 테스트(*.test.tsx) 작성을 구현 task에 포함한다
- 계획 마지막에 미결정 질문 목록을 추가한다

### 참조할 artifacts
- `artifacts/<feature>/spec.md` — 행동 명세와 성공 기준
- `artifacts/<feature>/wireframe.md` — 배치와 컴포넌트 인벤토리

### React/Next.js Best Practices 참조
- 계획 수립 시 `vercel-react-best-practices` skill에서 관련 규칙을 식별하고 반영한다

## 작업 규칙
- 모든 작업에 수용 기준(Acceptance Criteria)을 포함한다:
  1. 구현 검증을 위한 구체적 테스트/명령을 정의한다
  2. 구체적 입력과 기대 출력을 명시한다
  3. 구현 후 모든 수용 기준을 실행하고 통과를 확인한다
