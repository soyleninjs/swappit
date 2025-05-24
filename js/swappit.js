/**
 * To do:
 * Agregar actualizacion de scripts que esten dentro de un archivo externo
 * Agergar actualizacion de scripts dentro del tag <script>
 * Agregar configuracion para custom elements, el custom element sera el boton que tendra la url de la pagina que se va a cargar y precargara automaticamente, algo como:
 * <swappit-button data-url="/url-to-load" data-preload="true/false" data-always-load="true/false">contenido del boton...</swappit-button>
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

    // Configurar eventName usando el handle
    this.eventName = `${this.handle}::update`;
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

  async _getContent(url) {
    // Si no hay URL, no hace nada
    if (!url) {
      return;
    }

    if (!this.contentsCache[url]) {
      const request = await window.fetch(url);
      const html = await request.text();
      this.contentsCache[url] = new window.DOMParser().parseFromString(html, "text/html");
      this._logMessage(`Contenido precargado de ${url}`, 'success');
    }
  }

  async preloadContents(arrayUrls) {
    if (!Array.isArray(arrayUrls) || arrayUrls.length === 0) {
      this._logMessage(`preloadContents requiere un array de URLs no vacío`, 'warning');
      return;
    }

    await Promise.all(arrayUrls.map((url) => this._getContent(url)));
    this._logMessage(`Precarga completada para ${arrayUrls.length} URL(s)`, 'success');
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

        // Manejo de scripts
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

  // Método para actualizar contenido con una URL
  async update(url) {
    await this._getContent(url);
    this._updateElements(this.contentsCache[url]);
    this._logMessage(`Elementos actualizados del contenido de ${url}`, 'success');
    window.dispatchEvent(new window.Event(this.eventName));
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
