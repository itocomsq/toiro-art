// toiro art. 編集ツール。
// HERO_IMAGES / PRODUCTS（js/hero-data.js, js/products.js）を読み込んで編集し、
// 保存時にサイトのフォルダへ直接書き込む（File System Access API を使用）。

let heroImages = HERO_IMAGES.slice();
const heroFiles = {}; // index -> File（差し替え予定の新しい画像）

let products = PRODUCTS.map((p) => ({
  ...p,
  tags: p.tags.slice(),
  images: p.images.slice(),
}));
const productFiles = {}; // productUid -> { imageIndex: File }

// 商品配列内で個体を追跡するための内部ID（保存時のファイル名には使わない）
let uidCounter = 0;
products.forEach((p) => {
  p.__uid = uidCounter++;
});

function setStatus(message, kind) {
  const el = document.getElementById("editor-status");
  el.textContent = message || "";
  el.classList.remove("success", "error");
  if (kind) el.classList.add(kind);
}

function objectUrlFor(file) {
  return URL.createObjectURL(file);
}

/* ---------- ヒーロー画像 ---------- */

function renderHeroEditor() {
  const container = document.getElementById("hero-editor");
  const tpl = document.getElementById("tpl-hero-slot");
  container.innerHTML = "";

  heroImages.forEach((src, index) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const img = node.querySelector("img");
    img.src = heroFiles[index] ? objectUrlFor(heroFiles[index]) : src;

    const fileInput = node.querySelector('input[type="file"]');
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;
      heroFiles[index] = file;
      renderHeroEditor();
    });

    node.querySelector('[data-action="remove-hero"]').addEventListener("click", () => {
      heroImages.splice(index, 1);
      // 削除するとindexがずれてしまうため、差し替え予定だった未保存ファイルは
      // 混乱を避けて一旦クリアする（差し替えはやり直してもらう）
      for (const key in heroFiles) delete heroFiles[key];
      renderHeroEditor();
    });

    container.appendChild(node);
  });
}

document.getElementById("btn-add-hero").addEventListener("click", () => {
  heroImages.push("");
  renderHeroEditor();
});

/* ---------- 商品 ---------- */

function renderProductEditor() {
  const container = document.getElementById("product-editor");
  const tpl = document.getElementById("tpl-product-card");
  container.innerHTML = "";

  products.forEach((product) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.dataset.uid = product.__uid;

    node.querySelector(".pc-head-name").textContent = product.name || "（無題の商品）";

    const idInput = node.querySelector('[data-field="id"]');
    idInput.value = product.id;
    idInput.addEventListener("input", () => {
      product.id = idInput.value.trim();
    });

    const nameInput = node.querySelector('[data-field="name"]');
    nameInput.value = product.name;
    nameInput.addEventListener("input", () => {
      product.name = nameInput.value;
      node.querySelector(".pc-head-name").textContent = product.name || "（無題の商品）";
    });

    const categorySelect = node.querySelector('[data-field="category"]');
    categorySelect.value = product.category;
    categorySelect.addEventListener("change", () => {
      product.category = categorySelect.value;
    });

    const priceInput = node.querySelector('[data-field="price"]');
    priceInput.value = product.price;
    priceInput.addEventListener("input", () => {
      product.price = priceInput.value;
    });

    const sizeInput = node.querySelector('[data-field="size"]');
    sizeInput.value = product.size;
    sizeInput.addEventListener("input", () => {
      product.size = sizeInput.value;
    });

    const descInput = node.querySelector('[data-field="description"]');
    descInput.value = product.description;
    descInput.addEventListener("input", () => {
      product.description = descInput.value;
    });

    const tagsInput = node.querySelector('[data-field="tags"]');
    tagsInput.value = product.tags.join(", ");
    tagsInput.addEventListener("input", () => {
      product.tags = tagsInput.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    });

    node.querySelector('[data-action="remove-product"]').addEventListener("click", () => {
      if (!confirm(`「${product.name || product.id}」を削除します。よろしいですか？`)) return;
      products = products.filter((p) => p.__uid !== product.__uid);
      delete productFiles[product.__uid];
      renderProductEditor();
    });

    renderProductImages(node, product);

    node.querySelector('[data-action="add-image"]').addEventListener("click", () => {
      product.images.push("");
      renderProductImages(node, product);
    });

    container.appendChild(node);
  });
}

function renderProductImages(cardNode, product) {
  const wrap = cardNode.querySelector(".pc-images");
  const tpl = document.getElementById("tpl-product-image");
  wrap.innerHTML = "";

  product.images.forEach((src, index) => {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const img = node.querySelector("img");
    const pendingFile = productFiles[product.__uid] && productFiles[product.__uid][index];
    img.src = pendingFile ? objectUrlFor(pendingFile) : src;

    const fileInput = node.querySelector('input[type="file"]');
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;
      productFiles[product.__uid] = productFiles[product.__uid] || {};
      productFiles[product.__uid][index] = file;
      renderProductImages(cardNode, product);
    });

    node.querySelector('[data-action="remove-image"]').addEventListener("click", () => {
      product.images.splice(index, 1);
      if (productFiles[product.__uid]) delete productFiles[product.__uid][index];
      renderProductImages(cardNode, product);
    });

    wrap.appendChild(node);
  });
}

document.getElementById("btn-add-product").addEventListener("click", () => {
  const newProduct = {
    __uid: uidCounter++,
    id: `item-${Date.now().toString(36)}`,
    name: "",
    category: "stationery",
    price: 0,
    size: "",
    description: "",
    tags: [],
    images: [],
  };
  products.push(newProduct);
  renderProductEditor();
});

/* ---------- 保存 ---------- */

