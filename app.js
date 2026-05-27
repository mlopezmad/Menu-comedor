const MENU_URL = "menu.json";

const dias = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado"
];

const ordenDiasMenu = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes"
];

const $ = (id) => document.getElementById(id);

function claveDeHoy() {
  return dias[new Date().getDay()];
}

function formatearFecha(fecha) {
  const texto = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(fecha);

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function fechaBonita() {
  return formatearFecha(new Date());
}

function fechaParaDiaSemana(dia) {
  const hoy = new Date();
  const indiceHoy = hoy.getDay();
  const indiceDia = dias.indexOf(dia);

  const diferencia = indiceDia - indiceHoy;

  const fecha = new Date(hoy);
  fecha.setDate(hoy.getDate() + diferencia);

  return formatearFecha(fecha);
}

function pintarFecha() {
  $("fecha").textContent = fechaBonita();
}

function pintarBloque(menu) {
  return `
    <div style="margin-top:10px">

      <h3 style="margin:0 0 8px 0;">Primeros</h3>

      <ul style="margin:0 0 16px 22px; padding:0;">
        ${menu.primeros.map(x => `<li>${x}</li>`).join("")}
      </ul>

      <h3 style="margin:0 0 8px 0;">Segundos</h3>

      <ul style="margin:0 0 16px 22px; padding:0;">
        ${menu.segundos.map(x => `<li>${x}</li>`).join("")}
      </ul>

      <h3 style="margin:0 0 8px 0;">Dieta y plancha</h3>

      <ul style="margin:0 0 8px 22px; padding:0;">
        ${menu.dieta.map(x => `<li>${x}</li>`).join("")}
      </ul>

    </div>
  `;
}

function diasVisiblesDesdeManana() {
  const hoy = claveDeHoy();
  const indiceHoy = ordenDiasMenu.indexOf(hoy);

  if (indiceHoy === -1) {
    return ordenDiasMenu;
  }

  return ordenDiasMenu.slice(indiceHoy + 1);
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
      $("dia").textContent = fechaBonita();
      $("contenido-hoy").innerHTML = "No hay menú cargado para hoy.";

      const seccionSemana = document.querySelector(".week");
      seccionSemana.style.display = "none";

      return;
    }

    $("dia").textContent = fechaBonita();
    $("contenido-hoy").innerHTML = pintarBloque(menuHoy);

    const semana = $("semana");
    const seccionSemana = document.querySelector(".week");
    const diasFuturos = diasVisiblesDesdeManana();

    semana.innerHTML = "";

    if (diasFuturos.length === 0) {
      seccionSemana.style.display = "none";
      return;
    }

    seccionSemana.style.display = "block";

    diasFuturos.forEach(dia => {
      const menu = datos[dia];

      if (!menu) return;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h2>${fechaParaDiaSemana(dia)}</h2>
        ${pintarBloque(menu)}
      `;

      semana.appendChild(card);
    });

  } catch (error) {
    $("dia").textContent = "Hoy";
    $("contenido-hoy").innerHTML = "No se ha podido cargar el menú.";

    const seccionSemana = document.querySelector(".week");
    seccionSemana.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", cargarMenu);

document
  .getElementById("recargar")
  .addEventListener("click", cargarMenu);