// Build-time validation of the bundled CaretCMS baseline in .caret/data.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { ProductSchema, TestimonialSchema, FaqSchema, SiteGlobalSchema, PageSchema } from './content-schema';

export const collections = {
  products: defineCollection({
    loader: glob({ pattern: '*.json', base: '.caret/data/products' }),
    schema: ProductSchema,
  }),
  testimonials: defineCollection({
    loader: glob({ pattern: '*.json', base: '.caret/data/testimonials' }),
    schema: TestimonialSchema,
  }),
  faqs: defineCollection({
    loader: glob({ pattern: '*.json', base: '.caret/data/faqs' }),
    schema: FaqSchema,
  }),
  site: defineCollection({
    loader: glob({ pattern: '*.json', base: '.caret/data/site' }),
    schema: SiteGlobalSchema,
  }),
  pages: defineCollection({
    loader: glob({ pattern: '*.json', base: '.caret/data/pages' }),
    schema: PageSchema,
  }),
};
