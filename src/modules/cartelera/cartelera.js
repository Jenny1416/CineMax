/* ===========================================================
   CARTELERA MODULE (versión mejorada)
   Carrusel centrado con botones visibles y enfoque suave
   =========================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carteleraCarousel');
    const grid = document.getElementById('recomendadoGrid');
    if (!carousel || !grid) return;

    const cartelera = [
        { titulo: "Dracula: A Love Tale", poster: "/src/assets/img/poster4.jpg", genero: "Fantasia, Romance, Terror", duracion: "120min" },
        { titulo: "The Bad Guys", poster: "/src/assets/img/poster5.jpg", genero: "Animación, Familia", duracion: "95min" },
        { titulo: "DEMON SLAYER: KIMETSU NO YAIBA", poster: "/src/assets/img/poster1.jpg", genero: "Acción, Animación", duracion: "150min" },
        { titulo: "Dracula: A Love Tale (alt)", poster: "/src/assets/img/poster4.jpg", genero: "Romance", duracion: "112min" },
        { titulo: "Pets on a Train", poster: "/src/assets/img/poster6.jpg", genero: "Animación, Familia", duracion: "99min" }
    ];

    const recomendado = [
        { titulo: "Demon Slayer Kimetsu no Yaiba The Movie: Infinity Castle", poster: "/src/assets/img/poster1.jpg", genero: "Acción, Animación", duracion: "150min", edad: "+16" },
        { titulo: "The Fantastic Four: First Steps", poster: "/src/assets/img/poster9.jpg", genero: "Acción, Aventuras", duracion: "115min", edad: "+7" },
        { titulo: "Bring Her Back", poster: "/src/assets/img/poster3.jpg", genero: "Terror", duracion: "104min", edad: "+18" },
        { titulo: "Pets on a Train", poster: "/src/assets/img/poster8.jpg", genero: "Animación, Familia", duracion: "99min", edad: "+15" }
    ];

    // Render cartelera
    cartelera.forEach((p, i) => {
        const card = document.createElement('article');
        card.className = 'movie-card';
        if (i === 2) card.classList.add('center'); // centrada inicial
        card.innerHTML = `
      <img class="movie-poster" src="${p.poster}" alt="${p.titulo}">
      <div class="movie-body">
        <div class="movie-title">${p.titulo}</div>
        <div class="movie-meta">${p.genero} · ${p.duracion}</div>
      </div>`;
        carousel.appendChild(card);
    });

    // Render recomendado
    recomendado.forEach(r => {
        const card = document.createElement('div');
        card.className = 'reco-card';
        card.innerHTML = `
      <img class="poster-sm" src="${r.poster}" alt="${r.titulo}">
      <div class="reco-body">
        <div class="reco-title">${r.titulo}</div>
        <div class="reco-meta">${r.genero} · ${r.duracion} · ${r.edad}</div>
      </div>`;
        grid.appendChild(card);
    });

    // ==============================
    //  Lógica de enfoque automático
    // ==============================
    const cards = Array.from(carousel.querySelectorAll('.movie-card'));
    let currentIndex = Math.floor(cards.length / 2);

    function highlightCard(index) {
        cards.forEach(c => c.classList.remove('center'));
        const card = cards[index];
        if (!card) return;
        card.classList.add('center');
        const scrollAmount = card.offsetLeft - carousel.offsetWidth / 2 + card.offsetWidth / 2;
        carousel.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }

    document.querySelector('.carousel-btn.prev')?.addEventListener('click', () => {
        if (currentIndex > 0) currentIndex--;
        highlightCard(currentIndex);
    });

    document.querySelector('.carousel-btn.next')?.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) currentIndex++;
        highlightCard(currentIndex);
    });

    // Actualiza el centro cuando el usuario hace scroll manual
    function updateCenterCard() {
        const rect = carousel.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        let nearest = null, minDist = Infinity, index = 0;
        cards.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const cardCenter = r.left + r.width / 2;
            const dist = Math.abs(cardCenter - centerX);
            if (dist < minDist) { minDist = dist; nearest = c; index = i; }
        });
        cards.forEach(c => c.classList.remove('center'));
        if (nearest) nearest.classList.add('center');
        currentIndex = index;
    }

    carousel.addEventListener('scroll', () => requestAnimationFrame(updateCenterCard));
    window.addEventListener('resize', () => requestAnimationFrame(updateCenterCard));
    updateCenterCard();
});
