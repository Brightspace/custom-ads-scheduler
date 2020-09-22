import { LitElement, html } from 'lit-element';

class DeliveryMethod extends LitElement {
	render() {
		return html`
      <div>Hello from d2l-delivery-method!</div>
    `;
	}
}

customElements.define('d2l-delivery-method', DeliveryMethod);
