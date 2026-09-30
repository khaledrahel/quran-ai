# Architecture Decision Records

One file per decision. Sequential. **Immutable once Accepted** — a changed decision is a
new ADR that supersedes the old one. Never edit an accepted ADR except to mark it superseded.

Use `0000-template.md` as the starting point.

Four fields are project-specific and mandatory:

- **Religious-content impact** — forces the question on every decision, not only when remembered
- **Privacy / child-safety impact** — same
- **Reversibility** — determines whether PO approval is required
- **Review trigger** — what would make us revisit this

| ADR | Title | Status |
|---|---|---|
| 0001 | Monorepo repository structure | Accepted |
| 0002 | TypeScript for backend services | Accepted |
| 0003 | Environment strategy: local, staging, production | Accepted |
| 0004 | Forward-only versioned migrations | Accepted |
| 0005 | Secrets management | Accepted |
| 0006 | Vendor abstraction boundary | Accepted |
| 0007 | Qur'an data immutability | Accepted |
| 0008 | Audio lifecycle and retention | Accepted (retention period TBD) |
| 0009 | Confidence engine ownership | Accepted |
| 0010 | Mastery event sourcing | Accepted |
| 0011 | FlutterFlow custom package seam | Accepted |
