#!/bin/bash

# stdin으로 Claude가 실행하려는 도구 정보를 JSON으로 받음
input=$(cat)

# 실행하려는 명령어 추출
command=$(echo "$input" | jq -r '.tool_input.command // empty')

# 테스트 명령이 아니면 그대로 통과
if [[ ! "$command" =~ (bun\ (run\ )?test|bunx\ jest|bunx\ vitest|pytest) ]]; then
  exit 0
fi

# 테스트 명령에 필터링 파이프 추가
filtered_command="$command 2>&1 | grep -E -A 10 '(FAIL|ERROR|WARN|Tests:|Test Suites:|✕|✗|FAILED|assert)' || true"

# jq를 사용하여 안전한 JSON 생성
jq -n \
  --arg cmd "$filtered_command" \
  '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      updatedInput: {
        command: $cmd
      }
    }
  }'
