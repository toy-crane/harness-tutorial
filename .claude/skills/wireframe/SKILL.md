---
name: wireframe
description: spec을 기반으로 ASCII 와이어프레임을 즉시 생성합니다. 외부 API 호출 없이 레이아웃과 구조를 빠르게 검증합니다. "/wireframe", "와이어프레임", "레이아웃 검증" 등으로 실행합니다.
argument-hint: "feature 이름"
allowed-tools:
  - "Read"
  - "Write"
  - "Glob"
---

# Wireframe: Spec → ASCII 와이어프레임 즉시 생성

spec 문서를 기반으로 ASCII 와이어프레임을 생성하는 스킬입니다.
외부 API 호출 없이 Claude가 직접 생성하므로 **즉시 완료**됩니다.

## Step 1: 전제 조건 확인

$ARGUMENTS에서 feature명을 추출한 뒤, 다음 파일이 모두 존재하는지 확인합니다.

### 필수 파일

- `artifacts/<feature>/spec.md`

### 선택 파일

- `DESIGN.md` — 존재하면 컴포넌트 어휘와 반응형 전략을 보충 참조

### 파일이 없는 경우

필수 파일이 없으면 아래 안내를 출력하고 스킬을 종료합니다. 다음 단계로 진행하지 않습니다.

- `artifacts/<feature>/spec.md`가 없는 경우:
  - "먼저 `/spec <feature>`를 실행하여 요구사항 문서를 생성하세요."

## Step 2: 시나리오 분석 및 화면 계획

### 2-1: 시나리오 파싱

spec.md의 `### N.` 형식 시나리오 헤딩을 파싱하여 시나리오 목록을 추출합니다.

### 2-2: 기존 화면 계획 확인

`artifacts/<feature>/screen-plan.md`가 이미 존재하는지 확인합니다.

- **존재함**: 내용을 읽고 재사용할지 새로 생성할지 사용자에게 확인
- **존재하지 않음**: 새로 생성 (아래 2-3 진행)

### 2-3: 화면 그룹핑

시나리오들을 **시각적으로 구분되는 화면 상태**로 그룹핑합니다.

#### 그룹핑 원칙

- 하나의 화면 = 하나의 시각적으로 구분되는 UI 상태
- 같은 베이스 화면에서 작은 상태 차이만 있는 시나리오는 하나로 묶는다
- 시각적으로 완전히 다른 상태는 별도 화면으로 분리한다
- **다크모드는 별도 와이어프레임을 생성하지 않는다** (ASCII로 색상 차이를 표현할 수 없으므로 screen-plan.md에 "레이아웃 동일, 다크 테마 적용"으로 표기)

### 2-4: screen-plan.md 생성

`artifacts/<feature>/screen-plan.md`를 생성합니다. **prototype 스킬과 동일한 포맷**을 사용합니다.

`templates/screen-plan.md` 포맷을 따릅니다.

### 2-5: 사용자 확인

생성된 화면 계획을 보여주고 승인을 받습니다. 사용자는:
- 화면을 추가/제거/병합할 수 있음
- 각 화면의 설명을 수정할 수 있음
- 화면 순서를 변경할 수 있음

승인 후 **Step 3**으로 진행합니다.

## Step 3: 와이어프레임 생성

screen-plan.md의 모든 화면에 대해 와이어프레임을 생성합니다.
외부 API 호출이 없으므로 **화면 간 사용자 승인 게이트 없이** 전체를 한 번에 생성합니다.

### 각 화면별 생성 절차

1. screen-plan.md에서 해당 화면의 Description과 관련 시나리오 번호 확인
2. spec.md에서 해당 시나리오의 성공 기준을 읽어 필요한 UI 요소 도출
3. `references/ascii-vocabulary.md`에서 컴포넌트 어휘 참조 (Button, Card, Input, Badge, Select 등)
4. 와이어프레임 마크다운 생성
5. `artifacts/<feature>/wireframes/<screen-id>.md`에 저장
6. screen-plan.md에서 해당 화면의 Status를 `[x] completed`로 갱신, `generated` 카운트 +1

### 와이어프레임 파일 포맷

`templates/wireframe.md` 포맷을 따릅니다.

### 드로잉 규칙

와이어프레임을 그리기 전에 `references/ascii-vocabulary.md`를 읽고 Component Vocabulary와 상태 패턴을 확인합니다.
처음 생성하거나 품질 기준이 필요할 때 `references/examples.md`의 Desktop/Mobile 예시를 참조합니다.

핵심 원칙: **시각적으로 렌더링**합니다. `[Button:]`, `[Input:]` 등 시맨틱 레이블은 사용하지 않습니다.

### 레이아웃 작성 원칙

1. **너비**: Desktop 90자, Mobile 30자. DESIGN.md가 있으면 Responsive Strategy 참조, 없으면 기본 Desktop(90자)으로 생성
2. **계층**: 중첩 컨테이너 + `├────┤` 내부 분리로 레이아웃 계층 표현
3. **데이터 밀도**: 구체적 예시 데이터 사용 (이름, 날짜, 금액 등 — spec.md 성공 기준에서 도출)
4. **시각 렌더링**: ASCII Vocabulary에 따라 그리기. `[Button:]`, `[Input:]` 등 시맨틱 레이블 금지
5. **번호 주석**: `①②③`으로 주요 컴포넌트에 번호를 매기고 Component Inventory와 연결
6. **상태 표현**: 한 화면에 여러 상태를 배치하고 `(← state description)` 주석으로 구분

> 한국어 문자는 모노스페이스에서 2칸(full-width)을 차지합니다. 정렬 시 글자 수가 아닌 표시 폭을 기준으로 계산하세요.

### Component Inventory 작성 원칙

1. Layout의 `①②③` 번호 주석에 대응하는 컴포넌트를 나열
2. `#` 컬럼은 와이어프레임의 번호 주석(`①②③`)과 1:1 매핑
3. Type은 `references/ascii-vocabulary.md`에 정의된 컴포넌트명 사용 (Button, Card, Input, Badge, Select, AlertDialog 등)
4. Content/State에는 기본값, placeholder, variant 등 구현에 필요한 정보 기록

### Interactions 작성 원칙

1. spec.md의 성공 기준을 UI 인터랙션으로 번역
2. Component Inventory의 번호를 참조하여 어떤 컴포넌트에서 발생하는지 명시
3. `→` 뒤에 기대 결과를 기술

## Step 4: 완료 보고

### 산출물 파일 목록

```
artifacts/<feature>/
  spec.md              (기존)
  screen-plan.md       (생성됨 - prototype과 공유 포맷)
  wireframes/
    01-<screen-id>.md  (생성됨)
    02-<screen-id>.md  (생성됨)
    ...
```

### 요약 출력

- 생성된 화면 수
- 각 화면이 커버하는 시나리오 매핑
- 다크모드 화면이 있는 경우 "레이아웃 동일, 다크 테마 적용" 표기

### 다음 단계 안내

- "와이어프레임 생성이 완료되었습니다."
- "구현을 시작하려면 plan mode로 전환하세요. (Shift+Tab 두 번 또는 `/plan`)"
- "고충실도 프로토타입이 필요하면 `/prototype <feature>`를 실행하세요."
