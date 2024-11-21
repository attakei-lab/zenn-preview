import { z } from 'zod';

/**
 * Content information for reproduce.
 */
export const ContentAddress = z.object({
  owner: z.string(),
  repo: z.string(),
  path: z.string().endsWith('.md'),
  ref: z.optional(z.string()),
});

export type ZennFrontMatter = {
  title?: string;
  emoji?: string;
  topics?: string[];
  type?: string;
  published?: boolean;
  published_at?: string;
};

export type ZennContent = {
  addr: ContentAddress;
  body: string;
  frontMatter: ZennFrontMatter;
};

export type ContentAddress = z.infer<typeof ContentAddress>;

/**
 * Generate slug text for URL of contents.
 */
export const makeSlug = (addr: ContentAddress): string => {
  const json = JSON.stringify(addr);
  return btoa(encodeURIComponent(json));
};

/**
 * Reverse address object from slug text.
 */
export const parseSlug = (slug: string): ContentAddress => {
  const json = decodeURIComponent(atob(slug));
  return ContentAddress.parse(JSON.parse(json));
};
