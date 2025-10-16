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

// Función para confirmar compra
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

    // Si todo está correcto, mostrar mensaje de éxito
    alert(`¡Compra confirmada!\n\nGracias ${nombre}\nTotal: $13\n\nRecibirás un correo de confirmación en ${email}`);
    
    // Aquí podrías enviar los datos a un servidor
    console.log('Datos de compra:', {
        nombre,
        email,
        telefono,
        tarjeta: tarjeta.slice(-4), // Solo últimos 4 dígitos por seguridad
        nombreTarjeta
    });
}

// Prevenir envío del formulario con Enter
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
});