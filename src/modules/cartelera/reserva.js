document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("peliculaReserva"))

  if (!data) {
    document.body.innerHTML =
      "<h2 style='text-align:center;margin-top:100px;'>No se encontró información para la reserva.</h2>"
    return
  }

  const poster = document.getElementById("reservaPoster")
  const titulo = document.getElementById("reservaTitulo")
  const info = document.getElementById("reservaInfo")

  poster.src = data.img
  titulo.textContent = data.title
  info.textContent = `${data.genres || "Género no definido"} · ${data.duration || "Duración no especificada"} · ⭐ 4.5`

  function activarBotones(selector, storageKey) {
    const botones = document.querySelectorAll(selector)
    botones.forEach((boton) => {
      boton.addEventListener("click", () => {
        botones.forEach((b) => b.classList.remove("active"))
        boton.classList.add("active")
        localStorage.setItem(storageKey, boton.textContent.trim())
      })
    })
  }

  activarBotones(".cine", "reservaCine")
  activarBotones(".fecha", "reservaFecha")
  activarBotones(".formato", "reservaFormato")
  activarBotones(".hora", "reservaHora")

  const btnAsientos = document.querySelector(".btn-asientos")
  btnAsientos.addEventListener("click", () => {
    const seleccion = {
      pelicula: data.title,
      cine: localStorage.getItem("reservaCine") || "CineMax Centro",
      fecha: localStorage.getItem("reservaFecha") || "Mañana",
      formato: localStorage.getItem("reservaFormato") || "2D - Función Regular",
      hora: localStorage.getItem("reservaHora") || "16:30",
    }

    localStorage.setItem("reservaFinal", JSON.stringify(seleccion))

    window.location.href = "asientos.html"
  })
})
