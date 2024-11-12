import { Buffer } from "node:buffer";
import { Hono } from "hono";
import { Octokit } from "@octokit/rest";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/:slug", async (c) => {
  const octokit = new Octokit({
    auth: c.env.REPO_PAT,
  });
  const resp = await octokit.rest.repos.getContent({
    owner: c.env.REPO_OWNER,
    repo: c.env.REPO_NAME,
    path: `articles/${c.req.param("slug")}.md`,
  });
  const md = Buffer.from(resp.data.content, "base64").toString();
  return c.text(md);
});

export default app;
