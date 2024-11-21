import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { ContentAddress, makeSlug } from './models';

const api = new Hono();

api.post('/content-url', zValidator('json', ContentAddress), (c) => {
  const data = c.req.valid('json');
  // TODO:Validate as domain-level regular content.
  return c.text(makeSlug(data));
});

export default api;
