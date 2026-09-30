# Seed Data — SYNTHETIC ONLY

**Never place real data here. Not real child data, not real audio, not pilot data,
not "just for debugging".**

Local and staging are synthetic-only environments (ADR-0003). This rule is what allows
staging to exist before the PDPL review concludes, and what keeps production child data
off developer machines.

Synthetic seed data must be good enough to exercise real edge cases: varied ages,
reading abilities, mastery states, curricula, and confidence bands. That is ongoing work,
not a one-off.

**Empty.** Generated in P2 alongside the identity schema.
