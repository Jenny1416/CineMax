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

// Al confirmar en la pantalla de asientos guardamos la selección en localStorage
// y luego navegamos a la página de detalle de compra.
btnConfirmarVenta.addEventListener("click", () => {
  // Asegurarse de que el resumen esté actualizado
  actualizarResumen();

  if (asientosSeleccionados.length === 0) {
    alert("❗Seleccione al menos un asiento antes de continuar.");
    return;
  }

  const compra = {
    asientos: asientosSeleccionados,
    pelicula: tituloAsientos ? tituloAsientos.textContent : "Película",
    subtotal: parseFloat(resumenTotal.textContent) || 0,
    fechaCreacion: new Date().toISOString()
  };

  localStorage.setItem("compraCineMax", JSON.stringify(compra));
  window.location.href = "../clientes/Detalle_compra.html";
});
