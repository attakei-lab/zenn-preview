/**
 * HTML rendering routes.
 *
 * This module is to manage routes for Web API (not render html and images).
 */
import { Hono } from 'hono';
import { Input } from '../components/inputs';
import { AppLayout, AppMessageBox } from '../components/layouts';
import { Client } from '../client';

const app = new Hono<{ Bindings: CloudflareBindings }>();

/**
 * Render frontpage that has form.
 */
app.get('/', async (c) => {
  const client = new Client(c);
  return c.html(
    <AppLayout title="Zenn Private Previwer">
      <section class="hero">
        <div class="hero-body">
          <h1 class="title">Zenn Private Previwer</h1>
        </div>
      </section>
      <section class="section" hx-ext="response-targets">
        <div class="columns">
          <div class="column">
            <form
              hx-post="/app/content-url"
              hx-ext="json-enc"
              hx-target="#result"
              hx-target-error="#result"
              hx-swap="innerHTML"
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
            <div class="section" id="result">
              <AppMessageBox title="Usage" type="info">
                <ol>
                  <li>
                    <a
                      href={await client.getInstallationUrl()}
                      target="_blank"
                      rel="noreferrer"
                    >
                      このリンク
                    </a>
                    から、GitHub
                    Applicationのインストール/設定を行い、対象リポジトリへのRead権限を付与してください。
                  </li>
                  <li>
                    フォームに必要な情報の入力を行い、「URL生成」ボタンをクリックしてください。
                  </li>
                </ol>
              </AppMessageBox>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>,
  );
});

export default app;
