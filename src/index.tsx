import type { Context } from 'hono';
import { Hono } from 'hono';
import { html, raw } from 'hono/html';
import { sentry } from '@hono/sentry';
import { Octokit } from '@octokit/rest';
import api from './api';
import { fetchContent } from './client';
import { parseContentMarkdown } from './parser';
import { parseSlug } from './models';
import type { ZennContent } from './models';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use('*', (c: Context, next: any) => {
  return sentry({
    dsn: c.env.SENTRY_DSN,
    environment: c.env.SENTRY_ENVIRONMENT || 'debug',
  })(c, next);
});
app.route('/api', api);

app.get('/:slug', async (c) => {
  let props: ZennContent;
  const octokit = new Octokit({
    auth: c.env.REPO_PAT,
  });
  const addr = parseSlug(c.req.param('slug'));
  try {
    const md = await fetchContent(octokit, addr);
    props = parseContentMarkdown(md);
    return c.html(
      html`
      <!DOCTYPE html>
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
        <div>
          <h1>
            ${props.frontMatter?.title}
            <br />
            ${props.frontMatter?.emoji}
          </h1>
        </div>
        <hr />
        <hr />
        <div class="znc">${raw(props.body)}</div>
        </body>
      </html>
    `,
    );
  } catch (error) {
    console.error(error);
    if (error.status) {
      c.status(404);
      return c.text('Content is not found.');
    }
  }
});

export default app;
