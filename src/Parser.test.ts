import { Parser } from "./Parser";

const rslt =
  "<my-leaf name=3><p class=\"txt\">Leaf elem</p></my-leaf><my-branch lev=4 name=2 str=[{\"id\":\"1\"}]><p>Branch elem</p></my-branch>";

describe("Test Parser class", () => {
  it("Check that setter/getter is working fine", () => {
    expect(Parser).toBeDefined();
    expect(Parser.border).toEqual(false);
    Parser.border = true;
    expect(Parser.border).toEqual(true);
  });

  it("Check that Tree obj is parsing fine to html", () => {
    expect(
      Parser.parseToHTML(4, [{ id: "3" }, { id: "2", items: [{ id: "1" }] }])
    ).toEqual(rslt);
  });
});
