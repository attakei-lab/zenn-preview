# Zenn private preview

Zennで公開する予定のある記事を、公開範囲を狭める形式でプレビュー可能にする環境です。

いわゆる、Qiitaにおける【限定共有投稿】に近い扱いをします。

## Web環境としての使い方

下記のルールに従って、URLを組み立ててアクセスしてください。
なお、大文字は可変項目です。

- 自身の管理しているリポジトリに、 `articles/FILENAME.md` のパスにファイルを保存する。
  - このファイルは、Zennの記事コンテンツとして利用できるフォーマットにすること。
- 上記のリポジトリがプライベートの場合、 `@attakei` にRead権限を付与する。
  - (後日Apps化予定あり)
- `https://zenn-preview.attakei.workers.dev/FILENAME?org=ORGANIZATION&name=REPOSITORY&ref=BRANCH` となる。
  - `FILENAME` には、前述のファイル名。（拡張子は不要である点に気をつける）
  - `ORGANIZATION` は、対象となるリポジトリオーナー。（orgとしているが、個人アカウントでも問題ない）
  - `REPOSITORY` には、リポジトリ名。
  - `BRANCH` には、対象のブランチorタグ名。（`ref=`ごと削除した場合は、リポジトリのデフォルトブランチが対象となる）

## コントリビューションについて

### 要望等

ある場合は、Issueにどうぞ。（日本語可）

### 改修や実装提案

PRをどうぞ。ただし機能要望系はIssueへの登録をお願いします。

### 日英の基準について

- Gitのログとコメントは原則英語。（簡易な表現で構いません）
- Issue,PR等のGit動作と関わらない箇所は日本語可。

## 自分のCloudflareアカウントで使いたい場合

大まかに、次の手順で使えます。

1. cloneする。
2. ローカル環境のセットアップをする。
  - `pnpm i`
  - `cp .example.vars .dev.vars`
  - `.dev.vars`の中身を適宜編集する。
3. `pnpm dev` で動作確認をする。
4. 問題なければ、`pnpm wrangler deploy`でデプロイする。
