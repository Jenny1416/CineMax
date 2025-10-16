// Tab Navigation
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetTab = button.getAttribute('data-tab');
    
    // Remove active class from all tabs and contents
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    button.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
  });
});

// Back Button
const btnBack = document.getElementById('btnBack');
btnBack.addEventListener('click', () => {
  // Usuario manejará la redirección
  console.log('[v0] Botón volver clickeado - Usuario manejará la redirección');
  // window.history.back(); // Ejemplo de implementación
});

// Edit Profile Info
const btnEditInfo = document.getElementById('btnEditInfo');
const btnCancelEdit = document.getElementById('btnCancelEdit');
const editActions = document.getElementById('editActions');
const inputFields = [
  document.getElementById('inputName'),
  document.getElementById('inputEmail'),
  document.getElementById('inputPhone'),
  document.getElementById('inputBirth'),
  document.getElementById('inputCity')
];

let isEditing = false;

btnEditInfo.addEventListener('click', () => {
  isEditing = !isEditing;
  
  if (isEditing) {
    // Enable editing
    inputFields.forEach(input => {
      if (input) input.disabled = false;
    });
    editActions.classList.remove('hidden');
    btnEditInfo.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Editando...
    `;
  } else {
    // Disable editing
    inputFields.forEach(input => {
      if (input) input.disabled = true;
    });
    editActions.classList.add('hidden');
    btnEditInfo.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      Editar
    `;
  }
});

btnCancelEdit.addEventListener('click', () => {
  isEditing = false;
  inputFields.forEach(input => {
    if (input) input.disabled = true;
  });
  editActions.classList.add('hidden');
  btnEditInfo.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
    Editar
  `;
});

// Save Changes Button
const btnSave = document.querySelector('.btn-save');
if (btnSave) {
  btnSave.addEventListener('click', () => {
    console.log('[v0] Guardando cambios del perfil...');
    
    // Simular guardado
    const loadingText = btnSave.textContent;
    btnSave.textContent = 'Guardando...';
    btnSave.disabled = true;
    
    setTimeout(() => {
      btnSave.textContent = '✓ Guardado';
      
      setTimeout(() => {
        btnSave.textContent = loadingText;
        btnSave.disabled = false;
        
        // Disable editing mode
        isEditing = false;
        inputFields.forEach(input => {
          if (input) input.disabled = true;
        });
        editActions.classList.add('hidden');
        btnEditInfo.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          Editar
        `;
      }, 1000);
    }, 1500);
  });
}

// Edit Avatar
const editAvatarBtn = document.getElementById('editAvatarBtn');
const avatarImg = document.getElementById('avatarImg');

editAvatarBtn.addEventListener('click', () => {
  console.log('[v0] Cambiar foto de perfil clickeado');
  
  // Simular cambio de avatar
  const avatars = [
    'https://i.pravatar.cc/200?img=47',
    'https://i.pravatar.cc/200?img=48',
    'https://i.pravatar.cc/200?img=49',
    'https://i.pravatar.cc/200?img=50'
  ];
  
  const currentSrc = avatarImg.src;
  const currentIndex = avatars.findIndex(url => currentSrc.includes(url.split('=')[1]));
  const nextIndex = (currentIndex + 1) % avatars.length;
  
  avatarImg.style.transform = 'scale(0.8)';
  avatarImg.style.opacity = '0.5';
  
  setTimeout(() => {
    avatarImg.src = avatars[nextIndex];
    avatarImg.style.transform = 'scale(1)';
    avatarImg.style.opacity = '1';
  }, 300);
});

