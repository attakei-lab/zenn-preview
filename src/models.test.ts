import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import * as t from './models';

describe('ContentAddress', () => {
  it('parse with optional', () => {
    const obj = t.ContentAddress.parse({
      owner: 'attakei',
      repo: 'example',
      path: 'test.md',
    });
    expect(obj.ref).toBeUndefined();
  });
  it('parse with optional', () => {
    const obj = t.ContentAddress.parse({
      owner: 'attakei',
      repo: 'example',
      path: 'test.md',
      ref: 'main',
    });
    expect(obj.ref).toBe('main');
  });
  it('invalid path', () => {
    const param = {
      owner: 'attakei',
      repo: 'example',
      path: 'test',
    };
    expect(() => t.ContentAddress.parse(param)).toThrow(ZodError);
  });
});

describe('makeSlug', () => {
  it('valid with undefined ref', () => {
    const addr = t.ContentAddress.parse({
      owner: 'attakei',
      repo: 'example',
      path: 'test.md',
    });
    expect(t.makeSlug(addr)).toBe(
      'JTdCJTIyb3duZXIlMjIlM0ElMjJhdHRha2VpJTIyJTJDJTIycmVwbyUyMiUzQSUyMmV4YW1wbGUlMjIlMkMlMjJwYXRoJTIyJTNBJTIydGVzdC5tZCUyMiU3RA==',
    );
  });
  it('valid with defined ref', () => {
    const addr = t.ContentAddress.parse({
      owner: 'attakei',
      repo: 'example',
      path: 'test.md',
      ref: 'dev',
    });
    expect(t.makeSlug(addr)).toBe(
      'JTdCJTIyb3duZXIlMjIlM0ElMjJhdHRha2VpJTIyJTJDJTIycmVwbyUyMiUzQSUyMmV4YW1wbGUlMjIlMkMlMjJwYXRoJTIyJTNBJTIydGVzdC5tZCUyMiUyQyUyMnJlZiUyMiUzQSUyMmRldiUyMiU3RA==',
    );
  });
});

describe('parseSlug', () => {
  it('valid with undefined ref', () => {
    expect(
      t.parseSlug(
        'JTdCJTIyb3duZXIlMjIlM0ElMjJhdHRha2VpJTIyJTJDJTIycmVwbyUyMiUzQSUyMmV4YW1wbGUlMjIlMkMlMjJwYXRoJTIyJTNBJTIydGVzdC5tZCUyMiU3RA==',
      ),
    ).toMatchObject({
      owner: 'attakei',
      repo: 'example',
      path: 'test.md',
    });
  });
  it('valid with defined ref', () => {
    expect(
      t.parseSlug(
        'JTdCJTIyb3duZXIlMjIlM0ElMjJhdHRha2VpJTIyJTJDJTIycmVwbyUyMiUzQSUyMmV4YW1wbGUlMjIlMkMlMjJwYXRoJTIyJTNBJTIydGVzdC5tZCUyMiUyQyUyMnJlZiUyMiUzQSUyMmRldiUyMiU3RA==',
      ),
    ).toMatchObject({
      owner: 'attakei',
      repo: 'example',
      path: 'test.md',
      ref: 'dev',
    });
  });
});
