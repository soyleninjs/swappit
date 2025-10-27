# Swappit

Swappit es una librería JavaScript ligera que permite actualizar parcial o totalmente el contenido HTML de tu sitio web sin recargar la página. Con un enfoque declarativo basado en atributos data personalizados, facilita la creación de experiencias de navegación modernas sin la complejidad de un framework completo o SPA.

**Características principales:**
- **Actualización parcial del DOM**: Reemplaza solo los elementos que necesitas usando identificadores únicos (handles)
- **Tres formas de uso**: API JavaScript, links automáticos con `data-swappit-handle`, o componente `<swappit-instance>`
- **Precarga inteligente**: Configura precarga instantánea o al hacer hover, a nivel global o por link individual
- **Navegación con historial**: Soporte para botones adelante/atrás del navegador
- **Sistema de caché**: Controla cuándo usar caché o forzar nuevas descargas
- **Detección automática**: Observador de DOM que configura nuevos links dinámicamente
- **Sistema de eventos**: Escucha eventos antes/después de actualizar y al reiniciar
- **Logging colorido**: Sistema de debugging con 4 niveles (info, success, warning, error)
- **Zero-config**: Funciona con configuración mínima, personalizable según necesites

## Menú
- [Swappit](#swappit)
  - [Menú](#menú)
  - [Instalación](#instalación)
    - [NPM](#npm)
    - [CDN](#cdn)
    - [Descarga directa](#descarga-directa)
  - [Uso básico](#uso-básico)
    - [1. Usando el componente swappit-instance](#1-usando-el-componente-swappit-instance-recomendado-para-configuración-declarativa)
    - [2. Usando links con data-swappit-handle](#2-usando-links-con-data-swappit-handle)
    - [3. Usando la API de JavaScript directamente](#3-usando-la-api-de-javascript-directamente)
  - [Ejemplos](#ejemplos)
    - [Ejemplo 1: Actualización básica de contenido](#ejemplo-1-actualización-básica-de-contenido)
    - [Ejemplo 2: Actualización con orden específico](#ejemplo-2-actualización-con-orden-específico)
    - [Ejemplo 3: Precarga de múltiples URLs](#ejemplo-3-precarga-de-múltiples-urls)
  - [Opciones de configuración](#opciones-de-configuración)
    - [Opciones disponibles (options)](#opciones-disponibles-options)
    - [Atributos de datos para elementos que se actualizan](#atributos-de-datos-para-elementos-que-se-actualizan)
    - [Atributos de datos para links (a)](#atributos-de-datos-para-links-a)
  - [Métodos](#métodos)
    - [Métodos de instancia](#métodos-de-instancia)
    - [Métodos estáticos](#métodos-estáticos)
  - [Eventos](#eventos)
  - [Logging](#logging)
  - [Patrones de uso](#patrones-de-uso)
    - [Identificadores únicos](#identificadores-únicos)
    - [Precarga de contenido](#precarga-de-contenido)
    - [Validación de URLs](#validación-de-urls)
  - [Configuración de páginas de destino](#configuración-de-páginas-de-destino)
  - [Navegación con links automáticos (data-swappit-handle)](#navegación-con-links-automáticos-data-swappit-handle)
    - [Uso básico](#uso-básico-1)
    - [Configuración de precarga por link](#configuración-de-precarga-por-link)
    - [Precarga predeterminada para todos los links](#precarga-predeterminada-para-todos-los-links)
    - [Detección automática de nuevos links](#detección-automática-de-nuevos-links)
    - [Ventajas de este método](#ventajas-de-este-método)
  - [SwappitInstance](#swappitinstance)
    - [Uso básico](#uso-básico-2)
    - [Atributos disponibles](#atributos-disponibles)
    - [Comportamiento](#comportamiento)
    - [Ejemplo completo](#ejemplo-completo)
  - [Método reinit()](#método-reinit)
  - [Manejo de scripts](#manejo-de-scripts)
  - [Solución de problemas](#solución-de-problemas)

## Instalación

Puedes integrar Swappit en tu proyecto de las siguientes formas:

### NPM

```bash
npm install @soyleninjs/swappit
```

Importa en tu proyecto:

```javascript
// ES modules
import Swappit from '@soyleninjs/swappit';
// O desde CDN
import Swappit from "https://esm.sh/@soyleninjs/swappit";

// CommonJS
const Swappit = require('@soyleninjs/swappit');
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@soyleninjs/swappit/swappit.min.js"></script>
```

### Descarga directa

1. Descarga `swappit.min.js` desde [GitHub Releases](https://github.com/soyleninjs/swappit/releases)
2. Inclúyelo en tu HTML:

```html
<script src="ruta/a/tu/proyecto/swappit.min.js"></script>
```

**Nota**: El archivo `swappit.min.js` incluye tanto la clase `Swappit` como el componente `<swappit-instance>`.

## Uso básico

Swappit ofrece tres formas principales de uso:

### 1. Usando el componente `<swappit-instance>` (Recomendado para configuración declarativa)

```html
<!-- Elementos que se actualizarán -->
<div data-mi-handle-update="header">Contenido original del header</div>
<div data-mi-handle-update="main">Contenido original del main</div>

<!-- Crear instancia con configuración declarativa -->
<swappit-instance
  data-handle="mi-handle"
  data-log
  data-update-url
  data-enable-history
  data-preload="hover">
</swappit-instance>

<!-- Links que usarán esta instancia -->
<a href="./pagina1.html" data-swappit-handle="mi-handle">Página 1</a>
<a href="./pagina2.html" data-swappit-handle="mi-handle">Página 2</a>

<script src="ruta/a/swappit.min.js"></script>
```

### 2. Usando links con `data-swappit-handle`

```html
<!-- Elementos que se actualizarán -->
<div data-mi-handle-update="header">Contenido original del header</div>
<div data-mi-handle-update="main">Contenido original del main</div>

<!-- Links con atributo data-swappit-handle -->
<a href="./pagina1.html" data-swappit-handle="mi-handle">Página 1</a>
<a href="./pagina2.html" data-swappit-handle="mi-handle" data-preload="hover">Página 2 (Precarga al pasar el mouse)</a>
<a href="./pagina3.html" data-swappit-handle="mi-handle" data-preload="instant">Página 3 (Precarga instantánea)</a>

<script>
  // Crear una instancia de Swappit
  const swappit = new Swappit('mi-handle', true); // true para activar logs
  // Los links se configuran automáticamente
</script>
```

### 3. Usando la API de JavaScript directamente

```html
<script>
  const swappit = new Swappit('mi-handle', true);

  // Actualizar contenido desde una URL relativa (usando caché por defecto)
  swappit.update('./contenido-demo.html');

  // Para forzar nueva descarga, especifica false
  swappit.update('./contenido-demo.html', false);
</script>
```


## Ejemplos

### Ejemplo 1: Actualización básica de contenido

**HTML:**
```html
<div data-mi-app-update="header">
  <h1>Título original</h1>
</div>
<div data-mi-app-update="content">
  <p>Contenido original</p>
</div>
```

**JavaScript:**
```javascript
const appBasico = new Swappit('mi-app');
function actualizarContenido() {
  appBasico.update('./contenido-nuevo.html');
}
```

### Ejemplo 2: Actualización con orden específico

**HTML:**
```html
<div data-mi-app-orden-update="section1" data-mi-app-orden-update-order="2">Sección 1 (Orden: 2)</div>
<div data-mi-app-orden-update="section2" data-mi-app-orden-update-order="1">Sección 2 (Orden: 1)</div>
<div data-mi-app-orden-update="section3" data-mi-app-orden-update-order="3">Sección 3 (Orden: 3)</div>
```

**JavaScript:**
```javascript
const appOrdenado = new Swappit('mi-app-orden');
appOrdenado.update('./contenido-ordenado.html');
```

### Ejemplo 3: Precarga de múltiples URLs

**HTML:**
```html
<div data-mi-app-precarga-update="header" class="preload-section">...</div>
<div data-mi-app-precarga-update="main" class="preload-section">...</div>
<div data-mi-app-precarga-update="footer" class="preload-section">...</div>
```

**JavaScript:**
```javascript
const appPrecarga = new Swappit('mi-app-precarga');
appPrecarga.preloadContents(['./header.html', './main.html', './footer.html']);
function actualizarHeader() {
  appPrecarga.update('./header.html');
}
function actualizarMain() {
  appPrecarga.update('./main.html');
}
function actualizarFooter() {
  appPrecarga.update('./footer.html', false);
}
```

## Opciones de configuración

```javascript
new Swappit(handle, log = false, options = {})
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `handle` | string | Identificador único para la instancia (obligatorio) |
| `log` | boolean | Activa/desactiva los logs de la consola (opcional, default: false) |
| `options` | object | Configuración avanzada (ver tabla abajo) |

### Opciones disponibles (`options`)

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `updateUrl` | boolean | `false` | Actualiza la URL en la barra del navegador al hacer update |
| `enableHistory` | boolean | `false` | Habilita navegación con botones adelante/atrás del navegador. Requiere `updateUrl: true` |
| `preload` | string | `false` | Modo de precarga por defecto para links con `data-swappit-handle`. Valores: `false`, `"hover"`, `"instant"` |

**Notas:**
- `updateUrl: true` + `enableHistory: false`: actualiza la URL sin agregar al historial (usa `replaceState`)
- `updateUrl: true` + `enableHistory: true`: actualiza la URL y agrega al historial (usa `pushState`)
- `preload`: define el comportamiento por defecto para links, pero puede ser sobreescrito individualmente con el atributo `data-preload` en cada link

### Atributos de datos para elementos que se actualizan

| Atributo | Descripción |
|----------|-------------|
| `data-[handle]-update` | Identificador del elemento a actualizar (obligatorio) |
| `data-[handle]-update-order` | Orden de actualización (opcional, numérico). Los elementos sin orden se actualizan primero, luego los ordenados de menor a mayor |

### Atributos de datos para links (`<a>`)

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| `data-swappit-handle` | string | Conecta el link con una instancia Swappit (obligatorio) |
| `data-preload` | string | Modo de precarga: `"instant"` (inmediata), `"hover"` (al pasar mouse/touch), o sin definir (sin precarga) |
| `data-load-from-cache` | boolean | Si es `true` usa caché, si es `false` fuerza nueva descarga al hacer click |

## Métodos

### Métodos de instancia

| Método | Descripción |
|--------|-------------|
| `update(url, loadFromCache = true)` | Actualiza el contenido desde una URL relativa. <br>- `url`: Ruta relativa <br>- `loadFromCache`: Usa caché (`true`) o fuerza descarga (`false`) |
| `preloadContents(arrayUrls)` | Precarga el contenido de múltiples URLs relativas |
| `reinit(log, options)` | Reinicia la instancia limpiando la caché, actualizando opciones y volviendo a observar el DOM. <br>- `log`: Nuevo valor para logging <br>- `options`: Nuevas opciones para merge |

### Métodos estáticos

| Método | Descripción |
|--------|-------------|
| `updateScriptByContent(arrayScriptsNodes)` | Actualiza scripts inline por contenido |
| `updateScriptBySrc(matchUrl)` | Actualiza scripts por URL de origen (agrega timestamp) |
| `Swappit.instances` | Map con todas las instancias Swappit creadas, indexadas por handle |

## Eventos

Swappit emite eventos personalizados que puedes escuchar:

| Evento | Cuándo se emite | Detalle (`e.detail`) |
|--------|-----------------|---------------------|
| `swappit:[handle]:beforeUpdate` | Antes de actualizar el DOM | `{ handle: string, url: string }` |
| `swappit:[handle]:afterUpdate` | Después de actualizar el DOM | `{ handle: string, url: string }` |
| `swappit:[handle]:reinit` | Después de reiniciar la instancia | `{ handle: string, url: "" }` |

**Ejemplo de uso:**

```javascript
window.addEventListener('swappit:mi-handle:beforeUpdate', (e) => {
  console.log('Comenzando actualización', e.detail);
  // e.detail = { handle: 'mi-handle', url: './pagina.html' }
});

window.addEventListener('swappit:mi-handle:afterUpdate', (e) => {
  console.log('Contenido actualizado', e.detail);
  // Aquí puedes reinicializar scripts, ejecutar animaciones, etc.
});

window.addEventListener('swappit:mi-handle:reinit', (e) => {
  console.log('Instancia reiniciada', e.detail);
});
```

## Logging

Swappit incluye un sistema de logging con niveles: info (azul), success (verde), warning (amarillo), error (rojo).
Actívalo pasando `true` como segundo parámetro:

```javascript
const app = new Swappit('mi-app', true);
```

## Patrones de uso

### Identificadores únicos

Cada instancia debe tener un handle único, que se usará como prefijo en los atributos data:

```javascript
const app1 = new Swappit('mi-app'); // data-mi-app-update
const app2 = new Swappit('otro-app'); // data-otro-app-update
```

### Precarga de contenido

Puedes precargar contenido y luego actualizarlo usando la caché:

```javascript
app.preloadContents(['./header.html', './main.html', './footer.html']);
app.update('./header.html'); // Usa caché
app.update('./footer.html', false); // Fuerza descarga
```

### Validación de URLs

**IMPORTANTE**: Swappit solo acepta URLs relativas internas por seguridad:

```javascript
// ✅ URLs válidas
app.update('/pagina.html');
app.update('./pagina.html');
app.update('../pagina.html');

// ❌ URLs inválidas (lanzarán error)
app.update('https://ejemplo.com/pagina.html'); // URL externa
app.update('pagina.html'); // No empieza con / ni ./
```

Esta validación se aplica a:
- Método `update(url)`
- Método `preloadContents(arrayUrls)`
- Atributo `href` de links con `data-swappit-handle`

## Configuración de páginas de destino

Las páginas de destino deben tener elementos con los mismos atributos `data-[handle]-update` que la página principal. Swappit solo actualiza los elementos que tienen correspondencia por nombre.

**Ejemplo:**

Página principal:
```html
<div data-mi-app-update="header">Encabezado original</div>
<div data-mi-app-update="sidebar">Barra lateral original</div>
<div data-mi-app-update="content">Contenido original</div>
```
Página destino:
```html
<div data-mi-app-update="header">Nuevo encabezado</div>
<div data-mi-app-update="content">Nuevo contenido</div>
<div data-mi-app-update="footer">Este elemento será ignorado</div>
```
Resultado: solo se actualizan los elementos que tienen correspondencia.

**Consejos:**
- Usa los mismos nombres de atributos en todas tus páginas
- Divide el contenido en componentes lógicos
- Si necesitas orden, usa `data-[handle]-update-order`

## Navegación con links automáticos (`data-swappit-handle`)

Swappit incluye un sistema de observación del DOM que detecta automáticamente links con el atributo `data-swappit-handle` y los configura para actualizar el contenido sin recargar la página.

### Uso básico

```html
<!-- Crear instancia -->
<script>
  const app = new Swappit('mi-app');
</script>

<!-- Links automáticos -->
<a href="./pagina1.html" data-swappit-handle="mi-app">Ir a Página 1</a>
<a href="./pagina2.html" data-swappit-handle="mi-app">Ir a Página 2</a>
```

### Configuración de precarga por link

Cada link puede tener su propia configuración de precarga:

```html
<!-- Sin precarga (solo carga al hacer click) -->
<a href="./pagina1.html" data-swappit-handle="mi-app">Página 1</a>

<!-- Precarga al pasar el mouse o touch -->
<a href="./pagina2.html" data-swappit-handle="mi-app" data-preload="hover">Página 2</a>

<!-- Precarga instantánea (al cargar la página) -->
<a href="./pagina3.html" data-swappit-handle="mi-app" data-preload="instant">Página 3</a>

<!-- Forzar descarga nueva sin usar caché -->
<a href="./pagina4.html" data-swappit-handle="mi-app" data-load-from-cache="false">Página 4</a>
```

### Precarga predeterminada para todos los links

Puedes definir un modo de precarga predeterminado para todos los links al crear la instancia:

```javascript
const app = new Swappit('mi-app', false, {
  preload: 'hover' // Todos los links harán precarga al hover por defecto
});
```

Los links individuales pueden sobrescribir este comportamiento:

```html
<!-- Usará 'hover' (default de la instancia) -->
<a href="./pagina1.html" data-swappit-handle="mi-app">Página 1</a>

<!-- Sobrescribe con precarga instantánea -->
<a href="./pagina2.html" data-swappit-handle="mi-app" data-preload="instant">Página 2</a>
```

### Detección automática de nuevos links

Swappit observa cambios en el DOM y configura automáticamente los nuevos links que se agreguen dinámicamente:

```javascript
// Los nuevos links se configurarán automáticamente
document.querySelector('#contenedor').innerHTML = `
  <a href="./nueva-pagina.html" data-swappit-handle="mi-app">Nueva Página</a>
`;
```

### Ventajas de este método

- **Zero-config**: Solo agrega el atributo `data-swappit-handle` a tus links
- **Precarga flexible**: Configura precarga individual o global
- **Detección automática**: Los links dinámicos se configuran automáticamente
- **Control de caché**: Decide si usar caché o forzar descarga por link

## SwappitInstance

Swappit incluye el custom element `<swappit-instance>` para crear instancias Swappit de forma declarativa usando atributos HTML.

### Uso básico

```html
<swappit-instance data-handle="mi-app"></swappit-instance>
```

### Atributos disponibles

| Atributo | Tipo | Descripción | Valor predeterminado |
|----------|------|-------------|----------------------|
| `data-handle` | string | Identificador de la instancia Swappit (obligatorio) | N/A |
| `data-log` | boolean | Activa logs para la instancia | `false` |
| `data-update-url` | boolean | Actualiza la URL del navegador | `false` |
| `data-enable-history` | boolean | Habilita navegación con botones del navegador | `false` |
| `data-preload` | string | Modo de precarga: `"instant"`, `"hover"` o `false` | `false` |
| `data-load-from-cache` | boolean | Usa caché por defecto | `true` |
| `data-destroy-after-remove` | boolean | Elimina la instancia del registro cuando el componente se desconecta del DOM | `false` |

### Comportamiento

1. **Crea o reinicia una instancia**: Si no existe una instancia con ese `data-handle`, la crea. Si ya existe, la reinicia con las nuevas opciones.
2. **Configuración declarativa**: Todos los atributos se mapean directamente a las opciones de Swappit.
3. **Funciona con links automáticos**: Los links con `data-swappit-handle` que coincidan con el handle se configuran automáticamente.
4. **Reinicio automático**: Si el componente ya tiene una instancia activa y se especifican nuevos atributos, llama a `reinit()` para actualizar la configuración.
5. **Cleanup opcional**: Si `data-destroy-after-remove` está activo, cuando el componente se elimina del DOM, también se elimina la instancia del registro `Swappit.instances`.

### Ejemplo completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ejemplo Swappit Instance</title>
</head>
<body>
  <!-- Elementos que se actualizarán -->
  <div data-mi-app-update="header">
    <h1>Encabezado Original</h1>
  </div>

  <div data-mi-app-update="content">
    <p>Contenido original de la página</p>
  </div>

  <!-- Crear instancia con configuración completa -->
  <swappit-instance
    data-handle="mi-app"
    data-log
    data-update-url
    data-enable-history
    data-preload="hover">
  </swappit-instance>

  <!-- Navegación -->
  <nav>
    <a href="./pagina1.html" data-swappit-handle="mi-app">Página 1</a>
    <a href="./pagina2.html" data-swappit-handle="mi-app">Página 2</a>
    <a href="./pagina3.html" data-swappit-handle="mi-app" data-preload="instant">Página 3 (Precarga inmediata)</a>
    <a href="./pagina4.html" data-swappit-handle="mi-app" data-load-from-cache="false">Página 4 (Sin caché)</a>
  </nav>

  <script src="ruta/a/swappit.min.js"></script>

  <script>
    // Acceder a la instancia creada por el componente
    const miApp = Swappit.instances.get('mi-app');

    // Escuchar eventos
    window.addEventListener('swappit:mi-app:afterUpdate', (e) => {
      console.log('Contenido actualizado:', e.detail);
    });
  </script>
</body>
</html>
```

## Método reinit()

El método `reinit()` permite reiniciar una instancia Swappit, limpiando su caché y actualizando su configuración sin necesidad de crear una nueva instancia.

### Sintaxis

```javascript
instance.reinit(log, options)
```

### Parámetros

- `log` (boolean): Nuevo valor para activar/desactivar logging
- `options` (object): Objeto con opciones para actualizar (se hace merge con las existentes)

### Comportamiento

1. **Limpia la caché**: Elimina todo el contenido almacenado en `contentsCache`
2. **Actualiza logging**: Cambia el estado de logging
3. **Actualiza opciones**: Hace merge de las nuevas opciones con las existentes
4. **Reinicia handlers**: Vuelve a configurar el handler de historial
5. **Reinicia observer**: Vuelve a observar el DOM para detectar nuevos links
6. **Emite evento**: Dispara el evento `swappit:[handle]:reinit`

### Ejemplo de uso

```javascript
const app = new Swappit('mi-app', false, {
  updateUrl: false,
  preload: false
});

// Después de un tiempo, cambiar la configuración
app.reinit(true, {
  updateUrl: true,
  enableHistory: true,
  preload: 'hover'
});

// Ahora la instancia tiene:
// - log: true
// - updateUrl: true
// - enableHistory: true
// - preload: 'hover'
// - caché limpiada
```

### Cuándo usar reinit()

- Cuando necesitas cambiar opciones dinámicamente
- Cuando `<swappit-instance>` detecta que ya existe una instancia con ese handle
- Cuando quieres limpiar la caché sin perder la instancia
- Al cambiar entre modos (por ejemplo, de desarrollo a producción)

## Manejo de scripts

**IMPORTANTE**: En la versión actual de Swappit, los scripts dentro de los elementos actualizados **NO se ejecutan automáticamente**.

### Comportamiento actual

Cuando Swappit actualiza el DOM:
- Los elementos HTML se reemplazan correctamente
- Los `<noscript>` se procesan
- Los `<script>` **NO se ejecutan automáticamente** (el código está comentado)

### Cómo ejecutar scripts manualmente

Si necesitas que los scripts se ejecuten después de actualizar el contenido, usa los métodos estáticos:

#### 1. Actualizar scripts inline (por contenido)

```javascript
window.addEventListener('swappit:mi-app:afterUpdate', () => {
  // Seleccionar scripts que quieres ejecutar
  const scripts = document.querySelectorAll('[data-mi-app-update] script');

  // Ejecutarlos
  Swappit.updateScriptByContent(Array.from(scripts));
});
```

#### 2. Actualizar scripts externos (por src)

```javascript
window.addEventListener('swappit:mi-app:afterUpdate', () => {
  // Recargar todos los scripts que contengan "analytics" en su URL
  // Se agregará un timestamp para forzar la recarga
  Swappit.updateScriptBySrc('analytics');
});
```

### Ejemplo completo

```html
<script>
  const app = new Swappit('mi-app', true);

  window.addEventListener('swappit:mi-app:afterUpdate', (e) => {
    console.log('Contenido actualizado de:', e.detail.url);

    // Ejecutar scripts inline dentro de los elementos actualizados
    const inlineScripts = document.querySelectorAll('[data-mi-app-update] script:not([src])');
    if (inlineScripts.length > 0) {
      Swappit.updateScriptByContent(Array.from(inlineScripts));
    }

    // Recargar scripts externos específicos
    Swappit.updateScriptBySrc('mi-libreria.js');
  });
</script>
```

### Por qué los scripts están desactivados

Los scripts automáticos están comentados en el código para evitar:
- Ejecución duplicada de scripts
- Problemas con librerías que no soportan reinicialización
- Comportamientos inesperados en aplicaciones complejas

Esto te da **control total** sobre qué scripts ejecutar y cuándo.

## Solución de problemas

| Problema | Posible causa | Solución |
|----------|---------------|----------|
| No se actualiza el contenido | Atributos data incorrectos o handle distinto | Verifica que los atributos `data-[handle]-update` coincidan entre la página principal y las páginas de destino |
| Errores en consola sobre URL inválida | URL externa o absoluta | Solo se permiten rutas relativas internas que empiecen con `/` o `./` |
| Links no funcionan automáticamente | Falta atributo `data-swappit-handle` | Agrega `data-swappit-handle="tu-handle"` a los links |
| Orden de actualización incorrecto | Falta atributo order | Añade `data-[handle]-update-order` con valores numéricos. Los sin orden se actualizan primero |
| Error "El handle ya está en uso" | Intentas crear dos instancias con el mismo handle | Usa `Swappit.instances.get('tu-handle')` para reutilizar una instancia existente, o usa `<swappit-instance>` que reinicia automáticamente |
| `<swappit-instance>` no crea la instancia | Falta atributo `data-handle` | El atributo `data-handle` es obligatorio |
| Los scripts no se ejecutan | Scripts desactivados por defecto | Usa `Swappit.updateScriptByContent()` o `Swappit.updateScriptBySrc()` en el evento `afterUpdate` |
| La precarga no funciona | Valor incorrecto en `data-preload` | Usa `"instant"` o `"hover"` (entre comillas) |
| Los botones adelante/atrás no funcionan | Falta configuración de historial | Activa `updateUrl: true` y `enableHistory: true` en las opciones |
| Links dinámicos no se configuran | Error en el observer | El observer se inicia automáticamente. Activa `log: true` para ver mensajes de depuración |
| El caché no se actualiza | `loadFromCache` está en `true` | Usa `loadFromCache: false` o llama a `update(url, false)` para forzar nueva descarga, o usa `reinit()` para limpiar la caché |
| La instancia no toma las nuevas opciones | Las opciones se definen al crear la instancia | Usa el método `reinit(log, options)` para actualizar opciones dinámicamente |
