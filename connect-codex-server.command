#!/bin/zsh

PORT=4317
URL="http://localhost:$PORT"
PROJECT="/Users/iseong-yun/Documents/Portfolio-codex"
NODE="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"

cd "$PROJECT" || exit 1

if lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  echo "SY Archive is already running at $URL"
  exit 0
fi

echo "Starting SY Archive for Codex..."
echo "Open $URL in the in-app browser."

nohup "$NODE" node_modules/next/dist/bin/next dev -H 127.0.0.1 -p "$PORT" > /tmp/sy-archive-codex.log 2> /tmp/sy-archive-codex.error.log &

for attempt in {1..20}; do
  if lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
    echo "SY Archive is ready at $URL"
    exit 0
  fi
  sleep 1
done

echo "SY Archive did not start within 20 seconds."
echo "Check /tmp/sy-archive-codex.error.log"
exit 1
