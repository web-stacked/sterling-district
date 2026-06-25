/**
 * Cloudflare Image Transforms — generates /cdn-cgi/image/ URLs for on-the-fly
 * resizing and format conversion.
 *
 * Usage: img.hero(url), img.card(url), etc.
 * Falls back to the original URL if empty/missing.
 */

type TransformOpts = {
  width?: number;
  height?: number;
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad';
  quality?: number;
  format?: 'auto' | 'webp' | 'avif';
};

function cfImage(src: string, _opts: TransformOpts = {}): string {
  if (!src) return src;
  // TODO: re-enable /cdn-cgi/image/ transforms once Cloudflare Image Resizing is active
  return src;
}

export const img = {
  hero:     (src: string) => cfImage(src, { width: 1920, quality: 80 }),
  card:     (src: string) => cfImage(src, { width: 600, quality: 75 }),
  product:  (src: string) => cfImage(src, { width: 800, quality: 82 }),
  thumb:    (src: string) => cfImage(src, { width: 200, quality: 70 }),
  avatar:   (src: string) => cfImage(src, { width: 128, height: 128, fit: 'cover', quality: 75 }),
  lightbox: (src: string) => cfImage(src, { width: 1600, quality: 85 }),
  service:  (src: string) => cfImage(src, { width: 800, quality: 80 }),
};
