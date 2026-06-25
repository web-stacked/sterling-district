// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import caret from '@caretcms/core';
import { cloudflareStorage, r2Uploads } from '@caretcms/cloudflare';
import { schemasFromZod } from '@caretcms/zod';
import tailwindcss from '@tailwindcss/vite';
import {
  FaqSchema,
  ProductSchema,
  SiteGlobalSchema,
  TestimonialSchema,
} from './src/content-schema';

const caretSchemas = schemasFromZod({
  products: ProductSchema,
  testimonials: TestimonialSchema,
  faqs: FaqSchema,
  site: SiteGlobalSchema,
});

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    caret({
      mode: 'embedded',
      delivery: 'server',
      storage: cloudflareStorage({ binding: 'CMS_KV' }),
      uploads: r2Uploads({ binding: 'CMS_R2' }),
      schemas: caretSchemas,
      allowedClasses: {
        span: ['bg-secondary', 'h-px', 'w-8'],
      },
      brand: {
        name: 'Sterling District',
        faviconUrl: '/favicon.svg',
      },
    }),
  ],
  security: {
    csp: {
      scriptDirective: {
        resources: ["'self'"]
      },
      styleDirective: {
        resources: ["'self'", "https://fonts.googleapis.com"]
      },
      directives: [
        "default-src 'self'",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https://images.unsplash.com https://*.r2.dev",
        "connect-src 'self'",
        "frame-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ]
    }
  }
});
