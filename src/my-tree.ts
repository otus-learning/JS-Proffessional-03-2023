import type { Tree } from "./types";

import { LitElement, html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { customElement, property, queryAll } from "lit/decorators.js";
import { Parser } from "./Parser";

@customElement("my-tree")
export class MyTree extends LitElement {
  @property() str = "";

  @queryAll("my-branch") _childBranches!: LitElement[];
  @queryAll("my-leaf") _childLeafes!: LitElement[];

  private _tree: Tree | null = null;

  updated() {
    this._childBranches.length &&
      this._childBranches.forEach(
        (el) => el.requestUpdate && el.requestUpdate()
      );
    this._childLeafes.length &&
      this._childLeafes.forEach((el) => el.requestUpdate && el.requestUpdate());
  }

  render() {
    try {
      this._tree = JSON.parse(this.str);
    } catch (e) {
      this._tree = null;
    }
    return html`<div
      style="border:${Parser.border ? "red 1px solid;" : "none"}"
      class="tree"
    >
      ${this._tree && unsafeHTML(Parser.parseToHTML(0, [this._tree]))}
    </div>`;
  }

  static styles = css`
    .tree {
      padding: 3px;
      margin: 10px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-tree": MyTree;
  }
}
