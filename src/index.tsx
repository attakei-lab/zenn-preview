import type { Context } from 'hono';
import { Hono } from 'hono';
import { sentry } from '@hono/sentry';
import api from './routes/api';
import html from './routes/html';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use('*', (c: Context, next: any) => {
  return sentry({
    dsn: c.env.SENTRY_DSN,
    environment: c.env.SENTRY_ENVIRONMENT || 'debug',
  })(c, next);
});
app.route('/api', api);
app.route('/', html);

export default app;
