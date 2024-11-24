/**
 * GitHub api client
 *
 */
import { App } from '@octokit/app';
import type { Octokit } from '@octokit/core';
import type { Context } from 'hono';
import type { ContentAddress } from './models';

export class Client {
  protected app: App;
  protected owners: Map<string, any>;

  public constructor(c: Context) {
    this.app = new App({
      appId: c.env.GITHUB_APP_ID,
      privateKey: c.env.GITHUB_PRIVATE_KEY,
      oauth: {
        clientId: c.env.GITHUB_CLIENT_ID,
        clientSecret: c.env.GITHUB_CLIENT_SECRET,
      },
    });
    this.owners = new Map();
    //
  }
  public async getApp(owner: string): Promise<Octokit> {
    if (this.owners.size === 0) {
      await this.app.eachInstallation((opt) => {
        this.owners.set(opt.installation.account?.login, opt.installation);
      });
    }
    if (!this.owners.has(owner)) {
      throw new Error(`Application is not installed into '${owner}'`);
    }
    return await this.app.getInstallationOctokit(this.owners.get(owner).id);
  }
  public async getInstallationUrl(): Promise<string> {
    return await this.app.getInstallationUrl();
  }
}

export const fetchContent = async (
  octokit: Octokit,
  params: ContentAddress,
): Promise<string> => {
  const resp = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    params,
  );
  if (resp.status !== 200) {
    throw new Error('Content is not found.');
  }
  return Buffer.from(resp.data.content, 'base64').toString();
};
