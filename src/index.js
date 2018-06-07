"use strict";

const parser = require("./parser");
const printer = require("./printer");

const languages = [
  {
    name: "C#",
    parsers: ["cs"],
    tmScope: "source.cs",
    aceMode: "csharp",
    codemirrorMode: "clike",
    extensions: [".cs", ".cake", ".cshtml", ".csx"],
    vscodeLanguageIds: ["cs"],
    linguistLanguageId: 42
  }
];

const parsers = {
  cs: parser
};

const printers = {
  cs: printer
};

const options = {};

module.exports = {
  languages,
  printers,
  parsers,
  options,
  defaultOptions: {
    tabWidth: 4
  }
};
