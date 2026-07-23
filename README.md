# toiro art.（革細工サイト）

静的HTML/CSS/JSのみで構築した、革細工作品「toiro art.」を紹介するサイトです。GitHub Pagesでの公開を前提としています。モバイル表示を基準に設計しています。

- 公開URL: https://itocomsq.github.io/toiro-art/
- リポジトリ: https://github.com/itocomsq/toiro-art

## 構成

- `index.html` — トップページ（ヒーロー画像リール／作家紹介／ジャンル別商品一覧）
- `product.html?id=xxx` — 商品詳細ページ
- `search.html` — タグ・キーワード検索ページ
- `editor.html` — **お店の人向けの編集ツール**（商品情報・写真をブラウザ上で編集して保存できる。使い方は下記）
- `js/hero-data.js` — トップページのヒーロー画像リストのみを定義（編集ツールがこのファイルを書き換える）
- `js/products.js` — 商品データ・カテゴリ定義のみを定義（編集ツールがこのファイルを書き換える）
- `js/search-suggest.js` — 検索欄の入力候補（タグ）の表示ロジック
- `js/home.js` / `js/product.js` / `js/search.js` — 各ページの描画ロジック
- `js/editor.js` — 編集ツールのロジック
- `css/style.css` — サイト全体の共通スタイル（モバイルファースト）
- `css/editor.css` — 編集ツール専用のスタイル
- `assets/img/logo.png` — ブランドロゴ（ヘッダー・作家アイコンで使用、背景透過）
- `assets/img/favicon.png` — ブラウザタブのアイコン
- `assets/img/hero/` — トップページのヒーロー画像
- `assets/img/products/` — 商品写真
- `tools/serve.ps1` — ローカル確認・編集ツール用の簡易サーバー（Windows / PowerShell、Node.jsやPython不要）

`js/hero-data.js` と `js/products.js` は「データだけ」のファイルです。編集ツール（`editor.html`）が保存時にこの2つのファイルをそのまま書き換えるので、**手で書き換えても編集ツールを使っても、どちらでも構いません**。

---

## はじめての人向け：セットアップ〜公開までの手順

### 1. パソコンにコピーする（初回のみ）

```bash
git clone https://github.com/itocomsq/toiro-art.git
cd toiro-art
```

すでにパソコンにフォルダがある場合は、最新の状態を取り込みます。

```bash
git pull
```

### 2. ローカルで見てみる／編集する

Node.jsやPythonなどのインストールは不要です。Windowsなら付属のPowerShellだけで確認・編集ができます。

```powershell
powershell -ExecutionPolicy Bypass -File tools\serve.ps1
```

ターミナルに表示されるアドレス（例: `http://127.0.0.1:8123/`）をブラウザで開くと、サイトを確認できます。

- サイトを見る: `http://127.0.0.1:8123/index.html`
- 商品や写真を編集する: `http://127.0.0.1:8123/editor.html`

サーバーを止めるときはターミナルで `Ctrl+C` を押してください。

> `index.html` をダブルクリックして直接開く（`file://...`）と、一部の機能（検索・編集ツールの保存など）が正しく動きません。必ず上記のサーバー経由で開いてください。

### 3. 編集ツール（editor.html）の使い方

「商品を1つ追加したい」「写真を差し替えたい」「値段を直したい」というときは、コードを直接編集しなくても `editor.html` から行えます。

1. **Chrome または Edge** で `http://127.0.0.1:8123/editor.html` を開く（他のブラウザは保存機能に対応していません）
2. 「ヒーロー画像」「商品一覧」の内容を編集する
   - 写真は「変更」ボタンから選び直せます（＋写真を追加、削除も可能）
   - 商品IDはURL（`product.html?id=◯◯`）に使われるため、半角英数とハイフンのみにしてください
   - 価格・サイズ・説明・タグ（カンマ区切り）はテキストで編集できます
3. 右上の **「フォルダを選んで保存」** を押す
4. フォルダ選択ダイアログが出るので、**このサイトのフォルダ（`editor.html` がある場所、= `toiro-art` フォルダ）** を選ぶ
5. 「このフォルダの変更を許可しますか」のような確認が出たら許可する
6. 「保存しました」と表示されたら完了です

保存すると、選んだ写真が `assets/img/hero/` や `assets/img/products/` に書き込まれ、`js/hero-data.js` と `js/products.js` が新しい内容に書き換えられます。

### 4. 公開する（GitHubへ反映）

編集ツールでの保存はパソコンの中だけの変更です。実際にサイト（GitHub Pages）に反映するには、ターミナルで以下を行います。

```bash
git add -A
git commit -m "商品情報を更新"
git push
```

push すると、数十秒〜1分ほどでGitHub Pagesに自動反映されます。反映されたら公開URL（https://itocomsq.github.io/toiro-art/ ）をブラウザで再読み込みして確認してください（変わっていない場合は、ブラウザの再読み込みを「強制再読み込み」（Windowsは`Ctrl+Shift+R`）で試してください）。

### 5. 困ったときは

- **保存ボタンを押してもフォルダ選択が出ない／エラーになる** → Chrome または Edge を使っているか確認してください。Safari・Firefoxは対応していません。
- **保存時に「js・assetsフォルダが見つかりません」と出る** → フォルダ選択で `toiro-art` フォルダ自体（`editor.html` がある階層）を選び直してください。
- **git push でエラーになる** → `git pull` を先に実行してから、もう一度 `git push` してください。

---

## 商品データの形（手で編集する場合）

`js/products.js` の `PRODUCTS` 配列に、以下の形式でオブジェクトを追加・編集します（編集ツールを使えばこの形式を意識する必要はありません）。

```js
{
  id: "unique-id",          // URLに使う一意なID（半角英数とハイフン）
  name: "商品名",
  category: "stationery",   // "wallet" | "stationery" | "bag" | "other"
  price: 15000,              // 数値のみ
  size: "W10 x H10 cm",
  description: "紹介文",
  tags: ["タグ1", "タグ2"],   // 検索・絞り込みに使用
  images: ["assets/img/products/xxx-1.jpg", "assets/img/products/xxx-2.jpg"],
}
```

トップページでは `category` ごとに行が分かれます。該当する商品がない `category` の行は自動的に非表示になります。

## トップページのヒーロー画像を変更する（手で編集する場合）

`js/hero-data.js` の `HERO_IMAGES` 配列のパスを、`assets/img/hero/` に配置した画像に差し替えてください。

## SNSリンクを変更する

`index.html` / `product.html` / `search.html` それぞれのフッター内、`.sns-links` の `href` を実際のInstagram URLに変更してください（現在: `@toiro.nemui`）。

## 写真をHEIC（iPhone形式）から追加する場合

ImageMagickをインストール済みのPCでは、以下のコマンドでHEIC→JPEGに変換できます（未インストールの場合は `winget install ImageMagick.ImageMagick.Q16` などでインストールしてください）。

```
magick input.heic -auto-orient -resize "1600x1600>" -quality 85 output.jpg
```

## GitHub Pagesの設定について

このリポジトリは Settings → Pages で「Deploy from a branch」（`master` ブランチ・`/ (root)`）に設定済みです。`master` ブランチにpushすれば自動的に公開サイトへ反映されます。設定を変更する場合のみ、リポジトリの Settings → Pages から変更してください。
