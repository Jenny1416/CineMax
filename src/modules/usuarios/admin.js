document.addEventListener("DOMContentLoaded", () => {
  // Navigation functionality
  const navItems = document.querySelectorAll(".nav-item")
  const sections = document.querySelectorAll(".content-section")

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()

      // Remove active class from all nav items
      navItems.forEach((nav) => nav.classList.remove("active"))

      // Add active class to clicked item
      item.classList.add("active")

      // Hide all sections
      sections.forEach((section) => section.classList.remove("active"))

      // Show selected section
      const sectionId = item.getAttribute("data-section")
      const targetSection = document.getElementById(sectionId)
      if (targetSection) {
        targetSection.classList.add("active")
      }
    })
  })

  // Logout functionality
  const logoutBtn = document.querySelector(".btn-logout")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        // Redirigir de forma fiable al index dentro de `src/modules`
        window.location.replace(window.location.origin + '/index.html')
      }
    })
  }

  // Simulate real-time stats updates (optional)
  function updateStats() {
    const statValues = document.querySelectorAll(".stat-value")
    statValues.forEach((stat) => {
      // Add animation class when stats update
      stat.style.transition = "transform 0.3s ease"
    })
  }

  // Add activity item dynamically (example function)
  function addActivity(text) {
    const activityList = document.querySelector(".activity-list")
    if (!activityList) return

    const newActivity = document.createElement("div")
    newActivity.className = "activity-item"
    newActivity.innerHTML = `
      <span class="activity-dot red"></span>
      <span class="activity-text">${text}</span>
    `

    // Add with animation
    newActivity.style.opacity = "0"
    activityList.insertBefore(newActivity, activityList.firstChild)

    setTimeout(() => {
      newActivity.style.transition = "opacity 0.5s ease"
      newActivity.style.opacity = "1"
    }, 10)

    // Keep only last 5 activities
    const activities = activityList.querySelectorAll(".activity-item")
    if (activities.length > 5) {
      activityList.removeChild(activities[activities.length - 1])
    }
  }

  // Movies Section Functionality
  const searchInput = document.getElementById("searchMovies")
  const movieCards = document.querySelectorAll(".movie-card")
  const movieCount = document.querySelector(".movie-count")

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      let visibleCount = 0

      movieCards.forEach((card) => {
        const title = card.querySelector(".movie-title").textContent.toLowerCase()
        if (title.includes(searchTerm)) {
          card.style.display = "block"
          visibleCount++
        } else {
          card.style.display = "none"
        }
      })

      if (movieCount) {
        movieCount.textContent = `${visibleCount} película(s)`
      }
    })
  }

  // Nueva Película button
  const btnNuevaPelicula = document.querySelector(".btn-nueva-pelicula")
  if (btnNuevaPelicula) {
    btnNuevaPelicula.addEventListener("click", () => {
      alert("Funcionalidad para agregar nueva película")
      // Here you would open a modal or redirect to add movie form
    })
  }

  // Edit buttons
  const editButtons = document.querySelectorAll(".btn-editar")
  editButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const movieCard = e.target.closest(".movie-card")
      const movieTitle = movieCard.querySelector(".movie-title").textContent
      alert(`Editar película: ${movieTitle}`)
      // Here you would open edit modal or form
    })
  })

  // Delete buttons
  const deleteButtons = document.querySelectorAll(".btn-eliminar")
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const movieCard = e.target.closest(".movie-card")
      const movieTitle = movieCard.querySelector(".movie-title").textContent

      if (confirm(`¿Estás seguro de que deseas eliminar "${movieTitle}"?`)) {
        movieCard.style.transition = "opacity 0.3s ease, transform 0.3s ease"
        movieCard.style.opacity = "0"
        movieCard.style.transform = "scale(0.9)"

        setTimeout(() => {
          movieCard.remove()
          // Update count
          const remainingMovies = document.querySelectorAll(".movie-card").length
          if (movieCount) {
            movieCount.textContent = `${remainingMovies} película(s)`
          }
          // Add activity
          addActivity(`Película "${movieTitle}" eliminada del sistema`)
        }, 300)
      }
    })
  })

  // Food Section Functionality
  const foodSearchInput = document.getElementById("searchFood")
  const foodTableRows = document.querySelectorAll(".food-table tbody tr")

  if (foodSearchInput) {
    foodSearchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()

      foodTableRows.forEach((row) => {
        const foodName = row.querySelector(".food-name").textContent.toLowerCase()
        const category = row.cells[1].textContent.toLowerCase()

        if (foodName.includes(searchTerm) || category.includes(searchTerm)) {
          row.style.display = ""
        } else {
          row.style.display = "none"
        }
      })
    })
  }

  // Food edit buttons
  const foodEditButtons = document.querySelectorAll(".btn-icon-edit")
  foodEditButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr")
      const foodName = row.querySelector(".food-name").textContent
      alert(`Editar producto: ${foodName}`)
      // Here you would open edit modal or form
    })
  })

  // Food delete buttons
  const foodDeleteButtons = document.querySelectorAll(".btn-icon-delete")
  foodDeleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr")
      const foodName = row.querySelector(".food-name").textContent

      if (confirm(`¿Estás seguro de que deseas eliminar "${foodName}"?`)) {
        row.style.transition = "opacity 0.3s ease"
        row.style.opacity = "0"

        setTimeout(() => {
          row.remove()
          addActivity(`Producto "${foodName}" eliminado del sistema`)
        }, 300)
      }
    })
  })

  // Clients Section Functionality
  const clientSearchInput = document.getElementById("searchClients")
  const clientTableRows = document.querySelectorAll(".client-table tbody tr")
  const clientCount = document.querySelector(".client-count")

  if (clientSearchInput) {
    clientSearchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      let visibleCount = 0

      clientTableRows.forEach((row) => {
        const clientName = row.querySelector(".client-name").textContent.toLowerCase()
        const email = row.cells[1].textContent.toLowerCase()

        if (clientName.includes(searchTerm) || email.includes(searchTerm)) {
          row.style.display = ""
          visibleCount++
        } else {
          row.style.display = "none"
        }
      })

      if (clientCount) {
        clientCount.textContent = `${visibleCount} cliente(s)`
      }
    })
  }

  // Nuevo Cliente button
  const btnNuevoCliente = document.querySelector(".btn-nuevo-cliente")
  if (btnNuevoCliente) {
    btnNuevoCliente.addEventListener("click", () => {
      alert("Funcionalidad para agregar nuevo cliente")
      // Here you would open a modal or redirect to add client form
    })
  }

  // Client edit buttons
  const clientEditButtons = document.querySelectorAll(".client-table .btn-icon-edit")
  clientEditButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr")
      const clientName = row.querySelector(".client-name").textContent
      alert(`Editar cliente: ${clientName}`)
      // Here you would open edit modal or form
    })
  })

  // Client delete buttons
  const clientDeleteButtons = document.querySelectorAll(".client-table .btn-icon-delete")
  clientDeleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr")
      const clientName = row.querySelector(".client-name").textContent

      if (confirm(`¿Estás seguro de que deseas eliminar al cliente "${clientName}"?`)) {
        row.style.transition = "opacity 0.3s ease"
        row.style.opacity = "0"

        setTimeout(() => {
          row.remove()
          // Update client count
          const remainingClients = document.querySelectorAll(".client-table tbody tr").length
          if (clientCount) {
            clientCount.textContent = `${remainingClients} cliente(s)`
          }
          addActivity(`Cliente "${clientName}" eliminado del sistema`)
        }, 300)
      }
    })
  })

  // Cajeros Section Functionality
  const cajeroSearchInput = document.getElementById("searchCajeros")
  const cajeroTableRows = document.querySelectorAll(".cajero-table tbody tr")
  const cajeroCount = document.querySelector(".cajero-count")

  if (cajeroSearchInput) {
    cajeroSearchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      let visibleCount = 0

      cajeroTableRows.forEach((row) => {
        const cajeroName = row.querySelector(".cajero-name").textContent.toLowerCase()
        const email = row.cells[1].textContent.toLowerCase()

        if (cajeroName.includes(searchTerm) || email.includes(searchTerm)) {
          row.style.display = ""
          visibleCount++
        } else {
          row.style.display = "none"
        }
      })

      if (cajeroCount) {
        cajeroCount.textContent = `${visibleCount} cajero(s)`
      }
    })
  }

  // Nuevo Cajero button
  const btnNuevoCajero = document.querySelector(".btn-nuevo-cajero")
  if (btnNuevoCajero) {
    btnNuevoCajero.addEventListener("click", () => {
      alert("Funcionalidad para agregar nuevo cajero")
      // Here you would open a modal or redirect to add cajero form
    })
  }

  // Cajero edit buttons
  const cajeroEditButtons = document.querySelectorAll(".cajero-table .btn-icon-edit")
  cajeroEditButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr")
      const cajeroName = row.querySelector(".cajero-name").textContent
      alert(`Editar cajero: ${cajeroName}`)
      // Here you would open edit modal or form
    })
  })

  // Cajero delete buttons
  const cajeroDeleteButtons = document.querySelectorAll(".cajero-table .btn-icon-delete")
  cajeroDeleteButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const row = e.target.closest("tr")
      const cajeroName = row.querySelector(".cajero-name").textContent

      if (confirm(`¿Estás seguro de que deseas eliminar al cajero "${cajeroName}"?`)) {
        row.style.transition = "opacity 0.3s ease"
        row.style.opacity = "0"

        setTimeout(() => {
          row.remove()
          // Update cajero count
          const remainingCajeros = document.querySelectorAll(".cajero-table tbody tr").length
          if (cajeroCount) {
            cajeroCount.textContent = `${remainingCajeros} cajero(s)`
          }
          addActivity(`Cajero "${cajeroName}" eliminado del sistema`)
        }, 300)
      }
    })
  })

  // Reportes Section Functionality
  const btnFilter = document.querySelector(".btn-filter")
  if (btnFilter) {
    btnFilter.addEventListener("click", () => {
      const dateFrom = document.getElementById("dateFrom").value
      const dateTo = document.getElementById("dateTo").value

      if (dateFrom && dateTo) {
        alert(`Filtrando reportes desde ${dateFrom} hasta ${dateTo}`)
        // Here you would fetch and update the reports data
      } else {
        alert("Por favor selecciona ambas fechas")
      }
    })
  }

  const btnExport = document.querySelector(".btn-export")
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      alert("Exportando reporte a PDF...")
      // Here you would generate and download the PDF report
    })
  }

  // Log Section Functionality
  const logSearchInput = document.getElementById("searchLog")
  const logTableRows = document.querySelectorAll(".log-table tbody tr")

  if (logSearchInput) {
    logSearchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()

      logTableRows.forEach((row) => {
        const text = row.textContent.toLowerCase()
        if (text.includes(searchTerm)) {
          row.style.display = ""
        } else {
          row.style.display = "none"
        }
      })
    })
  }

  // Configuración Section Functionality
  const saveConfigButtons = document.querySelectorAll(".btn-save-config")
  saveConfigButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".config-card")
      const cardTitle = card.querySelector(".config-title").textContent

      // Show success message
      alert(`Configuración de "${cardTitle}" guardada exitosamente`)

      // Add activity
      addActivity(`Configuración actualizada: ${cardTitle}`)
    })
  })

  const btnBackup = document.querySelector(".btn-backup")
  if (btnBackup) {
    btnBackup.addEventListener("click", () => {
      if (confirm("¿Deseas crear un respaldo completo del sistema?")) {
        alert("Creando respaldo... Esto puede tomar unos minutos.")
        // Here you would trigger the backup process
        setTimeout(() => {
          alert("Respaldo creado exitosamente")
          addActivity("Respaldo del sistema creado")
        }, 2000)
      }
    })
  }

  const btnRestore = document.querySelector(".btn-restore")
  if (btnRestore) {
    btnRestore.addEventListener("click", () => {
      if (confirm("¿Estás seguro de que deseas restaurar desde un respaldo? Esta acción no se puede deshacer.")) {
        alert("Selecciona el archivo de respaldo...")
        // Here you would open a file picker and restore from backup
      }
    })
  }

  // Initialize
  updateStats()
})
