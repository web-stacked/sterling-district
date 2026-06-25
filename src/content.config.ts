import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { ProductSchema, TestimonialSchema, FaqSchema, SiteGlobalSchema, PageSchema } from './content-schema';

export const collections = {
  products: defineCollection({
    loader: glob({ pattern: '*.json', base: 'src/content/seeds/products' }),
    schema: ProductSchema,
  }),
  testimonials: defineCollection({
    loader: glob({ pattern: '*.json', base: 'src/content/seeds/testimonials' }),
    schema: TestimonialSchema,
  }),
  faqs: defineCollection({
    loader: glob({ pattern: '*.json', base: 'src/content/seeds/faqs' }),
    schema: FaqSchema,
  }),
  site: defineCollection({
    loader: glob({ pattern: '*.json', base: 'src/content/seeds/site' }),
    schema: SiteGlobalSchema,
  }),
  pages: defineCollection({
    loader: glob({ pattern: '*.json', base: 'src/content/seeds/pages' }),
    schema: PageSchema,
  }),
};
