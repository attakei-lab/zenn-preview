/**
 * HTML rendering routes.
 *
 * This module is to manage routes for Web API (not render html and images).
 */
import { Hono } from 'hono';
import { Input } from '../components/inputs';
import { AppLayout } from '../components/layouts';

const app = new Hono<{ Bindings: CloudflareBindings }>();

/**
 * Render frontpage that has form.
 */
app.get('/', (c) => {
  return c.html(
    <AppLayout title="Zenn Private Previwer">
      <section class="hero">
        <div class="hero-body">
          <h1 class="title">Zenn Private Previwer</h1>
        </div>
      </section>
      <section class="section">
        <div class="columns">
          <div class="column">
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
              <div class="field">
                <p class="control">
                  <button class="button is-fullwidth is-success" type="submit">
                    URL生成
                  </button>
                </p>
              </div>
            </form>
          </div>
          <div class="column">
            <div class="section" id="result" />
          </div>
        </div>
      </section>
      <template id="tmpl-result">
        <article class="message is-link">
          <div class="message-header">
            <p>OK!</p>
          </div>
          <div class="message-body">
            <p>Content URL is created!</p>
            <p>
              Link is{' '}
              <a href="/view/{{slug}}" target="_blank" rel="noreferrer">
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

export default app;
