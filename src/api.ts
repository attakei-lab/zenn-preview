/**
 * Web API routings.
 *
 * This module is to manage routes for Web API (not render html and images).
 */
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { ContentAddress, makeSlug } from './models';
import { fetchContent, initClient } from './client';

const api = new Hono();

/**
 * Return "slug for URL of content" on this app.
 */
api.post('/content-url', zValidator('json', ContentAddress), async (c) => {
  const addr = c.req.valid('json');
  try {
    // Try to fetch content as address validation.
    const octokit = initClient(c);
    await fetchContent(octokit, addr);
    return c.text(makeSlug(addr));
  } catch (error) {
    console.error(error);
    c.status(404);
    return c.text('Content is not found.');
  }
});

export default api;
