# GitHub authentication for the portfolio editor

The public site is hosted by GitHub Pages. Decap CMS needs a small separate OAuth service so its `/admin` page can sign in to GitHub without exposing an OAuth secret in this repository.

Use the official Decap CMS Cloudflare Worker template: https://github.com/sterlingwes/decap-proxy

## One-time setup

1. Create a GitHub OAuth App while signed in as `segunoluyi`.
   - Homepage URL: the Worker URL, for example `https://segun-portfolio-cms-auth.<account>.workers.dev`
   - Callback URL: the same Worker URL followed by `/callback`
2. Deploy the Cloudflare Worker from the template.
3. Add its two secrets in Cloudflare: `GITHUB_OAUTH_ID` and `GITHUB_OAUTH_SECRET`.
4. Copy the deployed Worker URL into `admin/config.yml` as `backend.base_url`.
5. Commit and push this repository. Then visit `https://segunoluyi.github.io/portfolio/admin/` and sign in with GitHub.

The OAuth secret belongs only in Cloudflare's secret store. Never add it to this repository or the GitHub Pages site.
