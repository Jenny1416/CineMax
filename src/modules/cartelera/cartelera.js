/* ===========================================================
   CARTELERA DINÁMICA DESDE BACKEND
   =========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carteleraCarousel");
  const grid = document.getElementById("recomendadoGrid");

  if (!carousel || !grid) return;

  async function cargarPeliculas() {
    try {
      const res = await fetch("https://cinemax-backend-production.up.railway.app/peliculas");
      const peliculas = await res.json();

      if (!Array.isArray(peliculas)) return;

      // =======================
      // SEPARAR RECOMENDADOS
      // =======================
      const cartelera = peliculas.filter(p => !p.edad);   // sin edad → cartelera normal
      const recomendados = peliculas.filter(p => p.edad); // con edad → recomendados

      // =======================
      // RENDER CARTELERA
     // ========================
      cartelera.forEach((p, i) => {
        const card = document.createElement("article");
        card.className = "movie-card";
        if (i === 2) card.classList.add("center");

        card.dataset.title = p.titulo;
        card.dataset.subtitle = p.titulo;
        card.dataset.date = "11-sep-2025";
        card.dataset.genres = p.genero;
        card.dataset.director = "Director Ejemplo";
        card.dataset.actors = "Actor 1, Actor 2, Actor 3";
        card.dataset.desc = p.descripcion || "Sinopsis no disponible";
        card.dataset.img = p.poster;
        card.dataset.banner = p.poster;
        card.dataset.duration = p.duracion;
        card.dataset.rating = "Apta para todo público";

        card.innerHTML = `
          <img class="movie-poster" src="${p.poster}" alt="${p.titulo}">
          <div class="movie-body">
            <div class="movie-title">${p.titulo}</div>
            <div class="movie-meta">${p.genero} · ${p.duracion}</div>
          </div>
        `;

        // Evento click
        card.addEventListener("click", () => {
          const data = {
            title: card.dataset.title,
            subtitle: card.dataset.subtitle,
            date: card.dataset.date,
            genres: card.dataset.genres,
            director: card.dataset.director,
            actors: card.dataset.actors,
            desc: card.dataset.desc,
            img: card.dataset.img,
            banner: card.dataset.banner,
            duration: card.dataset.duration,
            rating: card.dataset.rating
          };

          localStorage.setItem("peliculaSeleccionada", JSON.stringify(data));
          window.open("detalle.html", "_blank");
        });

        carousel.appendChild(card);
      });

      // =======================
      // RENDER RECOMENDADOS
     // ========================
      recomendados.forEach(r => {
        const card = document.createElement("div");
        card.className = "reco-card";

        card.innerHTML = `
          <img class="poster-sm" src="${r.poster}" alt="${r.titulo}">
          <div class="reco-body">
            <div class="reco-title">${r.titulo}</div>
            <div class="reco-meta">${r.genero} · ${r.duracion} · ${r.edad || ""}</div>
          </div>
        `;

        grid.appendChild(card);
      });

      activarCarrusel();

    } catch (err) {
      console.error("❌ Error cargando películas:", err);
    }
  }

  // ============================================
  // LÓGICA DEL CARRUSEL (NO CAMBIAR)
  // ============================================
  function activarCarrusel() {
    const cards = Array.from(carousel.querySelectorAll(".movie-card"));
    let currentIndex = Math.floor(cards.length / 2);

    function highlightCard(index) {
      cards.forEach(c => c.classList.remove("center"));
      const card = cards[index];
      if (!card) return;

      card.classList.add("center");
      const scrollAmount =
        card.offsetLeft - carousel.offsetWidth / 2 + card.offsetWidth / 2;

      carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }

    document.querySelector(".carousel-btn.prev")?.addEventListener("click", () => {
      if (currentIndex > 0) currentIndex--;
      highlightCard(currentIndex);
    });

    document.querySelector(".carousel-btn.next")?.addEventListener("click", () => {
      if (currentIndex < cards.length - 1) currentIndex++;
      highlightCard(currentIndex);
    });

    carousel.addEventListener("scroll", () =>
      requestAnimationFrame(updateCenterCard)
    );

    window.addEventListener("resize", () =>
      requestAnimationFrame(updateCenterCard)
    );

    function updateCenterCard() {
      const rect = carousel.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      let nearest = null,
        minDist = Infinity,
        index = 0;

      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = Math.abs(cardCenter - centerX);
        if (dist < minDist) {
          minDist = dist;
          nearest = c;
          index = i;
        }
      });

      cards.forEach(c => c.classList.remove("center"));
      if (nearest) nearest.classList.add("center");

      currentIndex = index;
    }

    updateCenterCard();
  }

  // cargar películas...
  cargarPeliculas();
});
