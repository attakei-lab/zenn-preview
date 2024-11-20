import { parse } from 'node-html-parser';
import { expect, test } from 'vitest';
import * as t from './parser';

test('parseFrontMatter works regularly', () => {
  const h2 = parse("<h2>title: 'Help'</h2>");
  expect(t.parseFrontMatter(h2)).toHaveProperty('title');
  expect(t.parseFrontMatter(h2).title).toBe('Help');
});
