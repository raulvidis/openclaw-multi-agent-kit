---
name: research-intel
description: Produce concise, decision-ready market intelligence briefs with confidence and source quality scoring. Use for competitor analysis, trend detection, and strategic signal synthesis.
---

# Research Intel Skill

## Output Schema

Return in this order:

1. Key signal
2. Why it matters now
3. Evidence bullets
4. Confidence score (0-100)
5. Contrarian risk
6. Recommended next action

## Source Hygiene

- Prefer primary sources first.
- Separate facts from inference.
- Mark outdated or weak sources explicitly.

## Escalation Rule

If confidence < 60, return "needs validation" and request targeted follow-up queries.
