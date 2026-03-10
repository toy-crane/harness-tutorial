#!/bin/bash
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

[[ -z "$file_path" ]] && exit 0

# spec 테스트 파일이 아니면 통과
[[ ! "$file_path" =~ \.spec\.test\.(ts|tsx)$ ]] && exit 0

# 파일이 아직 존재하지 않으면 최초 생성 → 통과
[[ ! -f "$file_path" ]] && exit 0

# 기존 spec 테스트 수정 시 사용자 확인 프롬프트
jq -n \
  --arg reason "spec 테스트(수용 기준)를 수정하려 합니다. 요구사항 변경이 맞다면 승인하세요." \
  '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "ask",
      permissionDecisionReason: $reason
    }
  }'
