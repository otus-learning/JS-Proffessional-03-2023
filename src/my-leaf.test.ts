import { MyLeaf } from "./my-leaf";
import { LitElement } from "lit";

const NAME = "leaf_1";
const ERR_NAME = "leaf_2";

describe("Test MyLeaf class", () => {
  it("Check that my-leaf component do it's job fine", async () => {
    expect(MyLeaf).toBeDefined();
    const leafElem = window.document.createElement("my-leaf") as LitElement;
    leafElem.setAttribute("name", NAME);
    window.document.body.appendChild(leafElem);
    await leafElem.updateComplete;
    const e = (
      window.document.body.getElementsByTagName("my-leaf")[0]
        .shadowRoot as ShadowRoot
    ).querySelector(".leaf") as Element;
    expect(e).not.toBeNull();
    expect((e.textContent as string).match(NAME)).not.toBeNull();
    expect((e.textContent as string).match(ERR_NAME)).toBeNull();
  });
});
