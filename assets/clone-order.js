// Shared ZIP check for the local service area, used by the product form and the local service page.
window.DigiLocalZip = window.DigiLocalZip || {
  // "900-918, 920" -> [[900, 918], [920, 920]]
  parse(prefixes) {
    return (prefixes || '')
      .split(/[\s,]+/)
      .filter(Boolean)
      .map((part) => {
        const [from, to] = part.split('-').map((n) => parseInt(n, 10));
        return [from, Number.isNaN(to) ? from : to];
      })
      .filter(([from, to]) => !Number.isNaN(from) && !Number.isNaN(to));
  },
  isServed(zip, prefixes) {
    if (!/^\d{5}$/.test(zip)) return null;
    const zip3 = parseInt(zip.slice(0, 3), 10);
    return this.parse(prefixes).some(([from, to]) => zip3 >= from && zip3 <= to);
  },
};

if (!customElements.get('clone-order-fields')) {
  customElements.define(
    'clone-order-fields',
    class CloneOrderFields extends HTMLElement {
      connectedCallback() {
        this.photo = this.querySelector('input[type="file"]');
        this.serial = this.querySelector('input[name="properties[Serial number]"]');
        this.zip = this.querySelector('input[name="properties[Service ZIP]"]');
        this.zipResult = this.querySelector('[data-zip-result]');
        this.maxBytes = (parseFloat(this.dataset.maxPhotoMb) || 20) * 1024 * 1024;

        this.querySelectorAll('input[name="properties[Copy method]"]').forEach((radio) =>
          radio.addEventListener('change', () => this.updateRoute())
        );
        this.photo.addEventListener('change', () => this.checkPhoto());
        this.zip.addEventListener('input', () => this.checkZip());
        this.updateRoute();
      }

      get route() {
        return this.querySelector('input[name="properties[Copy method]"]:checked')?.value;
      }

      // Only the chosen route's detail field is shown, required and submitted.
      updateRoute() {
        this.querySelectorAll('[data-route]').forEach((detail) => {
          const active = detail.dataset.route === this.route;
          detail.hidden = !active;
          detail.querySelectorAll('input').forEach((input) => {
            input.disabled = !active;
            input.required = active;
          });
        });
        this.checkZip();
      }

      checkPhoto() {
        const file = this.photo.files[0];
        let message = '';
        if (file && !file.type.startsWith('image/')) message = 'Please choose a photo (JPG, PNG or HEIC).';
        else if (file && file.size > this.maxBytes)
          message = `That photo is over ${this.dataset.maxPhotoMb} MB. Please choose a smaller one.`;
        this.photo.setCustomValidity(message);
        const error = this.querySelector('[data-error="photo"]');
        error.textContent = message;
        error.hidden = !message;
      }

      checkZip() {
        if (this.route !== 'Local visit') {
          this.zip.setCustomValidity('');
          return;
        }
        const served = window.DigiLocalZip.isServed(this.zip.value, this.dataset.zipPrefixes);
        let message = '';
        if (served === false) message = "Sorry, that ZIP is outside our local area. Choose serial number or mail-in instead.";
        this.zip.setCustomValidity(message);
        this.zipResult.textContent = served === true ? 'Good news, you are in our local service area.' : message;
      }
    }
  );
}
