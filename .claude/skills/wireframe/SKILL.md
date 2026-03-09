---
name: wireframe
description: spec을 기반으로 ASCII 와이어프레임을 즉시 생성합니다. 외부 API 호출 없이 레이아웃과 구조를 빠르게 검증합니다. "/wireframe", "와이어프레임", "레이아웃 검증" 등으로 실행합니다.
argument-hint: "feature 이름"
allowed-tools:
  - "Read"
  - "Write"
  - "Glob"
---

# Wireframe: Spec → ASCII 와이어프레임

spec 문서로부터 ASCII 와이어프레임을 생성한다. 외부 API 없이 즉시 완료.

## Step 1: 전제 조건

$ARGUMENTS에서 feature명 추출 후 `artifacts/<feature>/spec.md` 존재 확인.
없으면 "먼저 `/spec <feature>`를 실행하세요." 출력 후 종료.

## Step 2: 시나리오 → 화면 그룹핑

spec.md의 `### N.` 시나리오를 파싱하고, **시각적으로 구분되는 화면 상태**로 그룹핑한다.

- 하나의 화면 = 하나의 시각적으로 구분되는 UI 상태
- 같은 베이스에서 작은 상태 차이만 있는 시나리오는 하나로 묶는다
- 시각적으로 완전히 다른 상태는 별도 화면으로 분리
- 다크모드는 별도 와이어프레임 없음 (ASCII로 색상 표현 불가)

그룹핑 결과를 사용자에게 텍스트로 보여주고 승인받는다. 승인 후 Step 3 진행.

## Step 3: 와이어프레임 생성

모든 화면을 **단일 파일** `artifacts/<feature>/wireframe.md`에 생성한다.
`references/ascii-vocabulary.md`를 읽고 컴포넌트 어휘를 확인한 뒤 드로잉한다.

### 드로잉 규칙

- **시각적 렌더링**: `[Button:]`, `[Input:]` 등 시맨틱 레이블 금지. ASCII로 직접 그린다
- **데이터**: 구체적 예시 데이터 사용 (spec.md 성공 기준에서 도출)
- **번호 주석**: `①②③`으로 주요 컴포넌트 표시 → Components 테이블과 연결
- **상태 표현**: `(← state description)` 주석으로 구분

> 한국어 문자는 모노스페이스에서 2칸 차지. 표시 폭 기준으로 정렬.

### 출력 파일 포맷

```markdown
---
feature: <feature>
screens: [<screen-id 목록>]
---

## Screen: <화면 제목> (scenarios: N, M)

### Layout

<ASCII 와이어프레임>

### Components

| # | Name | Type | Detail |
|---|------|------|--------|
| ① | ... | ... | ... |

### Interactions

- [①] action → result

---

## Screen: <다음 화면> (scenarios: X)

...
```

## Step 4: 완료

산출물: `artifacts/<feature>/wireframe.md`

다음 단계 안내: "구현을 시작하려면 plan mode로 전환하세요."
