#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
LABEL="com.sy.portfolio.nas-sync"
PLIST_PATH="$HOME/Library/LaunchAgents/$LABEL.plist"
NODE_PATH="$(command -v node)"
INTERVAL_MINUTES="${NAS_SYNC_INTERVAL_MINUTES:-5}"
INTERVAL_SECONDS=$((INTERVAL_MINUTES * 60))

mkdir -p "$HOME/Library/LaunchAgents"

cat > "$PLIST_PATH" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>$NODE_PATH</string>
    <string>$ROOT_DIR/scripts/sync-nas-portfolio.mjs</string>
  </array>
  <key>WorkingDirectory</key>
  <string>$ROOT_DIR</string>
  <key>StartInterval</key>
  <integer>$INTERVAL_SECONDS</integer>
  <key>RunAtLoad</key>
  <true/>
  <key>StandardOutPath</key>
  <string>$ROOT_DIR/.nas-sync.log</string>
  <key>StandardErrorPath</key>
  <string>$ROOT_DIR/.nas-sync.log</string>
</dict>
</plist>
PLIST

launchctl unload "$PLIST_PATH" >/dev/null 2>&1 || true
launchctl load "$PLIST_PATH"

echo "Installed NAS sync agent at $PLIST_PATH"
echo "Interval: every $INTERVAL_MINUTES minute(s)"
