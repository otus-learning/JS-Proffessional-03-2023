//const FILE_SIZE = 1024 * 1024;
//const MEM_SIZE = 512 * 1024;
//const FILE_SIZE = 1024 * 1024;
//const MEM_SIZE = 128 * 1024;
//const FILE_SIZE = 10 * 1024 * 1024;
//const MEM_SIZE =  5 * 1024 * 1024;
//const FILE_SIZE = 100 * 1024 * 1024;
//const MEM_SIZE =  50 * 1024 * 1024;
let FILE_SIZE = 1024 * 1024;
let MEM_SIZE = 256 * 1024;
let DBG = false;
const FILE_NAME = "rnd";
const SORTED_NAME = "sorted";

const { bigFileSorting, createRndFile, checkSorted } = require("./sort");

import { argv } from "process";

if (argv.length < 3) {
  console.log("Usage: npm run sort [parameters]");
  console.log("Parameters: ");
  console.log("");
  console.log("FILE_SIZE=file size in bytes (two`s power)");
  console.log(
    "MEM_SIZE=memory size in bytes for operation (must be FILE_SIZE divided by (two`s power)"
  );
  console.log("DBG - write debug info for the sorting process");
  console.log("");
  console.log(
    "Example: npm run sort FILE_SIZE=1024*1024 MEM_SIZE=1024*512 DBG"
  );
  console.log("Example: npm run sort DBG");
  console.log(
    "_____________________________________________________________________________________________"
  );
  console.log("");
  console.log("Now you not passed any parameters and default values is used:");
  console.log(
    `FILE_SIZE=${FILE_SIZE} b, MEM_SIZE=${MEM_SIZE} b, debug info is off`
  );
  console.log(
    "_____________________________________________________________________________________________"
  );
} else {
  argv.forEach((arg: string) => {
    const arr = arg.split("=");
    if (arr.length > 1) {
      if (new RegExp("FILE_SIZE=*").test(arr[0])) {
        try {
          FILE_SIZE = eval(arr[1].trim());
        } catch (e) {
          console.log(
            "You pass wrong FILE_SIZE parameter, use default FILE_SIZE=1024*1024"
          );
        }
      } else if (new RegExp("MEM_SIZE=*").test(arr[0])) {
        try {
          MEM_SIZE = eval(arr[1].trim());
        } catch (e) {
          console.log(
            "You pass wrong MEM_SIZE parameter, use default MEM_SIZE=256*1024"
          );
        }
      }
    } else {
      arr[0].trim() === "DBG" && (DBG = true);
    }
  });
}

const fs = require("node:fs");

(async () => {
  try {
    fs.unlinkSync(SORTED_NAME);
    // eslint-disable-next-line no-empty
  } catch (e) {}
  await createRndFile(FILE_SIZE, FILE_NAME, DBG);
  console.log(`Big (${FILE_SIZE} bytes) unsorted file is generated now`);
  await bigFileSorting(MEM_SIZE, FILE_NAME, SORTED_NAME, DBG);

  fs.unlinkSync(FILE_NAME);
  for (let i = 0; i < FILE_SIZE / MEM_SIZE; i++) {
    fs.unlinkSync(`${FILE_NAME}${i}`);
  }

  console.log(
    (await checkSorted(SORTED_NAME))
      ? `And now this big file is really sorted with insuffient memory used (mem size is ${MEM_SIZE} bytes)`
      : "Error! Big file still unsorted :("
  );
})();
