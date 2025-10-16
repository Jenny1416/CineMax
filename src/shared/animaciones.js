document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     🔴 MENÚ LATERAL
  ===================================================== */
  const menuButtons = document.querySelectorAll(".menu-btn");
  menuButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      menuButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* =====================================================
     🎬 CARTELERA → VENDER
  ===================================================== */
  const seccionCartelera = document.getElementById("seccionCartelera");
  const seccionVender = document.getElementById("seccionVender");
  const seccionAsientos = document.getElementById("seccionAsientos");
  const btnVolver = document.getElementById("btnVolver");
  const imgPelicula = document.getElementById("imgPelicula");
  const tituloPelicula = document.getElementById("tituloPelicula");

  const cajeroActivo =
    document.querySelector(".header span")?.textContent.replace("Bienvenido, ", "") ||
    "Cajero user";

  // Datos de las películas (sin cambios)
  const dataPeliculas = {
    demon: { img: "/src/assets/img/poster1.jpg", titulo: "DEMON SLAYER: KIMETSU NO YAIBA" },
    dracula: { img: "/src/assets/img/poster10.jpg", titulo: "Dracula: A Love Tale" },
    terror: { img: "/src/assets/img/poster4.jpg", titulo: "Noche de Terror" },
    spiderman: { img: "/src/assets/img/poster3.jpg", titulo: "Spider-Man: No Way Home" },
    batman: { img: "/src/assets/img/poster5.jpg", titulo: "The Batman" },
    matrix: { img: "/src/assets/img/poster6.jpg", titulo: "The Matrix Resurrections" },
    minions: { img: "/src/assets/img/poster7.jpg", titulo: "Minions: The Rise of Gru" },
    johnwick: { img: "/src/assets/img/poster8.jpg", titulo: "John Wick: Chapter 4" },
    toyStory: { img: "/src/assets/img/poster9.jpg", titulo: "Toy Story 4" },
  };

  // Manejo robusto de botones vender (busca data-pelicula en botón o contenedor)
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-vender");
    if (!btn) return;
    const contenedor = btn.closest(".pelicula");
    const clavePelicula = btn.dataset.pelicula || contenedor?.dataset.pelicula;
    if (!clavePelicula) return console.error("data-pelicula no encontrada");
    const datos = dataPeliculas[clavePelicula];
    if (!datos) return console.error("clave no en dataPeliculas:", clavePelicula);
    if (!imgPelicula || !tituloPelicula || !seccionCartelera || !seccionVender) return;
    imgPelicula.src = datos.img;
    tituloPelicula.textContent = datos.titulo;
    seccionCartelera.classList.add("oculto");
    seccionVender.classList.remove("oculto");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  btnVolver?.addEventListener("click", () => {
    seccionVender.classList.add("oculto");
    seccionCartelera?.classList.remove("oculto");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* =====================================================
     🪑 SELECCIÓN DE ASIENTOS (AHORA LEE ocupadosCineMax y reservas para bloquear)
  ===================================================== */
  const btnContinuar = document.querySelector(".continuar");
  const btnVolverAsientos = document.getElementById("btnVolverAsientos");
  const gridAsientos = document.getElementById("gridAsientos");
  const tituloAsientos = document.getElementById("tituloAsientos");
  const resumenPelicula = document.getElementById("resumenPelicula");
  const resumenAsientos = document.getElementById("resumenAsientos");
  const resumenTotal = document.getElementById("resumenTotal");
  const btnConfirmarVenta = document.getElementById("btnConfirmarVenta");
  const btnReservar = document.getElementById("btnReservar");

  let asientosSeleccionados = [];

  btnContinuar?.addEventListener("click", () => {
    seccionVender.classList.add("oculto");
    seccionAsientos.classList.remove("oculto");
    tituloAsientos.textContent = tituloPelicula.textContent;
    resumenPelicula.textContent = tituloPelicula.textContent;
    generarAsientos();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  btnVolverAsientos?.addEventListener("click", () => {
    seccionAsientos.classList.add("oculto");
    seccionVender.classList.remove("oculto");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  function generarAsientos() {
    gridAsientos.innerHTML = "";
    const peliculaActual = tituloPelicula.textContent;

    // Leer ocupados permanentes desde storage
    const ocupadosObj = JSON.parse(localStorage.getItem("ocupadosCineMax")) || {};
    const ocupadosPermanentes = (ocupadosObj[peliculaActual] || []).map(s => s.trim());

    // Leer reservas y bloquear sillas pendientes no expiradas y confirmadas
    const reservas = JSON.parse(localStorage.getItem("reservasCineMax")) || [];
    const asientosBloqueadosPorReservas = reservas
      .filter(r => r && r.pelicula === peliculaActual && r.estado !== "cancelada")
      .filter(r => r.estado === "confirmada" || new Date(r.limite) > new Date())
      .flatMap(r => Array.isArray(r.asientos) ? r.asientos : String(r.asientos).split(","))
      .map(a => a.trim());

    const asientosOcupados = [...new Set([...ocupadosPermanentes, ...asientosBloqueadosPorReservas])];

    for (let fila = 1; fila <= 6; fila++) {
      for (let col = 1; col <= 10; col++) {
        const asiento = document.createElement("i");
        asiento.classList.add("ph", "ph-armchair", "asiento");

        let tipo = "regular";
        if (fila <= 2) tipo = "vip";
        else if (fila <= 4) tipo = "premium";

        const nombre = `F${fila}-C${col}`;
        asiento.dataset.fila = fila;
        asiento.dataset.columna = col;
        asiento.dataset.nombre = nombre;
        asiento.dataset.tipo = tipo;
        asiento.dataset.precio = tipo === "vip" ? 25 : tipo === "premium" ? 18 : 12;

        // marcar ocupado si está en lista
        if (asientosOcupados.includes(nombre)) {
          asiento.classList.add("ocupado");
        } else {
          asiento.classList.add(tipo);
        }

        asiento.title = `Fila ${fila}, Columna ${col} — ${tipo.toUpperCase()} ($${asiento.dataset.precio})`;
        gridAsientos.appendChild(asiento);
      }
    }

    // Delegado por si se regeneran asientos
    document.querySelectorAll(".asiento").forEach((a) => {
      a.addEventListener("click", () => {
        if (a.classList.contains("ocupado")) return;
        a.classList.toggle("seleccionado");
        actualizarResumen();
      });
    });
  }

  function actualizarResumen() {
    const seleccionados = document.querySelectorAll(".asiento.seleccionado");
    asientosSeleccionados = [];
    let total = 0;

    seleccionados.forEach((a) => {
      total += parseFloat(a.dataset.precio);
      asientosSeleccionados.push({
        nombre: `F${a.dataset.fila}-C${a.dataset.columna}`,
        tipo: a.dataset.tipo,
        precio: a.dataset.precio,
      });
    });

    resumenAsientos.textContent =
      asientosSeleccionados.length > 0
        ? `${asientosSeleccionados.length} asiento(s)`
        : "Ninguno";
    resumenTotal.textContent = total.toFixed(2);
  }

  /* =====================================================
     💬 MODAL CLIENTE / PAGO (sin cambios funcionales)
  ===================================================== */
  const modal = document.getElementById("modalCliente");
  const formCliente = document.getElementById("formCliente");
  const btnCancelarModal = document.getElementById("btnCancelarModal");
  const totalPagar = document.getElementById("totalPagar");
  const montoRecibido = document.getElementById("montoRecibido");
  const cambioCliente = document.getElementById("cambioCliente");
  let tipoOperacion = "";

  montoRecibido?.addEventListener("input", () => {
    const total = parseFloat(totalPagar.value) || 0;
    const recibido = parseFloat(montoRecibido.value) || 0;
    const cambio = Math.max(0, recibido - total);
    cambioCliente.value = "$" + cambio.toFixed(2);
  });

  function abrirModal(tipo) {
    tipoOperacion = tipo;
    modal.classList.remove("oculto");
    totalPagar.value = resumenTotal.textContent;
    document.getElementById("bloquePago").style.display =
      tipo === "reserva" ? "none" : "block";
  }

  btnCancelarModal?.addEventListener("click", () => {
    modal.classList.add("oculto");
    formCliente.reset();
  });

  btnConfirmarVenta?.addEventListener("click", () => {
    if (asientosSeleccionados.length === 0) return alert("Seleccione al menos un asiento.");
    abrirModal("venta");
  });

  btnReservar?.addEventListener("click", () => {
    if (asientosSeleccionados.length === 0) return alert("Seleccione al menos un asiento.");
    abrirModal("reserva");
  });

  formCliente?.addEventListener("submit", (e) => {
    e.preventDefault();
    const cliente = document.getElementById("nombreCliente").value;
    const cedula = document.getElementById("cedulaCliente").value;
    const telefono = document.getElementById("telefonoCliente").value;
    const total = parseFloat(totalPagar.value) || 0;
    const recibido = parseFloat(montoRecibido.value) || 0;
    const cambio = Math.max(0, recibido - total);
    modal.classList.add("oculto");

    if (tipoOperacion === "venta") {
      registrarVenta(cliente, cedula, telefono, recibido, cambio);
    } else {
      registrarReserva(cliente, cedula, telefono);
    }

    formCliente.reset();
  });

  /* =====================================================
     🧾 FUNCIONES DE REGISTRO (VENTA + RESERVA)
  ===================================================== */
  function registrarVenta(cliente, cedula, telefono, recibido, cambio) {
    const pelicula = tituloPelicula.textContent;
    const fechaFuncion = document.querySelector(".fecha.activa span")?.textContent || "Próx. Función";
    const horaFuncion = document.querySelector(".hora.activa")?.textContent || "Sin hora";
    const total = parseFloat(resumenTotal.textContent) || 0;
    const asientos = asientosSeleccionados.map((a) => a.nombre);
    const img = imgPelicula.src;

    const venta = {
      id: "V" + Math.floor(1000 + Math.random() * 9000),
      pelicula,
      fecha: new Date().toISOString(),
      fechaFuncion: `${fechaFuncion} - ${horaFuncion}`,
      sala: "Sala 1",
      total,
      asientos,
      imagen: img,
      cliente,
      cedula,
      telefono,
      cajero: cajeroActivo,
      efectivo: recibido,
      cambio
    };

    const ventas = JSON.parse(localStorage.getItem("ventasCineMax")) || [];
    ventas.push(venta);
    localStorage.setItem("ventasCineMax", JSON.stringify(ventas));
    localStorage.setItem("ventasCineMax_updated_at", Date.now());

    // Marcar asientos como ocupados permanentes (ventas)
    const ocupados = JSON.parse(localStorage.getItem("ocupadosCineMax")) || {};
    ocupados[pelicula] = [...new Set([...(ocupados[pelicula] || []), ...asientos.map(s => s.trim())])];
    localStorage.setItem("ocupadosCineMax", JSON.stringify(ocupados));
    localStorage.setItem("ocupadosCineMax_updated_at", Date.now());

    // Generar y descargar PDF (intento con jsPDF, fallback a ventana print)
    try {
      const jsPDFLib = window.jspdf && window.jspdf.jsPDF ? window.jspdf.jsPDF : (window.jsPDF || null);
      if (typeof jsPDFLib === "function") {
        const doc = new jsPDFLib({ unit: "mm", format: "a4" });
        doc.setFontSize(14);
        doc.text("CineMax — Boleta de Venta", 14, 20);
        doc.setFontSize(10);
        doc.text(`ID: ${venta.id}`, 14, 30);
        doc.text(`Película: ${venta.pelicula}`, 14, 36);
        doc.text(`Función: ${venta.fechaFuncion}`, 14, 42);
        doc.text(`Sala: ${venta.sala}`, 14, 48);
        doc.text(`Cajero: ${venta.cajero}`, 14, 54);
        doc.text(`Cliente: ${venta.cliente || "-"}`, 14, 60);
        doc.text(`Fecha (registro): ${new Date(venta.fecha).toLocaleString()}`, 14, 78);

        const asientosStr = venta.asientos.join(", ");
        let y = 88;
        doc.setFontSize(11);
        doc.text("Asientos:", 14, y);
        y += 6;
        for (let i = 0; i < asientosStr.length; i += 80) {
          doc.text(asientosStr.substr(i, 80), 14, y);
          y += 6;
        }

        doc.setFontSize(12);
        doc.text(`Total: $${venta.total.toFixed(2)}`, 14, y + 6);
        const filename = `Boleta_${venta.id}.pdf`;
        doc.save(filename);
      } else {
        throw new Error("jsPDF no disponible");
      }
    } catch (err) {
      try {
        const win = window.open("", "_blank", "width=600,height=800");
        const html = `
          <!doctype html><html><head><meta charset="utf-8"><title>Boleta ${venta.id}</title>
          <style>body{font-family:Arial;padding:20px}h1{font-size:18px}p{margin:6px 0}</style></head><body>
          <h1>CineMax — Boleta</h1>
          <p><strong>ID:</strong> ${venta.id}</p>
          <p><strong>Película:</strong> ${venta.pelicula}</p>
          <p><strong>Función:</strong> ${venta.fechaFuncion}</p>
          <p><strong>Sala:</strong> ${venta.sala}</p>
          <p><strong>Asientos:</strong> ${venta.asientos.join(", ")}</p>
          <p><strong>Total:</strong> $${venta.total.toFixed(2)}</p>
          <p><strong>Cajero:</strong> ${venta.cajero}</p>
          <p><strong>Fecha:</strong> ${new Date(venta.fecha).toLocaleString()}</p>
          <script>window.onload=function(){window.print();setTimeout(()=>window.close(),300);}</script>
          </body></html>`;
        win.document.write(html);
        win.document.close();
      } catch (e) {
        console.warn("No se pudo generar PDF ni abrir impresión.", e);
      }
    }

    // limpiar UI y refrescar asientos (para que se vean ocupados)
    document.querySelectorAll(".asiento.seleccionado").forEach(a => a.classList.remove("seleccionado"));
    actualizarResumen();
    generarAsientos();

    alert(`✅ Venta registrada.\nCliente: ${cliente}\nCambio: $${(venta.cambio || 0).toFixed(2)}`);
  }

  function registrarReserva(cliente, cedula, telefono) {
    const pelicula = tituloPelicula.textContent;
    const fechaFuncion = document.querySelector(".fecha.activa span")?.textContent || "Próx. Función";
    const horaFuncion = document.querySelector(".hora.activa")?.textContent || "Sin hora";
    const total = parseFloat(resumenTotal.textContent) || 0;
    const asientos = asientosSeleccionados.map((a) => a.nombre);
    const img = imgPelicula.src;

    const nuevaReserva = {
      id: "R" + Math.floor(1000 + Math.random() * 9000),
      pelicula,
      fecha: `${fechaFuncion} - ${horaFuncion}`,
      sala: "Sala 1",
      asientos: asientos.join(", "),
      total,
      imagen: img,
      cliente,
      cedula,
      telefono,
      cajero: cajeroActivo,
      creada: new Date().toISOString(),
      limite: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      estado: "pendiente",
    };

    const reservas = JSON.parse(localStorage.getItem("reservasCineMax")) || [];
    reservas.push(nuevaReserva);
    localStorage.setItem("reservasCineMax", JSON.stringify(reservas));
    localStorage.setItem("reservasCineMax_updated_at", Date.now());

    // No tocar ocupadosCineMax permanente; generarAsientos toma en cuenta reservas para bloquear temporalmente.
    generarAsientos();

    alert(`🕒 Reserva creada correctamente.\nID: ${nuevaReserva.id}\nExpira en 5 minutos.`);
    location.href = "cajeros-reservas.html";
  }

  // Delegación: permitir selección de fecha, hora y formato (botones generados dinámicamente)
  document.body.addEventListener("click", (e) => {
    // Selección de fecha (elementos con clase .fecha)
    const fechaBtn = e.target.closest(".fecha");
    if (fechaBtn) {
      document.querySelectorAll(".fecha").forEach(f => f.classList.remove("activa"));
      fechaBtn.classList.add("activa");
      // Si la fecha tiene un span con texto que se usa, actualizamos donde corresponda
      const span = fechaBtn.querySelector("span")?.textContent;
      if (span && document.getElementById("tituloAsientos")) {
        // opcional: actualizar texto visible de función
        document.getElementById("tituloAsientos").textContent = `${tituloPelicula.textContent} — ${span}`;
      }
      return;
    }

    // Selección de hora (elementos con clase .hora)
    const horaBtn = e.target.closest(".hora");
    if (horaBtn) {
      document.querySelectorAll(".hora").forEach(h => h.classList.remove("activa"));
      horaBtn.classList.add("activa");
      return;
    }

    // Selección de formato / tipo (ej. .formato o .tipo)
    const formatoBtn = e.target.closest(".formato, .tipo");
    if (formatoBtn) {
      document.querySelectorAll(".formato, .tipo").forEach(t => t.classList.remove("activo", "seleccionado"));
      formatoBtn.classList.add("activo");
      return;
    }
  });
});
