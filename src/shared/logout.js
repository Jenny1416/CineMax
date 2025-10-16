// Intento robusto: comprobar existencia vía fetch antes de navegar (HTTP). Fallbacks seguros.
(function () {
  const fileTarget = "file:///C:/Users/jenif/Downloads/CineMax/src/modules/index.html";
  const httpCandidates = [
    "/src/modules/index.html",
    "/modules/index.html",
    "/src/index.html",
    "/index.html",
    "/modules/usuarios/index.html"
  ];

  // Construir URLs absolutas desde origin
  function abs(url) {
    try { return location.origin + url; } catch { return url; }
  }

  async function existsHttp(url) {
    try {
      // intentar HEAD (más rápido); si falla, intentar GET sin cuerpo
      let r = await fetch(url, { method: "HEAD" });
      if (r && (r.ok || r.status === 200)) return true;
      // algunos servidores no responden HEAD correctamente -> probar GET
      r = await fetch(url, { method: "GET" });
      return r && (r.ok || r.status === 200);
    } catch (err) {
      return false;
    }
  }

  async function findAndNavigateHTTP() {
    // 1) probar candidatos absolutos (origin + path)
    for (const c of httpCandidates) {
      const url = abs(c);
      if (await existsHttp(url)) {
        window.location.href = url;
        return true;
      }
    }

    // 2) probar candidatos directos relativos desde origin (sin origin)
    for (const c of httpCandidates) {
      if (await existsHttp(c)) {
        window.location.href = c;
        return true;
      }
    }

    // 3) intentar subir ruta relativa desde la ubicación actual (../index.html, ../../index.html, ...)
    const parts = (location.pathname || "").split("/").filter(Boolean);
    for (let up = 1; up <= Math.max(3, parts.length); up++) {
      const prefix = parts.slice(0, Math.max(0, parts.length - up)).join("/");
      const candidate = (prefix ? "/" + prefix + "/index.html" : "/index.html");
      const url = location.origin + candidate;
      if (await existsHttp(url)) {
        window.location.href = url;
        return true;
      }
    }

    return false;
  }

  async function navigateToTarget() {
    console.log("[logout] protocolo:", location.protocol, "ruta actual:", location.href);

    if (location.protocol.startsWith("http")) {
      const ok = await findAndNavigateHTTP();
      if (ok) return;
      // último recurso: navegar a una ruta relativa común
      const fallback = "../index.html";
      console.warn("[logout] no se encontró index en los candidatos. Navegando a fallback:", fallback);
      window.location.href = fallback;
      return;
    }

    if (location.protocol === "file:") {
      // si se abrió por file:// intentar directamente la ruta file absoluta
      try {
        window.location.href = fileTarget;
        return;
      } catch (err) {
        console.warn("[logout] no pudo navegar a fileTarget, intentando relativo...");
      }
      // fallback relativo
      window.location.href = "../index.html";
      return;
    }

    // otros protocolos -> intento relativo
    window.location.href = "../index.html";
  }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".logout-btn, .btn-logout, .btn-logout-icon");
    if (!btn) return;
    e.preventDefault();
    navigateToTarget();
  });

  // Exponer para pruebas desde consola
  window.cineMaxLogout = navigateToTarget;
})();