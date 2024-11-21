import type { Context } from 'hono';
import { Hono } from 'hono';
import { html, raw } from 'hono/html';
import { sentry } from '@hono/sentry';
import { Octokit } from '@octokit/rest';
import api from './api';
import type { Props } from './types';
import { fetchContent } from './client';
import { parseContentMarkdown } from './parser';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use('*', (c: Context, next: any) => {
  return sentry({
    dsn: c.env.SENTRY_DSN,
    environment: c.env.SENTRY_ENVIRONMENT || 'debug',
  })(c, next);
});
app.route('/api', api);

app.get('/:slug', async (c) => {
  const props: Props = {};
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
    const md = await fetchContent(octokit, params);
    const { body, frontMatter } = parseContentMarkdown(md);
    props.body = body.toString();
    props.frontMatter = frontMatter;
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
          {props.frontMatter?.title}
          <br />
          {props.frontMatter?.emoji}
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
