"use strict";

const docBuilders = require("prettier").doc.builders;
const concat = docBuilders.concat;
const join = docBuilders.join;
const hardline = docBuilders.hardline;
const line = docBuilders.line;
const softline = docBuilders.softline;
const group = docBuilders.group;
const indent = docBuilders.indent;
const doublehardline = concat([hardline, hardline]);

const alphanumerical = require("is-alphanumerical");
const _ = require("lodash");

function printCompilationUnit(node) {
  return group("Hello");
}

function printNode(node) {
  if (!node || node.parentCtx === undefined) {
    throw new Error(`Not a node: ${node}`);
  }

  // console.log(node.constructor.name);
  switch (node.constructor.name) {
    case "Compilation_unitContext":
      return printCompilationUnit(node);
    default:
      console.error("Unknown C# node:", node.constructor.name);
      return `{${node.constructor.name}}`;
  }
}

function genericPrint(path, options, print) {
  const node = path.getValue();
  // Not using `path.call(print, "foo")` to recurse because all child nodes
  // are under the `children` array property.
  const result = printNode(node);
  return result;
}

module.exports = genericPrint;
