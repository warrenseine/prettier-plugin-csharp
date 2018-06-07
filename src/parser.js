"use strict";

const antlr4 = require("antlr4");
const CSharpLexer = require("../asset/csharp/CSharpLexer");
const CSharpParser = require("../asset/csharp/CSharpParser");
const fs = require("fs");

function parseCSharp(text) {
  let chars = new antlr4.InputStream(text);
  let lexer = new CSharpLexer.CSharpLexer(chars);
  let tokens = new antlr4.CommonTokenStream(lexer);
  let parser = new CSharpParser.CSharpParser(tokens);
  return parser.compilation_unit();
}

function loc(prop) {
  return function(node) {
    return node.loc && node.loc[prop] && node.loc[prop].offset;
  };
}

module.exports = {
  parse: parseCSharp,
  astFormat: "cs",
  locStart: loc("start"),
  locEnd: loc("end")
};
