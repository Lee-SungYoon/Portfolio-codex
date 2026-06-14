#!/bin/zsh
set -euo pipefail

LABEL="com.sy.portfolio.nas-sync"
PLIST_PATH="$HOME/Library/LaunchAgents/$LABEL.plist"

launchctl unload "$PLIST_PATH" >/dev/null 2>&1 || true
rm -f "$PLIST_PATH"

echo "Removed NAS sync agent"
