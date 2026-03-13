#!/bin/bash
input=$(cat)
stop_hook_active=$(echo "$input" | jq -r '.stop_hook_active // false')

# Stop hook이 이미 한 번 block하여 재실행된 경우, 무한 루프 방지를 위해 스킵
[[ "$stop_hook_active" == "true" ]] && exit 0

cd "$(git rev-parse --show-toplevel)" || exit 0

# 변경된 파일이 없으면 테스트 스킵
git diff --quiet HEAD -- ':!node_modules' ':!dist' ':!.next' 2>/dev/null && exit 0

# 소스/테스트 코드 변경이 없으면 테스트 스킵 (md, yaml 등 문서만 변경된 경우)
git diff HEAD --name-only -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.css' | grep -q . || exit 0

test_output=$(bun run test 2>&1)
test_exit_code=$?

if [[ $test_exit_code -ne 0 ]]; then
  summary=$(echo "$test_output" | tail -50)
  echo "전체 테스트 실패. 수정 후 다시 시도하세요:
$summary" >&2
  exit 2
fi

exit 0
