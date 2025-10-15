/* ===========================================================
   LOGIN FUNCTIONALITY
=========================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const rol = document.getElementById("rol").value;
            const correo = document.getElementById("correo").value.trim();
            const password = document.getElementById("password").value.trim();

            const cuentas = {
                admin: { email: "admin@cinemax.com", pass: "Admin1" },
                cajero: { email: "cajero@cinemax.com", pass: "Cajero1" },
                usuario: { email: "usuario@cinemax.com", pass: "Usuario1" }
            };

            if (!rol || !correo || !password) {
                alert("Por favor completa todos los campos.");
                return;
            }

            const cuenta = cuentas[rol];
            if (cuenta && correo === cuenta.email && password === cuenta.pass) {
                if (rol === "admin") window.location.href = "usuarios/admin.html";
                if (rol === "cajero" || rol === "usuario") window.location.href = "cartelera/cartelera.html";
            } else {
                alert("Correo o contraseña incorrectos.");
            }
        });
    }
});