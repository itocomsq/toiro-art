function getAllTags() {
  const tags = new Set();
  PRODUCTS.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags);
}

function getQueryFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("q") || "").trim();
}

let activeTag = null;

function matchesQuery(product, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    product.name.toLowerCase().includes(q) ||
    product.tags.some((t) => t.toLowerCase().includes(q))
  );
}

function renderResults() {
  const query = document.getElementById("search-input").value.trim();
  const results = PRODUCTS.filter((p) => {
    const tagOk = !activeTag || p.tags.includes(activeTag);
    return tagOk && matchesQuery(p, query);
  });

  const container = document.getElementById("search-results");
  if (results.length === 0) {
    container.innerHTML = `<p class="empty-state" style="grid-column:1/-1;">該当する商品が見つかりませんでした。</p>`;
    return;
  }

  container.innerHTML = results
    .map(
      (p) => `
      <a class="product-card" href="product.html?id=${p.id}">
        <div class="thumb">
          <img src="${p.images[0]}" alt="${p.name}" />
        </div>
        <div class="info">
          <h3>${p.name}</h3>
          <p class="price">&yen;${p.price.toLocaleString()}</p>
        </div>
      </a>`
    )
    .join("");
}

function renderTagFilter() {
  const container = document.getElementById("tag-filter");
  const tags = getAllTags();

  // 検索欄の初期値がタグ名と完全一致する場合は、そのタグをアクティブ表示にする
  const query = getQueryFromUrl();
  const matchedTag = tags.find((t) => t === query) || null;
  activeTag = matchedTag;

  container.innerHTML =
    `<button data-tag="">すべて</button>` +
    tags.map((t) => `<button data-tag="${t}">${t}</button>`).join("");

  container.querySelectorAll("button").forEach((btn) => {
    if ((btn.dataset.tag || null) === activeTag) btn.classList.add("active");
    btn.addEventListener("click", () => {
      activeTag = btn.dataset.tag || null;
      container
        .querySelectorAll("button")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      // タグクリックはそのタグだけで絞り込む。検索欄に残っている文字列と
      // 組み合わさって食い違う結果にならないよう、検索欄はクリアする
      document.getElementById("search-input").value = "";
      renderResults();
    });
  });
}

document.getElementById("search-input").value = getQueryFromUrl();
document.getElementById("search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  renderResults();
});

renderTagFilter();
renderResults();
