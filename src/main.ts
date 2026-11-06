/**
 * GESTIÓN DE RESERVAS DE ASIENTOS DE UN CINE
 * -----------------------------------------
 * TypeScript básico: arreglos, push, for, if/else y funciones sencillas.
 * Sin clases ni dependencias adicionales.
 *
 * Una única matriz (arreglo bidimensional) que se modifica con cada reserva.
 * Asiento libre = 0, asiento ocupado = 1.
 *
 * Funciona tanto en consola (npm run console) como en el navegador (npm run dev).
 */

// --------------------------------------------------------------------------
// LÓGICA DE NEGOCIO (compartida entre consola y web)
// --------------------------------------------------------------------------

const FILAS: number = 8;
const COLUMNAS: number = 10;

/** Inicializa la matriz de asientos con todos libres (0) */
function crearSala(filas: number, columnas: number): number[][] {
  const sala: number[][] = [];
  for (let i = 0; i < filas; i++) {
    const fila: number[] = [];
    for (let j = 0; j < columnas; j++) {
      fila.push(0);
    }
    sala.push(fila);
  }
  return sala;
}

/** Muestra la sala en consola con X (ocupado) y L (libre) */
function mostrarSala(sala: number[][]): void {
  console.log("Estado de la sala (X = ocupado, L = libre):");
  let encabezado = "   ";
  for (let col = 0; col < sala[0].length; col++) encabezado += "  " + col + " ";
  console.log(encabezado);
  for (let fila = 0; fila < sala.length; fila++) {
    let linea = " " + fila + "  ";
    for (let col = 0; col < sala[fila].length; col++) {
      linea += sala[fila][col] === 1 ? "  X " : "  L ";
    }
    console.log(linea);
  }
}

/**
 * Reserva un asiento. Si está libre (0) lo marca ocupado (1) y devuelve éxito.
 * Si ya está ocupado o no existe, devuelve un mensaje de error.
 */
function reservarAsiento(sala: number[][], fila: number, columna: number): string {
  if (fila < 0 || fila >= sala.length || columna < 0 || columna >= sala[0].length) {
    return "Error: la posición fila " + fila + ", columna " + columna + " no existe en la sala.";
  }
  if (sala[fila][columna] === 1) {
    return "Sillas ya vendidas";
  }
  sala[fila][columna] = 1;
  return "Éxito: asiento fila " + fila + ", columna " + columna + " reservado.";
}

/** Cuenta asientos ocupados y libres */
function contarAsientos(sala: number[][]): { ocupados: number; libres: number } {
  let ocupados = 0;
  let libres = 0;
  for (let i = 0; i < sala.length; i++) {
    for (let j = 0; j < sala[i].length; j++) {
      if (sala[i][j] === 1) ocupados++;
      else libres++;
    }
  }
  return { ocupados, libres };
}

/**
 * Busca dos asientos libres contiguos horizontalmente.
 * Devuelve [fila, columna] del primer asiento del par, o null si no hay.
 */
function buscarParejaLibre(sala: number[][]): number[] | null {
  for (let fila = 0; fila < sala.length; fila++) {
    for (let col = 0; col < sala[fila].length - 1; col++) {
      if (sala[fila][col] === 0 && sala[fila][col + 1] === 0) {
        return [fila, col];
      }
    }
  }
  return null;
}

/** Muestra en consola el resultado de buscarParejaLibre */
function mostrarParejaLibre(resultado: number[] | null): void {
  if (resultado === null) {
    console.log("No hay dos asientos libres contiguos en ninguna fila.");
  } else {
    console.log("Par libre encontrado: fila " + resultado[0] + ", columnas " + resultado[1] + " y " + (resultado[1] + 1) + ".");
  }
}

// --------------------------------------------------------------------------
// INTERFAZ WEB  (solo se ejecuta si hay un navegador con el DOM)
// --------------------------------------------------------------------------

