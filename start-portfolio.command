#!/bin/zsh

cd "/Users/iseong-yun/Documents/Portfolio-codex" || exit 1
export PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"

echo "Starting SY Archive..."
echo "Open http://localhost:3000 in your browser."
echo ""

node node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3000
