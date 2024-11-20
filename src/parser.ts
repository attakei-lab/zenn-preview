/**
 * Content parser
 *
 */
import frontMatter from 'front-matter';
import type { HTMLElement } from 'node-html-parser';
import { parse } from 'node-html-parser';
import markdownToHtml from 'zenn-markdown-html';
import type { FrontMatter } from './types';

type Content = {
  body: HTMLElement;
  frontMatter: FrontMatter;
};

const parseFrontMatter = (elm: HTMLElement): FrontMatter => {
  const raw = elm.innerHTML;
  const source = `---\n${raw}\n---\n`;
  const fm = frontMatter(source);
  return fm.attributes as FrontMatter;
};

export const parseContentMarkdown = (md: string): Content => {
  const dom = parse(markdownToHtml(md));
  dom.querySelector('hr')?.remove();
  const metadata = dom.querySelector('h2');
  metadata?.parentNode?.removeChild(metadata);
  metadata?.querySelector('a')?.remove();
  for (const br of metadata.querySelectorAll('br')) {
    br.parentNode.removeChild(br);
  }
  const fm = parseFrontMatter(metadata);
  return {
    body: dom,
    frontMatter: fm,
  };
};
