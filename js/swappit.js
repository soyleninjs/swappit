/**
 * To do:
 * - atributos aria para accesibilidad
 */

class Swappit {
  // Registro estático para almacenar los handles en uso
  static instances = new Map();

  constructor(handle, options = {}) {
    // Verificar que se haya proporcionado un handle
    if (!handle) {
      throw new Error("Swappit: El parámetro handle es obligatorio");
    }

    // Comprobar si el handle ya está en uso
    if (Swappit.instances.has(handle)) {
      // Lanzar error si el handle ya está en uso
      throw new Error(`Swappit: El handle "${handle}" ya está en uso. Utilice un identificador diferente.`);
    }

    // Usar el handle proporcionado
    this.handle = handle;

    this.options = {
      log: false, // true, false
      updateUrl: false, // true, false
      enableHistory: false, // true, false
      // Este preload sirve para colocar un default para los links que se capturen con el observer y ellos no tenga su propio preload
      preload: false, // false, hover, instant
      ...options
    };

    // Si updateUrl y enableHistory están activados, se reemplaza el estado del historial con el estado actual
    if (this.options.updateUrl && this.options.enableHistory) {
      if (window.__swappitNavigationController) {
        throw new Error("Swappit: Solo una instancia puede controlar el historial.");
      }
    
      window.__swappitNavigationController = this;
    
      window.history.replaceState(
        { swappit: true },
        "",
        window.location.href
      );
    }

    // Registrar esta instancia con su handle
    Swappit.instances.set(this.handle, this);
    this.destroyed = false;
    this.contentsCache = {};
    this.currentRequestId = 0;
    this.pendingRequests = new Map();

    // Manejo de eventos
    this._handleHistoryUpdate();
    this._observeDOM();

    this._logMessage(`Nueva instancia creada`, 'info');
  }

