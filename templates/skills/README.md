# SKILL.md Templates for Multi-Agent Teams

Use these as starter Skill packages when an agent needs deterministic workflows, strict formats, or reusable scripts.

## Included Templates

- `coding-handoff/SKILL.md` — branch/PR handoffs, review loops, release-ready status
- `research-intel/SKILL.md` — market scans, signal extraction, confidence scoring
- `leadgen-qualification/SKILL.md` — lead sourcing, enrichment, ICP scoring, next actions
- `content-repurpose/SKILL.md` — turn one source into X/LinkedIn/Reddit variants
- `ops-triage/SKILL.md` — inbox/calendar/task triage with priority routing

## Usage

1. Copy one template into an agent-local skills folder.
2. Rename `name`/`description` in frontmatter.
3. Add role-specific references under `references/`.
4. Keep SKILL.md concise; move long docs to references.

Recommended path:

`agents/<agent>/skills/<skill-name>/SKILL.md`
