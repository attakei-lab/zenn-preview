/**
 * Content parser
 *
 */
import frontMatter from 'front-matter';
import type { HTMLElement } from 'node-html-parser';
import { parse } from 'node-html-parser';
import markdownToHtml from 'zenn-markdown-html';
import type { ZennContent, ZennFrontMatter } from './models';

export const parseFrontMatter = (elm: HTMLElement): ZennFrontMatter => {
  const raw = elm.innerText;
  const source = `---\n${raw}\n---\n`;
  const fm = frontMatter(source);
  return fm.attributes as ZennFrontMatter;
};

export const parseContentMarkdown = (md: string): ZennContent => {
  const dom = parse(markdownToHtml(md));
  dom.querySelector('hr')?.remove();
  const metadata = dom.querySelector('h2');
  metadata?.parentNode?.removeChild(metadata);
  metadata?.querySelector('a')?.remove();
  for (const br of metadata.querySelectorAll('br')) {
    br.parentNode.removeChild(br);
  }
  return {
    body: dom.toString(),
    frontMatter: parseFrontMatter(metadata),
  };
};
