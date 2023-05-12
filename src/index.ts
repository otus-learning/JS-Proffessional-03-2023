if (process.argv.length < 3) {
  console.log(
    "You must to pass the path for the first parameter (usage: tree -- path)"
  );
} else {
  const path = process.argv[2];
  const tree = require("./tree");
  tree.getPath(path).then((rslt: typeof tree.rslt) => {
    (rslt.files.length || rslt.dirs.length) && console.log(rslt);
  });
}
