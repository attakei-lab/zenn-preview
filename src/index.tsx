import type { Context } from 'hono';
import { Hono } from 'hono';
import { html, raw } from 'hono/html';
import { sentry } from '@hono/sentry';
import { Octokit } from '@octokit/rest';
import api from './api';
import htmlRouter from './html';
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
app.route('/', htmlRouter);

export default app;
