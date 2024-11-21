import { expect, inject, it } from 'vitest';

it('Flow for public contents', async () => {
  let resp: Response;
  resp = await fetch(`${inject('URL_BASE')}/api/content-url`, {
    method: 'post',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      owner: 'attakei',
      repo: 'zenn-contents',
      path: 'articles/age-cli-beta.md',
    }),
  });
  expect(resp.status).toBe(200);
  const slug = await resp.text();
  resp = await fetch(`${inject('URL_BASE')}/${slug}`);
  expect(resp.status).toBe(200);
});
