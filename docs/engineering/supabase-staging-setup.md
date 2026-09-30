# Supabase Staging Setup

**Status:** DOCUMENTATION ONLY — no project has been created · 2026-09-30
**Owner of execution:** Khaled (PO) · **Time:** ~20 minutes

> **Staging holds synthetic data only** (ADR-0003). Never real child data, never pilot
> data, never "just for debugging". This rule is what allows staging to exist before the
> PDPL review concludes.
>
> **Do not create a production project.** Production is blocked on WS-4.

---

## Why staging can be created now

The production region is blocked on the PDPL/residency review. Staging is not, because it
will never contain a real person's data. Its region carries no regulatory weight.

This is the decision that keeps roughly four weeks of engineering moving while WS-4 runs.

---

## Steps

### 1. Create the account
https://supabase.com → sign up → **enable MFA** (Account → Security).

### 2. Create the project

| Field | Value |
|---|---|
| Name | `quran-ai-staging` |
| Database password | Generate a strong one → **save it in your password manager** |
| Region | Any. **Region does not matter for staging.** Choose one close to you for latency. |
| Plan | Free tier is sufficient |

**Name it with `-staging`.** When you later create production, the names must be
impossible to confuse — a wrong-project action is the kind of mistake that is easy to make
and hard to undo.

### 3. Create the storage bucket

Storage → New bucket:

| Field | Value |
|---|---|
| Name | `spike-audio` |
| Public | **OFF** — must be private |
| File size limit | 10 MB |

**Verify "Public" is off before continuing.** A public audio bucket would be a serious
finding even with synthetic content, because it sets a pattern we would carry forward.

### 4. Collect the credentials — do not paste them into chat

Settings → API. You need two values:

| Value | Where it goes |
|---|---|
| Project URL | `.env` → `SUPABASE_URL` |
| `anon` / publishable key | `.env` → `SUPABASE_ANON_KEY` |

Then in the repository root:

```bash
cp .env.example .env
```

and fill in those two values. **`.env` is gitignored and will never be committed.**

**Do not copy the `service_role` key anywhere yet.** It bypasses RLS and is the highest-
value secret in the project (ADR-0005). We do not need it until backend work begins, and
it must never reach a client, FlutterFlow, or the repository.

### 5. Tell me it is ready

I will verify connectivity by reading `.env` locally. I will not ask you to send a key.

---

## What is deliberately NOT done here

| Not done | Why |
|---|---|
| Schema / tables | Schema design is a separate step requiring your approval |
| Migrations | Forward-only, reviewed, applied by CI (ADR-0004) |
| RLS policies | Designed and tested with the schema |
| Production project | **Blocked on WS-4** |
| Service-role key handling | Not needed yet |
| Real data of any kind | Prohibited in staging, permanently |

---

## Local development (later, needs Docker)

Once Docker Desktop and the Supabase CLI are installed, `supabase/config.toml` in this
repository configures a **local** stack:

```bash
supabase start      # local Postgres, Auth, Storage, Studio
supabase db reset   # rebuild from migrations + synthetic seed
supabase stop
```

Local is entirely separate from staging. `config.toml` contains no secrets and does not
connect to any hosted project.

**Not required for the current step** — the analysis interfaces run on Node alone.

---

## Configuration decisions recorded in `config.toml`

| Setting | Value | Reason |
|---|---|---|
| `api.max_rows` | 200 | Learner queries paginate rather than bulk-fetch |
| `storage.file_size_limit` | 10 MiB | Recitations are short; limits accidental bulk upload |
| `auth.enable_anonymous_sign_ins` | `false` | Parent owns the account; learners never authenticate independently |
| `auth.sms.enable_signup` | `false` | Not an MVP decision yet |
| Third-party auth providers | none | Adding one requires an ADR and PO approval |
| `analytics.enabled` | `false` | No analytics touching child data |

## Execution log

| Date | Action | By |
|---|---|---|
| 2026-09-30 | Documented. **No project created.** | Claude |
