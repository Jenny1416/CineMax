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
      const header = seatsSection.querySelector("h4")?.outerHTML || "<h4>Asientos seleccionados</h4>";
      seatsSection.innerHTML = header + list;
    }

    // Precios
    const subtotal = parseFloat(compra.subtotal || 0);
    const serviceFee = 1;
    const total = subtotal + serviceFee;

    const subtotalEl = document.querySelector(".price-breakdown .price-row span:nth-child(2)");
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    const serviceEl = document.querySelectorAll(".price-row span:nth-child(2)")[1];
    if (serviceEl) serviceEl.textContent = `$${serviceFee.toFixed(2)}`;

    const totalEl = document.querySelector(".price-row.total-row span:nth-child(2)");
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    const confirmBtn = document.querySelector(".confirm-button");
    if (confirmBtn) confirmBtn.textContent = `Confirmar compra - $${total.toFixed(2)}`;
  });

  // Función principal
  function confirmarCompra() {
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const tarjeta = document.getElementById('tarjeta').value;
    const vencimiento = document.getElementById('vencimiento').value;
    const cvv = document.getElementById('cvv').value;
    const nombreTarjeta = document.getElementById('nombre-tarjeta').value;

    // VALIDACIONES
    if (!nombre || !email || !telefono || !tarjeta || !vencimiento || !cvv || !nombreTarjeta) {
        alert('Por favor, completa todos los campos');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Correo electrónico inválido');
        return;
    }

    if (tarjeta.replace(/\s/g, '').length !== 16) {
        alert('La tarjeta debe tener 16 dígitos');
        return;
    }

    if (cvv.length !== 3) {
        alert('El CVV debe tener 3 dígitos');
        return;
    }

    if (!/^\d{2}\/\d{2}$/.test(vencimiento)) {
        alert('El formato debe ser MM/AA');
        return;
    }

    // Obtener datos
    const data = JSON.parse(localStorage.getItem("compraCineMax") || "null");
    const compra = data || {
      asientos: [{ fila: "?", columna: "?", tipo: "REGULAR", precio: 0 }],
      pelicula: document.querySelector(".movie-title")?.textContent || "Película",
      subtotal: 0
    };

    // PDF
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
      doc.text(
        `Asiento ${i + 1}: F${a.fila}-C${a.columna} (${(a.tipo || '').toUpperCase()})  $${precio.toFixed(2)}`,
        20,
        y
      );
      y += 8;
      total += precio;

      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.text("-----------------------------------------------------", 20, y);
    const serviceFee = 1;
    doc.text(`Subtotal: $${total.toFixed(2)}`, 20, y + 8);
    doc.text(`Tarifa de servicio: $${serviceFee.toFixed(2)}`, 20, y + 16);
    doc.text(`Total: $${(total + serviceFee).toFixed(2)}`, 20, y + 26);

    const safeTitle = titulo.replace(/\s+/g, "_").replace(/[^\w\-]/g, "");
    doc.save(`Ticket_${safeTitle}_${new Date().toISOString().split('T')[0]}.pdf`);

    alert(`✅ Compra confirmada. Ticket descargado. Gracias ${nombre}`);

    // ==================== GUARDAR LA VENTA EN MONGODB ====================
    const payload = {
      compra,
      cliente: { nombre, email, telefono },
      tarjeta: tarjeta.slice(-4),
      fechaCompra: new Date().toISOString()
    };

    fetch("https://cinemax-backend-production.up.railway.app/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => console.log("VENTA GUARDADA EN BD:", data))
      .catch(err => console.error("ERROR AL GUARDAR VENTA:", err));

    // LIMPIAR
    localStorage.removeItem("compraCineMax");
  }

  // Exponer global
  window.confirmarCompra = confirmarCompra;

  // Evitar submit tradicional
  document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
  });
}
