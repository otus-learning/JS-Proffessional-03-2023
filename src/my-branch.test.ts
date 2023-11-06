import { MyBranch } from "./my-branch";
import { LitElement } from "lit";

const NAME = "branch_1";
const ERR_NAME = "branch_2";

describe("Test MyBranch class", () => {
  it("Check that my-branch component do it's job fine", async () => {
    expect(MyBranch).toBeDefined();
    const branchElem = window.document.createElement("my-branch") as LitElement;
    branchElem.setAttribute("name", NAME);
    branchElem.setAttribute(
      "str",
      "[{\"id\":\"1\"}, {\"id\":\"2\", \"items\":[{\"id\":\"3\"}]}, {\"id\":\"4\"}]"
    );
    branchElem.setAttribute("lev", "2");
    window.document.body.appendChild(branchElem);
    await branchElem.updateComplete;
    expect(
      window.document.body.getElementsByTagName("my-branch").length
    ).toEqual(1);
    const r = window.document.body.getElementsByTagName("my-branch")[0]
      .shadowRoot as ShadowRoot;
    expect(r.querySelectorAll("my-leaf").length).toEqual(2);
    const e = (
      window.document.body.getElementsByTagName("my-branch")[0]
        .shadowRoot as ShadowRoot
    ).querySelector(".branch") as Element;
    expect(e).not.toBeNull();
    expect((e.textContent as string).match(NAME)).not.toBeNull();
    expect((e.textContent as string).match(ERR_NAME)).toBeNull();
  });
});
