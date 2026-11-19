#!/bin/sh
# Stop the prod server on 3340, rebuild (retrying past the Next.js advisory stop), and print the result.
cd "$(dirname "$0")/.."
PID=$(netstat -ano | grep ":3340 " | grep LISTENING | awk '{print $5}' | head -1)
[ -n "$PID" ] && taskkill //PID $PID //F >/dev/null
for i in 1 2 3; do
  OUT=$(npx next build 2>&1)
  echo "$OUT" | grep -q "SecurityFatalError" && continue
  echo "$OUT" | grep -iE "error|✓ Generating" | head -5
  exit 0
done
echo "$OUT" | tail -20
