---
name: prototype
description: spec과 DESIGN.md를 기반으로 Stitch 화면을 자동 생성합니다. 두 파일이 없으면 안내하고 종료합니다. "/prototype", "프로토타입", "화면 생성" 등으로 실행합니다.
argument-hint: "feature 이름"
allowed-tools:
  - "stitch*:*"
  - "Read"
  - "Write"
  - "Bash"
  - "Agent"
---

# Prototype: Spec → Stitch 화면 생성

spec 문서, DESIGN.md, wireframe을 기반으로 Stitch 화면을 자동 생성하는 파이프라인입니다.
screen-plan.md의 화면 수에 따라 단일 화면 / multi-screen 모드로 동작합니다.

## Step 1: 전제 조건 확인

$ARGUMENTS에서 feature명을 추출한 뒤, 다음 파일이 모두 존재하는지 확인합니다.

### 필수 파일

- `artifacts/<feature>/spec.md`
- `DESIGN.md`
- `artifacts/<feature>/screen-plan.md`
- `artifacts/<feature>/wireframes/*.md` (1개 이상)

### 파일이 없는 경우

하나라도 없으면 아래 안내를 출력하고 스킬을 종료합니다. 다음 단계로 진행하지 않습니다.

- `artifacts/<feature>/spec.md`가 없는 경우:
  - "먼저 `/spec <feature>`를 실행하여 요구사항 문서를 생성하세요."
- `DESIGN.md`가 없는 경우:
  - "먼저 `/extract-design` 스킬을 실행하여 DESIGN.md를 생성하세요."
- `artifacts/<feature>/screen-plan.md` 또는 wireframes가 없는 경우:
  - "먼저 `/wireframe <feature>`를 실행하여 와이어프레임을 생성하세요."

### 파일이 모두 있는 경우

- `stitch.json`이 있으면 projectId를 확인합니다.
- 다음 단계로 진행합니다.

## Step 2: DESIGN.md 동기화 검증

DESIGN.md가 현재 프로젝트 상태와 맞는지 가볍게 확인합니다.

### 검증 항목

- `app/globals.css`의 CSS 변수(--background, --primary 등)가 DESIGN.md Section 2 색상과 일치하는지
- `components.json`의 style 값이 DESIGN.md 헤더의 스타일과 일치하는지
- `package.json`의 프레임워크 버전이 DESIGN.md 헤더와 일치하는지
- DESIGN.md Section 4에 문서화된 컴포넌트가 실제 `components/ui/` 디렉토리에 설치되어 있는지 (누락/추가 컴포넌트 확인)

### 결과 처리

- 불일치 없음: 다음 스텝으로 진행
- 불일치 발견: 구체적인 차이점을 목록으로 출력하고 사용자에게 확인
  - 계속 진행할지
  - `/extract-design` 스킬을 다시 실행하여 DESIGN.md를 업데이트할지

## Step 3: 화면 계획 확인

screen-plan.md를 읽어 화면 목록과 수를 확인합니다.

### 모드 판별

- screen-plan.md의 `total_screens` 값 확인
- **1개** → 단일 화면 모드
- **2개 이상** → multi-screen 모드

### 사용자 확인

화면 계획을 보여주고 승인을 받습니다. 사용자는:
- 화면을 추가/제거/병합할 수 있음
- 각 화면의 모드(light/dark)를 변경할 수 있음
- 화면 순서를 변경할 수 있음

승인 후 **Step 4**로 진행합니다.

## Step 4: Stitch 화면 생성

### 공통: 프로젝트 확인

- `stitch.json`이 있으면 `projectId`를 사용합니다.
- 없으면 `create_project`로 새 프로젝트를 생성하고 `stitch.json`에 저장합니다.

### 공통: deviceType 결정

DESIGN.md 또는 프롬프트의 `Platform` 필드에서 deviceType을 결정합니다.

| Platform 필드 | deviceType |
|--------------|------------|
| Desktop-first | `DESKTOP` |
| Mobile-first | `MOBILE` |
| 명시 없음 | `DESKTOP` (기본값) |

### 화면 생성 루프

screen-plan.md의 각 화면에 대해 **순차적으로** 아래를 반복합니다. 단일 화면이면 1회만 수행합니다.

#### 4-1: stitch-prompt-generator 서브에이전트 호출

`stitch-prompt-generator` 서브에이전트를 호출하여 프롬프트를 생성합니다.

