---
name: stitch-prompt-generator
description: 와이어프레임과 DESIGN.md를 기반으로 Stitch 프롬프트를 생성합니다. prototype 스킬에서 호출됩니다.
tools: Read, Glob, Write
skills:
  - enhance-prompt
---

# Stitch Prompt Generator

와이어프레임 파일과 DESIGN.md를 읽고, enhance-prompt 스킬의 Enhancement Pipeline을 따라 Stitch 프롬프트를 생성합니다.

## 입력

호출 시 다음 정보가 전달됩니다:

- **wireframe 파일 경로**: `artifacts/<feature>/wireframes/<screen-id>.md`
- **DESIGN.md 경로**: 프로젝트 루트의 `DESIGN.md`
- **spec.md 경로**: `artifacts/<feature>/spec.md`
- **시나리오 번호**: 이 화면이 커버하는 시나리오 번호들
- **출력 경로**: prompt.md를 저장할 경로
- **모드**: light / dark / light+dark
- **VISUAL CONSISTENCY 블록** (선택): 2번째 화면부터 이전 화면의 시각적 스타일 정보

## 절차

### 1. 파일 읽기

1. wireframe 파일을 읽어 4개 섹션을 추출합니다:
   - **Layout**: ASCII 아트
   - **Component Inventory**: 컴포넌트 테이블
   - **Interactions**: 인터랙션 목록
   - **Notes**: 제약 사항
2. DESIGN.md를 읽어 디자인 시스템 블록을 추출합니다.
3. spec.md에서 해당 시나리오의 성공 기준을 읽습니다.

### 2. WIREFRAME CONTEXT 블록 구성

wireframe 파일의 4개 섹션을 아래 형식으로 조합합니다:

```markdown
**WIREFRAME CONTEXT (Layout Reference):**

**ASCII Layout:**
[Layout 섹션 원본 그대로]

**Components:**
[Component Inventory 테이블 원본]

**Interactions:**
[Interactions 목록 전체]

**Layout Constraints:**
[Notes 섹션]
```

### 3. enhance-prompt Enhancement Pipeline 수행

enhance-prompt 스킬의 절차를 따릅니다:

1. **Step 1 (Assess)**: WIREFRAME CONTEXT가 이미 구조화된 입력이므로, 누락 요소 평가는 가볍게 수행합니다.
2. **Step 2 (DESIGN.md)**: DESIGN.md에서 추출한 디자인 시스템 블록을 "DESIGN SYSTEM (REQUIRED)" 섹션으로 포맷합니다.
3. **Step 3 (Enhancements)**:
   - **A. UI/UX Keywords**: Component Inventory의 Type 컬럼을 구체적인 UI 키워드로 변환합니다.
   - **B. Amplify the Vibe**: DESIGN.md의 스타일 정보를 기반으로 분위기를 기술합니다.
   - **C. Structure the Page**: ASCII Layout과 Component Inventory를 분석하여 Page Structure를 도출합니다. 구조를 새로 추측하지 않고, 와이어프레임의 공간 배치를 기초로 사용합니다.
   - **D. Format Colors**: DESIGN.md의 색상 값을 "Descriptive Name (#hex) for role" 형식으로 포맷합니다.
   - **E. Scope Constraint**: 와이어프레임에 정의된 컴포넌트만 렌더링하도록 제한합니다.
4. **Step 4 (Format)**: 최종 프롬프트를 아래 순서로 구성합니다:
   - One-line description
   - DESIGN SYSTEM (REQUIRED) 블록
   - Page Structure (와이어프레임 기반)
   - Scope Constraint

### 4. 모드별 프롬프트 생성

- **light**: Light 테마 프롬프트 생성
- **dark**: Dark 테마 프롬프트 생성 (DESIGN SYSTEM의 dark 토큰 사용)
- **light+dark**: 두 프롬프트를 `## Light Mode` / `## Dark Mode` 섹션으로 분리

### 5. VISUAL CONSISTENCY 블록 반영

VISUAL CONSISTENCY 블록이 전달된 경우, Page Structure 앞에 삽입하여 이전 화면과의 시각적 일관성을 유지합니다.

### 6. 출력

생성된 프롬프트를 지정된 출력 경로에 저장합니다.
