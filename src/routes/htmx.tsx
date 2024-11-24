/**
 * HTMX rendering routes.
 *
 * This module is to manage routes for Web API (not render html and images).
 */
import { Hono } from 'hono';
import { AppMessageBox } from '../components/layouts';
import { zValidator } from '@hono/zod-validator';
import { ContentAddress } from '../models';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.post('/content-url', zValidator('json', ContentAddress), async (c) => {
  const url = new URL(c.req.url);
  url.pathname = '/api/content-url';
  const resp = await fetch(url, {
    method: 'post',
    body: JSON.stringify(c.req.valid('json')),
    headers: {
      'content-type': 'application/json',
    },
  });
  const data = await resp.json();
  return c.html(
    <AppMessageBox title="OK!" type="link">
      <p>Content URL is created!</p>
      <p>
        Link is{' '}
        <a href={`/view/${data.slug}`} target="_blank" rel="noreferrer">
          here
        </a>
        .
      </p>
    </AppMessageBox>,
  );
});

export default app;
