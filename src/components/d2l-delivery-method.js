import { html, LitElement } from 'lit-element';

class DeliveryMethod extends LitElement {
	render() {
		return html`
      <div>Hello from d2l-delivery-method!</div>
    `;
	}

	validate() {
		return true;
	}
}

customElements.define('d2l-delivery-method', DeliveryMethod);
