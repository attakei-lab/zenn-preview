/**
 * Web API routings.
 *
 * This module is to manage routes for Web API (not render html and images).
 */
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { ContentAddress, makeSlug } from '../models';
import { fetchContent, Client } from '../client';

const api = new Hono();

/**
 * Return "slug for URL of content" on this app.
 */
api.post('/content-url', zValidator('json', ContentAddress), async (c) => {
  const addr = c.req.valid('json');
  if (addr.ref === '') {
    addr.ref = undefined;
  }
  try {
    // Try to fetch content as address validation.
    const client = new Client(c);
    const octokit = await client.getApp(addr.owner);
    await fetchContent(octokit, addr);
    return c.json({ slug: makeSlug(addr) });
  } catch (error) {
    console.error(error);
    c.status(404);
    return c.text('Content is not found.');
  }
});

export default api;