서브에이전트에 전달할 정보:
- **wireframe 파일 경로**: `artifacts/<feature>/wireframes/<screen-id>.md`
- **DESIGN.md 경로**: 프로젝트 루트의 `DESIGN.md`
- **spec.md 경로**: `artifacts/<feature>/spec.md`
- **시나리오 번호**: screen-plan.md에서 해당 화면이 커버하는 시나리오 번호들
- **출력 경로**:
  - 단일 화면: `artifacts/<feature>/prompt.md`
  - multi-screen: `artifacts/<feature>/screens/<screen-id>/prompt.md`
- **모드**: screen-plan.md의 해당 화면 Mode 값 (light / dark / light+dark)
- **VISUAL CONSISTENCY 블록** (2번째 화면부터): 이전 화면에서 확립된 스타일 정보

**VISUAL CONSISTENCY 블록 생성:**

2번째 화면부터, 이전에 생성된 화면의 HTML/스크린샷을 분석하여 시각적 스타일을 추출합니다.

```markdown
**VISUAL CONSISTENCY (이전 화면 기준):**
- Header: 64px 높이, 로고 좌측, 테마 토글 우측
- 칼럼 너비: ~320px, 칼럼 간격 16px
- 카드: 12px rounded corners, 16px padding
- 우선순위 색상: High=빨강, Medium=노랑, Low=초록
```

#### 4-2: 사용자 확인 (프롬프트)

생성된 프롬프트를 보여주고 승인을 받습니다.

#### 4-3: Stitch 생성

prompt.md의 `mode` 필드에 따라 화면을 생성합니다.

각 모드(Light, Dark)에 대해:

1. `generate_screen_from_text` 호출:
   - `projectId`: stitch.json의 ID
   - `prompt`: prompt.md의 해당 모드 프롬프트 전체
   - `deviceType`: 위에서 결정한 값
2. `get_screen`으로 `htmlCode.downloadUrl`, `screenshot.downloadUrl`을 획득합니다.
3. `curl -L -o`로 HTML과 PNG를 다운로드합니다.

산출물:
- 단일 화면: `artifacts/<feature>/light.html`, `light.png` (+ `dark.html`, `dark.png`)
- multi-screen: `artifacts/<feature>/screens/<screen-id>/light.html`, `light.png` (+ dark)

#### 4-4: 사용자 확인 (화면)

생성된 스크린샷을 보여주고 확인합니다. 사용자는:
- **승인** → 다음 화면으로 진행
- **재생성** → 프롬프트 수정 후 4-3 반복
- **나머지 스킵** → 루프 종료, Step 5로 이동

#### 4-5: 계획 갱신

1. `screen-plan.md`에서 현재 화면의 Status를 `[x] completed`로 업데이트
2. `screen-plan.md`의 `generated` 카운트를 +1
3. 다음 화면이 있으면 **4-1로 돌아감**
4. 모든 화면이 완료되면 **Step 5**로 진행

## Step 5: 완료 보고

### 단일 화면 모드 — 파일 목록

```
artifacts/<feature>/
  spec.md       (기존)
  screen-plan.md (기존 - wireframe에서 생성됨)
  wireframes/   (기존 - wireframe에서 생성됨)
  prompt.md     (생성됨)
  light.html    (생성됨)
  light.png     (생성됨)
  dark.html     (생성됨 - Dark 블록이 있을 때)
  dark.png      (생성됨 - Dark 블록이 있을 때)
```

### Multi-screen 모드 — 파일 목록

```
artifacts/<feature>/
  spec.md              (기존)
  screen-plan.md       (기존 - wireframe에서 생성됨)
  wireframes/          (기존 - wireframe에서 생성됨)
  screens/
    01-<screen-id>/
      prompt.md        (생성됨)
      light.html       (생성됨)
      light.png        (생성됨)
      dark.html        (생성됨 - 해당 시)
      dark.png         (생성됨 - 해당 시)
    02-<screen-id>/
      ...
```

### 요약 출력

- 계획된 화면 수 / 생성된 화면 수
- 각 화면이 커버하는 시나리오 매핑
- Stitch 프로젝트 ID

### 다음 단계 안내

- "화면 생성이 완료되었습니다. 구현을 시작하려면 plan mode로 전환하세요. (Shift+Tab 두 번 또는 `/plan`)"
