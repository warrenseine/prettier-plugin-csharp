const prettier = require("prettier");
const fs = require("fs");

if (process.argc < 3) {
  throw new Error("Missing file to format");
}

const file = process.argv[2];

const referenceCode = fs.readFileSync(file, "utf8");

const formattedCode = prettier.format(referenceCode, {
  parser: "cs",
  plugins: ["."],
  printWidth: 120
});

fs.writeFileSync(file, formattedCode, "utf8");
