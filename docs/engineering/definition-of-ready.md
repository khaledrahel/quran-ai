# Definition of Ready

**Status:** Approved (F15) · 2026-09-30

Work may start when **all** of the following hold.

1. It serves an approved MVP scope item — see `docs/product/mvp-scope.md`
2. Acceptance criteria are written
3. Dependencies identified and unblocked, or the blocker is explicit and accepted
4. **No `BLOCKED` decision sits upstream of it**
5. Religious-content implications identified, with a conservative interim behaviour
   defined if WS-1 is still open
6. Privacy implications identified
7. Test approach known
8. PO manual steps identified **in advance**, not discovered mid-task
9. Reversibility understood; irreversible steps have explicit approval

## On rule 4

This is what prevents building a complete integration against a provider we then cannot
legally use. Currently blocked upstream: production region, production storage, audio
retention period, ASR provider, AI provider (all WS-4); all religious approval (WS-1).

Work that depends on these does not start. Work that uses fixtures and provider-neutral
interfaces does.
