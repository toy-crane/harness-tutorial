#!/bin/bash
input=$(cat)
stop_hook_active=$(echo "$input" | jq -r '.stop_hook_active // false')

[[ "$stop_hook_active" == "true" ]] && exit 0

cd "$(git rev-parse --show-toplevel)" || exit 0

test_output=$(bun run test 2>&1)
test_exit_code=$?

if [[ $test_exit_code -ne 0 ]]; then
  summary=$(echo "$test_output" | tail -50)
  echo "전체 테스트 실패. 수정 후 다시 시도하세요:
$summary" >&2
  exit 2
fi

exit 0
