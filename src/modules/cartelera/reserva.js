document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("peliculaReserva"));

  // Si no hay datos, mostrar mensaje
  if (!data) {
    document.body.innerHTML = "<h2 style='text-align:center;margin-top:100px;'>No se encontró información para la reserva.</h2>";
    return;
  }

  // Mostrar información de la película
  const poster = document.getElementById("reservaPoster");
  const titulo = document.getElementById("reservaTitulo");
  const info = document.getElementById("reservaInfo");

  poster.src = data.img;
  titulo.textContent = data.title;
  info.textContent = `${data.genres || "Género no definido"} · ${data.duration || "Duración no especificada"} · ⭐ 4.5`;

  // ================================
  // SELECCIÓN INTERACTIVA DE OPCIONES
  // ================================

  // Función genérica para activar botones (solo uno por grupo)
  function activarBotones(selector, storageKey) {
    const botones = document.querySelectorAll(selector);
    botones.forEach(boton => {
      boton.addEventListener("click", () => {
        botones.forEach(b => b.classList.remove("active"));
        boton.classList.add("active");

        // Guardar en localStorage la selección
        localStorage.setItem(storageKey, boton.textContent.trim());
      });
    });
  }

  // Activar para cada grupo
  activarBotones(".cine", "reservaCine");
  activarBotones(".fecha", "reservaFecha");
  activarBotones(".formato", "reservaFormato");
  activarBotones(".hora", "reservaHora");

  // ================================
  // BOTÓN "Seleccionar Asientos"
  // ================================
  const btnAsientos = document.querySelector(".btn-asientos");
  btnAsientos.addEventListener("click", () => {
    const seleccion = {
      pelicula: data.title,
      cine: localStorage.getItem("reservaCine") || "No seleccionado",
      fecha: localStorage.getItem("reservaFecha") || "No seleccionada",
      formato: localStorage.getItem("reservaFormato") || "No seleccionado",
      hora: localStorage.getItem("reservaHora") || "No seleccionada",
    };

    // Guardar todo en una sola clave
    localStorage.setItem("reservaFinal", JSON.stringify(seleccion));

    alert(
      `✅ Reserva creada:\n\n🎬 Película: ${seleccion.pelicula}\n🏢 Cine: ${seleccion.cine}\n📅 Fecha: ${seleccion.fecha}\n🎥 Formato: ${seleccion.formato}\n🕓 Hora: ${seleccion.hora}`
    );

    // Abrir futura página de asientos
    // window.open("asientos.html", "_blank");
  });
});
