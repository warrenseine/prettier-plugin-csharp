const prettier = require("prettier");
const fs = require("fs");

const referenceFile = "asset/csharp/examples/AllInOneNoPreprocessor.cs";
const formattedFile = "test/AllInOneNoPreprocessor.Formatted.cs";

const referenceCode = fs.readFileSync(referenceFile, "utf8");

const formattedCode = prettier.format(referenceCode, {
  parser: "cs",
  plugins: ["."]
});

fs.writeFileSync(formattedFile, formattedCode, "utf8");
