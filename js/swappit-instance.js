class SwappitInstance extends HTMLElement {
  connectedCallback() {
    this.handle = this.dataset.handle;

    if (!this.handle) {
      console.error("SwappitInstance: El atributo data-handle es obligatorio.");
      return;
    }

    const log = this.hasAttribute("data-log");
    const updateUrl = this.hasAttribute("data-update-url");
    const enableHistory = this.hasAttribute("data-enable-history");
    this.loadFromCache = this.hasAttribute("data-load-from-cache");
    this.destroyAfterRemove = this.hasAttribute("data-destroy-after-remove");
    const preload = this.dataset.preload || false;

    if (Swappit.instances.has(this.handle)) {
      this.swappit = Swappit.instances.get(this.handle);

      this.swappit.reinit(log, {
        updateUrl,
        enableHistory,
        preload
      });
    } else {
      this.swappit = new Swappit(this.handle, log, {
        updateUrl,
        enableHistory,
        preload
      });
    }
  }

  disconnectedCallback() {
    if (this.destroyAfterRemove) {
      Swappit.instances.delete(this.handle);
    }
  }
}

if (!window.customElements.get("swappit-instance")) {
  window.customElements.define("swappit-instance", SwappitInstance);
}
