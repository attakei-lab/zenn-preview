/**
 * HTMX rendering routes.
 *
 * This module is to manage routes for Web API (not render html and images).
 */
import { Hono } from 'hono';
import { AppMessageBox } from '../components/layouts';
import { zValidator } from '@hono/zod-validator';
import { ContentAddress, makeSlug } from '../models';
import { fetchContent, Client } from '../client';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.post('/content-url', zValidator('json', ContentAddress), async (c) => {
  const addr = c.req.valid('json');
  if (addr.ref === '') {
    addr.ref = undefined;
  }
  try {
    const client = new Client(c);
    const octokit = await client.getApp(addr.owner);
    await fetchContent(octokit, addr);
    return c.html(
      <AppMessageBox title="OK!" type="link">
        <p>プレビュー用URLを生成しました。</p>
        <p>
          <a href={`/view/${makeSlug(addr)}`} target="_blank" rel="noreferrer">
            このリンク
          </a>
          からアクセスしてください（別画面表示）。
        </p>
      </AppMessageBox>,
    );
  } catch (error) {
    console.error(error);
    c.status(404);
    return c.html(
      <AppMessageBox title="Error!" type="danger">
        <p>{error.message}</p>
      </AppMessageBox>,
    );
  }
});

export default app;
