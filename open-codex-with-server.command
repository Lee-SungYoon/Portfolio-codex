#!/bin/zsh

PORT=4317
URL="http://localhost:$PORT"
PROJECT="/Users/iseong-yun/Documents/Portfolio-codex"

if ! lsof -nP -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
  open "$PROJECT/start-portfolio.command"
fi

open -a "Codex" 2>/dev/null || open -a "ChatGPT" 2>/dev/null || true
open "$URL"
