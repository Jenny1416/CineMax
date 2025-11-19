document.addEventListener("DOMContentLoaded", () => {
    // Variables globales
    const sections = document.querySelectorAll(".section");
    const navButtons = document.querySelectorAll(".nav-btn");
    const modal = document.getElementById("reserva-modal");
    const btnSell = document.querySelectorAll(".btn-sell");
    const btnBack = document.querySelector(".btn-back");
    const btnLogout = document.querySelector(".btn-logout");

    // Navegación entre secciones
    navButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const section = btn.getAttribute("data-section");

            // Actualizar botones activos
            navButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            // Mostrar sección
            sections.forEach((s) => s.classList.remove("active"));
            document.getElementById(section).classList.add("active");
        });
    });

    // Abrir modal de reserva
    btnSell.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const movieCard = e.target.closest(".movie-card");
            const title = movieCard.querySelector(".movie-title").textContent;
            const poster = movieCard.querySelector(".movie-poster img").src;

            document.getElementById("modal-movie-title").textContent = title;
            document.getElementById("modal-poster").src = poster;

            modal.classList.remove("hidden");
        });
    });

    // Cerrar modal
    btnBack.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // Seleccionar cine
    const cinemaBtns = document.querySelectorAll(".cinema-btn");
    cinemaBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            cinemaBtns.forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
        });
    });

    // Seleccionar fecha
    const dateBtns = document.querySelectorAll(".date-btn");
    dateBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            dateBtns.forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
        });
    });

    // Seleccionar formato
    const formatTabs = document.querySelectorAll(".format-tab");
    formatTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            formatTabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");
        });
    });

    // Seleccionar horario
    const timeBtns = document.querySelectorAll(".time-btn");
    timeBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            timeBtns.forEach((b) => b.classList.remove("selected"));
            btn.classList.add("selected");
        });
    });

    // Cerrar sesión
    btnLogout.addEventListener("click", () => {
       
           window.location.href = "index.html";
        });

    // Seleccionar asientos
    const btnSelectSeats = document.querySelector(".btn-select-seats");
    btnSelectSeats.addEventListener("click", () => {
        
        modal.classList.add("hidden");
    });
});

async function cargarPeliculas() {
    const response = await fetch("http://localhost:3000/api/peliculas");
    const peliculas = await response.json();

    console.log("Películas desde MySQL:", peliculas);
}
cargarPeliculas();
