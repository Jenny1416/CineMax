const gridAsientos = document.getElementById("gridAsientos");
const resumenAsientos = document.getElementById("resumenAsientos");
const resumenTotal = document.getElementById("resumenTotal");
const btnConfirmarVenta = document.getElementById("btnConfirmarVenta");
const btnVolverAsientos = document.getElementById("btnVolverAsientos");
const resumenPelicula = document.getElementById("resumenPelicula");
const tituloAsientos = document.getElementById("tituloAsientos");

let asientosSeleccionados = [];

// Tipos y precios
const tipos = ["vip", "premium", "ocupado", "disponible"];
const precios = { vip: 25, premium: 18, disponible: 12 };

// Generar 6 filas x 10 columnas
function generarAsientos() {
  gridAsientos.innerHTML = "";
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

  // Listeners
  document.querySelectorAll(".asiento").forEach((a) => {
    a.addEventListener("click", () => {
      if (a.classList.contains("ocupado")) return;
      a.classList.toggle("seleccionado");
      actualizarResumen();
    });
  });
}

// Actualizar resumen lateral
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

// Generar al cargar
window.addEventListener("load", generarAsientos);

// Volver → redirige a reserva.html
btnVolverAsientos.addEventListener("click", () => {
  window.location.href = "reserva.html";
});

// Confirmar venta → generar ticket PDF
btnConfirmarVenta.addEventListener("click", () => {
  if (asientosSeleccionados.length === 0) {
    alert("❗Seleccione al menos un asiento para generar el ticket.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const titulo = tituloAsientos.textContent || "Película";
  const fecha = new Date().toLocaleDateString();
  const sala = Math.floor(Math.random() * 5) + 1;
  const bloque = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A-F aleatorio

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("🎟️ TICKET DE CINE", 20, 20);

  doc.setFont("helvetica", "normal");
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