// Rate Movie Buttons
const rateButtons = document.querySelectorAll('.btn-rate');
rateButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.history-card');
    const movieName = card.querySelector('.history-movie').textContent;
    
    console.log(`[v0] Calificar película: ${movieName}`);
    
    // Simular calificación
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      ★★★★★
    `;
    btn.style.background = '#d40000';
    btn.style.color = '#fff';
    btn.disabled = true;
  });
});

// Download Ticket Buttons
const downloadButtons = document.querySelectorAll('.btn-download');
downloadButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.reservation-card');
    const movieName = card.querySelector('h3').textContent;
    
    console.log(`[v0] Descargar boleto: ${movieName}`);
    
    // Simular descarga
    const originalText = btn.textContent;
    btn.textContent = 'Descargando...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.textContent = '✓ Descargado';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    }, 1500);
  });
});

// Favorites Carousel Auto-scroll
const favoritesCarousel = document.getElementById('favoritesCarousel');
let scrollAmount = 0;
let scrollDirection = 1;

function autoScrollFavorites() {
  if (!favoritesCarousel) return;
  
  const maxScroll = favoritesCarousel.scrollWidth - favoritesCarousel.clientWidth;
  
  scrollAmount += scrollDirection * 1;
  
  if (scrollAmount >= maxScroll) {
    scrollDirection = -1;
  } else if (scrollAmount <= 0) {
    scrollDirection = 1;
  }
  
  favoritesCarousel.scrollLeft = scrollAmount;
}

// Auto-scroll every 50ms (smooth animation)
let autoScrollInterval = setInterval(autoScrollFavorites, 50);

// Pause auto-scroll on hover
if (favoritesCarousel) {
  favoritesCarousel.addEventListener('mouseenter', () => {
    clearInterval(autoScrollInterval);
  });
  
  favoritesCarousel.addEventListener('mouseleave', () => {
    autoScrollInterval = setInterval(autoScrollFavorites, 50);
  });
}

// Genre Chips Animation
const genreChips = document.querySelectorAll('.genre-chip');
genreChips.forEach(chip => {
  chip.addEventListener('change', (e) => {
    const span = chip.querySelector('span');
    if (e.target.checked) {
      span.style.animation = 'chipSelect 0.3s ease';
    }
  });
});

// Add CSS animation for chip selection
const style = document.createElement('style');
style.textContent = `
  @keyframes chipSelect {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1.05); }
  }
`;
document.head.appendChild(style);

// Notification Toggles
const notificationToggles = document.querySelectorAll('.notification-item input[type="checkbox"]');
notificationToggles.forEach(toggle => {
  toggle.addEventListener('change', (e) => {
    const notifItem = e.target.closest('.notification-item');
    const notifName = notifItem.querySelector('strong').textContent;
    const isEnabled = e.target.checked;
    
    console.log(`[v0] Notificación "${notifName}" ${isEnabled ? 'activada' : 'desactivada'}`);
  });
});

// Setting Buttons
const settingButtons = document.querySelectorAll('.setting-btn');
settingButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.textContent.trim();
    console.log(`[v0] Acción de configuración: ${action}`);
    
    if (btn.classList.contains('danger')) {
      const confirm = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
      if (confirm) {
        console.log('[v0] Usuario confirmó eliminación de cuenta');
      }
    }
  });
});

// Animate stats on page load
window.addEventListener('load', () => {
  const statValues = document.querySelectorAll('.stat-value');
  
  statValues.forEach(stat => {
    const finalValue = parseInt(stat.textContent.replace(/,/g, ''));
    let currentValue = 0;
    const increment = finalValue / 50;
    
    const counter = setInterval(() => {
      currentValue += increment;
      if (currentValue >= finalValue) {
        stat.textContent = finalValue.toLocaleString();
        clearInterval(counter);
      } else {
        stat.textContent = Math.floor(currentValue).toLocaleString();
      }
    }, 30);
  });
});

// Badge hover effects
const badges = document.querySelectorAll('.badge-item:not(.locked)');
badges.forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    badge.style.animation = 'badgeBounce 0.5s ease';
  });
  
  badge.addEventListener('animationend', () => {
    badge.style.animation = '';
  });
});

// Add badge bounce animation
const badgeStyle = document.createElement('style');
badgeStyle.textContent = `
  @keyframes badgeBounce {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.1) rotate(-5deg); }
    75% { transform: scale(1.1) rotate(5deg); }
  }
`;
document.head.appendChild(badgeStyle);

console.log('[v0] Página de perfil CineMax cargada correctamente');