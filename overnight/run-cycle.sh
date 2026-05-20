#!/usr/bin/env bash
# Overnight autonomous cycle for reference-sites
# Usage: bash overnight/run-cycle.sh [cycle_name]
# Triggers: one Claude Code headless invocation per cycle, working through QUEUE.md
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
CYCLE="${1:-cycle-$(date +%H%M)}"
LOG="overnight/logs/${CYCLE}.log"
mkdir -p overnight/logs

echo "== $(date) == starting cycle $CYCLE" | tee -a "$LOG"

# 1. Sync branch
git fetch origin claude/setup-mcp-api-keys-t4GTr 2>&1 | tee -a "$LOG"
git checkout claude/setup-mcp-api-keys-t4GTr 2>&1 | tee -a "$LOG"
git pull --ff-only origin claude/setup-mcp-api-keys-t4GTr 2>&1 | tee -a "$LOG" || echo "pull skipped" | tee -a "$LOG"

# 2. Drive Claude Code headless on the next pending QUEUE.md item
PROMPT="$(cat <<EOF
Read overnight/QUEUE.md. Pick the FIRST unchecked item under '## Pending'.
Implement it end-to-end:
  1. Read notes/reel-techniques.json and coco-veda/ for reference
  2. Edit build.js (do NOT rewrite, surgical edits only)
  3. Run 'node build.js' and confirm 'Generated 70 pages'
  4. Inspect output: grep for the renderer class in styles/<archetype>.html, ensure >0 matches
  5. Stage explicit files only, commit with conventional msg, push to claude/setup-mcp-api-keys-t4GTr
  6. Edit overnight/QUEUE.md: move the item from '## Pending' to '## Done' with the commit SHA
If blocked, log the reason under '## Blocked' and exit cleanly.
Hard rule: NEVER merge to main. NEVER use external image hotlinks. NEVER touch shared/lib.js without need.
EOF
)"

# Headless invocation — adjust path if claude CLI is elsewhere
if command -v claude >/dev/null 2>&1; then
  claude -p "$PROMPT" --output-format text 2>&1 | tee -a "$LOG"
else
  echo "claude CLI not on PATH — install or alias before scheduling" | tee -a "$LOG"
  exit 1
fi

# 3. Verify build still passes
node build.js 2>&1 | tee -a "$LOG"

# 4. Push any final state
git push origin claude/setup-mcp-api-keys-t4GTr 2>&1 | tee -a "$LOG" || true

echo "== $(date) == cycle $CYCLE complete" | tee -a "$LOG"
