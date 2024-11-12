import { Buffer } from "node:buffer";
import { Hono } from "hono";
import { Octokit } from "@octokit/rest";
import markdownToHtml from "zenn-markdown-html";

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
  const html = `
  <!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Zenn article</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/zenn-content-css@0.1.158/lib/index.min.css">
</head>
<body>
  <div class="znc">
    ${markdownToHtml(md)}
  </div>
</body>
</html>
  `;
  return c.html(html);
});

export default app;
