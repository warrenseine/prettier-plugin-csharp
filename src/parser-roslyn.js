"use strict";

const _ = require("lodash");
const execFileSync = require("child_process").execFileSync;
const fs = require("fs");

function parseCSharp(text) {
  const output = execFileSync(
    "dotnet",
    [
      "vendor/csharp/AstExport/bin/Debug/netcoreapp2.1/AstExport.dll",
      "--formatting=indented"
    ],
    {
      encoding: "utf8",
      input: text
    }
  );

  fs.writeFileSync("vendor/csharp/AstExport/ast.json", output);

  const result = JSON.parse(output);

  augmentTree(result);

  return result;
}

function augmentTree(node) {
  if (!node.children) {
    return;
  }

  for (const child of node.children) {
    const childType = _.camelCase(child.nodeType);
    if (!node[childType]) {
      node[childType] = [];
    }
    node[childType].push(child);

    augmentTree(child);
  }
}

function loc(prop) {
  return function(node) {
    return node[prop];
  };
}

module.exports = {
  parse: parseCSharp,
  astFormat: "roslyn",
  locStart: loc("start"),
  locEnd: loc("end")
};
