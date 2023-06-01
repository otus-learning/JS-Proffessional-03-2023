import { bigFileSorting, createRndFile, checkSorted } from "./sort";

const RD_STREAM_CAPACITY = 2;
const RND_ARRAY_SIZE = 64;
const MAX_RAM_SIZE = [8, 16, 32];
const SRC_FILE_NAME = "./rnd";
const DST_FILE_NAME = "./sorted";

const createWriteStreamArgs: Record<string, unknown[]> = {};
let createWriteStreamArgsIdx = 0;
let wrStreamArgs: Record<string, unknown[]> = {};
let wrStreamArgsIdx = 0;
let wrStreamsToRdStreamsIdx = 0;

let createReadStreamArgs: Record<string, unknown[]> = {};
let createReadStreamArgsIdx = 0;
let rdStreamArgs: Record<string, unknown[]> = {};
let rdStreamArgsIdx = 0;

const fs = require("node:fs");

jest.mock("node:fs");

jest.spyOn(fs, "createWriteStream").mockImplementation((...args: unknown[]) => {
  createWriteStreamArgs[createWriteStreamArgsIdx.toString()] = args;
  createWriteStreamArgsIdx++;

  let onFinishListener: (() => void) | null = null;

  return {
    write: (...args: unknown[]) => {
      wrStreamArgs[wrStreamArgsIdx.toString()] = args;
      wrStreamArgsIdx++;

      onFinishListener && (onFinishListener as () => void)();
    },
    end: () => {},
    on: (...args: unknown[]) => {
      args[0] === "finish" && (onFinishListener = args[1] as () => void);
    },
  };
});

jest.spyOn(fs, "createReadStream").mockImplementation((...args: unknown[]) => {
  createReadStreamArgs[createReadStreamArgsIdx.toString()] = args;
  createReadStreamArgsIdx++;

  const srcFileArray = wrStreamArgs[
    wrStreamsToRdStreamsIdx.toString()
  ][0] as Uint8Array;
  wrStreamsToRdStreamsIdx++;

  let onEndListener: (() => void) | null = null;
  // eslint-disable-next-line no-unused-vars
  let onDataListener: ((data: number[]) => void) | null = null;

  let idx = 0;
  const readFunc = () => {
    idx >= srcFileArray.length
      ? (onEndListener as () => void)()
      : // eslint-disable-next-line no-unused-vars
        (onDataListener as (data: number[]) => void)([
          ...srcFileArray.slice(idx, (idx += RD_STREAM_CAPACITY)),
        ]);
  };

  const streamObj = {
    on: (...args: unknown[]) => {
      rdStreamArgs[rdStreamArgsIdx.toString()] = args;
      rdStreamArgsIdx++;

      if ((args[0] as string) === "end") {
        onEndListener = args[1] as () => void;
      } else {
        if (createReadStreamArgsIdx !== 1) {
          // eslint-disable-next-line no-unused-vars
          onDataListener = args[1] as (data: number[]) => void;
          readFunc();
        } else {
          for (let i = 0; i < srcFileArray.length; i++) {
            // eslint-disable-next-line no-unused-vars
            (args[1] as (data: number[]) => void)([srcFileArray[i]]);
          }
          (onEndListener as () => void)();
        }
      }
      return streamObj;
    },
    pause: () => {},
    resume: () => {
      onDataListener && readFunc();
    },
  };

  return streamObj;
});

describe("Test generation of random numbers files", () => {
  it("tests that file for the operation is generated right and it is trully unsorted", async () => {
    await createRndFile(RND_ARRAY_SIZE, SRC_FILE_NAME);
    expect(createWriteStreamArgs["0"][0]).toEqual(SRC_FILE_NAME);
    expect(wrStreamArgs["0"][0]).toEqual(expect.any(Uint8Array));
    expect(wrStreamArgs["0"][0]).toHaveLength(RND_ARRAY_SIZE);
    expect(wrStreamArgs["0"][1]).toEqual("utf8");

    let rslt = false;
    const length = (wrStreamArgs["0"][0] as Uint8Array).length;

    for (let i = 1; i < length; i++) {
      (wrStreamArgs["0"][0] as Uint8Array)[i - 1] >
        (wrStreamArgs["0"][0] as Uint8Array)[i] && (rslt = true);
    }

    expect(rslt).toEqual(true);
  });
});

describe("File sorting test", () => {
  const test = async (ramSize: number) => {
    await bigFileSorting(ramSize, SRC_FILE_NAME, DST_FILE_NAME);
    expect(createReadStreamArgs["0"][0]).toEqual(SRC_FILE_NAME);
    expect(
      createWriteStreamArgs[(createWriteStreamArgsIdx - 1).toString()][0]
    ).toEqual(DST_FILE_NAME);

    let rslt: number[] = [];
    for (let i = 1; i < createWriteStreamArgsIdx; i++) {
      const idx = i.toString();
      if (createWriteStreamArgs[idx].length === 1) {
        expect((createWriteStreamArgs[idx] as string[])[0]).toEqual(
          `${SRC_FILE_NAME}${i - 1}`
        );
      } else {
        rslt = [...rslt, ...(wrStreamArgs[idx][0] as number[])];
      }
    }
    const rnd = (wrStreamArgs["0"][0] as number[]).sort(
      (a: number, b: number) => {
        return a === b ? 0 : a < b ? -1 : 1;
      }
    );

    expect(rslt.length).toEqual(rnd.length);
    let equality = true;
    const l = rslt.length;
    for (let i = 0; i < l; i++) {
      if (rslt[i] !== rnd[i]) {
        equality = false;
        break;
      }
    }
    return equality;
  };
  // eslint-disable-next-line jest/expect-expect
  it("tests that big file is sorted right with insuffient memory (USED RAM = FILE_SIZE / 8)", async () => {
    test(MAX_RAM_SIZE[0]);
  });

  // eslint-disable-next-line jest/expect-expect
  it("tests that big file is sorted right with insuffient memory (USED RAM = FILE_SIZE / 4)", async () => {
    test(MAX_RAM_SIZE[1]);
  });

  // eslint-disable-next-line jest/expect-expect
  it("tests that big file is sorted right with insuffient memory (USED RAM = FILE_SIZE / 2)", async () => {
    test(MAX_RAM_SIZE[2]);
  });
});

describe("Test \"check sorted\" function", () => {
  it("tests that sort testing function is working all right", async () => {
    createWriteStreamArgsIdx = 0;
    wrStreamArgs = {};
    wrStreamArgsIdx = 0;
    wrStreamsToRdStreamsIdx = 0;

    await createRndFile(RND_ARRAY_SIZE, SRC_FILE_NAME);

    createReadStreamArgs = {};
    createReadStreamArgsIdx = 0;
    rdStreamArgs = {};
    rdStreamArgsIdx = 0;

    expect(await checkSorted(DST_FILE_NAME)).toEqual(false);
    expect(createReadStreamArgs["0"][0]).toEqual(DST_FILE_NAME);

    createWriteStreamArgsIdx = 0;
    wrStreamArgs = {};
    wrStreamArgsIdx = 0;
    wrStreamsToRdStreamsIdx = 0;

    await createRndFile(RND_ARRAY_SIZE, SRC_FILE_NAME);
    createReadStreamArgs = {};
    createReadStreamArgsIdx = 0;
    rdStreamArgs = {};
    rdStreamArgsIdx = 0;

    (wrStreamArgs["0"][0] as number[]).sort((a: number, b: number) => {
      return a === b ? 0 : a < b ? -1 : 1;
    });

    expect(await checkSorted(DST_FILE_NAME)).toEqual(true);
  });
});
