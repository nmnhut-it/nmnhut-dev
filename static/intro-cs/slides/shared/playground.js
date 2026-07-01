// In-browser Python playground for the decks (Pyodide / WebAssembly).
// Any element:
//   <div class="playground">
//     <textarea class="pg-code">…python…</textarea>
//     <button class="pg-run">Run</button>
//     <pre class="pg-out"></pre>
//   </div>
// becomes runnable. Python executes client-side; input() uses window.prompt.
// Pyodide is loaded lazily on the first Run so the deck opens fast.
(function () {
  let pyodidePromise = null;

  function loadPy(statusEl) {
    if (!pyodidePromise) {
      statusEl.textContent = "Starting Python… (first run downloads a few MB — give it a moment)";
      pyodidePromise = (typeof loadPyodide === "function")
        ? loadPyodide()
        : Promise.reject(new Error("Pyodide did not load from the CDN (are you online?)."));
    }
    return pyodidePromise;
  }

  document.querySelectorAll(".playground").forEach(function (pg) {
    const code = pg.querySelector(".pg-code");
    const out = pg.querySelector(".pg-out");
    const btn = pg.querySelector(".pg-run");
    if (!code || !out || !btn) return;

    btn.addEventListener("click", async function () {
      btn.disabled = true;
      const label = btn.textContent;
      btn.textContent = "Running…";
      out.textContent = "";
      try {
        const py = await loadPy(out);
        out.textContent = "";
        // batched fires per line WITHOUT the trailing newline — add it back.
        py.setStdout({ batched: function (s) { out.textContent += s + "\n"; } });
        py.setStderr({ batched: function (s) { out.textContent += s + "\n"; } });
        py.setStdin({ stdin: function () {
          const v = window.prompt("Your program is asking for input:");
          return v === null ? "" : v;
        } });
        await py.runPythonAsync(code.value);
        if (out.textContent === "") out.textContent = "(ran — no printed output)";
      } catch (e) {
        out.textContent += "\n" + (e && e.message ? e.message : String(e));
      } finally {
        btn.textContent = label;
        btn.disabled = false;
      }
    });
  });
})();
