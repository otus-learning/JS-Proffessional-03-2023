const fs = require("node:fs/promises");
import { dir2obj } from "./tree";

const PATH = "/home/user";
const RSLT = {
  files: [
    "/home/user/dir1/file1",
    "/home/user/dir1/file2",
    "/home/user/dir2/file1",
    "/home/user/dir2/file2",
  ],
  dirs: ["dir1", "dir2"],
};

type ReadDirReturnValue = ReturnType<typeof fs.readdir>;

jest.spyOn(fs, "readdir").mockImplementation((...args: unknown[]) => {
  if (args[0] === "\\") {
    throw new Error("Bad path");
  }

  //mocking dirent struct
  return Promise.resolve(
    args[0] !== PATH
      ? [
          {
            name: "file1",
            isFile: () => true,
            isDirectory: () => false,
          },
          {
            name: "file2",
            isFile: () => true,
            isDirectory: () => false,
          },
        ]
      : [
          {
            name: "dir1",
            isFile: () => false,
            isDirectory: () => true,
          },
          {
            name: "dir2",
            isFile: () => false,
            isDirectory: () => true,
          },
        ]
  ) as unknown as ReadDirReturnValue;
});

console.log = jest.fn();

describe("Test our getPath function", () => {
  it("tests than function return need result", async () => {
    const rslt = await dir2obj(PATH);
    expect(rslt).toEqual(RSLT);
    expect(console.log).toHaveBeenCalledTimes(0);
  });

  it("tests than function catching error and write warning message for the wrong path", async () => {
    await dir2obj("\\");
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenLastCalledWith(
      "You pass wrong first parameter, must be the correct path"
    );
  });
});
