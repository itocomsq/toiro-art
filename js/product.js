function getProductIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function renderProductDetail() {
  const container = document.getElementById("product-detail");
  const id = getProductIdFromQuery();
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    container.innerHTML = `<p class="empty-state">商品が見つかりませんでした。<br /><a href="index.html">TOPへ戻る</a></p>`;
    return;
  }

  document.title = `${product.name} | toiro art.`;

  const thumbs = product.images
    .map(
      (img, i) =>
        `<img src="${img}" alt="${product.name} ${i + 1}" data-index="${i}" class="${i === 0 ? "active" : ""}" />`
    )
    .join("");

  const tags = product.tags.map((t) => `<span class="tag">${t}</span>`).join("");

  container.innerHTML = `
    <div class="detail-gallery">
      <div class="main-image">
        <img id="main-image" src="${product.images[0]}" alt="${product.name}" />
      </div>
      <div class="detail-thumbs">${thumbs}</div>
    </div>
    <div class="detail-info">
      <h1>${product.name}</h1>
      <p class="price">&yen;${product.price.toLocaleString()}</p>
      <p class="size">サイズ: ${product.size}</p>
      <p class="description">${product.description}</p>
      <div class="tag-list">${tags}</div>
      <a class="cta-instagram" href="https://www.instagram.com/toiro.nemui/" target="_blank" rel="noopener">
        ご購入・お問い合わせは Instagram へ &rarr;
      </a>
    </div>
  `;

  const mainImage = document.getElementById("main-image");
  container.querySelectorAll(".detail-thumbs img").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImage.src = thumb.src;
      container
        .querySelectorAll(".detail-thumbs img")
        .forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}

renderProductDetail();
