# Overnight runner

## What
`run-cycle.sh` pulls the branch, fires one headless `claude -p` invocation that picks the next item in `QUEUE.md`, implements it, commits, pushes, then verifies the build. One cycle ≈ 1 queue item.

## How to schedule on Windows
Open Task Scheduler → Create Basic Task:
- Trigger: Daily at 01:00 (or hourly between 22:00–06:00 — recommended)
- Action: Start a program
  - Program: `C:\Program Files\Git\bin\bash.exe`
  - Arguments: `-c "cd /c/Users/Admin/AppData/Local/Temp/reference-sites && bash overnight/run-cycle.sh nightly"`
- Conditions: run whether user logged on or not; wake computer if needed
- Settings: stop task if runs > 30 min

## Manual one-shot
```bash
cd /c/Users/Admin/AppData/Local/Temp/reference-sites
bash overnight/run-cycle.sh
```

## Hard limits
- Requires `claude` CLI on PATH and authenticated. If using cloud routines instead, see `~/.claude/projects/.../memory/claude_code_routines_offload.md`.
- Each cycle is bounded — runs ONE item then exits. Multiple items = multiple cycles. Schedule every 30–60 min for steady throughput.
- Pull/push need credentials cached (gh auth login or git credential manager).
- Branch is locked to `claude/setup-mcp-api-keys-t4GTr`. Never main.

## What gets logged
`overnight/logs/<cycle>.log` — full git output, Claude transcript, build output. Inspect after wake-up:
```bash
ls overnight/logs/ | tail -5
tail -100 overnight/logs/nightly.log
```
