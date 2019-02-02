"use strict";

const antlr = require("./parser-antlr");
const printer = require("./printer-antlr");

const languages = [
  {
    name: "C#",
    parsers: ["antlr"],
    tmScope: "source.cs",
    aceMode: "csharp",
    codemirrorMode: "clike",
    extensions: [".cs", ".cake", ".cshtml", ".csx"],
    vscodeLanguageIds: ["cs"],
    linguistLanguageId: 42
  }
];

const parsers = {
  antlr
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
