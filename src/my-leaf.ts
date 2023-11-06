import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Parser } from "./Parser";

@customElement("my-leaf")
export class MyLeaf extends LitElement {
  @property() name = "";

  private _onClick() {
    alert(`I am a #${this.name} leaf!`);
  }

  render() {
    return html`
      <div class="leaf">
        <slot></slot>
        <button
          style="border: ${Parser.border ? "blue 1px solid;" : "none"}"
          @click=${this._onClick}
          class="name"
        >
          #${this.name}
        </button>
      </div>
    `;
  }

  static styles = css`
    ::slotted(p) {
      display: inline-block;
      font-size: 1em;
      font-weigth: 700;
      padding: 1px;
      margin: 0px;
    }

    .leaf {
      margin: 1px;
      display: block;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-leaf": MyLeaf;
  }
}
