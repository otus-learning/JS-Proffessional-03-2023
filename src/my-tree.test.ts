import { MyTree } from "./my-tree";
import { LitElement } from "lit";

describe("Test MyTree class", () => {
  it("Check that my-tree component do it's job fine", async () => {
    expect(MyTree).toBeDefined();
    const treeElem = window.document.createElement("my-tree") as LitElement;
    treeElem.setAttribute("str", "{\"id\":\"2\", \"items\":[{\"id\":\"3\"}]}");
    treeElem.setAttribute("lev", "2");
    window.document.body.appendChild(treeElem);
    await treeElem.updateComplete;
    expect(window.document.body.getElementsByTagName("my-tree").length).toEqual(
      1
    );
    expect(
      (
        window.document.body.getElementsByTagName("my-tree")[0]
          .shadowRoot as ShadowRoot
      ).innerHTML.match("Tree elem")
    ).not.toBeNull();
    expect(
      (
        window.document.body.getElementsByTagName("my-tree")[0]
          .shadowRoot as ShadowRoot
      ).querySelector(".tree")
    ).not.toBeNull();
    const b = (
      window.document.body.getElementsByTagName("my-tree")[0]
        .shadowRoot as ShadowRoot
    ).querySelectorAll("my-branch");
    expect(b.length).toEqual(1);
  });
});
