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
    const preloadValues = ["hover", "instant"];
    const preload = preloadValues.includes(this.dataset.preload) ? this.dataset.preload : false;

    if (!updateUrl && enableHistory) {
      console.warn(`SwappitInstance [${this.handle}]: data-enable-history requiere data-update-url.`);
    }

    if (Swappit.instances.has(this.handle)) {
      this.swappit = Swappit.instances.get(this.handle);

      this.swappit.reinit({
        log,
        updateUrl,
        enableHistory,
        preload
      });
    } else {
      this.swappit = new Swappit(this.handle, {
        log,
        updateUrl,
        enableHistory,
        preload
      });
    }
  }
}

if (!window.customElements.get("swappit-instance")) {
  window.customElements.define("swappit-instance", SwappitInstance);
}
