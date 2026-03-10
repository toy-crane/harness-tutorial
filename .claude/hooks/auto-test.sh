#!/bin/bash
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

[[ -z "$file_path" ]] && exit 0
[[ ! "$file_path" =~ \.(ts|tsx)$ ]] && exit 0

basename=$(basename "$file_path")
[[ "$basename" =~ \.(config|setup)\. ]] && exit 0
[[ "$basename" =~ ^(next|postcss|tailwind|vitest|eslint)\. ]] && exit 0

cd "$(git rev-parse --show-toplevel)" || exit 0

test_output=$(bunx vitest related "$file_path" --run --reporter=verbose 2>&1)
test_exit_code=$?

echo "$test_output" | grep -q "No test files found" && exit 0

if [[ $test_exit_code -ne 0 ]]; then
  summary=$(echo "$test_output" | tail -80)
  jq -n --arg ctx "[auto-test] FAIL (exit $test_exit_code):
$summary" \
    '{ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: $ctx } }'
else
  pass_line=$(echo "$test_output" | sed 's/\x1b\[[0-9;]*m//g' | grep -E "Tests.*passed" | tail -1)
  jq -n --arg ctx "[auto-test] PASS: $pass_line" \
    '{ hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: $ctx } }'
fi
