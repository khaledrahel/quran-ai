# Runbook: Credential Compromise

## Triggers

- Secret scanner alert
- A key committed to the repository, even briefly
- Unexpected access patterns in provider or Supabase logs
- Lost or compromised device with credential access
- Provider notification of compromise

## Immediate response

1. **Rotate the credential.** Do not merely delete the file — git history is permanent,
   and a key that was once committed must be treated as public forever.
2. **Revoke** the old credential at the provider.
3. **Alert the PO.**
4. **Assess blast radius** using the table below.

## Blast radius by credential

| Credential | Exposure |
|---|---|
| **Supabase service-role key** | **Bypasses RLS — every child record in the system.** Highest severity. |
| Supabase anon key | Low — public by design; RLS is the protection. Verify RLS is actually sound. |
| ASR / AI provider key | Financial abuse; potential access to submitted audio |
| Mobile signing credentials | Ability to publish a malicious build under our identity. Severe. |
| GitHub access | Source code; potential to inject code into the pipeline |

## If the service-role key was exposed

Treat as a data incident as well. Follow `data-incident.md` in parallel.

## Resolution

- New credential issued and deployed
- Old credential confirmed revoked
- Access logs reviewed for the full exposure window
- If a key was committed: it stays in history; rotation is the only real remedy

## Prevention

- Secret scanning in CI (mandatory, not optional)
- `.env` gitignored from the first commit
- MFA on every account
- Never paste secrets into chat or into any tool
- Password manager for account credentials
