# Swappit

Swappit es una librería JavaScript diseñada para facilitar la actualización parcial o total del contenido HTML de tu sitio web sin recargar la página. Su enfoque declarativo permite integrar funcionalidades modernas de navegación y experiencia de usuario sin la complejidad de un framework completo o arquitectura SPA. Ideal para proyectos que requieren velocidad, simplicidad y compatibilidad con plataformas. Swappit detecta y reemplaza dinámicamente elementos del DOM, manteniendo scripts de terceros funcionales y ofreciendo una navegación fluida y eficiente.

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
  - [Configuración de páginas de destino](#configuración-de-páginas-de-destino)
    - [Estructura HTML](#estructura-html)
    - [Requisitos para la actualización](#requisitos-para-la-actualización)
    - [Ejemplo práctico](#ejemplo-práctico)
    - [Consejos para estructurar páginas de destino](#consejos-para-estructurar-páginas-de-destino)
  - [SwappitButton](#swappitbutton)
    - [Uso básico](#uso-básico-1)
    - [Atributos disponibles](#atributos-disponibles)
    - [Comportamiento](#comportamiento)
    - [Ejemplo completo](#ejemplo-completo)
    - [JavaScript (opcional)](#javascript-opcional)
  - [Solución de problemas](#solución-de-problemas)

## Instalación

Hay varias formas de integrar Swappit en tu proyecto:

### NPM

```bash
npm install @soyleninjs/swappit
```

Y luego importarlo en tu proyecto:

```javascript
// Usando ES modules
import Swappit from '@soyleninjs/swappit';
// o puedes hacer uso de un cdn sin instalarlo
import Swappit from "https://esm.sh/@soyleninjs/swappit";

// O usando CommonJS
const Swappit = require('@soyleninjs/swappit');
```

### CDN

Incluye Swappit directamente desde un CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@soyleninjs/swappit/swappit.min.js"></script>
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

  // Actualizar contenido desde una URL (usando caché por defecto)
  swappit.update('https://ejemplo.com/contenido.html');
  
  // Para forzar una nueva descarga, especificar false
  // swappit.update('https://ejemplo.com/contenido.html', false);
</script>
```


## Ejemplos

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

// Precargar contenido
appPrecarga.preloadContents(['header.html', 'main.html', 'footer.html']);

// Funciones para actualizar componentes individuales
function actualizarHeader() {
  appPrecarga.update('header.html'); // Usa caché por defecto
}

function actualizarMain() {
  appPrecarga.update('main.html'); // Usa caché por defecto
}

function actualizarFooter() {
  appPrecarga.update('footer.html', false); // Forzar nueva descarga
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
| `update(url, loadFromCache = true)` | Actualiza el contenido desde una URL específica. <br>- `url`: Ruta relativa a la página que contiene el contenido a cargar <br>- `loadFromCache`: Determina si se debe utilizar la versión en caché (si existe) o forzar una nueva descarga. <br>   - `true` (valor predeterminado): Usa la versión en caché si está disponible <br>   - `false`: Ignora la caché y realiza una nueva petición fetch a la URL |
| `preloadContents(arrayUrls)` | Precarga el contenido de múltiples URLs para utilizarlo posteriormente |

### Métodos estáticos

| Método | Descripción |
|--------|-------------|
| `updateScriptByContent(arrayScriptsNodes)` | Actualiza scripts por contenido |
| `updateScriptBySrc(matchUrl)` | Actualiza scripts por URL de origen |
| `Swappit.instances` | Map que almacena todas las instancias de Swappit creadas, indexadas por su handle |

## Eventos

Swappit emite eventos personalizados durante el ciclo de actualización:

```javascript
// Antes de la actualización
window.addEventListener('swappit:mi-handle:beforeUpdate', () => {
  console.log('Comenzando actualización');
});

// Después de la actualización
window.addEventListener('swappit:mi-handle:afterUpdate', () => {
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

// Más tarde, actualizar usando caché (comportamiento por defecto)
app.update('header.html');

// Para forzar una nueva descarga, especificar false
app.update('footer.html', false);
```

## Configuración de páginas de destino

Para que Swappit funcione correctamente, las páginas de destino (las que se cargan mediante fetch) deben configurarse siguiendo estas pautas:

### Estructura HTML

Las páginas de destino pueden ser documentos HTML completos normales. Swappit extraerá automáticamente solo los elementos que necesita actualizar.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Página de destino</title>
  <!-- Cualquier contenido en el head será ignorado -->
</head>
<body>
  <!-- Solo los elementos con atributos data-[handle]-update serán utilizados -->
  <div data-mi-app-update="header">Nuevo encabezado</div>
  <div data-mi-app-update="content">Nuevo contenido</div>
  
  <!-- El resto del contenido será ignorado -->
  <footer>Este contenido será ignorado si no tiene el atributo data-[handle]-update</footer>
</body>
</html>
```

### Requisitos para la actualización

1. **Atributos data correspondientes**: Los elementos en la página de destino deben tener los mismos atributos `data-[handle]-update` con los mismos valores que los elementos que deseas actualizar en tu página principal.

2. **Correspondencia por nombre**: Solo se actualizarán los elementos que tengan un elemento correspondiente en la página principal con el mismo valor en el atributo `data-[handle]-update`.

### Ejemplo práctico

**Página principal:**
```html
<div data-mi-app-update="header">Encabezado original</div>
<div data-mi-app-update="sidebar">Barra lateral original</div>
<div data-mi-app-update="content">Contenido original</div>
```
**Página de destino (nueva-pagina.html):**
```html
<!DOCTYPE html>
<html>
<body>
  <div data-mi-app-update="header">Nuevo encabezado</div>
  <div data-mi-app-update="content">Nuevo contenido</div>
  <div data-mi-app-update="footer">Este elemento será ignorado</div>
</body>
</html>
```

**Resultado después de `app.update('nueva-pagina.html')`:**
- El elemento "header" se actualizará con "Nuevo encabezado"
- El elemento "content" se actualizará con "Nuevo contenido"
- El elemento "sidebar" permanecerá sin cambios (no hay correspondencia en la página de destino)
- El elemento "footer" de la página de destino será ignorado (no hay correspondencia en la página principal)

### Consejos para estructurar páginas de destino

- **Mantén consistencia**: Usa los mismos nombres de atributos `data-[handle]-update` en todas tus páginas
- **Estructura modular**: Divide tu contenido en componentes lógicos que puedan actualizarse independientemente
- **Orden de actualización**: Si necesitas un orden específico de actualización, usa atributos `data-[handle]-update-order`

## SwappitButton

Swappit incluye un custom element que facilita la integración con enlaces existentes para actualizar contenido sin recargar la página.

### Uso básico

```html
<swappit-button data-handle="mi-app">
  <a href="./mi-pagina.html">Ir a Mi Página</a>
</swappit-button>
```

### Atributos disponibles

| Atributo | Tipo | Descripción | Valor predeterminado |
|----------|------|-------------|----------------------|
| `data-handle` | string | Identificador de la instancia Swappit a utilizar (obligatorio) | N/A |
| `data-log` | boolean | Activa/desactiva los logs para esta instancia | `false` |
| `data-preload` | boolean | Precarga automáticamente el contenido del enlace | `true` |
| `data-load-from-cache` | boolean | Si es `true` (predeterminado) usa la versión en caché. Solo es necesario especificar `false` para forzar una nueva descarga | `true` |

### Comportamiento

1. El componente debe contener un único elemento `<a>` con un atributo `href` válido
2. Solo acepta rutas relativas internas (que empiecen con `./` o `/`)
3. Intercepta los clics y utiliza Swappit para actualizar el contenido sin recargar la página
4. Reutiliza instancias existentes de Swappit o crea una nueva si no existe

### Ejemplo completo

```html
<!-- Elementos que se actualizarán -->
<div data-swappit-button-update="header">Encabezado actual</div>
<div data-swappit-button-update="content">Contenido actual</div>

<!-- Menú de navegación con SwappitButton -->
<nav>
  <swappit-button data-handle="swappit-button" data-log="true">
    <a href="./pagina1.html">Página 1</a>
  </swappit-button>
  
  <swappit-button data-handle="swappit-button" data-preload="false">
    <a href="./pagina2.html">Página 2</a>
  </swappit-button>
  
  <swappit-button data-handle="swappit-button" data-load-from-cache="false">
    <a href="./pagina3.html">Página 3 (Forzar nueva descarga)</a>
  </swappit-button>
</nav>
```

### JavaScript (opcional)

No es necesario escribir JavaScript adicional para utilizar el componente, pero puede interactuar con la instancia de Swappit si lo desea:

```javascript
// Obtener acceso a la instancia compartida
const swappitButton = Swappit.instances.get('swappit-button');

// Escuchar eventos de actualización
window.addEventListener('swappit:swappit-button:afterUpdate', () => {
  console.log('Navegación completada');
});
```

## Solución de problemas

| Problema | Posible causa | Solución |
|----------|---------------|----------|
| No se actualiza el contenido | Atributos data incorrectos | Verifica que los atributos data coincidan con el handle utilizado |
| Errores en consola | URL incorrecta o no disponible | Verifica que las URLs sean accesibles y tengan el formato correcto |
| Orden de actualización incorrecto | Falta atributo order | Añade atributos `data-[handle]-update-order` con valores numéricos |
| Conflictos entre instancias | Handles duplicados | Asegúrate de usar un handle único para cada instancia |
| No se cargan scripts | Problemas con la ejecución de scripts | Verifica que no haya errores en los scripts y que estén correctamente formateados | 
