// Formatear número de tarjeta con espacios
document.getElementById('tarjeta').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
});

// Formatear fecha de vencimiento MM/AA
document.getElementById('vencimiento').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// Solo números en CVV
document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// Solo números en teléfono
document.getElementById('telefono').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
});

{
  // Cargar compra guardada (si existe) y poblar resumen
  document.addEventListener("DOMContentLoaded", () => {
    const data = localStorage.getItem("compraCineMax");
    if (!data) return;

    const compra = JSON.parse(data);
    // Actualizar título de película si existe
    const movieTitleEl = document.querySelector(".movie-title");
    if (compra.pelicula && movieTitleEl) movieTitleEl.textContent = compra.pelicula;

    // Poblar lista de asientos
    const seatsSection = document.querySelector(".seats-section");
    if (compra.asientos && seatsSection) {
      const list = compra.asientos.map((a, i) => {
        const tipo = (a.tipo || "").toUpperCase() || "REGULAR";
        const precio = parseFloat(a.precio || 0).toFixed(2);
        return `
          <div class="seat-item">
            <div class="seat-info">
              <span>F${a.fila}-C${a.columna}</span>
              <span class="seat-badge">${tipo}</span>
            </div>
            <span class="seat-price">$${precio}</span>
          </div>
        `;
      }).join("");
      // Reemplaza el contenido interno conservando el encabezado
      const header = seatsSection.querySelector("h4")?.outerHTML || "<h4>Asientos seleccionados</h4>";
      seatsSection.innerHTML = header + list;
    }

    // Actualizar precios (subtotal, tarifa, total)
    const subtotal = parseFloat(compra.subtotal || 0);
    const serviceFee = 1; // fijo en tu UI
    const total = subtotal + serviceFee;

    const subtotalEl = document.querySelector(".price-breakdown .price-row span:nth-child(2)");
    // Mejor buscar por texto es más frágil; este selector asume estructura fija
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    const serviceEl = document.querySelectorAll(".price-row span:nth-child(2)")[1];
    if (serviceEl) serviceEl.textContent = `$${serviceFee.toFixed(2)}`;

    const totalEl = document.querySelector(".price-row.total-row span:nth-child(2)");
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    // Actualizar texto del botón de confirmar
    const confirmBtn = document.querySelector(".confirm-button");
    if (confirmBtn) confirmBtn.textContent = `Confirmar compra - $${total.toFixed(2)}`;
  });

  // Función para confirmar compra (validaciones ya existentes)
  function confirmarCompra() {
    const form = document.getElementById('checkout-form');
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const tarjeta = document.getElementById('tarjeta').value;
    const vencimiento = document.getElementById('vencimiento').value;
    const cvv = document.getElementById('cvv').value;
    const nombreTarjeta = document.getElementById('nombre-tarjeta').value;

    // Validar que todos los campos estén llenos
    if (!nombre || !email || !telefono || !tarjeta || !vencimiento || !cvv || !nombreTarjeta) {
        alert('Por favor, completa todos los campos');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor, ingresa un correo electrónico válido');
        return;
    }

    // Validar tarjeta (16 dígitos)
    if (tarjeta.replace(/\s/g, '').length !== 16) {
        alert('El número de tarjeta debe tener 16 dígitos');
        return;
    }

    // Validar CVV (3 dígitos)
    if (cvv.length !== 3) {
        alert('El CVV debe tener 3 dígitos');
        return;
    }

    // Validar formato de vencimiento
    if (!/^\d{2}\/\d{2}$/.test(vencimiento)) {
        alert('El formato de vencimiento debe ser MM/AA');
        return;
    }

    // Obtener datos para el PDF desde localStorage (o fallback)
    const data = JSON.parse(localStorage.getItem("compraCineMax") || "null");
    const compra = data || {
      asientos: [{ fila: "?", columna: "?", tipo: "REGULAR", precio: 0 }],
      pelicula: document.querySelector(".movie-title")?.textContent || "Película",
      subtotal: 0
    };

    // Generar PDF con jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const titulo = compra.pelicula;
    const fecha = new Date().toLocaleString();
    const sala = Math.floor(Math.random() * 5) + 1;
    const bloque = String.fromCharCode(65 + Math.floor(Math.random() * 6));

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("🎟️ TICKET DE CINE", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Cliente: ${nombre}`, 20, 32);
    doc.text(`Película: ${titulo}`, 20, 42);
    doc.text(`Fecha compra: ${fecha}`, 20, 52);
    doc.text(`Sala: ${sala}  Bloque: ${bloque}`, 20, 62);
    doc.text("-----------------------------------------------------", 20, 70);

    let y = 78;
    let total = 0;
    (compra.asientos || []).forEach((a, i) => {
      const precio = parseFloat(a.precio || 0);
      doc.text(`Asiento ${i + 1}: F${a.fila}-C${a.columna} (${(a.tipo||'').toUpperCase()})  $${precio.toFixed(2)}`, 20, y);
      y += 8;
      total += precio;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.text("-----------------------------------------------------", 20, y);
    doc.text(`Subtotal: $${total.toFixed(2)}`, 20, y + 8);
    const serviceFee = 1;
    doc.text(`Tarifa de servicio: $${serviceFee.toFixed(2)}`, 20, y + 16);
    doc.text(`Total: $${(total + serviceFee).toFixed(2)}`, 20, y + 26);

    // Guardar PDF
    const safeTitle = titulo.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
    doc.save(`Ticket_${safeTitle}_${new Date().toISOString().split('T')[0]}.pdf`);

    // Mensaje y limpieza ligera
    alert(`✅ Compra confirmada. Ticket descargado. Gracias ${nombre}`);
    console.log('Datos de compra (seguridad):', {
      nombre,
      email,
      telefono,
      tarjeta: tarjeta.slice(-4),
      nombreTarjeta
    });

    // Opcional: limpiar localStorage de la compra
    localStorage.removeItem("compraCineMax");
    // Redirigir o actualizar UI si lo deseas:
    // window.location.href = "alguna_pagina.html";
  }

  // Reemplaza la función global existente por la nueva (si estaba definida)
  window.confirmarCompra = confirmarCompra;

  // Evitar envío del formulario por Enter
  document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
  });
}
