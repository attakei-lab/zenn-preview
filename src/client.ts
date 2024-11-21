/**
 * GitHub api client
 *
 */
import { Octokit } from '@octokit/rest';
import type { Context } from 'hono';
import type { ContentAddress } from './models';

/**
 * Create client object from context of Hono.
 */
export const initClient = (c: Context): Octokit => {
  return new Octokit({
    auth: c.env.REPO_PAT,
  });
};

export const fetchContent = async (
  octokit: Octokit,
  params: ContentAddress,
): Promise<string> => {
  const resp = await octokit.rest.repos.getContent(params);
  return Buffer.from(resp.data.content, 'base64').toString();
};
