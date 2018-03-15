"use strict";

const parse = require("./parser");
const print = require("./printer");

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

const loc = function(prop) {
  return function(node) {
    return node.loc && node.loc[prop] && node.loc[prop].offset;
  };
};

const parsers = {
  cs: {
    parse,
    astFormat: "cs",
    locStart: loc("start"),
    locEnd: loc("end")
  }
};

const printers = {
  cs: {
    print
  }
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
