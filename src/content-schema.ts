/**
 * Content Collection Definitions
 *
 * These schemas validate the seed JSON used by Astro content collections and
 * provide TypeScript types for page rendering.
 */

import { z } from 'astro/zod';

// `.meta()` titles, descriptions, formats, and groups shape the CaretCMS Studio form.
export const ProductSchema = z.object({
  name: z.string().min(1).meta({ title: 'Name' }),
  price: z.number().min(0).meta({ title: 'Price (USD)' }),
  description: z.string().min(1).meta({ title: 'Description', format: 'textarea' }),
  details: z.array(z.string()).meta({ title: 'Highlights', description: 'Short points listed on the product page.' }),
  specifications: z.object({
    material: z.string().min(1).meta({ title: 'Material' }),
    stones: z.string().optional().meta({ title: 'Stones' }),
    weight: z.string().optional().meta({ title: 'Weight' }),
    dimensions: z.string().optional().meta({ title: 'Size or dimensions' }),
  }).meta({ title: 'Specifications' }),
  images: z.array(z.string()).meta({ title: 'Photos', format: 'image-gallery', description: 'The first photo is used on product cards.' }),
  category: z.enum(['rings', 'necklaces', 'earrings', 'bracelets']).meta({ title: 'Category' }),
  featured: z.boolean().meta({ title: 'Featured', description: 'Shows the Featured badge and includes the piece on the home page.' }),
  slug: z.string().min(1).meta({ title: 'URL slug', description: 'Used in the product address: /products/<slug>.' }),
}).meta({
  'x-caret-groups': [
    { title: 'Product', fields: ['name', 'price', 'category', 'featured', 'description', 'details'] },
    { title: 'Specifications', fields: ['specifications'] },
    { title: 'Photos', fields: ['images'] },
    { title: 'Address', fields: ['slug'] },
  ],
});

export const TestimonialSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  text: z.string().min(1).meta({ title: 'Review', format: 'textarea' }),
  date: z.string().min(1).meta({ title: 'Date', description: 'Shown as written, for example "September 2024".' }),
  product: z.string().meta({ title: 'Product purchased' }),
  image: z.string().meta({ title: 'Photo', format: 'image' }),
  order: z.number().min(0).meta({ title: 'Display order' }),
});

export const FaqSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1).meta({ title: 'Question' }),
  answer: z.string().min(1).meta({ title: 'Answer', format: 'textarea' }),
  order: z.number().min(0).meta({ title: 'Display order' }),
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
}).meta({
  'x-caret-groups': [
    { title: 'Brand', fields: ['company_name', 'tagline'] },
    { title: 'Navigation', fields: ['nav', 'nav_cta'] },
    { title: 'Contact', fields: ['contact', 'social'] },
    { title: 'Newsletter', fields: ['newsletter'] },
    { title: 'Footer', fields: ['footer_links', 'footer_bottom_links', 'copyright_template'] },
  ],
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
