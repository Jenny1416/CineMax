document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     🔴 MENÚ LATERAL: Activar botón
  ===================================================== */
  const menuButtons = document.querySelectorAll(".menu-btn");
  menuButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      menuButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* =====================================================
     🎬 CAMBIO ENTRE CARTELERA Y VENTA
  ===================================================== */
  const btnsVender = document.querySelectorAll(".btn-vender");
  const seccionCartelera = document.getElementById("seccionCartelera");
  const seccionVender = document.getElementById("seccionVender");
  const seccionAsientos = document.getElementById("seccionAsientos");
  const btnVolver = document.getElementById("btnVolver");
  const imgPelicula = document.getElementById("imgPelicula");
  const tituloPelicula = document.getElementById("tituloPelicula");

  // Datos de películas
  const dataPeliculas = {
    demon: {
      img: "/src/assets/img/poster1.jpg",
      titulo: "DEMON SLAYER: KIMETSU NO YAIBA",
      genero: "Acción",
      duracion: "2h 15min",
      rating: "⭐ 4.5",
    },
    dracula: {
      img: "/src/assets/img/poster10.jpg",
      titulo: "Dracula: A Love Tale",
      genero: "Romance / Drama",
      duracion: "2h 10min",
      rating: "⭐ 4.3",
    },
    terror: {
      img: "/src/assets/img/poster4.jpg",
      titulo: "Noche de Terror",
      genero: "Terror",
      duracion: "2h 20min",
      rating: "⭐ 4.1",
    },
  };

  // Evento de Vender Boletos
  btnsVender.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const peliculaSeleccionada = e.target.closest(".pelicula").dataset.pelicula;
      const datos = dataPeliculas[peliculaSeleccionada];

      imgPelicula.src = datos.img;
      tituloPelicula.textContent = datos.titulo;
      document.querySelector(".genero").textContent = datos.genero;
      document.querySelector(".duracion").textContent = datos.duracion;
      document.querySelector(".estrella").textContent = datos.rating;

      seccionCartelera.classList.add("oculto");
      seccionVender.classList.remove("oculto");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // Botón Volver
  btnVolver.addEventListener("click", () => {
    seccionVender.classList.add("oculto");
    seccionCartelera.classList.remove("oculto");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* =====================================================
     🧩 SELECCIONES INTERACTIVAS
  ===================================================== */
  const activarGrupo = (selector, claseActiva) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener("click", () => {
        document.querySelectorAll(selector).forEach((x) => x.classList.remove(claseActiva));
        el.classList.add(claseActiva);
      });
    });
  };

  activarGrupo(".fecha", "activa");
  activarGrupo(".formato", "activo");
  activarGrupo(".hora", "activa");

  /* =====================================================
     🎟️ SECCIÓN DE ASIENTOS
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

  // Ir a selección de asientos
  btnContinuar.addEventListener("click", () => {
    seccionVender.classList.add("oculto");
    seccionAsientos.classList.remove("oculto");
    tituloAsientos.textContent = tituloPelicula.textContent;
    resumenPelicula.textContent = tituloPelicula.textContent;
    generarAsientos();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Volver a la sección anterior
  btnVolverAsientos.addEventListener("click", () => {
    seccionAsientos.classList.add("oculto");
    seccionVender.classList.remove("oculto");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* =====================================================
     🪑 GENERAR ASIENTOS CON TIPOS Y PRECIOS
  ===================================================== */
  function generarAsientos() {
    gridAsientos.innerHTML = "";
    const tipos = ["vip", "premium", "ocupado", "disponible"];

    for (let fila = 1; fila <= 6; fila++) {
      for (let col = 1; col <= 10; col++) {
        const asiento = document.createElement("i");
        asiento.classList.add("ph", "ph-armchair", "asiento");

        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        asiento.classList.add(tipo);
        asiento.dataset.fila = fila;
        asiento.dataset.columna = col;
        asiento.dataset.tipo = tipo;
        asiento.dataset.precio =
          tipo === "vip" ? 25 : tipo === "premium" ? 18 : tipo === "disponible" ? 12 : 0;

        asiento.title = `Fila ${fila}, Columna ${col} — ${tipo.toUpperCase()} ($${asiento.dataset.precio})`;

        gridAsientos.appendChild(asiento);
      }
    }

    document.querySelectorAll(".asiento").forEach((a) => {
      a.addEventListener("click", () => {
        if (a.classList.contains("ocupado")) return;
        a.classList.toggle("seleccionado");
        actualizarResumen();
      });
    });
  }

  /* =====================================================
     🧾 ACTUALIZAR RESUMEN LATERAL
  ===================================================== */
  function actualizarResumen() {
    const seleccionados = document.querySelectorAll(".asiento.seleccionado");
    asientosSeleccionados = [];
    let total = 0;

    seleccionados.forEach((a) => {
      total += parseFloat(a.dataset.precio);
      asientosSeleccionados.push({
        fila: a.dataset.fila,
        columna: a.dataset.columna,
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
     🧾 GENERAR TICKET PDF AUTOMÁTICAMENTE
  ===================================================== */
  btnConfirmarVenta.addEventListener("click", () => {
    if (asientosSeleccionados.length === 0) {
      alert("❗Seleccione al menos un asiento para generar el ticket.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const titulo = tituloPelicula.textContent;
    const fecha = new Date().toLocaleDateString();
    const sala = Math.floor(Math.random() * 5) + 1;
    const bloque = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A-F aleatorio

    doc.setFontSize(18);
    doc.text("🎟️ TICKET DE CINE", 20, 20);
    doc.setFontSize(12);
    doc.text(`Película: ${titulo}`, 20, 35);
    doc.text(`Fecha: ${fecha}`, 20, 45);
    doc.text(`Sala: ${sala}`, 20, 55);
    doc.text(`Bloque: ${bloque}`, 20, 65);
    doc.text("-----------------------------------------------------", 20, 70);

    let y = 80;
    let total = 0;

    asientosSeleccionados.forEach((a, i) => {
      doc.text(
        `Asiento ${i + 1}: F${a.fila}-C${a.columna} (${a.tipo.toUpperCase()})  $${a.precio}`,
        20,
        y
      );
      y += 10;
      total += parseFloat(a.precio);
    });

    doc.text("-----------------------------------------------------", 20, y);
    doc.text(`Total: $${total.toFixed(2)}`, 20, y + 10);

    doc.save(`Ticket_${titulo.replace(/\s+/g, "_")}_${fecha}.pdf`);
    alert("✅ Venta confirmada. Ticket generado y descargado.");
  });

  /* =====================================================
     ⏳ RESERVAR ASIENTOS (SIN PAGO)
  ===================================================== */
  btnReservar.addEventListener("click", () => {
    if (asientosSeleccionados.length === 0) {
      alert("❗Seleccione al menos un asiento antes de reservar.");
      return;
    }

    // Datos de la reserva
    const titulo = tituloPelicula.textContent;
    const fechaFuncion = document.querySelector(".fecha.activa span")?.textContent || "Próx. Función";
    const horaFuncion = document.querySelector(".hora.activa")?.textContent || "Sin hora";
    const total = parseFloat(resumenTotal.textContent);
    const asientos = asientosSeleccionados.map(a => `F${a.fila}-C${a.columna}`);
    const img = imgPelicula.src;

    // Crear objeto de reserva
    const nuevaReserva = {
      id: "R" + Math.floor(1000 + Math.random() * 9000),
      pelicula: titulo,
      fecha: `${fechaFuncion} - ${horaFuncion}`,
      sala: "Sala 1",
      asientos: asientos.join(", "),
      total: total,
      imagen: img,
      creada: new Date().toISOString(),
      limite: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // expira en 5 minutos
      estado: "pendiente",
    };

    // Guardar en localStorage
    const reservas = JSON.parse(localStorage.getItem("reservasCineMax")) || [];
    reservas.push(nuevaReserva);
    localStorage.setItem("reservasCineMax", JSON.stringify(reservas));

    alert(`🕒 Reserva creada correctamente.\n\nID: ${nuevaReserva.id}\nExpira en 5 minutos.`);

    // Redirigir a la página de reservas
    window.location.href = "cajeros-reservas.html";
  });
});
