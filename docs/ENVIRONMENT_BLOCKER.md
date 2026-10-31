# Runtime network-policy mismatch — 2026-10-31

The saved environment configuration contains the correct five domains:

- www.cdc.gov
- www.nhs.uk
- baupvfnujzfugksfzrrq.supabase.co
- api.github.com
- tiny-steps-six.vercel.app

The user supplied a screenshot confirming those entries. Do not request duplicate entries or a different Vercel domain. The production domain is https://tiny-steps-six.vercel.app/.

The attached running instance still reports spec/observed revision 1, restricted policy enforced, and **zero custom allowed hosts**. Requests to CDC/NHS, Supabase and the production site fail at proxy CONNECT with HTTP 403, before reaching the destination. Native Git access is independently available. There is no evidence that the application or production server is the cause of these transport failures.

Agent configuration tools save a draft but do not activate/publish it or restart the runtime. No apply/publish/restart operation is exposed in this task's available tools. The runtime must receive the saved configuration through the platform's supported activation/recovery flow. No broader domain allowance, proxy bypass, TLS workaround or production DNS change is needed.

Reproduction and safe evidence:

```sh
npm run verify:external
```

The command writes `verification-results/external-release/report.json` with transport status, timestamp, target commit/version and source hashes when available. Source HTML is saved only for successful current-run checks; stale files are removed. It exits nonzero on failures. Public URLs and failure codes are enough to diagnose this mismatch; do not share credential files or process environments.

After recovery, rerun that command. Then substantively review the retrieved authoritative source text, implement the source-dependent developmental/safety cards, run their UI/content checks, push the tested changes, and verify the deployed version. A successful HTTP check alone is not content review, and a successful Git push alone is not deployment verification.

Real auth/RLS checks can run independently in the disposable local stack (`npm run test:integration`); production administrative credentials are unnecessary for that test route. See INTEGRATION_TESTING.md.
