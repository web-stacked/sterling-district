/**
 * Content Collection Definitions
 *
 * These schemas validate the seed JSON used by Astro content collections and
 * provide TypeScript types for page rendering.
 */

import { z } from 'astro/zod';

export const ProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  description: z.string().min(1),
  details: z.array(z.string()),
  specifications: z.object({
    material: z.string().min(1),
    stones: z.string().optional(),
    weight: z.string().optional(),
    dimensions: z.string().optional(),
  }),
  images: z.array(z.string()),
  category: z.enum(['rings', 'necklaces', 'earrings', 'bracelets']),
  featured: z.boolean(),
  slug: z.string().min(1),
});

export const TestimonialSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  text: z.string().min(1),
  date: z.string().min(1),
  product: z.string(),
  image: z.string(),
  order: z.number().min(0),
});

export const FaqSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
  order: z.number().min(0),
});

const NavLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const SiteGlobalSchema = z.object({
  company_name: z.string().min(1),
  tagline: z.string(),
  nav: z.array(NavLinkSchema),
  nav_cta: z.string().min(1),
  contact: z.object({
    address_line1: z.string().min(1),
    address_line2: z.string(),
    phone: z.string().min(1),
    email: z.string().email(),
    hours: z.object({
      weekday: z.string().min(1),
      saturday: z.string().min(1),
      sunday: z.string().min(1),
    }),
  }),
  social: z.object({
    instagram: z.string(),
    tiktok: z.string(),
  }),
  newsletter: z.object({
    heading: z.string().min(1),
    subtext: z.string(),
    placeholder: z.string(),
    button: z.string().min(1),
  }),
  footer_links: z.array(NavLinkSchema),
  footer_bottom_links: z.array(NavLinkSchema),
  copyright_template: z.string().min(1),
});

// Pages have free-form shapes — no schema validation
export const PageSchema = z.record(z.string(), z.any());

// ---------------------------------------------------------------------------
// Types (derived from schemas)
// ---------------------------------------------------------------------------

export type ProductData = z.infer<typeof ProductSchema>;
export type TestimonialData = z.infer<typeof TestimonialSchema>;
export type FaqData = z.infer<typeof FaqSchema>;
export type SiteGlobalData = z.infer<typeof SiteGlobalSchema>;
export type PageData = Record<string, unknown>;
