document.addEventListener("DOMContentLoaded", () => {
  const reservasPendientesEl = document.getElementById("reservasPendientes");
  const reservasConfirmadasEl = document.getElementById("reservasConfirmadas");
  const contadorReservas = document.getElementById("contadorReservas");
  const buscador = document.getElementById("buscarReserva");

  // === CARGAR DESDE LOCALSTORAGE ===
  let todasLasReservas = JSON.parse(localStorage.getItem("reservasCineMax")) || [];

  // === RENDERIZAR ===
  function renderReservas(filtro = "") {
    reservasPendientesEl.innerHTML = "";
    reservasConfirmadasEl.innerHTML = "";

    // Filtra si se usa buscador
    const reservasFiltradas = todasLasReservas.filter(r =>
      r.pelicula.toLowerCase().includes(filtro.toLowerCase()) ||
      r.id.toLowerCase().includes(filtro.toLowerCase())
    );

    // Contador
    contadorReservas.textContent = `${reservasFiltradas.length} reserv${reservasFiltradas.length === 1 ? "a" : "as"}`;

    // Mostrar pendientes
    reservasFiltradas
      .filter(r => r.estado === "pendiente")
      .forEach((r) => {
        const expirada = new Date() > new Date(r.limite);
        const minutosRestantes = Math.max(0, Math.floor((new Date(r.limite) - Date.now()) / 60000));

        const card = document.createElement("div");
        card.classList.add("reserva-card", "pendiente");

        card.innerHTML = `
          <div class="reserva-info">
            <img src="${r.imagen}" alt="${r.pelicula}">
            <div class="reserva-detalles">
              <h4>${r.pelicula}</h4>
              <p>${r.fecha} • ${r.sala}</p>
              <p>ID: ${r.id}</p>
              <p>Asientos: ${r.asientos}</p>
              <p>Total: $${r.total.toLocaleString()}</p>
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

    // Mostrar confirmadas
    reservasFiltradas
      .filter(r => r.estado === "confirmada")
      .forEach((r) => {
        const card = document.createElement("div");
        card.classList.add("reserva-card", "confirmada");

        card.innerHTML = `
          <div class="reserva-info">
            <img src="${r.imagen}" alt="${r.pelicula}">
            <div class="reserva-detalles">
              <h4>${r.pelicula}</h4>
              <p>${r.fecha} • ${r.sala}</p>
              <p>ID: ${r.id}</p>
              <p>Asientos: ${r.asientos}</p>
              <p>Total: $${r.total.toLocaleString()}</p>
            </div>
          </div>
          <div class="reserva-acciones">
            <button class="btn-confirmar" disabled>Confirmada</button>
          </div>
        `;

        reservasConfirmadasEl.appendChild(card);
      });
  }

  // === FUNCIONES ===
  function confirmarReserva(id) {
    const reserva = todasLasReservas.find(r => r.id === id);
    if (!reserva) return;
    reserva.estado = "confirmada";
    localStorage.setItem("reservasCineMax", JSON.stringify(todasLasReservas));
    renderReservas(buscador.value);
  }

  function cancelarReserva(id) {
    todasLasReservas = todasLasReservas.filter(r => r.id !== id);
    localStorage.setItem("reservasCineMax", JSON.stringify(todasLasReservas));
    renderReservas(buscador.value);
  }

  // === VERIFICAR EXPIRACIÓN AUTOMÁTICAMENTE ===
  setInterval(() => {
    const ahora = new Date();
    todasLasReservas.forEach(r => {
      if (r.estado === "pendiente" && ahora > new Date(r.limite)) {
        r.estado = "expirada";
      }
    });
    localStorage.setItem("reservasCineMax", JSON.stringify(todasLasReservas));
    renderReservas(buscador.value);
  }, 30000);

  // === BUSCADOR ===
  buscador.addEventListener("input", (e) => renderReservas(e.target.value));

  renderReservas();
});
