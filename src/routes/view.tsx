/**
 * User content rendering routes.
 */

import { Hono } from 'hono';
import { fetchContent, Client } from '../client';
import { Layout } from '../components/layouts';
import { parseSlug } from '../models';
import { parseContentMarkdown } from '../parser';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get('/:slug', async (c) => {
  const addr = parseSlug(c.req.param('slug'));
  const client = new Client(c);
  const octokit = await client.getApp(addr.owner);
  try {
    const md = await fetchContent(octokit, addr);
    const content = parseContentMarkdown(md);
    const cssUrls = [
      'https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css',
      'https://cdn.jsdelivr.net/npm/zenn-content-css@0.1.158/lib/index.min.css',
    ];
    const style = `
      .tag {
        all: revert;
      }
    `;
    return c.html(
      <Layout
        title={`[PREVIRE]: ${content.frontMatter?.title}`}
        cssUrls={cssUrls}
        style={<style dangerouslySetInnerHTML={{ __html: style }} />}
      >
        <section class="section">
          <h1 class="title">
            {content.frontMatter?.title}
            <br />
            {content.frontMatter?.emoji}
          </h1>
        </section>
        <hr />
        <hr />
        <section class="section">
          <div class="znc" dangerouslySetInnerHTML={{ __html: content.body }} />
        </section>
      </Layout>,
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
