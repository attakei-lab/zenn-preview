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
  const json = JSON.parse(await resp.text());
  expect(json.slug).toBe(
    'JTdCJTIyb3duZXIlMjIlM0ElMjJhdHRha2VpJTIyJTJDJTIycmVwbyUyMiUzQSUyMnplbm4tY29udGVudHMlMjIlMkMlMjJwYXRoJTIyJTNBJTIyYXJ0aWNsZXMlMkZhZ2UtY2xpLWJldGEubWQlMjIlN0Q=',
  );
  resp = await fetch(`${inject('URL_BASE')}/${json.slug}`);
  expect(resp.status).toBe(200);
});
