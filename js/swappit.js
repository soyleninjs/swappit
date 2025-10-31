/**
 * To do:
 * - atributos aria para accesibilidad
 * - añadir configuracion para reiniciar scripts desde src e inline
 * - arreglar mensaje de exito al precargar urls
 * - Fix documentacion homepage ✅
 * - Agregar parametro para actualizar la url de la pagina ✅
 * - Remover prefetch automatico en swappit-button, se tiene que activara manualmente ✅
 * - Agregar option para que funcione con el History del navegador ✅
 * - Observador de nuevos links ✅
 * - agregar config para preload con instant ✅
 * - agregar config para preload con hover ✅
 * - Agregar sistema de Zero config, usando datas sobre <a> para evitar estructuras extras, con resyncronisacion automatica para nuevos elementos en el dom ✅
 */

class Swappit {
  // Registro estático para almacenar los handles en uso
  static instances = new Map();

  constructor(handle, log = false, options = {}) {
    // Verificar que se haya proporcionado un handle
    if (!handle) {
      throw new Error("Swappit: Error - El parámetro handle es obligatorio");
    }

    // Comprobar si el handle ya está en uso
    if (Swappit.instances.has(handle)) {
      // Lanzar error si el handle ya está en uso
      throw new Error(`Swappit: Error - El handle "${handle}" ya está en uso. Utilice un identificador diferente.`);
    }

    // Usar el handle proporcionado
    this.handle = handle;
    // Configurar el parámetro log
    this.log = log;

    this.options = {
      updateUrl: false, // true, false
      enableHistory: false, // true, false
      // Este preload sirve para colocar un default para los links que se capturen con el observer y ellos no tenga su propio preload
      preload: false, // false, hover, instant
      ...options
    };

    // Registrar esta instancia con su handle
    Swappit.instances.set(this.handle, this);
    this.contentsCache = {};

    // Manejo de eventos
    this._handleHistoryUpdate();
    this._observeDOM();

    this._logMessage(`Nueva instancia creada`, 'info');
  }

  _logMessage(message, type = 'info') {
    if (!this.log) return;
    
    const colors = {
      info: '#3498db',    // Azul
      success: '#2ecc71', // Verde
      warning: '#f39c12', // Amarillo
      error: '#e74c3c'    // Rojo
    };
    
    const color = colors[type] || colors.info;
    const prefix = `%cSwappit [${this.handle}]:`;
    
    console.log(prefix, `color: ${color}; font-weight: bold;`, message);
  }

  async _getContent(url, loadFromCache = true) {
    if (!url || (!url.startsWith("/") && !url.startsWith("./"))) {
      this._logMessage(`La URL "${url}" no es válida. Solo se permiten rutas internas relativas.`, "error");
      return;
    }

    if (!loadFromCache || !this.contentsCache[url]) {
      const request = await window.fetch(url);
      const html = await request.text();
      this.contentsCache[url] = new window.DOMParser().parseFromString(html, "text/html");
      this._logMessage(`Contenido precargado de ${url}`, 'success');
    }
  }

  _updateDOM(html) {
    const $elementsToUpdate = Array.from(document.querySelectorAll(`[data-${this.handle}-update]`));
    const $elementsToUpdateWithOrder = $elementsToUpdate.filter((item) => item.hasAttribute(`data-${this.handle}-update-order`));
    const $elementsToUpdateWithoutOrder = $elementsToUpdate.filter((item) => !item.hasAttribute(`data-${this.handle}-update-order`));

    $elementsToUpdateWithOrder.sort((itemA, itemB) => window.parseInt(itemA.getAttribute(`data-${this.handle}-update-order`)) - window.parseInt(itemB.getAttribute(`data-${this.handle}-update-order`)));

    const $finalElementsOrderToUpdate = [...$elementsToUpdateWithoutOrder, ...$elementsToUpdateWithOrder];

    $finalElementsOrderToUpdate.forEach(($element) => {
      const $elementName = $element.getAttribute(`data-${this.handle}-update`);
      const $newElements = html.querySelectorAll(`[data-${this.handle}-update="${$elementName}"]`);

      $newElements.forEach(($newElement) => {
        if ($newElement == null) {
          $element.classList.add("hidden");
          return;
        }

        const clonedElement = $newElement.cloneNode(true);
        
        // Manejo de noscripts
        const noscripts = clonedElement.querySelectorAll("noscript");
        noscripts.forEach((noscript) => {
          noscript.textContent = noscript.innerHTML;
        });

        // // Manejo de scripts
        // const scripts = clonedElement.querySelectorAll("script");
        // scripts.forEach((script) => {
        //   const newScript = document.createElement("script");
          
        //   // Si el script tiene src, actualizamos la URL con timestamp
        //   if (script.src) {
        //     newScript.src = `${script.src}?timestamp=${new Date().getTime()}`;
        //   } else {
        //     // Si es código inline, copiamos el contenido
        //     newScript.textContent = script.textContent;
        //   }
          
        //   // Copiamos todos los atributos del script original
        //   Array.from(script.attributes).forEach(attr => {
        //     if (attr.name !== 'src') { // No copiamos src ya que lo manejamos arriba
        //       newScript.setAttribute(attr.name, attr.value);
        //     }
        //   });
          
        //   script.replaceWith(newScript);
        // });

        $element.replaceWith(clonedElement);
      });
    });
  }

