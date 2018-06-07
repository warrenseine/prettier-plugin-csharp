"use strict";

const antlr4 = require("antlr4");
const CSharpLexer = require("../asset/csharp/CSharpLexer");
const CSharpParser = require("../asset/csharp/CSharpParser");
const _ = require("lodash");

function parseCSharp(text) {
  const chars = new antlr4.InputStream(text);
  const lexer = new CSharpLexer.CSharpLexer(chars);
  const tokens = new antlr4.CommonTokenStream(lexer);
  const parser = new CSharpParser.CSharpParser(tokens);
  const compilationUnit = parser.compilation_unit();
  const result = simplifyTree(compilationUnit);
  result.comments = tokens.tokens
    .filter(token => token.channel == CSharpLexer.CSharpLexer.COMMENTS_CHANNEL)
    .map(token => buildComment(token));
  return result;
}

function buildComment(token) {
  return {
    nodeType: "comment",
    start: token.start,
    end: token.stop,
    lineStart: token.line,
    lineEnd: token.line,
    value: token.text
  };
}

const nodeNameRegex = /Context$|NodeImpl$/;

function simplifyTree(node) {
  const nodeType = _.snakeCase(
    node.constructor.name.replace(nodeNameRegex, "")
  );

  if (!node.children) {
    if (node.symbol) {
      return {
        nodeType,
        start: node.symbol.start,
        end: node.symbol.stop,
        lineStart: node.symbol.line,
        lineEnd: node.symbol.line,
        value: node.symbol.text
      };
    }
  }

  const children = {};
  const orderedChildren = [];

  for (let child of node.children) {
    child = simplifyTree(child);
    if (!children[child.nodeType]) {
      children[child.nodeType] = [];
    }
    children[child.nodeType].push(child);
    orderedChildren.push(child);
  }

  return {
    ...children,
    children: orderedChildren,
    nodeType,
    start: node.start.start,
    end: node.stop.stop,
    lineStart: node.start.line,
    lineEnd: node.stop.line
  };
}

function loc(prop) {
  return function(node) {
    return node[prop];
  };
}

module.exports = {
  parse: parseCSharp,
  astFormat: "cs",
  locStart: loc("start"),
  locEnd: loc("end")
};
