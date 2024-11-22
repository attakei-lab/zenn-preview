/**
 * HTML rendering routes.
 *
 * This module is to manage routes for Web API (not render html and images).
 */
import { Hono } from 'hono';
import { Input } from './components';

const app = new Hono();
app.use(async (c, next) => {
  c.setRenderer((content) => {
    return c.html(`<!DOCTYPE html>${content}`);
  });
  await next();
});

/**
 * Render frontpage that has form.
 */
app.get('/', (c) => {
  return c.render(
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Zenn Private Previwer</title>
        <script src="https://unpkg.com/htmx.org@2.0.3" />
        <script src="https://unpkg.com/htmx-ext-json-enc@2.0.1/json-enc.js" />
        <script src="https://unpkg.com/htmx-ext-client-side-templates@2.0.0/client-side-templates.js" />
        <script src="https://unpkg.com/mustache@latest" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css"
        />
      </head>
      <body>
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
      </body>
    </html>,
  );
});

export default app;
