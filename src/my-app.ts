import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("my-app")
export class MyApp extends LitElement {
  private _reRender() {
    document.querySelectorAll("my-tree").forEach((el) => el.requestUpdate());
  }

  render() {
    return html` <slot @rerender=${this._reRender}></slot> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "my-app": MyApp;
  }
}
