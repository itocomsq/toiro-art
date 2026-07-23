// 検索欄の入力候補（タグ）を、サイトデザインに合わせた自前のドロップダウンで表示する
document.addEventListener("DOMContentLoaded", () => {
  const allTags = Array.from(new Set(PRODUCTS.flatMap((p) => p.tags)));

  document.querySelectorAll(".search-box").forEach((box) => {
    const input = box.querySelector(".search-field");
    const list = box.querySelector(".search-suggest");
    if (!input || !list) return;

    function render(matches) {
      if (matches.length === 0) {
        list.hidden = true;
        list.innerHTML = "";
        return;
      }
      list.innerHTML = matches
        .map((t) => `<li><button type="button">${t}</button></li>`)
        .join("");
      list.hidden = false;
    }

    function filterAndRender() {
      const q = input.value.trim().toLowerCase();
      // 何も入力していない状態では、タグ一覧の先頭から候補として出す
      const matches = q
        ? allTags.filter((t) => t.toLowerCase().includes(q)).slice(0, 8)
        : allTags.slice(0, 8);
      render(matches);
    }

    input.addEventListener("input", (e) => {
      // 日本語などIME変換中のinputイベントでは候補を更新しない（変換前の文字で誤判定しないように）
      if (e.isComposing) return;
      filterAndRender();
    });

    // IMEでの変換が確定した瞬間にも候補を更新する
    input.addEventListener("compositionend", filterAndRender);

    // 空欄でクリック（フォーカス）しても候補が見えるようにする
    input.addEventListener("focus", filterAndRender);

    list.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      input.value = btn.textContent;
      render([]);
      input.form.requestSubmit();
    });

    input.addEventListener("blur", () => {
      // 候補クリックを先に処理できるよう少し遅らせてから閉じる
      setTimeout(() => render([]), 150);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") render([]);
    });
  });
});
