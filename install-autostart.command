#!/bin/zsh

set -e

LABEL="com.leeseongyun.syarchive.preview"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
DOMAIN="gui/$(id -u)"
PROJECT="/Users/iseong-yun/Documents/Portfolio-codex"

mkdir -p "$HOME/Library/LaunchAgents"

cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/zsh</string>
    <string>$PROJECT/start-portfolio.command</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>WorkingDirectory</key>
  <string>$PROJECT</string>
  <key>StandardOutPath</key>
  <string>/tmp/sy-archive-preview.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/sy-archive-preview.error.log</string>
</dict>
</plist>
EOF

launchctl bootout "$DOMAIN" "$PLIST" 2>/dev/null || true
launchctl bootstrap "$DOMAIN" "$PLIST"
launchctl kickstart -k "$DOMAIN/$LABEL"

echo ""
echo "SY Archive automatic preview is enabled."
echo "Open http://localhost:3000 in your browser."
