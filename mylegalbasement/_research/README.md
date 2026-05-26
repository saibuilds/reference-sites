# _research/ — backup mirror

These are copies of the canonical research/learnings docs from the repo
root, mirrored here as a safety backup per the user's request.
**Canonical source is the repo root** — when something changes there,
re-mirror these (or accept they'll drift). To re-mirror manually:

```
for f in LEARNINGS.txt BOOTSTRAP.md PROMPTS-MANUAL.md HANDOFF.md \
         STACK.md GHL-PRODUCTION.md ARSENAL.md BROWSER.md \
         NETWORK.md LISTINGS.md MCP-SETUP.md README.md \
         PROMPTS.md .mcp.env.example; do
  cp "../../$f" .
done
mkdir -p notes
for f in tools-research.md session-learnings.md \
         frontend-stack-learnings.md coco-veda-analysis.md \
         parity-audit.md; do
  cp "../../notes/$f" notes/
done
```

Snapshotted: 2026-05-26.
