// Cambia esta URL por la dirección pública de tu menu.json
const MENU_URL = "menu.json";

const dias = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
const nombresBonitos = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo"
};

const $ = (id) => document.getElementById(id);

function claveDeHoy() {
  return dias[new Date().getDay()];
}

function pintarFecha() {
  const fecha = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date());
  $("fecha").textContent = fecha;
}

async function cargarMenu() {
  pintarFecha();

  try {
    const respuesta = await fetch(`${MENU_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!respuesta.ok) throw new Error("No se pudo cargar el menú");

    const datos = await respuesta.json();
    const hoy = claveDeHoy();
    const menuHoy = datos[hoy] || "No hay menú cargado para hoy.";

    $("dia").textContent = nombresBonitos[hoy];
    $("menuHoy").textContent = menuHoy;

    const orden = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
    $("listaSemana").innerHTML = orden.map(dia => `
      <article class="day-row ${dia === hoy ? "today" : ""}">
        <strong>${nombresBonitos[dia]}</strong>
        <span>${datos[dia] || "Sin menú"}</span>
      </article>
    `).join("");
  } catch (error) {
    $("menuHoy").textContent = "No se ha podido cargar el menú. Revisa la conexión o la URL del archivo.";
    $("listaSemana").innerHTML = "";
  }
}

$("recargar").addEventListener("click", cargarMenu);
cargarMenu();
