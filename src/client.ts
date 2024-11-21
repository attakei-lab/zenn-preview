/**
 * GitHub api client
 *
 */
import type { Octokit } from '@octokit/rest';
import type { ContentAddress } from './models';

export const fetchContent = async (
  octokit: Octokit,
  params: ContentAddress,
): Promise<string> => {
  const resp = await octokit.rest.repos.getContent(params);
  return Buffer.from(resp.data.content, 'base64').toString();
};