  _emitCustomEvent(name, url = "") {
    const nameEvent = `swappit:${this.handle}:${name}`;
    window.dispatchEvent(new window.CustomEvent(nameEvent, {
      detail: {
        handle: this.handle,
        url: url
      }
    }));
  }

  // ----- HANDLERS -----
  _handleHistoryUpdate() {
    if (this.options.updateUrl && this.options.enableHistory) {
      // Limpiar listener antiguo si existía
      if (window._swappitHistoryUpdate) {
        window.removeEventListener("popstate", window._swappitHistoryUpdate);
      }

      // Handle Popstate
      window._swappitHistoryUpdate = () => this._handleHistoryUpdateCallback();
      window.addEventListener("popstate", window._swappitHistoryUpdate);
    }
  }

  async _handleHistoryUpdateCallback() {
    const url = window.location.pathname;
    await this._getContent(url);
    this._updateDOM(this.contentsCache[url]);
  }

  _handleLinksToPreload($links) {
    $links.forEach(($link) => {
      const  { preload: preloadLink, loadFromCache: loadFromCacheLink } = $link.dataset;
      const url = $link.getAttribute(`href`)
      const preload = preloadLink || this.options.preload
      const loadFromCache = loadFromCacheLink || true
      
      // Preload
      if (preload === "instant") {
        this._getContent(url);
      }
      else if (preload === "hover") {
        // 1️⃣ Prefetch on hover (desktop)
        $link.addEventListener('mouseenter', () => {
          this._getContent(url);
        });
  
        // 2️⃣ Prefetch on touch (móvil)
        $link.addEventListener('touchstart', () => {
          this._getContent(url);
        }, { passive: true });
      }

      // Limpiar listener antiguo si existía
      if ($link._clickListener) {
        $link.removeEventListener('click', $link._clickListener);
      }

      // Handle Click
      $link._clickListener = (event) => this._handleClickLink(event, url, loadFromCache);
      $link.addEventListener('click', $link._clickListener);
    });
  }

  _handleClickLink(event, url, loadFromCache) {
    event.preventDefault();
    this.update(url, loadFromCache);
  }

  _observeNode(node) {
    if (node.nodeType !== 1) return;

    if (node.matches(`a[data-swappit-handle="${this.handle}"]`) || node.querySelector(`a[data-swappit-handle="${this.handle}"]`)) {
      if (node.matches(`a[data-swappit-handle="${this.handle}"]`)) this._handleLinksToPreload([node]);

      const $links = node.querySelectorAll(`a[data-swappit-handle="${this.handle}"]`);
      this._handleLinksToPreload($links);
    }
  }

  _observeDOM() {
    // Iniciar lectura de los links existentes
    const $links = document.querySelectorAll(`a[data-swappit-handle="${this.handle}"]`);
    this._handleLinksToPreload($links);

    if (this.observerLinks) {
      this.observerLinks.disconnect();
    }

    // Iniciar observador de nuevos links
    this.observerLinks = new window.MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => this._observeNode(node));
      });
    });

    this.observerLinks.observe(document.body, { childList: true, subtree: true });
  }

  // ---- API PUBLICA ----
  async preloadContents(arrayUrls) {
    const cleanArrayUrls = [...new Set(arrayUrls)];
    if (!Array.isArray(cleanArrayUrls) || cleanArrayUrls.length === 0) {
      this._logMessage(`preloadContents requiere un array de URLs no vacío`, 'warning');
      return;
    }

    await Promise.all(cleanArrayUrls.map((url) => this._getContent(url)));
    this._logMessage(`Precarga completada para ${cleanArrayUrls.length} URL(s)`, 'success');
  }

  // Método para actualizar contenido de una URL específica
  async update(url, loadFromCache = true) {
    this._emitCustomEvent("beforeUpdate", url);

    if (this.options.updateUrl) {
      if (this.options.enableHistory) {
        window.history.pushState({}, "", url);
      } else {
        window.history.replaceState({}, "", url);
      }
    }

    await this._getContent(url, loadFromCache);
    this._updateDOM(this.contentsCache[url]);
    this._logMessage(`Elementos actualizados del contenido de ${url}`, 'success');
    this._emitCustomEvent("afterUpdate", url);
  }

  reinit(log = false, options = {}) {
    this.log = log;
    this.options = {
      ...this.options,
      ...options
    };
    this._handleHistoryUpdate();
    this._observeDOM();
    this._logMessage(`Reinicio completado`, 'success');
    this._emitCustomEvent("reinit");
  }

  static updateScriptByContent(arrayScriptsNodes) {
    arrayScriptsNodes.forEach((script) => {
      const newScript = document.createElement("script");
      newScript.textContent = script.textContent;
      script.replaceWith(newScript);
    });
  }

  static updateScriptBySrc(matchUrl) {
    const scripts = document.querySelectorAll(`script[src*="${matchUrl}"]`);
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      newScript.src = `${oldScript.src}?timestamp=${new Date().getTime()}`;
      oldScript.replaceWith(newScript);
    });
  }
}

// Exportar para entornos de navegador
window.Swappit = Swappit;

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = Swappit;
}
