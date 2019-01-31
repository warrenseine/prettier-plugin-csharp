"use strict";

const parserAntlr = require("./parser-antlr");
const parserRoslyn = require("./parser-roslyn");
const printerAntlr = require("./printer-antlr");
const printerRoslyn = require("./printer-roslyn");

const languages = [
  {
    name: "C#",
    parsers: ["antlr", "roslyn"],
    tmScope: "source.cs",
    aceMode: "csharp",
    codemirrorMode: "clike",
    extensions: [".cs", ".cake", ".cshtml", ".csx"],
    vscodeLanguageIds: ["cs"],
    linguistLanguageId: 42
  }
];

const parsers = {
  antlr: parserAntlr,
  roslyn: parserRoslyn
};

const printers = {
  antlr: printerAntlr,
  roslyn: printerRoslyn
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
