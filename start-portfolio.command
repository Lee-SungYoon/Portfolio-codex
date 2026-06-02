#!/bin/zsh

cd "/Users/iseong-yun/Documents/Portfolio-codex" || exit 1
export PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"

echo "Starting SY Archive with automatic refresh..."
echo "Open http://localhost:3100 in your browser."
echo ""

node node_modules/next/dist/bin/next dev -H 127.0.0.1 -p 3100
