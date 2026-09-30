# FlutterFlow Capability Decision

**Status:** ANALYSIS — awaiting PO manual verification · **Date:** 2026-09-30
**Nothing purchased or upgraded. No ADR changed. No application code created.**

Evidence labels: **VERIFIED** (read from FlutterFlow's own pages today) ·
**ASSUMED** (inference, stated as such) · **NEEDS MANUAL VERIFICATION** (must be
confirmed inside the product by the PO)

---

## 1. Current plan capabilities — **VERIFIED** (flutterflow.io/pricing, 2026-09-30)

| Feature (verbatim) | Free $0 | Basic $39 | Growth $80 | Business $150 |
|---|---|---|---|---|
| "Push to GitHub" | ✗ | ✗ | **✓** | ✓ |
| "Code Extensibility" | ✓ | ✓ | ✓ | ✓ |
| "Code Download" | ✗ | **✓** | ✓ | ✓ |
| "Third-Party Package Imports" | **✓** | ✓ | ✓ | ✓ |
| "VS Code Extension" | ✗ | ✗ | ✓ | ✓ |
| "Local Run Desktop Emulator" | ✗ | ✗ | ✗ | **✓** |
| "CLI" | ✗ | ✗ | ✗ | **✓** |
| API endpoints | ≤2 | Unlimited | Unlimited | Unlimited |

Prices are per month, first seat. Growth adds seats at $55, Business at $85 (seats 2–5).
**NEEDS MANUAL VERIFICATION:** currency (presumed USD), annual-billing discount, and
whether regional pricing applies for Saudi Arabia.

> **Which plan you are on today is unknown to me.** Confirm it — everything below depends
> on it.

## 2. GitHub integration — **VERIFIED**

Requires **Growth ($80/mo) or higher**. Not available on Free or Basic.

Mechanics (**VERIFIED**, docs.flutterflow.io/exporting/push-to-github):

- **One-way only.** FlutterFlow pushes to GitHub. It **cannot pull changes back.**
- *"FlutterFlow always pushes changes to a branch named `flutterflow`."*
- *"Avoid making direct changes to this branch, as your changes will be overwritten by
  the next push from FlutterFlow."*
- Documented workflow: a `develop` branch off `flutterflow`, custom changes there,
  PRs from `flutterflow` into `develop`, then `main`.

## 3. Custom Code — **VERIFIED**

"Code Extensibility" is available on **all tiers including Free**. Custom Actions and
Custom Widgets can import package dependencies.

## 4. Custom Package availability — **VERIFIED**

"Third-Party Package Imports" is available on **all tiers including Free**. Dependencies
are entered in a **Pubspec Dependency** field in the code editor, copied from the
package's pub.dev page.

## 5. Git dependency support — 🔴 **NEEDS MANUAL VERIFICATION** (likely NOT supported)

**This is the decisive unknown for ADR-0011.**

Community reports state the pubspec dependency field *"doesn't even allow the characters
needed for a url (like '/')"*, which would make git dependencies impossible through the UI
even though Dart itself supports them.

**Confidence: low-to-moderate.** The primary source is a community post roughly three
years old, and FlutterFlow ships frequently. It may no longer hold. I am not treating it
as fact.

**This single question determines how our package reaches FlutterFlow, and it is testable
on the Free tier in about 10 minutes.**

## 6. Pub.dev dependency support — **VERIFIED**

Supported on all tiers. The documented, first-class path: copy the dependency line from
pub.dev into the Pubspec Dependency field.

## 7. Code download / export — **VERIFIED**

Requires **Basic ($39/mo) or higher**. Not available on Free.

## 8. FlutterFlow CLI — **VERIFIED**

**Business tier only ($150/mo).** Same for "Local Run Desktop Emulator".

**ASSUMED:** we do not need either. The CLI mainly automates code export, which
Push to GitHub already covers at Growth. Local Run is a convenience — a real Android
device serves us better anyway, since we must validate real microphone behaviour.

## 9. Is Growth actually required for our architecture?

**It depends on which option we choose — and the honest answer is: not strictly.**

| Requirement | Free | Basic $39 | Growth $80 |
|---|---|---|---|
| Build UI in FlutterFlow | ✓ | ✓ | ✓ |
| Custom actions calling our package | ✓ | ✓ | ✓ |
| Import our package from pub.dev | ✓ | ✓ | ✓ |
| Get generated code into our repo | ✗ | Manual download | **Automatic push** |
| GitHub as source of truth | ✗ | Achievable manually | Achievable automatically |

**Growth buys automation, not capability.** Basic achieves the same end state through a
manual download-and-commit step. Free cannot get generated code out at all.

## 10. Can GitHub + Claude Code remain the engineering source of truth?

**Yes — with one structural caveat you should understand clearly.**

Because the integration is **one-way**, GitHub can never be the source of truth for the
*UI*. FlutterFlow owns the UI definition; the repository holds a generated *copy*. Editing
generated code in GitHub achieves nothing — the next push overwrites it.

What GitHub genuinely is the source of truth for: our custom package, all backend
services, schema and migrations, RLS policies, tests, CI, and every document. That is the
large majority of the system and all of the safety-critical parts.

**This matches ADR-0011's intent.** The ADR already declares `apps/flutterflow/` a
read-only mirror. Reality is slightly stricter than the ADR's wording implies, not
different in kind.

## 11. Minimum plan required

| Goal | Minimum plan |
|---|---|
| Answer the git-dependency question (spike Q2) | **Free** |
| Validate custom action → package → microphone → record (spike Q3) | **Free** |
| Get generated code into our repository at all | **Basic $39** |
| Automated Push to GitHub per ADR-0011 | **Growth $80** |
| CLI / Local Run | Business $150 — **not needed** |

**Minimum for the architecture as designed: Growth ($80/mo).**
**Minimum to run the spike and resolve the blocker: Free ($0).**

## 12. Limitations affecting ADR-0011

| # | Finding | Severity | Effect |
|---|---|---|---|
| L1 | Branch is named **`flutterflow`**, not `flutterflow/main` | **Low — factual error in our docs** | ADR-0011 and `branching-and-ci.md` name the wrong branch. Needs a correction. |
| L2 | Sync is **one-way**; FlutterFlow cannot pull from GitHub | Low | Consistent with the ADR's read-only mirror; worth stating explicitly |
| L3 | FlutterFlow's docs recommend a **`develop` branch** between `flutterflow` and `main` | Low–Medium | Our approved strategy has no `develop` branch. Either adopt it or PR `flutterflow` → `main` directly. |
| L4 | **Git dependencies probably unsupported** | 🔴 **High if confirmed** | Package must be published to pub.dev, or distributed another way. Changes how we version and release it. |
| L5 | Push to GitHub needs **Growth** | Medium | A recurring cost, or a manual workflow on Basic |
| L6 | No code export at all on Free | Medium | Free is fine for the spike, not for building |

**None of these invalidate ADR-0011.** L4 changes the *distribution mechanism* for the
package, not the decision to have one. The ADR's core claim — real logic in a versioned,
tested Flutter package; FlutterFlow for UI; thin wrappers between — survives intact.

**L1 is a genuine error I introduced.** I wrote `flutterflow/main` in ADR-0011 and in the
branching doc; the actual branch is `flutterflow`. Not changing it now, per your
instruction, but it needs correcting before the workflow is used.

## 13. Architecture options

### Option A — FlutterFlow + GitHub + custom package (ADR-0011 as written)

```
FlutterFlow --Push to GitHub--> `flutterflow` branch --PR--> main
                                                              |
packages/quran_recitation_kit  <--- pub.dev or git dependency
```

Requires **Growth $80/mo**. Automated, matches the approved ADR.
**Contingent on L4:** if git dependencies are unsupported, the package must be published
to pub.dev — public, or private via a self-hosted pub server.

### Option B — FlutterFlow UI + externally published package

Identical in structure, but the package is **deliberately** published to pub.dev and
consumed as a normal versioned dependency. Works on **any tier including Free**, because
pub.dev imports are universally supported.

Trade-off: a publish step on every package change, and public visibility unless a private
pub server is used. Benefit: it is the path FlutterFlow actually supports first-class, so
it cannot break on us.

### Option C — FlutterFlow for UI/prototyping, Flutter code maintained externally

FlutterFlow used to design and generate the UI once; the code is then downloaded
(**Basic $39**) and maintained in our repository as ordinary Flutter, with FlutterFlow
progressively retired.

Trade-off: the PO loses visual editing, and the UI becomes my responsibility — a real cost
given you are not a full-time developer. Benefit: full control, no plan dependency, no
one-way-sync awkwardness. **This is the fallback if the seam proves unworkable, not a
first choice.**

### Recommendation

**Option A, with Option B as the dependency mechanism if L4 is confirmed.** They are the
same architecture; only package distribution differs. Do not choose Option C unless the
spike fails outright.

---

## Bottom line

**Minimum plan for the architecture: Growth ($80/mo).**
**Minimum to resolve the blocker: Free ($0).**

**Do not upgrade yet.** The decisive unknown (L4, git dependency support) is testable on
the Free tier. If git dependencies are unsupported, we publish to pub.dev instead — and
that works on every tier, which could mean Growth buys only convenience.

Spending $80/month before knowing that is premature. Verify first, then decide.

## What to verify manually in FlutterFlow — ~30 minutes

| # | Check | Where | Why |
|---|---|---|---|
| 1 | **Which plan am I on?** | Account / Billing | Everything depends on it |
| 2 | Is **Push to GitHub** visible? | Settings → Integrations, or Deploy | Confirms tier gating |
| 3 | Open a **Custom Action** and find the **Pubspec Dependency** field | Custom Code → Actions | Confirms the mechanism exists |
| 4 | 🔴 **Paste a git dependency into that field** (see below) and report whether it accepts it | Same field | **Resolves L4 — the decisive question** |
| 5 | Does a plain pub.dev line work? e.g. `record: ^5.0.0` | Same field | Confirms the fallback path |
| 6 | Is **Code Download** available? | Deploy / Download | Confirms tier |

**For check 4, try pasting exactly this:**

```yaml
quran_recitation_kit:
  git:
    url: https://github.com/khaledrahel/quran-ai.git
    path: packages/quran_recitation_kit
```

Report precisely what happens — accepted, rejected, characters stripped, or multi-line
input refused. **A screenshot would be ideal.** The repository path above does not exist
yet as a package, so this tests only whether the *field* accepts the syntax; it will not
build, and that is fine.

## Execution log

| Date | Action | By |
|---|---|---|
| 2026-09-30 | Capabilities researched from FlutterFlow pricing and docs. Nothing purchased. L1 documentation error identified. | Claude |
