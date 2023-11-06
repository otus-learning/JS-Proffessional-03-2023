import type { Tree } from "./types";

export class Parser {
  public static indent = 20;

  private static _border = false;

  public static get border(): boolean {
    return Parser._border;
  }

  public static set border(value: boolean) {
    Parser._border = value;
  }

  public static parseToHTML(level: number, tree: Tree[]): string {
    return tree.reduce(
      (rslt: string, el: Tree): string =>
        el
          ? (rslt += el.items
              ? `<my-branch lev=${level} name=${el.id} str=${JSON.stringify(
                  el.items
                )}><p>${level ? "Branch" : "Tree"} elem</p></my-branch>`
              : `<my-leaf name=${el.id}><p class="txt">Leaf elem</p></my-leaf>`)
          : "",
      ""
    );
  }
}
