// Función para añadir logs a los contenedores
function addLog(containerId, message, type) {
  const logContainer = document.getElementById(containerId);
  if (!logContainer) return;

  const logEntry = document.createElement("div");
  logEntry.className = `log-entry log-${type}`;
  logEntry.textContent = message;
  logContainer.appendChild(logEntry);

  // Auto-scroll al último mensaje
  logContainer.scrollTop = logContainer.scrollHeight;
}

// Función para resaltar elementos cambiados
function highlightChangedElements(container) {
  const elements = container.querySelectorAll(".bg-white.rounded-md");
  elements.forEach((el) => {
    el.classList.add("changed");
    setTimeout(() => {
      el.classList.remove("changed");
    }, 1000);
  });
}

// Demo interactiva en la sección "Cómo Funciona"
const demoApp = new Swappit("demo", true);

// Configurar botones de la demo principal
document.getElementById("update-demo")?.addEventListener("click", () => {
  // Actualizar contenido usando Swappit
  demoApp.update("/examples/contenido-demo.html");
});

document.getElementById("reset-demo")?.addEventListener("click", () => {
  // Restaurar contenido original usando Swappit
  demoApp.update("./");
});

// Ejemplo 1: Actualización básica
const appBasico = new Swappit("mi-app", true); // Habilitar debug

// Sobrescribir el método _logMessage para capturar los logs
const originalLogMessage = appBasico._logMessage;
appBasico._logMessage = function (message, type) {
  originalLogMessage.call(this, message, type);
  addLog("log-basico", message, type);
};

function actualizarContenidoBasico() {
  // Usar Swappit para cargar el contenido desde el archivo externo
  appBasico.update("/examples/contenido-nuevo.html");
  setTimeout(() => highlightChangedElements(document.getElementById("example-1")), 200);
}

function restaurarContenidoBasico() {
  // Restaurar el contenido original usando Swappit
  appBasico.update("./");
  setTimeout(() => highlightChangedElements(document.getElementById("example-1")), 200);
}

// Ejemplo 2: Actualización con orden
const appOrdenado = new Swappit("mi-app-orden", true); // Habilitar debug

// Sobrescribir el método _logMessage para capturar los logs
const originalLogMessageOrdenado = appOrdenado._logMessage;
appOrdenado._logMessage = function (message, type) {
  originalLogMessageOrdenado.call(this, message, type);
  addLog("log-ordenado", message, type);
};

function actualizarContenidoOrdenado() {
  // Usar Swappit para cargar el contenido ordenado desde el archivo externo
  appOrdenado.update("/examples/contenido-ordenado.html");
  setTimeout(() => highlightChangedElements(document.getElementById("example-2")), 1500);
}

function restaurarContenidoOrdenado() {
  // Restaurar el contenido original usando Swappit
  appOrdenado.update("./");
  setTimeout(() => highlightChangedElements(document.getElementById("example-2")), 200);
}

// Ejemplo 3: Precarga de múltiples URLs
const appPrecarga = new Swappit("mi-app-precarga", true); // Habilitar debug

// Sobrescribir el método _logMessage para capturar los logs
const originalLogMessagePrecarga = appPrecarga._logMessage;
appPrecarga._logMessage = function (message, type) {
  originalLogMessagePrecarga.call(this, message, type);
  addLog("log-precarga", message, type);
};

// Precargar realmente los archivos
appPrecarga.preloadContents(["/examples/header.html", "/examples/main.html", "/examples/footer.html"]);

function actualizarHeader() {
  // Usar Swappit para cargar el header desde el archivo precargado
  appPrecarga.update("/examples/header.html");
  setTimeout(() => highlightChangedElements(document.getElementById("example-3")), 200);
}

function actualizarMain() {
  // Usar Swappit para cargar el main desde el archivo precargado
  appPrecarga.update("/examples/main.html");
  setTimeout(() => highlightChangedElements(document.getElementById("example-3")), 200);
}

function actualizarFooter() {
  // Usar Swappit para cargar el footer desde el archivo precargado
  appPrecarga.update("/examples/footer.html");
  setTimeout(() => highlightChangedElements(document.getElementById("example-3")), 200);
}

function restaurarPrecarga() {
  // Restaurar el contenido original usando Swappit
  appPrecarga.update("./");
  setTimeout(() => highlightChangedElements(document.getElementById("example-3")), 200);
}

// Ejemplo SwappitButton
// Crear instancia de Swappit para la demo del botón
const swappitButton = Swappit.instances.get("swappit-button");

// Sobrescribir el método _logMessage para capturar los logs
const originalLogMessageNav = swappitButton._logMessage;
swappitButton._logMessage = function (message, type) {
  originalLogMessageNav.call(this, message, type);
  addLog("log-swappit-button", message, type);
};

// Escuchar eventos de actualización
window.addEventListener("swappit:swappit-button:beforeUpdate", () => {
  addLog("log-swappit-button", "Iniciando actualización de navegación", "info");
});

window.addEventListener("swappit:swappit-button:afterUpdate", () => {
  addLog("log-swappit-button", "Navegación completada", "info");
  setTimeout(() => highlightChangedElements(document.getElementById("swappit-button-demo")), 200);
});

// Control del menú móvil
document.addEventListener("DOMContentLoaded", function () {
  // Botón de hamburguesa para mostrar/ocultar el menú móvil
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Manejo de los submenús en móvil
  const mobileDropdowns = document.querySelectorAll(".mobile-dropdown");

  mobileDropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector("button");
    const content = dropdown.querySelector(".mobile-dropdown-content");
    const icon = dropdown.querySelector(".mobile-dropdown-icon");

    if (button && content) {
      button.addEventListener("click", function () {
        content.classList.toggle("hidden");
        // Rotar el ícono cuando se expande
        if (icon) {
          icon.classList.toggle("rotate-180");
        }
      });
    }
  });

  // Cerrar el menú móvil cuando se hace clic en un enlace
  const mobileLinks = mobileMenu.querySelectorAll("a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      mobileMenu.classList.add("hidden");
    });
  });
});
