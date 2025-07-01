/**
 * To do:
 * - atributos aria para accesibilidad
 * - añadir configuracion para reiniciar scripts desde src e inline
 * - arreglar mensaje de exito al precargar urls
 * - Fix documentacion homepage sobre los eventos
 */

class Swappit {
  // Registro estático para almacenar los handles en uso
  static instances = new Map();

  constructor(handle, log = false) {
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

    // Registrar esta instancia con su handle
    Swappit.instances.set(this.handle, this);
    this.contentsCache = {};

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

  _handleCustomEvent(name) {
    const nameEvent = `swappit:${this.handle}:${name}`;
    window.dispatchEvent(new window.Event(nameEvent));
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

  _updateElements(html) {
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

  // Métodos públicos
  async preloadContents(arrayUrls) {
    if (!Array.isArray(arrayUrls) || arrayUrls.length === 0) {
      this._logMessage(`preloadContents requiere un array de URLs no vacío`, 'warning');
      return;
    }

    await Promise.all(arrayUrls.map((url) => this._getContent(url)));
    this._logMessage(`Precarga completada para ${arrayUrls.length} URL(s)`, 'success');
  }

  // Método para actualizar contenido con una URL
  async update(url, loadFromCache = true) {
    this._handleCustomEvent("beforeUpdate");
    await this._getContent(url, loadFromCache);
    this._updateElements(this.contentsCache[url]);
    this._logMessage(`Elementos actualizados del contenido de ${url}`, 'success');
    this._handleCustomEvent("afterUpdate");
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
