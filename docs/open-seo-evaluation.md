# OpenSEO: free workflow adaptation

Reviewed 2026-09-28: https://github.com/every-app/open-seo at commit `0ffff93101043aad7600a3b6a499a0cd2887ef49` (MIT).

The full service is not an ongoing zero-cost substitute for Search Console. Its README and `docs/DATAFORSEO_API_KEY.md` require pay-as-you-go DataForSEO for SEO datasets. `docs/SELF_HOSTING_DOCKER.md` also names OpenRouter for AI features. Self-hosting does not remove provider charges. No provider account, paid API, Docker service, hosted subscription or OpenSEO MCP server was installed.

Adopted workflow ideas from `plugins/openseo/skills/seo-audit/SKILL.md`: reuse recent research, keep business context durable, focus on a few useful recommendations, and distinguish first-party measurements from third-party estimates. This is a small independently implemented adaptation, not the OpenSEO application or a port of its complete crawler.

Run `node scripts/seo-catalog-audit.mjs` from the repository. It uses existing build tooling, no network or LLM API, and checks guide metadata, duplicate titles, sitemap membership and guide link destinations. A content fingerprint reuses unchanged reports. Console output is bounded; full findings are saved privately at `../organic-growth-state/catalog-audit.json`. Read only relevant records after the summary. This reduces repeated source reading, but actual Codex credit savings have not been measured.

Source checks do not establish HTTP behavior, rendered canonical tags, rankings, backlinks or conversions. Keep authenticated Search Console browser evidence and conditional live release tests. For a larger future deployment, review upstream license/security/cost requirements again and obtain an explicit API budget first.
