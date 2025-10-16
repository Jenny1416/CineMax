document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(localStorage.getItem('peliculaSeleccionada'));

  if (!data) {
    document.body.innerHTML = "<h2 style='text-align:center;margin-top:100px;'>No se encontró información de la película.</h2>";
    return;
  }

  // Asignar datos
  document.getElementById('detalleTituloSuperior').textContent = data.title || "Película";
  document.getElementById('detalleTitulo').textContent = data.title || "";
  document.getElementById('detalleSubtitulo').textContent = data.subtitle || "";
  document.getElementById('detalleMeta').textContent = data.genres || "";
  document.getElementById('detalleClasificacion').textContent = data.rating || "Apta para todo público";
  document.getElementById('detalleDescripcion').textContent = data.desc || "Sin descripción disponible.";
  document.getElementById('detalleTituloOriginal').textContent = data.original || data.title || "";
  document.getElementById('detalleDirector').textContent = data.director || "No especificado";
  document.getElementById('detalleActores').textContent = data.actors || "No especificado";
  document.getElementById('detalleDuracion').textContent = data.duration || "N/A";
  document.getElementById('detalleGeneros').textContent = data.genres || "";
  document.getElementById('detalleFecha').textContent = data.date || "Próximamente";

  // Imagen principal
  const poster = document.getElementById('detallePoster');
  if (data.img) poster.src = data.img;
  else poster.src = "/src/assets/img/default-poster.jpg";

  // Banner
  const banner = document.getElementById('detalleBanner');
  if (data.banner) {
    banner.style.backgroundImage = `url(${data.banner})`;
    banner.style.backgroundSize = "cover";
    banner.style.backgroundPosition = "center";
  } else if (data.img) {
    banner.style.backgroundImage = `url(${data.img})`;
  }
});

// === Botón Reservar ===
const btnReservar = document.getElementById("btnReservar");
if (btnReservar) {
  btnReservar.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem('peliculaSeleccionada'));
    if (data) {
      localStorage.setItem("peliculaReserva", JSON.stringify(data));
      window.open("reserva.html", "_blank");
    } else {
      alert("No hay información de la película para reservar.");
    }
  });
}
