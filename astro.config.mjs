// @ts-check
import { defineConfig, envField } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // Set SITE_URL (e.g. https://example.com) at build time for absolute canonical and Open Graph URLs.
  site: process.env.SITE_URL,
  // Pages stay prerendered; only commerce routes opt out with `export const prerender = false` (AGENT.md, Phase 2).
  adapter: vercel(),
  security: { checkOrigin: true },
  // Supabase auth emails link to SITE_URL (localhost:4321 locally), so fail loudly rather than drift to another port.
  server: { port: 4321 },
  vite: { server: { strictPort: true } },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  env: {
    // Server-only secrets. All are optional so the storefront still builds without commerce configured;
    // commerce routes report themselves unavailable until every value is set (src/lib/server/env.ts).
    schema: {
      SUPABASE_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      SUPABASE_PUBLISHABLE_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      SUPABASE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      STRIPE_SECRET_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      STRIPE_WEBHOOK_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
});
