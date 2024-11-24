/**
 * HTML rendering routes.
 *
 * This module is to manage routes for Web API (not render html and images).
 */
import { Hono } from 'hono';
import { Octokit } from '@octokit/rest';
import { fetchContent } from '../client';
import { Input } from '../components';
import { AppLayout, Layout } from '../components/layouts';
import { parseSlug } from '../models';
import { parseContentMarkdown } from '../parser';

const app = new Hono<{ Bindings: CloudflareBindings }>();

/**
 * Render frontpage that has form.
 */
app.get('/', (c) => {
  return c.render(
    <AppLayout title="Zenn Private Previwer">
      <section class="hero">
        <div class="hero-body">
          <h1 class="title">Zenn Private Previwer</h1>
        </div>
      </section>
      <section class="section">
        <form
          hx-post="/api/content-url"
          hx-ext="json-enc, client-side-templates"
          hx-target="#result"
          hx-swap="innerHTML"
          mustache-template="tmpl-result"
        >
          <Input name="owner" label="ユーザー/Org" />
          <Input name="repo" label="リポジトリ" />
          <Input name="path" label="ファイルパス" />
          <Input name="ref" label="ブランチ" />
          <div class="field is-horizontal">
            <div class="field-label" />
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <button class="button is-success" type="submit">
                    URL生成
                  </button>
                </p>
              </div>
            </div>
          </div>
        </form>
      </section>
      <section class="section" id="result" />
      <template id="tmpl-result">
        <article class="message is-link">
          <div class="message-header">
            <p>OK!</p>
          </div>
          <div class="message-body">
            <p>Content URL is created!</p>
            <p>
              Link is{' '}
              <a href="/{{slug}}" target="_blank" rel="noreferrer">
                here
              </a>
              .
            </p>
          </div>
        </article>
      </template>
    </AppLayout>,
  );
});

app.get('/:slug', async (c) => {
  const octokit = new Octokit({
    auth: c.env.REPO_PAT,
  });
  const addr = parseSlug(c.req.param('slug'));
  try {
    const md = await fetchContent(octokit, addr);
    const content = parseContentMarkdown(md);
    const cssUrls = [
      'https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css',
      'https://cdn.jsdelivr.net/npm/zenn-content-css@0.1.158/lib/index.min.css',
    ];
    return c.render(
      <Layout
        title={`[PREVIRE]: ${content.frontMatter?.title}`}
        cssUrls={cssUrls}
      >
        <section class="section">
          <h1 class="title">
            {content.frontMatter?.title}
            <br />
            {content.frontMatter?.emoji}
          </h1>
        </section>
        <hr />
        <hr />
        <section class="section">
          <div class="znc" dangerouslySetInnerHTML={{ __html: content.body }} />
        </section>
      </Layout>,
    );
  } catch (error) {
    console.error(error);
    if (error.status) {
      c.status(404);
      return c.text('Content is not found.');
    }
  }
});

export default app;