function extOf(filename) {
  const m = /\.([a-zA-Z0-9]+)$/.exec(filename || "");
  return m ? m[1].toLowerCase() : "jpg";
}

async function writeFile(dirHandle, name, fileOrBlob) {
  const fileHandle = await dirHandle.getFileHandle(name, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(fileOrBlob);
  await writable.close();
}

function jsStringArray(arr, indent) {
  const pad = " ".repeat(indent);
  if (arr.length === 0) return "[]";
  return `[\n${arr.map((v) => `${pad}  ${JSON.stringify(v)},`).join("\n")}\n${pad}]`;
}

function generateHeroDataJs() {
  return (
    "// トップページのヒーロー画像リール。ここに書いた順番で表示される。\n" +
    `const HERO_IMAGES = ${jsStringArray(heroImages, 0)};\n`
  );
}

function generateProductsJs() {
  const items = products
    .map((p) => {
      return (
        "  {\n" +
        `    id: ${JSON.stringify(p.id)},\n` +
        `    name: ${JSON.stringify(p.name)},\n` +
        `    category: ${JSON.stringify(p.category)},\n` +
        `    price: ${Number(p.price) || 0},\n` +
        `    size: ${JSON.stringify(p.size)},\n` +
        `    description: ${JSON.stringify(p.description)},\n` +
        `    tags: ${JSON.stringify(p.tags)},\n` +
        `    images: ${jsStringArray(p.images, 4)},\n` +
        "  },"
      );
    })
    .join("\n");

  return (
    "// 商品データ。価格は仮価格です。実際の価格に差し替えてください。\n" +
    '// category: "wallet" | "stationery" | "bag" | "other"\n' +
    `const CATEGORY_LABELS = ${JSON.stringify(CATEGORY_LABELS, null, 2)};\n\n` +
    `const CATEGORY_ORDER = ${JSON.stringify(CATEGORY_ORDER)};\n\n` +
    `const PRODUCTS = [\n${items}\n];\n`
  );
}

function validate() {
  const errors = [];
  const seenIds = new Set();
  products.forEach((p) => {
    if (!p.id || !/^[a-z0-9-]+$/.test(p.id)) {
      errors.push(`商品ID「${p.id}」は半角英数とハイフンのみで入力してください。`);
    }
    if (seenIds.has(p.id)) {
      errors.push(`商品ID「${p.id}」が重複しています。`);
    }
    seenIds.add(p.id);
    if (!p.name) {
      errors.push(`商品ID「${p.id}」の商品名が未入力です。`);
    }
    if (p.images.length === 0) {
      errors.push(`商品「${p.name || p.id}」に写真が1枚もありません。`);
    }
  });
  return errors;
}

async function handleSave() {
  const errors = validate();
  if (errors.length > 0) {
    setStatus(errors[0], "error");
    alert("保存前に確認してください：\n\n" + errors.join("\n"));
    return;
  }

  if (!window.showDirectoryPicker) {
    setStatus(
      "このブラウザは保存機能に対応していません。Chrome または Edge をお使いください。",
      "error"
    );
    return;
  }

  try {
    setStatus("保存先フォルダを選んでください…");
    const rootHandle = await window.showDirectoryPicker();

    let jsHandle, assetsHandle;
    try {
      jsHandle = await rootHandle.getDirectoryHandle("js");
      assetsHandle = await rootHandle.getDirectoryHandle("assets");
    } catch (e) {
      throw new Error(
        "選んだフォルダにjs・assetsフォルダが見つかりません。サイトのフォルダ（editor.htmlがある場所）を選んでください。"
      );
    }
    const imgHandle = await assetsHandle.getDirectoryHandle("img");
    const heroDirHandle = await imgHandle.getDirectoryHandle("hero", { create: true });
    const productsDirHandle = await imgHandle.getDirectoryHandle("products", { create: true });

    setStatus("画像を保存しています…");

    for (let i = 0; i < heroImages.length; i++) {
      const file = heroFiles[i];
      if (file) {
        const filename = `hero-${i + 1}.${extOf(file.name)}`;
        await writeFile(heroDirHandle, filename, file);
        heroImages[i] = `assets/img/hero/${filename}`;
      }
      if (!heroImages[i]) {
        throw new Error(`ヒーロー画像の${i + 1}枚目が空です。画像を選ぶか、削除してください。`);
      }
    }

    for (const p of products) {
      const files = productFiles[p.__uid] || {};
      for (const idxStr of Object.keys(files)) {
        const idx = Number(idxStr);
        const file = files[idx];
        const filename = `${p.id}-${idx + 1}.${extOf(file.name)}`;
        await writeFile(productsDirHandle, filename, file);
        p.images[idx] = `assets/img/products/${filename}`;
      }
      if (p.images.some((src) => !src)) {
        throw new Error(`商品「${p.name}」の写真が空のままです。画像を選ぶか、削除してください。`);
      }
    }

    setStatus("データを保存しています…");
    await writeFile(jsHandle, "hero-data.js", new Blob([generateHeroDataJs()], { type: "text/javascript" }));
    await writeFile(jsHandle, "products.js", new Blob([generateProductsJs()], { type: "text/javascript" }));

    setStatus(
      "保存しました。あとはターミナルで git add / commit / push をしてください（README参照）。",
      "success"
    );
  } catch (err) {
    if (err && err.name === "AbortError") {
      setStatus("保存はキャンセルされました。");
      return;
    }
    console.error(err);
    setStatus("保存に失敗しました: " + (err && err.message ? err.message : err), "error");
  }
}

document.getElementById("btn-save").addEventListener("click", handleSave);

renderHeroEditor();
renderProductEditor();
