# Swappit

Biblioteca JavaScript ligera para actualizar dinámicamente el contenido de tu sitio web desde URLs externas con soporte para caché y actualización ordenada.

## Menú
- [Swappit](#swappit)
  - [Menú](#menú)
  - [Instalación](#instalación)
    - [NPM](#npm)
    - [CDN](#cdn)
    - [Descarga directa](#descarga-directa)
  - [Uso básico](#uso-básico)
  - [Ejemplos](#ejemplos)
    - [Ejemplo 1: Actualización básica de contenido](#ejemplo-1-actualización-básica-de-contenido)
    - [Ejemplo 2: Actualización con orden específico](#ejemplo-2-actualización-con-orden-específico)
    - [Ejemplo 3: Precarga de múltiples URLs](#ejemplo-3-precarga-de-múltiples-urls)
  - [Opciones de configuración](#opciones-de-configuración)
    - [Atributos de datos](#atributos-de-datos)
  - [Métodos](#métodos)
    - [Métodos de instancia](#métodos-de-instancia)
    - [Métodos estáticos](#métodos-estáticos)
  - [Eventos](#eventos)
  - [Logging](#logging)
  - [Patrones de uso](#patrones-de-uso)
    - [Identificadores únicos](#identificadores-únicos)
    - [Precarga de contenido](#precarga-de-contenido)
  - [Solución de problemas](#solución-de-problemas)

## Instalación

Hay varias formas de integrar Swappit en tu proyecto:

### NPM

```bash
npm install swappit
```

Y luego importarlo en tu proyecto:

```javascript
// Usando ES modules
import Swappit from 'swappit';

// O usando CommonJS
const Swappit = require('swappit');
```

### CDN

Incluye Swappit directamente desde un CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/swappit/dist/swappit.min.js"></script>
```

### Descarga directa

1. Descarga el archivo `swappit.min.js` desde el [repositorio de GitHub](https://github.com/soyleninjs/swappit/releases)
2. Copia el archivo a tu proyecto e inclúyelo en tu HTML:

```html
<script src="ruta/a/tu/proyecto/swappit.min.js"></script>
```

## Uso básico

```html
<!-- Elementos que se actualizarán -->
<div data-mi-handle-update="header">Contenido original del header</div>
<div data-mi-handle-update="main">Contenido original del main</div>

<script>
  // Crear una instancia de Swappit
  const swappit = new Swappit('mi-handle', true); // true para activar logs

  // Actualizar contenido desde una URL
  swappit.update('https://ejemplo.com/contenido.html');
</script>
```

## Ejemplos

Todos los ejemplos están disponibles en el archivo `examples/index.html`. Puedes abrir este archivo en tu navegador para ver las demostraciones de Swappit en acción.

### Ejemplo 1: Actualización básica de contenido

Este ejemplo muestra cómo actualizar el contenido básico de una página.

**HTML:**
```html
<!-- Elementos originales -->
<div data-mi-app-update="header">
  <h1>Título original</h1>
</div>

<div data-mi-app-update="content">
  <p>Contenido original</p>
</div>
```

**JavaScript:**
```javascript
// Crear una instancia de Swappit
const appBasico = new Swappit('mi-app');

// Función para actualizar contenido
function actualizarContenido() {
  appBasico.update('contenido-nuevo.html');
}
```

### Ejemplo 2: Actualización con orden específico

Este ejemplo muestra cómo establecer un orden específico para actualizar elementos.

**HTML:**
```html
<!-- Elementos con orden específico -->
<div data-mi-app-orden-update="section1" data-mi-app-orden-update-order="2">
  Sección 1 (Orden: 2)
</div>
<div data-mi-app-orden-update="section2" data-mi-app-orden-update-order="1">
  Sección 2 (Orden: 1)
</div>
<div data-mi-app-orden-update="section3" data-mi-app-orden-update-order="3">
  Sección 3 (Orden: 3)
</div>
```

**JavaScript:**
```javascript
// Crear una instancia de Swappit
const appOrdenado = new Swappit('mi-app-orden');

// Actualizar contenido con orden
appOrdenado.update('contenido-ordenado.html');
```

### Ejemplo 3: Precarga de múltiples URLs

Este ejemplo muestra cómo precargar múltiples URLs y luego actualizarlas individualmente.

**HTML:**
```html
<!-- Elementos para actualizar individualmente -->
<div data-mi-app-precarga-update="header" class="preload-section">
  <h2>Header</h2>
  <p>Contenido del header...</p>
</div>

<div data-mi-app-precarga-update="main" class="preload-section">
  <h2>Contenido Principal</h2>
  <p>Contenido principal...</p>
</div>

<div data-mi-app-precarga-update="footer" class="preload-section">
  <h2>Footer</h2>
  <p>Contenido del footer...</p>
</div>
```

**JavaScript:**
```javascript
// Crear una instancia de Swappit
const appPrecarga = new Swappit('mi-app-precarga');

// Precargar todo el contenido
appPrecarga.preloadContents([
  'header.html',
  'main.html',
  'footer.html'
]);

// Funciones para actualizar componentes individuales
function actualizarHeader() {
  appPrecarga.update('header.html');
}

function actualizarMain() {
  appPrecarga.update('main.html');
}

function actualizarFooter() {
  appPrecarga.update('footer.html');
}
```

## Opciones de configuración

```javascript
new Swappit(handle, log = false)
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `handle` | string | Identificador único para la instancia (obligatorio) |
| `log` | boolean | Activa/desactiva los logs de la consola (opcional, default: false) |

### Atributos de datos

| Atributo | Descripción |
|----------|-------------|
| `data-[handle]-update` | Identificador del elemento a actualizar |
| `data-[handle]-update-order` | Orden de actualización (opcional) |

## Métodos

### Métodos de instancia

| Método | Descripción |
|--------|-------------|
| `update(url)` | Actualiza el contenido desde una URL específica |
| `preloadContents(arrayUrls)` | Precarga el contenido de múltiples URLs para utilizarlo posteriormente |

### Métodos estáticos

| Método | Descripción |
|--------|-------------|
| `updateScriptByContent(arrayScriptsNodes)` | Actualiza scripts por contenido |
| `updateScriptBySrc(matchUrl)` | Actualiza scripts por URL de origen |

## Eventos

Swappit emite un evento personalizado cuando se completa una actualización:

```javascript
window.addEventListener('mi-handle::update', () => {
  console.log('Contenido actualizado');
});
```

## Logging

Swappit incluye un sistema de logging con diferentes niveles:

- Info (azul): Información general
- Success (verde): Operaciones exitosas
- Warning (amarillo): Advertencias
- Error (rojo): Errores

Para activar los logs, inicializa el componente con el parámetro `log` en `true`:

```javascript
const app = new Swappit('mi-app', true);
```

## Patrones de uso

### Identificadores únicos

Cada instancia de Swappit debe tener un handle único que se utilizará como prefijo en los atributos data:

```javascript
// Instancia 1
const app1 = new Swappit('mi-app');
// Usará elementos con atributo 'data-mi-app-update'

// Instancia 2
const app2 = new Swappit('otro-app');
// Usará elementos con atributo 'data-otro-app-update'
```

### Precarga de contenido

Para mejorar el rendimiento, puede precargar el contenido y luego actualizarlo cuando sea necesario:

```javascript
// Precargar contenido
app.preloadContents(['header.html', 'main.html', 'footer.html']);

// Más tarde, actualizar solo una parte
app.update('header.html');
```

## Solución de problemas

| Problema | Posible causa | Solución |
|----------|---------------|----------|
| No se actualiza el contenido | Atributos data incorrectos | Verifica que los atributos data coincidan con el handle utilizado |
| Errores en consola | URL incorrecta o no disponible | Verifica que las URLs sean accesibles y tengan el formato correcto |
| Orden de actualización incorrecto | Falta atributo order | Añade atributos `data-[handle]-update-order` con valores numéricos |
| Conflictos entre instancias | Handles duplicados | Asegúrate de usar un handle único para cada instancia |
| No se cargan scripts | Problemas con la ejecución de scripts | Verifica que no haya errores en los scripts y que estén correctamente formateados | 