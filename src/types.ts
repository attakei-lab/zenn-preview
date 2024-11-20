export type FrontMatter = {
  title?: string;
  emoji?: string;
  topics?: string[];
  type?: string;
  published?: boolean;
  published_at?: string;
};

export type Props = {
  body?: string;
  frontMatter?: FrontMatter;
};
