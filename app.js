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

function pintarBloque(menu) {
  return `
    <h3>Primeros</h3>
    <ul>
      ${menu.primeros.map(x => `<li>${x}</li>`).join("")}
    </ul>

    <h3>Segundos</h3>
    <ul>
      ${menu.segundos.map(x => `<li>${x}</li>`).join("")}
    </ul>

    <h3>Dieta y plancha</h3>
    <ul>
      ${menu.dieta.map(x => `<li>${x}</li>`).join("")}
    </ul>
  `;
}

async function cargarMenu() {
  pintarFecha();

  try {
    const respuesta = await fetch(`${MENU_URL}?t=${Date.now()}`, {
      cache: "no-store"
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar el menú");
    }

    const datos = await respuesta.json();
    const hoy = claveDeHoy();
    const menuHoy = datos[hoy];

    if (!menuHoy) {
      $("dia").textContent = "Hoy";
      $("contenido-hoy").innerHTML = "No hay menú cargado para hoy.";
      return;
    }

    $("dia").textContent = nombresBonitos[hoy];
    $("contenido-hoy").innerHTML = pintarBloque(menuHoy);

    const semana = $("semana");
    semana.innerHTML = "";

    ["lunes", "martes", "miercoles", "jueves", "viernes"].forEach(dia => {
      const menu = datos[dia];

      if (!menu) return;

      const card = document.createElement("div");
      card.className = "card";

      if (dia === hoy) {
        card.classList.add("actual");
      }

      card.innerHTML = `
        <h2>${nombresBonitos[dia]}</h2>
        ${pintarBloque(menu)}
      `;

      semana.appendChild(card);
    });

  } catch (error) {
    $("dia").textContent = "Hoy";
    $("contenido-hoy").innerHTML =
      "No se ha podido cargar el menú.";
  }
}

document.addEventListener("DOMContentLoaded", cargarMenu);

document.getElementById("recargar")
  .addEventListener("click", cargarMenu);