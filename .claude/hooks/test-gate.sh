#!/bin/bash

# 무한 루프 방지: 재시도 카운터
COUNTER_FILE="/tmp/claude-test-gate-retry"
COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
COUNT=$((COUNT + 1))
echo "$COUNT" > "$COUNTER_FILE"

if [ "$COUNT" -ge 3 ]; then
  echo "3회 재시도 후에도 테스트 실패. 사용자 개입 필요." >&2
  rm -f "$COUNTER_FILE"
  exit 0
fi

# 테스트 실행
if bun run test 2>/tmp/test-gate.err; then
  rm -f "$COUNTER_FILE"
  exit 0
else
  echo "테스트 실패 (시도 $COUNT/3):" >&2
  tail -30 /tmp/test-gate.err >&2
  exit 2
fi
