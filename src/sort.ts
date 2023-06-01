const fs = require("node:fs");

const generateRndData = (count: number) => {
  const rslt: number[] = [];
  for (let i = 0; i < count; i++) {
    rslt.push((Math.random() * 0xff) | 0);
  }
  return rslt;
};

export const createRndFile = (size: number, fName: string, dbg?: boolean) => {
  return new Promise<void>((resolve) => {
    const wrStream = fs.createWriteStream(fName);
    wrStream.on("finish", () => {
      dbg && console.log("End of generation");
      resolve();
    });
    wrStream.write(new Uint8Array(generateRndData(size)), "utf8", () => {
      dbg && console.log("Generate ", wrStream.bytesWritten, " bytes of data");
    });
    wrStream.end();
  });
};

export const bigFileSorting = (
  ramSize: number,
  fName: string,
  sortedName: string,
  dbg?: boolean
) => {
  return new Promise<void>((resolve) => {
    let arr: number[] = [];
    let idx = 0;

    const readStream = fs.createReadStream(fName);
    readStream
      .on("end", () => {
        dbg &&
          console.log(`Lets do ${idx} read streams for small sorted files!`);

        const rdStreams: ReturnType<typeof fs.createReadStream>[] = [];
        const lastValues: number[] = [];
        const lengths: number[] = [];

        arr = [];

        let endedCnt = 0;
        let pausedCnt = 0;

        const sortBigBySmallParts = () => {
          let min = 0xffffffff;
          let minIdx = -1;

          for (let k = 0; k < idx; k++) {
            if (lengths[k] && lastValues[k] < min) {
              minIdx = k;
              min = lastValues[k];
            }
          }

          dbg && console.log(`Now the last elements array is [${lastValues}]`);
          dbg &&
            console.log(
              `Find that minimum last element is in ${minIdx} stream and this element is ${min}`
            );

          arr.sort((a: number, b: number) => {
            return a === b ? 0 : a < b ? -1 : 1;
          });

          const writedArr = arr.slice(0, lengths[minIdx]);
          arr = arr.slice(lengths[minIdx]);

          const wrStream = fs.createWriteStream(sortedName, { flags: "a" });
          wrStream.on("finish", () => {
            dbg && console.log("Another sorted part writed to the result");
            pausedCnt--;
            dbg && console.log(`Do unpaused stream number ${minIdx}`);
            rdStreams[minIdx].resume();
          });
          wrStream.write(new Uint8Array(writedArr));
          wrStream.end();
        };

        for (let i = 0; i < idx; i++) {
          dbg && console.log(`Create stream number ${i}`);
          rdStreams[i] = fs.createReadStream(`${fName}${i}`);
          rdStreams[i]
            .on("end", () => {
              endedCnt++;
              dbg && console.log(`Read stream number ${i} is ended`);
              if (endedCnt === idx) {
                dbg && console.log("All streams are ended");
                resolve();
              } else {
                lastValues[i] = 0xffffffff;
                lengths[i] = 0;
                sortBigBySmallParts();
              }
            })
            .on("data", (data: number[]) => {
              lastValues[i] = data[data.length - 1];
              lengths[i] = data.length;
              dbg &&
                console.log(
                  `Find that last value of readed from stream ${i} data is ${lastValues[i]}`
                );
              arr = [...arr, ...data];
              rdStreams[i].pause();
              pausedCnt++;
              dbg && console.log(`Now stream number ${i} is paused`);
              pausedCnt === idx && sortBigBySmallParts();
            });
        }
      })
      .on("data", (data: number[]) => {
        arr = [...arr, ...data];
        if (arr.length === ramSize) {
          dbg &&
            console.log(
              "Another maximum for memory part of big unsorted file is readed now"
            );
          readStream.pause();

          const wrStream = fs.createWriteStream(`${fName}${idx}`);
          wrStream.on("finish", () => {
            dbg && console.log("Another small sorted file is writed now");
            readStream.resume();
          });
          wrStream.write(
            new Uint8Array(
              arr.sort((a: number, b: number) => {
                return a === b ? 0 : a < b ? -1 : 1;
              })
            )
          );
          wrStream.end();
          arr = [];
          idx++;
        }
      });
  });
};

export const checkSorted = (sortedName: string) => {
  let rslt = true;
  let startByte = 0;
  return new Promise((resolve) => {
    const readStream = fs.createReadStream(sortedName);
    readStream
      .on("end", () => {
        resolve(rslt);
      })
      .on("data", (data: number[]) => {
        if (!rslt) {
          return;
        }
        if (startByte > data[0]) {
          rslt = false;
          return;
        }
        const l = data.length;
        for (let i = 0; i < l - 1; i++) {
          if (data[i] > data[i + 1]) {
            rslt = false;
            break;
          }
        }
        startByte = data[l - 1];
      });
  });
};
