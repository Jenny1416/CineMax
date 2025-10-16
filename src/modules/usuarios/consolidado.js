document.addEventListener("DOMContentLoaded", () => {
  const totalBoletas = document.getElementById("totalBoletas");
  const totalRecaudado = document.getElementById("totalRecaudado");
  const tablaPeliculas = document.querySelector("#tablaPeliculas tbody");
  const tablaHorarios = document.querySelector("#tablaHorarios tbody");
  const tablaCajeros = document.querySelector("#tablaCajeros tbody");
  const filtroTipo = document.getElementById("filtroTipo");
  const rangoFechas = document.getElementById("rangoFechas");
  const fechaInicio = document.getElementById("fechaInicio");
  const fechaFin = document.getElementById("fechaFin");
  const btnFiltrar = document.getElementById("btnFiltrar");

  function readJSON(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
  }

  function resetView() {
    if (totalBoletas) totalBoletas.textContent = "0";
    if (totalRecaudado) totalRecaudado.textContent = "$0";
    if (tablaPeliculas) tablaPeliculas.innerHTML = "";
    if (tablaHorarios) tablaHorarios.innerHTML = "";
    if (tablaCajeros) tablaCajeros.innerHTML = "";
  }

  function llenarTabla(tabla, mapa) {
    if (!tabla) return;
    tabla.innerHTML = "";
    for (const k in mapa) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${k}</td><td>${mapa[k].cantidad}</td><td>$${mapa[k].total.toFixed(2)}</td>`;
      tabla.appendChild(tr);
    }
  }

  function cargarDatos() {
    // leer ventas
    const ventas = JSON.parse(localStorage.getItem("ventasCineMax")) || [];

    // fallback: si existen reservas confirmadas que no se transformaron en venta (por versiones anteriores), incluirlas
    const reservas = JSON.parse(localStorage.getItem("reservasCineMax")) || [];
    const reservasConfirmadas = (reservas || [])
      .filter(r => r && r.estado === "confirmada")
      .map(r => ({
        id: "V_from_" + r.id,
        pelicula: r.pelicula,
        fecha: r.creada || new Date().toISOString(),
        fechaFuncion: r.fecha,
        sala: r.sala,
        total: Number(r.total || 0),
        asientos: Array.isArray(r.asientos) ? r.asientos : (r.asientos ? String(r.asientos).split(",").map(s => s.trim()) : []),
        cajero: r.cajero || "Cajero"
      }));

    const todasVentas = [...ventas, ...reservasConfirmadas];

    if (!todasVentas || todasVentas.length === 0) {
      resetView();
      return;
    }

    // determinar rango de fechas (usar fecha ISO en venta.fecha)
    const hoy = new Date();
    let desde, hasta;
    switch (filtroTipo?.value) {
      case "hoy":
        desde = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        hasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
        break;
      case "semana":
        desde = new Date(hoy); desde.setDate(hoy.getDate() - 6);
        hasta = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
        break;
      case "rango":
        if (!fechaInicio.value || !fechaFin.value) { alert("Seleccione fechas."); return; }
        desde = new Date(fechaInicio.value); hasta = new Date(fechaFin.value); hasta.setDate(hasta.getDate() + 1);
        break;
      default:
        desde = new Date("2000-01-01"); hasta = new Date("2100-01-01");
    }

    const filtradas = todasVentas.filter(v => {
      const fechaVenta = new Date(v.fecha || v.fechaVenta || Date.now());
      return fechaVenta >= desde && fechaVenta < hasta;
    });

    if (filtradas.length === 0) { resetView(); return; }

    // totales y agrupaciones (ya maneja asientos como array o string)
    const totalBoletasCount = filtradas.reduce((acc, v) => {
      const cnt = Array.isArray(v.asientos) ? v.asientos.length : (typeof v.asientos === "string" && v.asientos ? v.asientos.split(",").length : 0);
      return acc + cnt;
    }, 0);
    totalBoletas.textContent = totalBoletasCount;

    const total = filtradas.reduce((acc, v) => acc + (Number(v.total) || 0), 0);
    totalRecaudado.textContent = `$${total.toFixed(2)}`;

    const agrupar = (key) => {
      const mapa = {};
      filtradas.forEach(v => {
        const k = v[key] || "Sin dato";
        if (!mapa[k]) mapa[k] = { cantidad: 0, total: 0 };
        const boletas = Array.isArray(v.asientos) ? v.asientos.length : (typeof v.asientos === "string" && v.asientos ? v.asientos.split(",").length : 0);
        mapa[k].cantidad += boletas;
        mapa[k].total += Number(v.total) || 0;
      });
      return mapa;
    };

    llenarTabla(tablaPeliculas, agrupar("pelicula"));
    llenarTabla(tablaHorarios, agrupar("fechaFuncion"));
    llenarTabla(tablaCajeros, agrupar("cajero"));
  }

  btnFiltrar?.addEventListener("click", cargarDatos);
  if (filtroTipo) filtroTipo.addEventListener("change", () => {
    if (rangoFechas) rangoFechas.classList.toggle("oculto", filtroTipo.value !== "rango");
  });

  cargarDatos();

  window.addEventListener("storage", (e) => {
    if (["ventasCineMax", "ventasCineMax_updated_at", "reservasCineMax", "ocupadosCineMax", "reservasCineMax_updated_at"].includes(e.key)) {
      cargarDatos();
    }
  });
});
