class SwappitButton extends HTMLElement {
  connectedCallback() {
    this.anchor = this.querySelector("a");

    if (!this.anchor || this.children.length > 1) {
      console.error("SwappitButton: Debe contener un único <a> como hijo.");
      return;
    }

    this.url = this.anchor.getAttribute("href");

    if (!this.url) {
      console.error("SwappitButton: El <a> dentro del componente debe tener un atributo href válido.");
      return;
    }

    // Validación: solo rutas relativas internas permitidas
    if (!this.url.startsWith("/") && !this.url.startsWith("./")) {
      console.error("SwappitButton: Solo se permiten rutas internas relativas (href debe empezar con '/' o './').");
      return;
    }

    this.handle = this.dataset.handle;

    if (!this.handle) {
      console.error("SwappitButton: El atributo data-handle es obligatorio.");
      return;
    }

    const log = this.dataset.log === "true";

    if (Swappit.instances.has(this.handle)) {
      this.swappit = Swappit.instances.get(this.handle);
      if (log) {
        this.swappit.log = true;
        this.swappit._logMessage("Log activado dinámicamente por <swappit-button>", "info");
      }
    } else {
      this.swappit = new Swappit(this.handle, log);
      if (log) {
        this.swappit._logMessage("Log activado dinámicamente por <swappit-button>", "info");
      }
    }

    const preload = this.hasAttribute("data-preload")
      ? this.dataset.preload === "true"
      : true;

    this.loadFromCache = this.hasAttribute("data-load-from-cache")
      ? this.dataset.loadFromCache === "true"
      : true;

    if (preload) {
      this.swappit.preloadContents([this.url]);
    }

    this.handleEvents();
  }

  handleEvents() {
    this._onClickHandler = (event) => {
      event.preventDefault();
      this.swappit.update(this.url, this.loadFromCache);
    };

    this.addEventListener("click", this._onClickHandler);
  }

  disconnectedCallback() {
    if (this._onClickHandler && this.anchor) {
      this.removeEventListener("click", this._onClickHandler);
    }
  }
}

if (!window.customElements.get("swappit-button")) {
  window.customElements.define("swappit-button", SwappitButton);
}