if (typeof document !== "undefined") {

  // Importar estilos Tailwind (solo en navegador)
  import("./style.css");

  // ---------- Estado ----------
  const sala: number[][] = crearSala(FILAS, COLUMNAS);

  // Reservas de ejemplo para que se vean ocupados desde el inicio
  reservarAsiento(sala, 0, 0);
  reservarAsiento(sala, 0, 1);
  reservarAsiento(sala, 3, 5);
  reservarAsiento(sala, 5, 9);

  // ---------- Referencias al DOM ----------
  const seatMap = document.getElementById("seat-map")!;
  const statsEl = document.getElementById("stats")!;
  const mensajeEl = document.getElementById("mensaje")!;
  const btnPareja = document.getElementById("btn-pareja")!;
  const btnReiniciar = document.getElementById("btn-reiniciar")!;

  // ---------- Utilidad: mostrar mensaje al usuario ----------
  function mostrarMensaje(texto: string, exito: boolean): void {
    mensajeEl.textContent = texto;
    mensajeEl.className = "text-center text-sm min-h-[2rem] mb-6 " + (exito ? "text-emerald-300" : "text-red-300");
  }

  // ---------- Renderizar el mapa de asientos ----------
  function renderizarSala(): void {
    // Buscar pareja libre para resaltarla
    const pareja = buscarParejaLibre(sala);

    // Construir la tabla
    let html = '<table class="border-collapse">';

    // Encabezado con números de columna
    html += '<tr><td class="w-8 h-6 text-center text-slate-500 text-xs"></td>';
    for (let col = 0; col < COLUMNAS; col++) {
      html += '<td class="w-10 h-6 text-center text-slate-400 text-xs font-medium">' + col + "</td>";
    }
    html += "</tr>";

    // Filas de asientos
    for (let fila = 0; fila < FILAS; fila++) {
      html += '<tr><td class="w-8 h-10 text-center text-slate-400 text-xs font-medium">' + fila + "</td>";
      for (let col = 0; col < COLUMNAS; col++) {
        const ocupado = sala[fila][col] === 1;
        const esPareja = pareja !== null && (fila === pareja[0] && (col === pareja[1] || col === pareja[1] + 1));

        let clases = "w-10 h-10 rounded-lg border-2 text-xs font-bold cursor-pointer transition-all duration-150 select-none ";

        if (esPareja) {
          clases += "bg-orange-400 border-orange-300 text-orange-900 hover:bg-orange-500 ";
        } else if (ocupado) {
          clases += "bg-rose-400 border-rose-300 text-white cursor-not-allowed ";
        } else {
          clases += "bg-emerald-500 border-emerald-400 text-emerald-900 hover:bg-emerald-400 hover:scale-105 ";
        }

        const label = ocupado ? "X" : "L";
        const onClick = ocupado ? "" : "onclick='reservarClick(" + fila + "," + col + ")'";

        html += '<td class="p-0.5"><div class="' + clases + '" ' + onClick + ' data-fila="' + fila + '" data-col="' + col + '">' + label + "</div></td>";
      }
      html += "</tr>";
    }

    html += "</table>";
    seatMap.innerHTML = html;

    // Actualizar estadísticas
    const totales = contarAsientos(sala);
    statsEl.innerHTML =
      '<div class="flex items-center gap-2"><div class="w-3 h-3 rounded bg-emerald-500"></div> Libres: <strong>' + totales.libres + '</strong></div>' +
      '<div class="flex items-center gap-2"><div class="w-3 h-3 rounded bg-rose-400"></div> Ocupados: <strong>' + totales.ocupados + '</strong></div>' +
      '<div class="flex items-center gap-2 text-slate-400">Total: <strong>' + (totales.libres + totales.ocupados) + "</strong></div>";
  }

  // ---------- Manejar clic en un asiento (desde onclick en el HTML) ----------
  (window as any).reservarClick = function (fila: number, col: number): void {
    const resultado = reservarAsiento(sala, fila, col);
    const exito = resultado.startsWith("Éxito");
    mostrarMensaje(resultado, exito);

    // También mostrar en consola
    console.log(resultado);

    // Re-renderizar
    renderizarSala();
  };

  // ---------- Botón: buscar pareja libre ----------
  btnPareja.addEventListener("click", () => {
    const pareja = buscarParejaLibre(sala);
    if (pareja === null) {
      mostrarMensaje("No hay dos asientos libres contiguos en ninguna fila.", false);
      console.log("No hay dos asientos libres contiguos en ninguna fila.");
    } else {
      const texto = "Par libre encontrado: fila " + pareja[0] + ", columnas " + pareja[1] + " y " + (pareja[1] + 1) + ".";
      mostrarMensaje(texto, true);
      console.log(texto);
    }
    renderizarSala();
  });

  // ---------- Botón: reiniciar sala ----------
  btnReiniciar.addEventListener("click", () => {
    // Vaciar la sala
    for (let i = 0; i < sala.length; i++) {
      for (let j = 0; j < sala[i].length; j++) {
        sala[i][j] = 0;
      }
    }
    mostrarMensaje("Sala reiniciada. Todos los asientos están libres.", true);
    console.log("Sala reiniciada.");
    renderizarSala();
  });

  // ---------- Render inicial ----------
  renderizarSala();
  mostrarMensaje("Bienvenido. Haz clic en un asiento disponible para reservarlo.", true);

  // Mostrar la sala en consola también por si el usuario abre DevTools
  console.log("==============================================");
  console.log("  CINE — GESTIÓN DE RESERVAS DE ASIENTOS");
  console.log("==============================================");
  console.log("(Reservas de ejemplo para empezar visualmente)");
  mostrarSala(sala);
  console.log("Haz clic en un asiento de la página para reservarlo.");
}

// --------------------------------------------------------------------------
// MODO CONSOLA (cuando se ejecuta con: npm run console)
// --------------------------------------------------------------------------
if (typeof document === "undefined") {
  const sala: number[][] = crearSala(FILAS, COLUMNAS);

  console.log("==============================================");
  console.log("  CINE — GESTIÓN DE RESERVAS DE ASIENTOS");
  console.log("==============================================");
  console.log();

  mostrarSala(sala);
  console.log();

  console.log("Reservas realizadas:");
  console.log(reservarAsiento(sala, 0, 0));
  console.log(reservarAsiento(sala, 0, 1));
  console.log(reservarAsiento(sala, 3, 5));
  console.log(reservarAsiento(sala, 5, 9));
  console.log();

  console.log("Intento de reservar un asiento ya ocupado:");
  console.log(reservarAsiento(sala, 0, 0));
  console.log();

  console.log("Intento de reservar una posición inexistente:");
  console.log(reservarAsiento(sala, 20, 5));
  console.log();

  mostrarSala(sala);
  console.log();

  const totales = contarAsientos(sala);
  console.log("Totales de la sala:");
  console.log("  Asientos ocupados: " + totales.ocupados);
  console.log("  Asientos libres:   " + totales.libres);
  console.log();

  console.log("Búsqueda de dos asientos libres contiguos:");
  const pareja = buscarParejaLibre(sala);
  mostrarParejaLibre(pareja);
}