  _logMessage(message, type = 'info') {
    if (!this.options.log) return;
    
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

  async _getContent(url, useCache = true) {
    if (this.destroyed) {
      throw new Error("Swappit: La instancia fue destruida.");
    }
    
    if (!url || (!url.startsWith("/") && !url.startsWith("./"))) {
      throw new Error(`La URL "${url}" no es válida. Solo se permiten rutas internas relativas.`);
    }
  
    if (useCache && this.contentsCache[url]) {
      return;
    }
  
    if (this.pendingRequests.has(url)) {
      return this.pendingRequests.get(url);
    }
  
    const requestPromise = (async () => {
      try {
        const request = await window.fetch(url);
  
        if (!request.ok) {
          throw new Error(`HTTP ${request.status} - ${url}`);
        }
  
        const html = await request.text();
        this.contentsCache[url] = new window.DOMParser().parseFromString(html, "text/html");
        this._logMessage(`Contenido precargado de ${url}`, "success");
      } finally {
        this.pendingRequests.delete(url);
      }
    })();
  
    this.pendingRequests.set(url, requestPromise);
  
    return requestPromise;
  }

  _updateDOM(html) {
    const $elementsToUpdate = Array.from(document.querySelectorAll(`[data-${this.handle}-update]`));
    const $elementsToUpdateWithOrder = $elementsToUpdate.filter((item) => item.hasAttribute(`data-${this.handle}-update-order`));
    const $elementsToUpdateWithoutOrder = $elementsToUpdate.filter((item) => !item.hasAttribute(`data-${this.handle}-update-order`));

    $elementsToUpdateWithOrder.sort((itemA, itemB) => window.parseInt(itemA.getAttribute(`data-${this.handle}-update-order`)) - window.parseInt(itemB.getAttribute(`data-${this.handle}-update-order`)));

    const $finalElementsOrderToUpdate = [...$elementsToUpdateWithOrder, ...$elementsToUpdateWithoutOrder];

    const updateRegions = new Map();
    html.querySelectorAll(`[data-${this.handle}-update]`).forEach((node) => {
      const key = node.getAttribute(`data-${this.handle}-update`);

      if (updateRegions.has(key)) {
        this._logMessage(
          `Update region duplicada detectada: ${key}`,
          "warning"
        );
      }

      updateRegions.set(key, node);
    });

    $finalElementsOrderToUpdate.forEach(($element) => {
      const key = $element.getAttribute(`data-${this.handle}-update`);
      const $newElement = updateRegions.get(key);

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

      $element.replaceWith(clonedElement);
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
      if (this.historyUpdate) {
        window.removeEventListener("popstate", this.historyUpdate);
      }

      // Handle Popstate
      this.historyUpdate = (event) => this._handleHistoryUpdateCallback(event)
      window.addEventListener("popstate", this.historyUpdate);
    }
  }

  async _handleHistoryUpdateCallback(event) {
    if (!event.state?.swappit) return;
    const requestId = ++this.currentRequestId;
    const url = window.location.pathname + window.location.search;
    this._emitCustomEvent("historyUpdate:before", url);

    try {
      await this._getContent(url);
  
      if (requestId !== this.currentRequestId) {
        return;
      }

      if (this.destroyed) return;
  
      this._updateDOM(this.contentsCache[url]);
      this._emitCustomEvent("historyUpdate:after", url);
    } catch(error) {
      this._logMessage(error.message, "error");
      this._emitCustomEvent("historyUpdate:error", url);
    }
  }

  _handleLinksToPreload($links) {
    $links.forEach(($link) => {
      const  { preload: preloadLink, useCache: useCacheLink } = $link.dataset;
      const url = $link.getAttribute(`href`)
      const preload = preloadLink || this.options.preload
      const useCache = useCacheLink === undefined ? true : useCacheLink === "true";

      const handlePreload = () => {
        this._getContent(url).catch((error) => {
          this._logMessage(error.message, "error");
        });
      }

      // Limpiar listener antiguo si existía
      if ($link._clickListener) {
        $link.removeEventListener('click', $link._clickListener);
      }
      if ($link._hoverListener) {
        $link.removeEventListener('mouseenter', $link._hoverListener);
      }
      if ($link._touchListener) {
        $link.removeEventListener('touchstart', $link._touchListener);
      }

      // Handle Click
      $link._hoverListener = () => handlePreload();
      $link._touchListener = () => handlePreload();
      $link._clickListener = (event) => {
        event.preventDefault();
        this.update(url, useCache);
      };
      
      // Preload
      if (preload === "instant") {
        handlePreload();
      }
      else if (preload === "hover") {
        // 1️⃣ Prefetch on hover (desktop)
        $link.addEventListener('mouseenter', $link._hoverListener);
  
        // 2️⃣ Prefetch on touch (móvil)
        $link.addEventListener('touchstart', $link._touchListener, { passive: true });
      }

      $link.addEventListener('click', $link._clickListener);
    });
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
    if (this.destroyed) {
      throw new Error("Swappit: No se puede usar preloadContents() en una instancia destruida.");
    }

    if (!Array.isArray(arrayUrls) || arrayUrls.length === 0) {
      this._logMessage(`preloadContents requiere un array de URLs no vacío`, 'warning');
      return;
    }

    const cleanArrayUrls = [...new Set(arrayUrls)];
    const results = await Promise.allSettled(cleanArrayUrls.map((url) => this._getContent(url)));
    const success = results.filter(result => result.status === "fulfilled").length;
    const failed = results.length - success;

    this._logMessage(`Precarga completada: ${success} exitosas, ${failed} fallidas`, 'success');
  }

  // Método para actualizar contenido de una URL específica
  async update(url, useCache = true) {
    if (this.destroyed) {
      throw new Error("Swappit: No se puede usar update() en una instancia destruida.");
    }

    const requestId = ++this.currentRequestId;
    this._emitCustomEvent("update:before", url);

    try {
      await this._getContent(url, useCache);

      if (this.options.updateUrl) {
        const state = { swappit: true };
  
        if (this.options.enableHistory) {
          window.history.pushState(state, "", url);
        } else {
          window.history.replaceState(state, "", url);
        }
      }
  
      if (requestId !== this.currentRequestId) {
        return;
      }

      if (this.destroyed) return;
  
      this._updateDOM(this.contentsCache[url]);
      this._logMessage(`Elementos actualizados del contenido de ${url}`, 'success');
      this._emitCustomEvent("update:after", url);
    } catch(error) {
      this._logMessage(error.message, "error");
      this._emitCustomEvent("update:error", url);
    }
  }

  reinit(options = {}) {
    if (this.destroyed) {
      throw new Error("Swappit: No se puede reiniciar una instancia destruida.");
    }

    this.options = {
      ...this.options,
      ...options
    };
    this._handleHistoryUpdate();
    this._observeDOM();
    this._logMessage(`Reinicio completado`, 'success');
    this._emitCustomEvent("reinit");
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.options = {
      log: false,
      updateUrl: false,
      enableHistory: false,
      preload: false
    };
    this.contentsCache = {};
    this.currentRequestId++
    this.pendingRequests.clear();

    if (this.historyUpdate) {
      window.removeEventListener("popstate", this.historyUpdate);
      this.historyUpdate = null;
    }

    if (this.observerLinks) {
      this.observerLinks.disconnect();
      this.observerLinks = null;
    }

    const $links = document.querySelectorAll(`a[data-swappit-handle="${this.handle}"]`);
    $links.forEach(($link) => {
      if ($link._clickListener) {
        $link.removeEventListener('click', $link._clickListener);
      }
      if ($link._hoverListener) {
        $link.removeEventListener('mouseenter', $link._hoverListener);
      }
      if ($link._touchListener) {
        $link.removeEventListener('touchstart', $link._touchListener);
      }
    });

    if (window.__swappitNavigationController === this) {
      delete window.__swappitNavigationController;
    }

    this._emitCustomEvent("destroy");
    Swappit.instances.delete(this.handle);
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
      const separator = oldScript.src.includes("?") ? "&" : "?";
      newScript.src = `${oldScript.src}${separator}timestamp=${Date.now()}`;
      oldScript.replaceWith(newScript);
    });
  }
}

// Exportar para entornos de navegador
window.Swappit = Swappit;
