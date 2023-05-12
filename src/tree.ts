const fsPromises = require("node:fs/promises");
const path = require("path");

const rslt: Record<string, string[]> = {
  files: [],
  dirs: [],
};

export const dir2obj = async (dir: string): Promise<typeof rslt> => {
  try {
    const files = await fsPromises.readdir(dir, { withFileTypes: true });
    for (const file of files) {
      file.isFile() && rslt.files.push(String(path.resolve(dir, file.name)));
      file.isDirectory() &&
        rslt.dirs.push(file.name) &&
        (await dir2obj(path.resolve(dir, file.name)));
    }
  } catch (e) {
    console.log("You pass wrong first parameter, must be the correct path");
  }
  return rslt;
};

exports.getPath = dir2obj;
exports.rslt = rslt;
