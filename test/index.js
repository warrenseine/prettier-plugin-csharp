const prettier = require("prettier");
const fs = require("fs");

const tests = ["AllInOneNoPreprocessor", "AllInOne"];

for (let test of tests) {
  const referenceFile = `asset/csharp/examples/${test}.cs`;
  const formattedFile = `test/${test}.Formatted.cs`;

  const referenceCode = fs.readFileSync(referenceFile, "utf8");

  const formattedCode = prettier.format(referenceCode, {
    parser: "cs",
    plugins: ["."]
  });

  fs.writeFileSync(formattedFile, formattedCode, "utf8");
}
