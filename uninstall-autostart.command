#!/bin/zsh

LABEL="com.leeseongyun.syarchive.preview"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
DOMAIN="gui/$(id -u)"

launchctl bootout "$DOMAIN" "$PLIST" 2>/dev/null || true
rm -f "$PLIST"

echo "SY Archive automatic preview is disabled."
