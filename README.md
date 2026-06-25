# Sterling District

CaretCMS starter theme — Astro 7 storefront on Cloudflare Workers with inline editing, Studio, and Zod schemas.

Sterling District is a production-ready jewelry storefront built to show how CaretCMS fits an Astro site end to end. The theme ships with seeded pages (home, collections, luxury, services, contact), a product catalog with detail views, FAQs, testimonials, and global site settings — all typed from Zod schemas in `src/content-schema.ts` and editable in Studio at `/admin/cms`. On the front end, pages are server-rendered with Tailwind CSS 4; on the back end, content lives in Cloudflare KV, media uploads go to R2, and templates are wired for inline editing via `data-caret` attributes from `caretize`. Clone it as a starting point for your own CaretCMS + Cloudflare site, swap the seed content, and deploy to Workers.

| | |
| --- | --- |
| Inline editing | `/admin` |
| Studio | `/admin/cms` |
| Schemas | `src/content-schema.ts` |
| Storage | KV (`CMS_KV`) + R2 (`CMS_R2`) |
| Templates | `data-caret` from `caretize --all` |

[`@caretcms/core`](https://www.npmjs.com/package/@caretcms/core) · [`@caretcms/cloudflare`](https://www.npmjs.com/package/@caretcms/cloudflare) · [`@caretcms/zod`](https://www.npmjs.com/package/@caretcms/zod) · [`@caretcms/caretize`](https://www.npmjs.com/package/@caretcms/caretize)

Node 20+, npm. Cloudflare account for deploy.

## Local

```sh
npm install
npm run dev
```

Open `/admin`. Without `CARET_EDIT_PASSWORD`, the dev password prints in the terminal.

```sh
cp .env.example .env
cp .env.example .dev.vars
```

Same values in both — Astro reads `.env`, Wrangler reads `.dev.vars`:

- `CARET_EDIT_PASSWORD`
- `CARET_SESSION_SECRET` — `openssl rand -base64 32`
- `R2_PUBLIC_DOMAIN`
- `PUBLIC_CONTACT_FORM_ENDPOINT` — optional; form is UI-only without it

Preview on the Workers runtime: `npm run preview:cf`

## Deploy

```sh
npx wrangler kv namespace create CMS_KV
npx wrangler r2 bucket create sterling-district-uploads
cp wrangler.production.toml.example wrangler.production.toml
# fill KV id + R2 bucket
npm run deploy:production
```

Set editor auth once in Cloudflare (not in GitHub Actions):

```sh
npx wrangler secret put CARET_EDIT_PASSWORD
npx wrangler secret put CARET_SESSION_SECRET
```

### CI

Pushes to `main` → [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

| Name | Type |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Secret — [Edit Cloudflare Workers](https://dash.cloudflare.com/profile/api-tokens) template |
| `CLOUDFLARE_ACCOUNT_ID` | Secret |
| `CF_KV_NAMESPACE_ID` | Variable |
| `CF_R2_BUCKET_NAME` | Variable |

## Content

Seeds in `src/content/seeds`. Schemas in `src/content-schema.ts`. Mirror in `.caret/data` for bundled Worker fallback before KV has data.

After template changes: `npm run caretize`

## Scripts

| Command | |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Local preview |
| `npm run preview:cf` | Workers runtime preview |
| `npm run deploy:production` | Deploy with `wrangler.production.toml` |
| `npm run caretize` | Re-bind `data-caret` attributes |

## Gotchas

- `@caretcms/core` peer range is Astro 5/6 — this theme uses Astro 7; `.npmrc` sets `legacy-peer-deps=true`
- `astro build` may warn on `@caretcms/cloudflare` 0.1.x provider exports — they resolve at runtime

## License

MIT
