const HERO_IMAGES = [
  "assets/img/hero/hero-1.jpg",
  "assets/img/hero/hero-2.jpg",
  "assets/img/hero/hero-3.jpg",
  "assets/img/hero/hero-4.jpg",
];

function renderHero() {
  const viewport = document.getElementById("hero-viewport");
  const dotsEl = document.getElementById("hero-dots");
  const n = HERO_IMAGES.length;

  // 両端をつなげて無限に見せるため、先頭に最後の複製、末尾に先頭の複製を追加する
  const extended = [HERO_IMAGES[n - 1], ...HERO_IMAGES, HERO_IMAGES[0]];

  // 両端のクローンは、スクロール可能範囲の限界に近いとセンタリングできず止まってしまうため、
  // 前後に見えないダミー要素を置いてスクロール可能な余白を確保する
  const spacer = `<div class="hero-slide hero-spacer" aria-hidden="true"></div>`;
  viewport.innerHTML =
    spacer +
    extended
      .map(
        (src, i) => `
      <div class="hero-slide" data-pos="${i}">
        <img src="${src}" alt="展示写真" loading="eager" />
      </div>`
      )
      .join("") +
    spacer;
  dotsEl.innerHTML = HERO_IMAGES.map(
    (_, i) => `<span data-real="${i}"${i === 0 ? ' class="active"' : ""}></span>`
  ).join("");

  const slideEls = [...viewport.querySelectorAll(".hero-slide:not(.hero-spacer)")];
  const dots = [...dotsEl.querySelectorAll("span")];
  let pos = 1; // 拡張配列上の現在位置（1 = 実データの先頭）

  function realIndex(p) {
    return ((p - 1) % n + n) % n;
  }

  function updateActive(p) {
    slideEls.forEach((el, i) => el.classList.toggle("is-active", i === p));
    const ri = realIndex(p);
    dots.forEach((d, i) => d.classList.toggle("active", i === ri));
  }

  function goTo(newPos, smooth) {
    pos = Math.max(0, Math.min(n + 1, newPos));
    const vRect = viewport.getBoundingClientRect();
    const sRect = slideEls[pos].getBoundingClientRect();
    const delta = sRect.left - vRect.left + sRect.width / 2 - vRect.width / 2;
    viewport.style.scrollBehavior = smooth ? "smooth" : "auto";
    viewport.scrollLeft = viewport.scrollLeft + delta;
    updateActive(pos);

    // 端のクローンは、スクロール可能な範囲の限界でscrollLeftがクランプされてしまい、
    // 変化量が0になって"scroll"イベント自体が発火しないことがある。
    // その場合に備え、スクロール監視に頼らないフォールバックも必ず仕込む。
    if (pos === 0 || pos === n + 1) {
      clearTimeout(boundaryFallbackTimer);
      boundaryFallbackTimer = setTimeout(settle, smooth ? 500 : 80);
    }
  }

  let boundaryFallbackTimer = null;

  // 「今どのスライドが中央に一番近いか」を実際の見た目から判定して、状態を現実に合わせる。
  // クリック・自動再生・手動スワイプ・上記フォールバックのどこから呼ばれても同じ処理で済む。
  function settle() {
    const vRect = viewport.getBoundingClientRect();
    const center = vRect.left + vRect.width / 2;
    let closest = pos;
    let minDist = Infinity;
    slideEls.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const dist = Math.abs((r.left + r.right) / 2 - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    pos = closest;
    updateActive(pos);
    // クローン（両端の複製）で止まっていたら、見た目を変えず実データ側へ瞬時に戻す
    if (pos === 0) goTo(n, false);
    else if (pos === n + 1) goTo(1, false);
  }

  // アニメーションの完了タイミングに依存せず、「スクロールイベントが一定時間来なくなったら
  // 落ち着いたとみなす」方式で判定する。クリック・自動再生・手動スワイプのどれでも同じ処理で扱える。
  let scrollIdleTimer = null;
  viewport.addEventListener(
    "scroll",
    () => {
      clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(settle, 150);
    },
    { passive: true }
  );

  slideEls.forEach((el) => {
    el.addEventListener("click", () => {
      const clickedPos = Number(el.dataset.pos);
      if (clickedPos === pos) return;
      restartAutoplay();
      goTo(clickedPos, true);
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      restartAutoplay();
      goTo(1 + Number(dot.dataset.real), true);
    });
  });

  let timer = null;
  function play() {
    timer = setInterval(() => goTo(pos + 1, true), 4500);
  }
  // 手動操作の直後に自動再生が衝突しないよう、操作したら次の切り替えまでの秒数をリセットする
  function restartAutoplay() {
    clearInterval(timer);
    play();
  }

  window.addEventListener("resize", () => goTo(pos, false));

  goTo(1, false);
  play();
}

function renderGenreSections() {
  const container = document.getElementById("genre-sections");
  container.innerHTML = CATEGORY_ORDER.map((cat) => {
    const items = PRODUCTS.filter((p) => p.category === cat);
    if (items.length === 0) return "";
    const cards = items
      .map(
        (p) => `
        <a class="product-card" href="product.html?id=${p.id}">
          <div class="thumb">
            <img src="${p.images[0]}" alt="${p.name}" loading="lazy" />
          </div>
          <div class="info">
            <h3>${p.name}</h3>
          </div>
        </a>`
      )
      .join("");
    return `
      <section class="genre-section">
        <div class="genre-heading wrap">
          <h3>${CATEGORY_LABELS[cat]}</h3>
          <span class="genre-count">${items.length}点</span>
        </div>
        <div class="genre-row">${cards}</div>
      </section>`;
  }).join("");
}

renderHero();
renderGenreSections();
