import type { FC, PropsWithChildren } from 'hono/jsx';
import { html } from 'hono/html';

type LayoutProps = {
  title: string;
  cssUrls?: string[];
  jsUrls?: string[];
};

export const Layout: FC<PropsWithChildren<LayoutProps>> = (props) => {
  const content = (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props.title}</title>
        {props.cssUrls?.map((css) => (
          <link rel="stylesheet" href={css} key={css} />
        ))}
      </head>
      <body>{props.children}</body>
    </html>
  );
  return html`<!DOCTYPE html>${content}`;
};

export const AppLayout: FC<
  PropsWithChildren<{
    title: string;
  }>
> = (props) => {
  const cssFiles = [
    'https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css',
  ];
  const jsFiles = [
    'https://unpkg.com/htmx.org@2.0.3',
    'https://unpkg.com/htmx-ext-json-enc@2.0.1/json-enc.js',
    'https://unpkg.com/htmx-ext-client-side-templates@2.0.0/client-side-templates.js',
    'https://unpkg.com/mustache@latest',
  ];
  return (
    <Layout title={props.title} cssUrls={cssFiles} jsUrls={jsFiles}>
      {props.children}
    </Layout>
  );
};
