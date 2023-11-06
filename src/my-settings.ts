import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { Parser } from "./Parser";

@customElement("my-settings")
export class MySettings extends LitElement {
  private _onClick(e: Event) {
    if (e) {
      Parser.border = (e.currentTarget as HTMLInputElement).checked;
      this.dispatchEvent(
        new CustomEvent("rerender", { bubbles: true, composed: true })
      );
    }
  }

  render() {
    return html`<slot></slot><input @click=${this._onClick} class="settings" type="checkbox">Show borders</input><hr>`;
  }

  static styles = css`
    .settings {
      padding: 3px;
      margin: 10px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-settings": MySettings;
  }
}
