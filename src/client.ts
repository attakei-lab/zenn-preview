/**
 * GitHub api client
 *
 */
import type { Octokit } from '@octokit/rest';

type ParamsForGetContent = {
  owner: string;
  repo: string;
  path: string;
  ref?: string;
};

export const fetchContent = async (
  octokit: Octokit,
  params: ParamsForGetContent,
): Promise<string> => {
  const resp = await octokit.rest.repos.getContent(params);
  return Buffer.from(resp.data.content, 'base64').toString();
};
