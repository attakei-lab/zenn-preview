import { Buffer } from 'node:buffer';
import type { Context } from 'hono';
import { Hono } from 'hono';
import type { HTMLElement } from 'node-html-parser';
import { parse } from 'node-html-parser';
import frontMatter from 'front-matter';
import { html, raw } from 'hono/html';
import { sentry } from '@hono/sentry';
import { Octokit } from '@octokit/rest';
import markdownToHtml from 'zenn-markdown-html';

type FrontMatter = {
  title?: string;
  emoji?: string;
  topics?: string[];
  type?: string;
  published?: boolean;
  published_at?: string;
};

type Props = {
  body: string;
  frontMatter: FrontMatter;
};

const parseFrontMatter = (
  elm: HTMLElement,
  pre?: (e: HTMLElement) => HTMLElement,
): FrontMatter => {
  const raw = (pre ? pre(elm) : elm).innerHTML;
  const source = `---\n${raw}\n---\n`;
  const fm = frontMatter(source);
  return fm.attributes as FrontMatter;
};

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use('*', (c: Context, next: any) => {
  return sentry({
    dsn: c.env.SENTRY_DSN,
    environment: c.env.SENTRY_ENVIRONMENT || 'debug',
  })(c, next);
});

app.get('/:slug', async (c) => {
  let props: Props = {};
  const octokit = new Octokit({
    auth: c.env.REPO_PAT,
  });
  const params = {
    owner: c.req.query('org') || c.env.REPO_ORG,
    repo: c.req.query('name') || c.env.REPO_NAME,
    path: `articles/${c.req.param('slug')}.md`,
    ref: c.req.query('ref'),
  };
  try {
    const resp = await octokit.rest.repos.getContent(params);
    const md = Buffer.from(resp.data.content, 'base64').toString();
    const dom = parse(markdownToHtml(md));
    dom.querySelector('hr')?.remove();
    const metadata = dom.querySelector('h2');
    metadata?.parentNode?.removeChild(metadata);
    props.frontMatter = parseFrontMatter(metadata, (elm) => {
      elm.querySelector('a').remove();
      for (const br of elm.querySelectorAll('br')) {
        br.parentNode.removeChild(br);
      }
      return elm;
    });

    console.log(frontMatter);
    props.body = dom.toString();
  } catch (error) {
    console.error(error);
    if (error.status) {
      c.status(404);
      return c.text('Content is not found.');
    }
  }
  const content = (
    <>
      <div>
        <h1>
          {props.frontMatter.title}
          <br />
          {props.frontMatter.emoji}
        </h1>
      </div>
      <hr />
      <hr />
      <div className="znc">{raw(props.body)}</div>
    </>
  );
  return c.html(
    html`<!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <title>Zenn article</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/zenn-content-css@0.1.158/lib/index.min.css"
        />
      </head>
      <body>
        ${content}
      </body>
    </html>
    `,
  );
});

export default app;
