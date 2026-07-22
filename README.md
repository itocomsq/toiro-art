# toiro art.（革細工サイト）

静的HTML/CSS/JSのみで構築した、革細工作品を紹介するための個人サイトです。GitHub Pagesでの公開を前提としています。モバイル表示を基準に設計しています。

## 構成

- `index.html` — トップページ（ヒーロー画像のピークカルーセル／作家紹介／ジャンル別商品一覧）
- `product.html?id=xxx` — 商品詳細ページ
- `search.html` — タグ・キーワード検索ページ
- `js/products.js` — 商品データ・カテゴリ定義（ここを編集して実データに差し替える）
- `js/home.js` / `js/product.js` / `js/search.js` — 各ページの描画ロジック
- `css/style.css` — 全ページ共通スタイル（モバイルファースト、`min-width`メディアクエリで拡張）
- `assets/img/logo.jpg` — ブランドロゴ（ヘッダー・作家アイコンで使用）
- `assets/img/hero/` — トップページのヒーロー画像
- `assets/img/products/` — 商品写真

## 商品を追加・編集する

`js/products.js` の `PRODUCTS` 配列に、以下の形式でオブジェクトを追加してください。

```js
{
  id: "unique-id",          // URLに使う一意なID（半角英数とハイフン）
  name: "商品名",
  category: "stationery",   // "wallet" | "stationery" | "bag" | "other"
  price: 15000,              // 数値のみ（仮価格。実価格に差し替えてください）
  size: "W10 x H10 cm",
  description: "紹介文",
  tags: ["タグ1", "タグ2"],   // 検索・絞り込みに使用
  images: ["assets/img/products/xxx-1.jpg", "assets/img/products/xxx-2.jpg"],
}
```

トップページでは `category` ごとに行が分かれ、横スクロールで並びます。`category` に該当する商品がなければ、その行は自動的に非表示になります（現在 `wallet` は商品がないため非表示）。

価格は現在すべて仮価格です。実際の価格に差し替えてください。トップページには表示されず、商品詳細ページのみに表示されます。

## トップページのヒーロー画像を変更する

`js/home.js` の `HERO_IMAGES` 配列のパスを、`assets/img/hero/` に配置した画像に差し替えてください。ヒーローは左右の端が少し見える「ピークカルーセル」形式で、自動切り替え＋スワイプ操作に対応しています。

## SNSリンクを変更する

`index.html` / `product.html` / `search.html` それぞれのフッター内、`.sns-links` の `href` をInstagram・X（Twitter）の実際のURLに変更してください。

## 写真をHEIC（iPhone形式）から追加する場合

このPCには写真変換用に ImageMagick をインストール済みです。以下のコマンドでHEIC→JPEGに変換できます。

```
"C:\Program Files\ImageMagick-7.1.2-Q16\magick.exe" input.heic -auto-orient -resize "1600x1600>" -quality 85 output.jpg
```

## GitHub Pagesで公開する手順

1. このフォルダの内容をGitHubリポジトリにpushする
2. リポジトリの Settings → Pages → Source で「Deploy from a branch」を選び、`main` ブランチ・`/ (root)` を指定
3. しばらくすると `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開される

独自ドメインを使う場合は、リポジトリ直下に `CNAME` ファイルを追加し、ドメインレジストラ側でDNS設定（CNAMEレコード）を行ってください。

## ローカルで確認する

ブラウザで直接 `index.html` を開くと正しく動作しない場合があります。簡易サーバーを立てて確認してください（例: VS Codeの「Live Server」拡張など）。
