document.addEventListener("DOMContentLoaded", () => {
  const reservasPendientesEl = document.getElementById("reservasPendientes");
  const reservasConfirmadasEl = document.getElementById("reservasConfirmadas");
  const contadorReservas = document.getElementById("contadorReservas");
  const buscador = document.getElementById("buscarReserva");

  // Siempre leer desde storage cuando renderizamos
  function leerTodasLasReservas() {
    return JSON.parse(localStorage.getItem("reservasCineMax")) || [];
  }

  // Recomputar ocupados a partir de ventas + reservas confirmadas + reservas pendientes válidas
  function recomputeOcupados() {
    const ventas = JSON.parse(localStorage.getItem("ventasCineMax")) || [];
    const reservas = JSON.parse(localStorage.getItem("reservasCineMax")) || [];
    const ocupados = {};

    ventas.forEach(v => {
      const peli = v.pelicula || "Sin pelicula";
      const as = Array.isArray(v.asientos) ? v.asientos : (v.asientos ? String(v.asientos).split(",") : []);
      ocupados[peli] = ocupados[peli] || [];
      ocupados[peli].push(...as.map(s => s.trim()));
    });

    reservas.forEach(r => {
      if (!r) return;
      const peli = r.pelicula || "Sin pelicula";
      const as = Array.isArray(r.asientos) ? r.asientos : (r.asientos ? String(r.asientos).split(",") : []);
      if (r.estado === "confirmada") {
        ocupados[peli] = ocupados[peli] || [];
        ocupados[peli].push(...as.map(s => s.trim()));
      } else if (r.estado === "pendiente" && new Date(r.limite) > new Date()) {
        // bloquear temporalmente
        ocupados[peli] = ocupados[peli] || [];
        ocupados[peli].push(...as.map(s => s.trim()));
      }
    });

    for (const k in ocupados) {
      ocupados[k] = [...new Set(ocupados[k])];
    }

    localStorage.setItem("ocupadosCineMax", JSON.stringify(ocupados));
    localStorage.setItem("ocupadosCineMax_updated_at", Date.now());
  }

  // Renderizar usando datos actuales de storage
  function renderReservas(filtro = "") {
    const todasLasReservas = leerTodasLasReservas();

    reservasPendientesEl.innerHTML = "";
    reservasConfirmadasEl.innerHTML = "";

    const reservasFiltradas = todasLasReservas.filter(r =>
      (r.pelicula || "").toLowerCase().includes(filtro.toLowerCase()) ||
      (r.id || "").toLowerCase().includes(filtro.toLowerCase())
    );

    contadorReservas.textContent = `${reservasFiltradas.length} reserv${reservasFiltradas.length === 1 ? "a" : "as"}`;

    reservasFiltradas
      .filter(r => r.estado === "pendiente")
      .forEach((r) => {
        const expirada = new Date() > new Date(r.limite);
        const minutosRestantes = Math.max(0, Math.floor((new Date(r.limite) - Date.now()) / 60000));

        const card = document.createElement("div");
        card.classList.add("reserva-card", "pendiente");

        card.innerHTML = `
          <div class="reserva-info">
            <img src="${r.imagen || ''}" alt="${r.pelicula}">
            <div class="reserva-detalles">
              <h4>${r.pelicula}</h4>
              <p>${r.fecha} • ${r.sala}</p>
              <p>ID: ${r.id}</p>
              <p>Asientos: ${r.asientos}</p>
              <p>Total: $${Number(r.total || 0).toFixed(2)}</p>
              <p>Expira en: <span class="${expirada ? "expirada" : ""}">
                ${expirada ? "Expirada" : minutosRestantes + " min"}
              </span></p>
            </div>
          </div>
          <div class="reserva-acciones">
            <button class="btn-confirmar" ${expirada ? "disabled" : ""}>Confirmar</button>
            <button class="btn-cancelar">Cancelar</button>
          </div>
        `;

        card.querySelector(".btn-confirmar").addEventListener("click", () => confirmarReserva(r.id));
        card.querySelector(".btn-cancelar").addEventListener("click", () => cancelarReserva(r.id));
        reservasPendientesEl.appendChild(card);
      });

    reservasFiltradas
      .filter(r => r.estado === "confirmada")
      .forEach((r) => {
        const card = document.createElement("div");
        card.classList.add("reserva-card", "confirmada");

        card.innerHTML = `
          <div class="reserva-info">
            <img src="${r.imagen || ''}" alt="${r.pelicula}">
            <div class="reserva-detalles">
              <h4>${r.pelicula}</h4>
              <p>${r.fecha} • ${r.sala}</p>
              <p>ID: ${r.id}</p>
              <p>Asientos: ${r.asientos}</p>
              <p>Total: $${Number(r.total || 0).toFixed(2)}</p>
            </div>
          </div>
          <div class="reserva-acciones">
            <button class="btn-confirmar" disabled>Confirmada</button>
          </div>
        `;
        reservasConfirmadasEl.appendChild(card);
      });
  }

  function confirmarReserva(id) {
    let todas = leerTodasLasReservas();
    const idx = todas.findIndex(r => r.id === id);
    if (idx === -1) return;
    todas[idx].estado = "confirmada";
    localStorage.setItem("reservasCineMax", JSON.stringify(todas));
    // recomputar ocupados (ahora confirmadas deben ser permanentes)
    recomputeOcupados();
    renderReservas(buscador?.value || "");
    // notificar otras pestañas
    localStorage.setItem("reservasCineMax_updated_at", Date.now());
  }

  function cancelarReserva(id) {
    let todas = leerTodasLasReservas();
    todas = todas.filter(r => r.id !== id);
    localStorage.setItem("reservasCineMax", JSON.stringify(todas));
    recomputeOcupados();
    renderReservas(buscador?.value || "");
    localStorage.setItem("reservasCineMax_updated_at", Date.now());
  }

  // Expiraciones persistentes: marcar/limpiar y recompute
  setInterval(() => {
    const ahora = new Date();
    let todas = leerTodasLasReservas();
    const cambiadas = todas.some(r => r.estado === "pendiente" && ahora > new Date(r.limite));
    if (cambiadas) {
      todas = todas.map(r => (r.estado === "pendiente" && ahora > new Date(r.limite)) ? { ...r, estado: "expirada" } : r);
      localStorage.setItem("reservasCineMax", JSON.stringify(todas));
      recomputeOcupados();
      renderReservas(buscador?.value || "");
      localStorage.setItem("reservasCineMax_updated_at", Date.now());
    }
  }, 10000);

  buscador?.addEventListener("input", (e) => renderReservas(e.target.value));

  // inicializar
  recomputeOcupados();
  renderReservas();

  // reaccionar a cambios desde otras pestañas
  window.addEventListener("storage", (e) => {
    if (["reservasCineMax", "reservasCineMax_updated_at", "ventasCineMax", "ventasCineMax_updated_at", "ocupadosCineMax", "ocupadosCineMax_updated_at"].includes(e.key)) {
      recomputeOcupados();
      renderReservas(buscador?.value || "");
    }
  });
});
