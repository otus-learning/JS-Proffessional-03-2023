import type { Tree } from "./types";

import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { customElement, property, queryAll } from "lit/decorators.js";
import { Parser } from "./Parser";

@customElement("my-branch")
export class MyBranch extends LitElement {
  @property() name = "";
  @property() str = "";
  @property({ type: Number }) lev = 0;

  @queryAll("my-branch") _childBranches!: LitElement[];
  @queryAll("my-leaf") _childLeafes!: LitElement[];

  private _branch!: Tree[];

  private _onClick() {
    alert(`I am a #${this.name} ${this.lev ? "branch" : "tree"}!`);
  }

  updated() {
    this._childBranches.length &&
      this._childBranches.forEach(
        (el) => el.requestUpdate && el.requestUpdate()
      );
    this._childLeafes.length &&
      this._childLeafes.forEach((el) => el.requestUpdate && el.requestUpdate());
  }

  render() {
    this._branch = JSON.parse(this.str);
    return html`
      <div
        class="branch"
        style="padding-left: ${this.lev *
        Parser.indent}px; border: ${Parser.border
          ? "green 1px solid;"
          : "none"};"
      >
        <slot></slot>
        <button @click=${this._onClick} class="name">&nbsp#${this.name}</button
        ><br />
        ${this._branch &&
        unsafeHTML(Parser.parseToHTML(this.lev + 1, this._branch))}
      </div>
    `;
  }

  static styles = css`
    ::slotted(p) {
      display: inline-block;
      font-size: 1rem;
      margin: 0px;
      font-weight: 700;
    }
    .branch {
      display: block;
      padding: 10px;
      margin: 1px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-branch": MyBranch;
  }
}
