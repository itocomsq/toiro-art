// 商品データ。価格は仮価格です。実際の価格に差し替えてください。
// category: "wallet" | "stationery" | "bag" | "other"
const CATEGORY_LABELS = {
  wallet: "WALLET",
  stationery: "STATIONERY",
  bag: "BAG",
  other: "その他",
};

const CATEGORY_ORDER = ["wallet", "stationery", "bag", "other"];

const PRODUCTS = [
  {
    id: "notebook-navy",
    name: "ノートカバー",
    category: "stationery",
    price: 9800,
    size: "W11 x H16 cm（文庫〜A6サイズ対応）",
    description:
      "植物タンニンなめしの一枚革を三つ折りに仕立てたノートカバー。中央のベルトでページを留められます。使うほどに深みのある色合いに育っていきます。",
    tags: ["ノートカバー", "牛革", "ネイビー"],
    images: [
      "assets/img/products/notebook-navy-1.jpg",
      "assets/img/products/notebook-navy-2.jpg",
    ],
  },
  {
    id: "notebook-brown",
    name: "ノートカバー",
    category: "stationery",
    price: 9800,
    size: "W11 x H16 cm（文庫〜A6サイズ対応）",
    description:
      "落ち着いた色合いのブラウンレザーを使ったノートカバー。中央のベルトでページを留められる三つ折りタイプです。",
    tags: ["ノートカバー", "牛革", "ブラウン"],
    images: ["assets/img/products/notebook-brown-1.jpg"],
  },
  {
    id: "notebook-camel",
    name: "ノートカバー",
    category: "stationery",
    price: 9800,
    size: "W11 x H16 cm（文庫〜A6サイズ対応）",
    description:
      "経年変化が楽しみやすいキャメルカラーのノートカバー。ヌメ革ならではの色の育ちを楽しめます。",
    tags: ["ノートカバー", "ヌメ革", "キャメル"],
    images: ["assets/img/products/notebook-camel-1.jpg"],
  },
  {
    id: "notebook-mustard",
    name: "文庫本カバー",
    category: "stationery",
    price: 6800,
    size: "文庫本サイズ",
    description:
      "しおり用のレザーストラップ付き文庫本カバー。マスタードイエローの一枚革で仕立てました。",
    tags: ["ブックカバー", "文庫", "マスタード"],
    images: ["assets/img/products/notebook-mustard-1.jpg"],
  },
  {
    id: "memo-cover",
    name: "メモパッドカバー",
    category: "stationery",
    price: 8200,
    size: "A5メモパッド対応",
    description:
      "金属クリップでメモパッドを挟めるレザーカバー。デスクでもすぐに手に取れる使いやすさが特徴です。",
    tags: ["メモカバー", "クリップボード", "デスク用品"],
    images: [
      "assets/img/products/memo-cover-1.jpg",
      "assets/img/products/memo-cover-2.jpg",
      "assets/img/products/memo-cover-3.jpg",
    ],
  },
  {
    id: "pencase-flap",
    name: "ペンケース",
    category: "stationery",
    price: 4200,
    size: "1本用",
    description:
      "1本挿しのシンプルなフラップ式ペンケース。革ひもで固定でき、鞄の中でも迷いません。",
    tags: ["ペンケース", "牛革"],
    images: ["assets/img/products/pencase-flap-1.jpg"],
  },
  {
    id: "penroll-navy",
    name: "ペンロール",
    category: "stationery",
    price: 5500,
    size: "2〜3本用",
    description:
      "バックルベルトで留めるコンパクトなペンロール。小ぶりなので普段使いのペンケースにぴったりです。",
    tags: ["ペンロール", "ネイビー"],
    images: ["assets/img/products/penroll-navy-1.jpg"],
  },
  {
    id: "penroll-camel",
    name: "ペンロール",
    category: "stationery",
    price: 5500,
    size: "2〜3本用",
    description:
      "バックルベルトで留めるコンパクトなペンロール。キャメルカラーで経年変化も楽しめます。",
    tags: ["ペンロール", "キャメル"],
    images: ["assets/img/products/penroll-camel-1.jpg"],
  },
  {
    id: "penroll-large",
    name: "ペンロール",
    category: "stationery",
    price: 7800,
    size: "4〜5本用",
    description:
      "たっぷり収納できる大きめサイズのペンロール。バックルベルトでしっかり固定でき、持ち運びも安心です。",
    tags: ["ペンロール", "生成り", "大容量"],
    images: [
      "assets/img/products/penroll-large-1.jpg",
      "assets/img/products/penroll-large-2.jpg",
      "assets/img/products/penroll-large-3.jpg",
      "assets/img/products/penroll-large-4.jpg",
      "assets/img/products/penroll-large-5.jpg",
    ],
  },
  {
    id: "penpouch",
    name: "ペンポーチ",
    category: "stationery",
    price: 3800,
    size: "L18 x H6 cm",
    description:
      "起毛感のあるスエードレザーを使ったジップ式のペンポーチ。柔らかい手触りが特徴です。",
    tags: ["ペンポーチ", "スエード"],
    images: [
      "assets/img/products/penpouch-1.jpg",
      "assets/img/products/penpouch-2.jpg",
    ],
  },
  {
    id: "penstand",
    name: "ペン立て",
    category: "stationery",
    price: 4800,
    size: "W6 x H16 cm",
    description:
      "穴あき加工がアクセントのレザーペン立て。立てても寝かせても使える2wayデザインです。数種のカラーをご用意しています。",
    tags: ["ペン立て", "デスク用品"],
    images: [
      "assets/img/products/penstand-1.jpg",
      "assets/img/products/penstand-2.jpg",
      "assets/img/products/penstand-3.jpg",
    ],
  },
  {
    id: "tote-black",
    name: "トートバッグ",
    category: "bag",
    price: 32000,
    size: "W35 x H28 x D12 cm",
    description:
      "しっかりとした一枚革で仕立てたトートバッグ。ブラックレザーに真鍮金具が映えるシンプルなデザインです。",
    tags: ["バッグ", "トート", "ブラック"],
    images: [
      "assets/img/products/tote-1.jpg",
      "assets/img/products/tote-2.jpg",
      "assets/img/products/tote-3.jpg",
    ],
  },
  {
    id: "keychain",
    name: "キーチャーム（TOIRO刻印）",
    category: "other",
    price: 1800,
    size: "約4 x 4 cm",
    description:
      "シールド型のレザーキーチャーム。TOIROの刻印入りで、オレンジ・ブラック・ネイビー・ブラウン・キャメル・グリーンの全6色からお選びいただけます。",
    tags: ["キーチャーム", "キーホルダー", "ギフト"],
    images: [
      "assets/img/products/keychain-1.jpg",
      "assets/img/products/keychain-2.jpg",
      "assets/img/products/keychain-3.jpg",
    ],
  },
  {
    id: "photo-frame",
    name: "レザーフォトフレーム",
    category: "other",
    price: 4500,
    size: "L判サイズ対応",
    description:
      "木製フレームにレザーを貼り合わせたフォトフレーム。お部屋に温かみを添えるインテリア雑貨です。",
    tags: ["フォトフレーム", "インテリア", "ギフト"],
    images: ["assets/img/products/frame-1.jpg"],
  },
];
