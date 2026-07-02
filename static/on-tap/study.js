/* Shared behaviour for the data-mining study hub.
   - data-reveal="ID": click toggles the .reveal-body with that id (formula → plug-in,
     and "show answer" panels).
   - "Hiện tất cả" / "Ẩn tất cả": expand or collapse every reveal on the page.
   - Active-nav highlight: marks the nav link matching the current filename.
   KaTeX auto-render runs on load (input: \( \) inline, $$ $$ block). */

(function () {
  function setOpen(body, btn, open) {
    body.classList.toggle('open', open);
    if (btn) {
      btn.classList.toggle('open', open);
      const show = btn.getAttribute('data-label-show') || btn.textContent;
      const hide = btn.getAttribute('data-label-hide');
      if (hide) btn.textContent = open ? hide : show;
      // mark the parent step as completed once revealed
      const step = btn.closest('.step');
      if (step && open) step.classList.add('done');
    }
  }

  // Event delegation for all reveal buttons.
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-reveal]');
    if (!btn) return;
    const body = document.getElementById(btn.getAttribute('data-reveal'));
    if (!body) return;
    setOpen(body, btn, !body.classList.contains('open'));
  });

  // Expand / collapse all on the page.
  function revealAll(open) {
    document.querySelectorAll('.reveal-body').forEach(function (body) {
      const btn = document.querySelector('[data-reveal="' + body.id + '"]');
      setOpen(body, btn, open);
    });
  }
  window.revealAll = revealAll;

  // Highlight the current page in the nav bar.
  function markActiveNav() {
    let file = location.pathname.split('/').pop();
    if (!file || file === '') file = 'index.html';
    document.querySelectorAll('.study-nav a').forEach(function (a) {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (href === file) a.classList.add('active');
    });
  }

  function renderMath() {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    markActiveNav();
    renderMath();
  });
})();
