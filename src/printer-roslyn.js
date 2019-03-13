"use strict";

const docBuilders = require("prettier").doc.builders;
const util = require("prettier").util;
const concat = docBuilders.concat;
const join = docBuilders.join;
const hardline = docBuilders.hardline;
const line = docBuilders.line;
const softline = docBuilders.softline;
const trim = docBuilders.trim;
const group = docBuilders.group;
const conditionalGroup = docBuilders.conditionalGroup;
const indent = docBuilders.indent;
const dedentToRoot = docBuilders.dedentToRoot;
const doublehardline = concat([hardline, hardline]);
const empty = "";

const _ = require("lodash");

const nodePrinters = {
  AddExpression: printBinaryExpression,
  Attribute: printChildren,
  AttributeArgument: printChildren,
  AttributeArgumentList: printAttributeArgumentList,
  AttributeList: printAttributeList,
  AttributeTargetSpecifier: printIdentifierName,
  CompilationUnit: printCompilationUnit,
  ExternAliasDirective: printExternAliasDirective,
  GenericName: printGenericName,
  IdentifierName: printIdentifierName,
  NameEquals: printNameEquals,
  NamespaceDeclaration: printNamespaceDeclaration,
  ParenthesizedExpression: printParenthesizedExpression,
  PredefinedType: printPredefinedType,
  QualifiedName: printQualifiedName,
  UsingDirective: printUsingDirective,
  StringLiteralExpression: printLiteralExpression,
  SubtractExpression: printBinaryExpression,
  TypeArgumentList: printTypeArgumentList
};

function print(path, options, print) {
  const node = path.getValue();

  const printer = nodePrinters[node.nodeType] || printFallback;

  return printer(path, options, print);
}

function printCompilationUnit(path, options, print) {
  const node = path.getValue();
  const parts = [];

  const externAliasDirectives = [];
  const usingDirectives = [];
  const declarations = [];

  path.each(path => {
    const doc = print(path, options, print);
    const node = path.getValue();

    if (node.nodeType === "ExternAliasDirective") {
      externAliasDirectives.push(doc);
    } else if (node.nodeType === "UsingDirective") {
      usingDirectives.push([node, doc]);
    } else {
      declarations.push(doc);
    }
  }, "children");

  if (externAliasDirectives.length > 0) {
    parts.push(join(hardline, externAliasDirectives));
  }

  if (usingDirectives.length > 0) {
    // parts.push(printCompilationUnitUsingDirectives(path, options, print));
  }

  parts.push(...declarations);

  // if (node.attributeList) {
  //   parts.push(join(hardline, path.map(print, "attributeList")));
  // }

  // if (node.namespaceDeclaration) {
  //   parts.push(path.call(print, "namespaceDeclaration", 0));
  // }

  return concat([join(doublehardline, parts), hardline]);
}

function printCompilationUnitUsingDirectives(path, options, print) {
  const node = path.getValue();

  // Do not sort when preprocessor directives are present (think of using directives in #if blocks).
  if (_.some(node.usingDirective, hasPreprocessorDirectives)) {
    return join(hardline, path.map(print, "usingDirective"));
  }

  const collectIdentifiers = node =>
    node.identifier ||
    [node.identifierName, node.qualifiedName, node.genericName].reduce(
      (acc, cur) => (cur ? acc + cur.map(collectIdentifiers).join("") : acc),
      ""
    );

  const computeSortKeyAndPrint = path => {
    const node = path.getValue();

    // Build a sortable key: `using System.Math;` becomes `SystemMath`.
    const key = collectIdentifiers(node);

    const usingKind = node.staticKeyword ? 2 : node.nameEquals ? 1 : 0;
    const isSystem = key.startsWith("System") ? 0 : 1;

    return {
      usingKind,
      isSystem,
      key,
      docs: print(path, options, print)
    };
  };

  // Aggregate directives in sortable objects.
  const directives = path.map(computeSortKeyAndPrint, "usingDirective");

  // Sort them, them group them by using kind (namespace, alias, static).
  const directivesByUsingKind = _.groupBy(
    _.sortBy(directives, ["usingKind", "isSystem", "key"]),
    "usingKind"
  );

  // Project to an array of array of printed directives.
  const docs = Object.values(directivesByUsingKind).map(groupedDirectives =>
    groupedDirectives.map(({ docs }) => docs)
  );

  // Separate groups of directives with a blank line.
  return join(doublehardline, docs.map(docs => join(hardline, docs)));
}

function printExternAliasDirective(path, options, print) {
  const node = path.getValue();

  return group(
    concat([
      "extern",
      " ",
      "alias",
      indent(concat([line, node.identifier])),
      ";"
    ])
  );
}

function printIdentifierName(path, options, print) {
  const node = path.getValue();

  return node.identifier;
}

function printNameEquals(path, options, print) {
  const node = path.getValue();

  return path.call(
    print,
    node.qualifiedName ? "qualifiedName" : "identifierName",
    0
  );
}

function printQualifiedName(path, options, print) {
  return printDotList(path.map(print, "children"));
}

function printUsingDirective(path, options, print) {
  const node = path.getValue();

  const docs = ["using", " "];

  if (node.staticKeyword) {
    docs.push("static", " ");
  }

  const namePart = [];

  if (node.nameEquals) {
    namePart.push(path.call(print, "nameEquals", 0), " ", "=", " ");
  }

  if (node.qualifiedName) {
    namePart.push(path.call(print, "qualifiedName", 0));
  } else {
    namePart.push(path.call(print, "identifierName", 0));
  }

  docs.push(group(concat(namePart)), ";");

  return group(concat(docs));
}

function printGenericName(path, options, print) {
  const node = path.getValue();

  return group(
    concat([node.identifier, softline, path.call(print, "typeArgumentList", 0)])
  );
}

function printTypeArgumentList(path, options, print) {
  return group(
    concat([
      "<",
      indent(group(printCommaList(path.map(print, "children")))),
      softline,
      ">"
    ])
  );
}

function printPredefinedType(path, options, print) {
  return path.getValue().keyword;
}

function printArgumentList(path, options, print) {
  return printCommaList(path.map(print, "argument"));
}

function printArgument(path, options, print) {
  const node = path.getValue();
  const identifier = getAny(node, "identifier");
  const hasRef = node.children.find(child => isSymbol(child, "ref"));
  const hasOut = node.children.find(child => isSymbol(child, "out"));

  const docs = [];

  if (identifier) {
    docs.push(path.call(print, "identifier", 0), ":", " ");
  }

  if (hasRef) {
    docs.push("ref", " ");
  }

  if (hasOut) {
    docs.push("out", " ");
  }

  docs.push(path.call(print, "typed_argument", 0));

  return group(concat(docs));
}

function printTypedArgument(path, options, print) {
  const node = path.getValue();
  const type = getAny(node, "type");
  const hasVar = node.children.find(child => isSymbol(child, "var"));

  const docs = [];

  if (hasVar) {
    docs.push("var", " ");
  }

  if (type) {
    docs.push(path.call(print, type, 0), " ");
  }

  docs.push(path.call(print, "expression", 0));

  return group(concat(docs));
}

function printType(path, options, print) {
  return concat(path.map(print, "children"));
}

function printBaseType(path, options, print) {
  const node = path.getValue();
  const nonVoidType = getAny(node, ["simple_type", "class_type", "tuple_type"]);

  if (nonVoidType) {
    return path.call(print, nonVoidType, 0);
  }

  return concat(["void", "*"]);
}

function printSimpleType(path, options, print) {
  const node = path.getValue();

  for (const typeType of [
    "predefined_type",
    "simple_type",
    "numeric_type",
    "integral_type",
    "floating_point_type",
    "terminal"
  ]) {
    if (node[typeType]) {
      return path.call(print, typeType, 0);
    }
  }

  return "bool";
}

function printClassType(path, options, print) {
  return path.call(print, "children", 0);
}

function printTupleType(path, options, print) {
  return group(
    concat([
      "(",
      indent(
        concat([
          softline,
          printCommaList(path.map(print, "tuple_element_type"))
        ])
      ),
      softline,
      ")"
    ])
  );
}

function printTupleElementType(path, options, print) {
  const node = path.getValue();
  const identifier = getAny(node, "identifier");

  const docs = [path.call(print, "type", 0)];

  if (identifier) {
    docs.push(" ", path.call(print, "identifier", 0));
  }

  return concat(docs);
}

function printPointerType(path, options, print) {
  return concat(path.map(print, "children"));
}

function printArrayType(path, options, print) {
  return concat(path.map(print, "children"));
}

function printDotList(list) {
  return join(concat([".", softline]), list);
}

function printCommaList(list) {
  return join(concat([",", line]), list);
}

// function printGlobalAttributeSection(path, options, print) {
//   const globalAttributeTarget = path.call(print, "global_attribute_target", 0);
//   const attributeList = path.call(print, "attribute_list", 0);

//   return group(
//     concat([
//       "[",
//       indent(
//         concat([softline, globalAttributeTarget, ":", line, attributeList])
//       ),
//       softline,
//       "]"
//     ])
//   );
// }

function printAttributeList(path, options, print) {
  const node = path.getValue();

  const attributePart = [softline];

  if (node.attributeTargetSpecifier) {
    attributePart.push(
      path.call(print, "attributeTargetSpecifier", 0),
      ":",
      line
    );
  }

  attributePart.push(printCommaList(path.map(print, "attribute")));

  return group(concat(["[", indent(concat(attributePart)), softline, "]"]));
}

function printAttributeArgumentList(path, options, print) {
  const node = path.getValue();
  const docs = ["("];

  if (node.attributeArgument) {
    docs.push(
      indent(
        concat([softline, printCommaList(path.map(print, "attributeArgument"))])
      )
    );
  }

  docs.push(")");

  return group(concat(docs));
}

function printChildren(path, options, print) {
  return concat(path.map(print, "children"));
}

function printConditionalExpression(path, options, print) {
  const node = path.getValue();
  const nullCoalescingExpression = getAny(node, "null_coalescing_expression");
  const expression = getAny(node, "expression");

  if (!expression) {
    return path.call(print, nullCoalescingExpression, 0);
  }

  const expressions = path.map(print, "expression");

  return group(
    concat([
      path.call(print, nullCoalescingExpression, 0),
      indent(
        concat([
          line,
          concat(["?", " ", expressions[0]]),
          line,
          concat([":", " ", expressions[1]])
        ])
      )
    ])
  );
}

function printNullCoalescingExpression(path, options, print) {
  const node = path.getValue();
  const conditionalOrExpression = getAny(node, "conditional_or_expression");
  const nullCoalescingExpression = getAny(node, "null_coalescing_expression");

  if (!nullCoalescingExpression) {
    return path.call(print, conditionalOrExpression, 0);
  }

  return group(
    concat([
      path.call(print, conditionalOrExpression, 0),
      indent(
        concat([
          line,
          concat(["??", " ", path.call(print, nullCoalescingExpression, 0)])
        ])
      )
    ])
  );
}

function printBinaryExpression(path, options, print) {
  const node = path.getValue();

  return group(
    concat([
      group(concat([path.call(print, "children", 0), " ", node.operatorToken])),
      line,
      path.call(print, "children", 1)
    ])
  );
}

function printExpression(path, options, print) {
  return path.call(print, "children", 0);
}

function printPrimaryExpressionStart(path, options, print) {
  return path.call(print, "children", 0);
}

function printPrimaryExpression(path, options, print) {
  const parts = path.map(print, "children");

  // Partition over ".".
  const [headPart, ...tailParts] = parts.reduce(
    (groups, part) => {
      if (part === ".") {
        groups.push([]);
      }

      groups[groups.length - 1].push(part);

      return groups;
    },
    [[]]
  );

  if (tailParts.length === 0) {
    return group(concat(headPart));
  }

  return concat([
    group(concat(headPart)),
    indent(group(concat([softline, join(softline, tailParts.map(concat))])))
  ]);
}

function printUnaryExpression(path, options, print) {
  const node = path.getValue();
  const primaryExpression = getAny(node, "primary_expression");

  if (primaryExpression) {
    return path.call(print, primaryExpression, 0);
  }

  const type = getAny(node, "type");

  if (type) {
    return group(
      concat([
        "(",
        path.call(print, type, 0),
        ")",
        line,
        path.call(print, "unary_expression", 0)
      ])
    );
  }

  if (isSymbol(node.children[0], "await")) {
    return concat(["await", " ", path.call(print, "children", 1)]);
  }

  return concat(path.map(print, "children"));
}

function printPredefinedTypeExpression(path, options, print) {
  return path.call(print, "children", 0);
}

function printQualifiedAliasMemberExpression(path, options, print) {
  return path.call(print, "children", 0);
}

function printLiteralAccessExpression(path, options, print) {
  return path.call(print, "children", 0);
}

function printParenthesizedExpression(path, options, print) {
  return concat([
    "(",
    softline,
    path.call(print, "children", 0),
    softline,
    ")"
  ]);
}

function printTupleExpression(path, options, print) {
  return path.call(print, "children", 0);
}

function printSimpleNameExpression(path, options, print) {
  return path.call(print, "children", 0);
}

function printNamespaceMemberDeclarations(path, options, print) {
  const namespaceMemberDeclarations = path.map(
    print,
    "namespace_member_declaration"
  );

  return group(join(doublehardline, namespaceMemberDeclarations));
}

function printNamespaceMemberDeclaration(path, options, print) {
  const node = path.getValue();
  const namespace = getAny(node, ["namespace_declaration", "type_declaration"]);

  return group(path.call(print, namespace, 0));
}

function printNamespaceDeclaration(path, options, print) {
  const node = path.getValue();
  const [qualifiedName, ...children] = path.map(print, "children");

  return group(
    concat([
      group(concat(["namespace", " ", qualifiedName])),
      hardline,
      "{",
      indent(group(concat([hardline, join(doublehardline, children)]))),
      hardline,
      "}"
    ])
  );
}

function printBraceBody(path, options, print) {
  const node = path.getValue();
  const groupedDeclarations = getAny(node, [
    "class_member_declarations",
    "namespace_member_declarations"
  ]);

  const lineSeparatedDeclarations = getAll(node, [
    "interface_member_declaration",
    "struct_member_declaration"
  ]);

  const commaSeparatedDeclarations = getAll(node, "enum_member_declaration");
  const externAliasDirectives = getAny(node, "extern_alias_directives");
  const usingDirectives = getAny(node, "using_directives");

  const hasDeclarations =
    lineSeparatedDeclarations.length ||
    commaSeparatedDeclarations.length ||
    groupedDeclarations ||
    externAliasDirectives ||
    usingDirectives;

  if (!hasDeclarations) {
    return group(concat(["{", line, "}"]));
  }

  const declarationParts = [];

  if (externAliasDirectives) {
    declarationParts.push(path.call(print, externAliasDirectives, 0));
  }

  if (usingDirectives) {
    declarationParts.push(path.call(print, usingDirectives, 0));
  }

  if (groupedDeclarations) {
    declarationParts.push(path.call(print, groupedDeclarations, 0));
  }

  if (lineSeparatedDeclarations.length) {
    declarationParts.push(...path.map(print, lineSeparatedDeclarations));
  }

  if (commaSeparatedDeclarations.length) {
    declarationParts.push(
      printCommaList(path.map(print, commaSeparatedDeclarations))
    );
  }

  return group(
    concat([
      "{",
      indent(concat([hardline, join(doublehardline, declarationParts)])),
      hardline,
      "}"
    ])
  );
}

function printTypeDeclaration(path, options, print) {
  const node = path.getValue();
  const attributes = getAny(node, "attributes");
  const allMemberModifiers = getAny(node, "all_member_modifiers");
  const definition = getAny(node, [
    "class_definition",
    "struct_definition",
    "interface_definition",
    "enum_definition",
    "delegate_definition"
  ]);

  const docs = [];

  if (attributes) {
    docs.push(path.call(print, attributes, 0), hardline);
  }

  if (allMemberModifiers) {
    docs.push(
      group(
        concat([
          path.call(print, allMemberModifiers, 0),
          " ",
          path.call(print, definition, 0)
        ])
      )
    );
  } else {
    docs.push(path.call(print, definition, 0));
  }

  return group(concat(docs));
}

function printStructDefinition(path, options, print) {
  const node = path.getValue();
  const identifier = path.call(print, "identifier", 0);
  const base = getAny(node, ["class_base", "struct_interfaces", "enum_base"]);
  const body = getAny(node, ["class_body", "struct_body", "enum_body"]);
  const clauses = getAny(node, "type_parameter_constraints_clauses");
  const head = [path.call(print, "children", 0), line, identifier];

  if (base) {
    head.push(line, path.call(print, base, 0));
  }

  if (clauses) {
    head.push(
      indent(
        concat([
          line,
          path.call(print, "type_parameter_constraints_clauses", 0)
        ])
      )
    );
  }

  return group(concat([group(concat(head)), line, path.call(print, body, 0)]));
}

function printStructBase(path, options, print) {
  const node = path.getValue();
  const type = getAny(node, ["interface_type_list", "type", "class_type"]);
  const namespaceOrTypeNames = getAny(node, "namespace_or_type_name");

  const docs = [path.call(print, type, 0)];

  if (namespaceOrTypeNames) {
    docs.push(...path.map(print, namespaceOrTypeNames));
  }

  return group(concat([":", line, printCommaList(docs)]));
}

function printInterfaceTypeList(path, options, print) {
  return printCommaList(path.map(print, "namespace_or_type_name"));
}

function printClassOrStructMemberDeclarations(path, options, print) {
  return join(doublehardline, path.map(print, "children"));
}

function printClassOrStructMemberDeclaration(path, options, print) {
  const node = path.getValue();
  const attributes = getAny(node, "attributes");
  const allMemberModifiers = getAny(node, "all_member_modifiers");
  const commonMemberDeclaration = getAny(node, "common_member_declaration");
  const destructorDefinition = getAny(node, "destructor_definition");
  const type = getAny(node, "type");

  const attributesPart = [];
  const signaturePart = [];
  const bodyPart = [];

  if (attributes) {
    attributesPart.push(
      group(concat([path.call(print, "attributes", 0), hardline]))
    );
  }

  if (allMemberModifiers) {
    signaturePart.push(path.call(print, allMemberModifiers, 0), " ");
  }

  if (commonMemberDeclaration) {
    const declaration = getAny(node[commonMemberDeclaration][0], [
      "method_declaration",
      "typed_member_declaration"
    ]);

    if (declaration === "method_declaration") {
      // It's always void (otherwise it's a typed_member_declaration).
      signaturePart.push(
        "void",
        " ",
        path.call(
          () => printMethodDeclarationSignatureBase(path, options, print),
          commonMemberDeclaration,
          0,
          declaration,
          0
        ),
        path.call(
          () =>
            printMethodDeclarationSignatureConstraints(path, options, print),
          commonMemberDeclaration,
          0,
          declaration,
          0
        )
      );
      bodyPart.push(
        path.call(
          () => printMethodDeclarationBody(path, options, print),
          commonMemberDeclaration,
          0,
          declaration,
          0
        )
      );
    } else if (declaration === "typed_member_declaration") {
      signaturePart.push(
        path.call(
          () => printTypedMemberDeclarationSignature(path, options, print),
          commonMemberDeclaration,
          0,
          declaration,
          0
        )
      );
      bodyPart.push(
        path.call(
          () => printTypedMemberDeclarationBody(path, options, print),
          commonMemberDeclaration,
          0,
          declaration,
          0
        )
      );
    } else {
      signaturePart.push(path.call(print, commonMemberDeclaration, 0));
    }
  } else if (destructorDefinition) {
    signaturePart.push(path.call(print, destructorDefinition, 0));
  } else if (type) {
    signaturePart.push("fixed", line, path.call(print, type, 0));
    bodyPart.push(
      line,
      join(line, path.map(print, "fixed_size_buffer_declarator")),
      ";"
    );
  }

  return group(
    concat([
      group(concat(attributesPart)),
      group(concat(signaturePart)),
      group(concat(bodyPart))
    ])
  );
}

function printEnumMemberDeclaration(path, options, print) {
  const node = path.getValue();
  const attributes = getAny(node, "attributes");
  const expression = getAny(node, "expression");

  const docs = [];

  if (attributes) {
    docs.push(path.call(print, attributes, 0), hardline);
  }

  const declarationPart = [path.call(print, "identifier", 0)];

  if (expression) {
    declarationPart.push(
      indent(group(concat([line, "=", " ", path.call(print, expression, 0)])))
    );
  }

  docs.push(group(concat(declarationPart)));

  return group(concat(docs));
}

function printCommonMemberDeclaration(path, options, print) {
  const node = path.getValue();
  const conversionOperator = getAny(node, "conversion_operator_declarator");
  const methodDeclaration = getAny(node, "method_declaration");

  if (conversionOperator) {
    const body = getAny(node, "body");
    const expression = getAny(node, "expression");

    const docs = [path.call(print, conversionOperator, 0)];

    if (body) {
      docs.push(line, path.call(print, body, 0));
    } else {
      docs.push(
        indent(
          group(concat([line, "=>", " ", path.call(print, expression, 0), ";"]))
        )
      );
    }

    return group(concat(docs));
  } else if (methodDeclaration) {
    return group(concat(["void", " ", path.call(print, methodDeclaration, 0)]));
  } else {
    return join(line, path.map(print, "children"));
  }
}

function printMethodDeclarationSignatureBase(path, options, print) {
  const node = path.getValue();
  const methodMemberName = getAny(node, ["method_member_name", "identifier"]);
  const typeParameterList = getAny(node, "type_parameter_list");
  const formalParameterList = getAny(node, "formal_parameter_list");

  const signatureBasePart = [path.call(print, methodMemberName, 0)];

  if (typeParameterList) {
    signatureBasePart.push(path.call(print, typeParameterList, 0));
  }

  signatureBasePart.push("(");

  if (formalParameterList) {
    signatureBasePart.push(path.call(print, formalParameterList, 0));
  }

  signatureBasePart.push(")");

  return group(concat(signatureBasePart));
}

function printMethodDeclarationSignatureConstraints(path, options, print) {
  const node = path.getValue();
  const constructorInitializer = getAny(node, "constructor_initializer");
  const typeParameterConstraintsClauses = getAny(
    node,
    "type_parameter_constraints_clauses"
  );

  const docs = [];

  if (typeParameterConstraintsClauses) {
    docs.push(
      indent(
        group(
          concat([
            hardline,
            path.call(print, typeParameterConstraintsClauses, 0)
          ])
        )
      )
    );
  }

  if (constructorInitializer) {
    docs.push(" ", ":");
    docs.push(
      indent(
        group(concat([hardline, path.call(print, constructorInitializer, 0)]))
      )
    );
  }

  return group(concat(docs));
}

function printMethodDeclarationBody(path, options, print) {
  const node = path.getValue();
  const methodBody = getAny(node, ["method_body", "body"]);
  const expression = getAny(node, "expression");

  const docs = [];

  if (expression) {
    docs.push(
      " ",
      "=>",
      indent(group(concat([line, path.call(print, expression, 0), ";"])))
    );
  } else if (methodBody) {
    docs.push(path.call(print, methodBody, 0));
  }

  return group(concat(docs));
}

function printPropertyDeclarationBody(path, options, print) {
  const node = path.getValue();
  const docs = [];

  const accessorDeclarations = getAny(node, "accessor_declarations");

  if (accessorDeclarations) {
    const variableInitializer = getAny(node, "variable_initializer");

    docs.push(
      line,
      "{",
      indent(group(concat([line, path.call(print, accessorDeclarations, 0)]))),
      line,
      "}"
    );

    if (variableInitializer) {
      docs.push(
        " ",
        "=",
        indent(
          group(concat([line, path.call(print, variableInitializer, 0), ";"]))
        )
      );
    }
  } else {
    docs.push(printMethodDeclarationBody(path, options, print));
  }

  return group(concat(docs));
}

function printTypedMemberDeclarationSignature(path, options, print) {
  const node = path.getValue();
  const typeDocs = path.call(print, "type", 0);
  const declaration = getAny(node, [
    "namespace_or_type_name",
    "method_declaration",
    "property_declaration",
    "indexer_declaration",
    "operator_declaration",
    "field_declaration"
  ]);

  const docs = [];

  if (declaration === "property_declaration") {
    docs.push(
      typeDocs,
      line,
      path.call(print, declaration, 0, "member_name", 0)
    );
  } else if (declaration === "method_declaration") {
    docs.push(
      group(
        concat([
          typeDocs,
          line,
          path.call(
            () => printMethodDeclarationSignatureBase(path, options, print),
            declaration,
            0
          )
        ])
      ),
      path.call(
        () => printMethodDeclarationSignatureConstraints(path, options, print),
        declaration,
        0
      )
    );
  } else if (declaration === "indexer_declaration") {
    docs.push(
      typeDocs,
      line,
      path.call(
        () => printIndexerDeclarationSignature(path, options, print),
        declaration,
        0
      )
    );
  } else if (declaration === "operator_declaration") {
    docs.push(
      typeDocs,
      line,
      path.call(
        () => printOperatorDeclarationSignature(path, options, print),
        declaration,
        0
      )
    );
  } else {
    docs.push(typeDocs);
  }

  return group(concat(docs));
}

function printTypedMemberDeclarationBody(path, options, print) {
  const node = path.getValue();
  const declaration = getAny(node, [
    "namespace_or_type_name",
    "method_declaration",
    "property_declaration",
    "indexer_declaration",
    "operator_declaration",
    "field_declaration"
  ]);

  const docs = [];

  if (declaration === "property_declaration") {
    docs.push(
      path.call(
        () => printPropertyDeclarationBody(path, options, print),
        declaration,
        0
      )
    );
  } else if (declaration === "method_declaration") {
    docs.push(
      path.call(
        () => printMethodDeclarationBody(path, options, print),
        declaration,
        0
      )
    );
  } else if (declaration === "namespace_or_type_name") {
    const indexer = getAny(node, "indexer_declaration");

    docs.push(
      path.call(print, declaration, 0),
      ".",
      path.call(
        () => printIndexerDeclarationBody(path, options, print),
        indexer,
        0
      )
    );
  } else if (declaration === "indexer_declaration") {
    docs.push(
      path.call(
        () => printIndexerDeclarationBody(path, options, print),
        declaration,
        0
      )
    );
  } else if (declaration === "operator_declaration") {
    docs.push(
      path.call(
        () => printOperatorDeclarationBody(path, options, print),
        declaration,
        0
      )
    );
  } else {
    docs.push(indent(group(concat([line, path.call(print, declaration, 0)]))));
  }

  return group(concat(docs));
}

function printMethodDeclaration(path, options, print) {
  return concat([
    printMethodDeclarationSignatureBase(path, options, print),
    printMethodDeclarationSignatureConstraints(path, options, print),
    printMethodDeclarationBody(path, options, print)
  ]);
}

function printMethodInvocation(path, options, print) {
  const node = path.getValue();
  const argumentList = getAny(node, "argument_list");

  return group(
    concat([
      "(",
      argumentList ? path.call(print, argumentList, 0) : softline,
      ")"
    ])
  );
}

function printQualifiedAliasMember(path, options, print) {
  const node = path.getValue();
  const identifiers = path.map(print, "identifier");
  const typeArgumentList = getAny(node, "type_argument_list");

  const docs = [identifiers[0], "::", identifiers[1]];

  if (typeArgumentList) {
    docs.push(path.call(print, typeArgumentList, 0));
  }

  return group(concat(docs));
}

function printConversionOperatorDeclarator(path, options, print) {
  return group(
    concat([
      path.call(print, "children", 0),
      " ",
      "operator",
      " ",
      path.call(print, "type", 0),
      "(",
      indent(group(concat([softline, path.call(print, "arg_declaration", 0)]))),
      softline,
      ")"
    ])
  );
}

function printConstructorInitializer(path, options, print) {
  const node = path.getValue();

  const baseDocs = path.call(print, "children", 1); // base or this
  const argumentList = getAny(node, "argument_list");

  const docs = [baseDocs, "("];

  if (argumentList) {
    docs.push(
      indent(concat([softline, path.call(print, argumentList, 0)])),
      softline
    );
  }

  docs.push(")");

  return group(concat(docs));
}

function printAccessorModifier(path, options, print) {
  const resharperOrder = ["protected", "internal", "private"];

  const modifiers = path.map(print, "terminal");
  const orderedModifiers = _.intersection(resharperOrder, modifiers);

  return group(join(line, orderedModifiers));
}

function printAllMemberModifiers(path, options, print) {
  const resharperOrder = [
    "public",
    "protected",
    "internal",
    "private",
    "new",
    "abstract",
    "virtual",
    "override",
    "sealed",
    "static",
    "readonly",
    "extern",
    "unsafe",
    "volatile",
    "async",
    "partial"
  ];

  const modifiers = path.map(print, "all_member_modifier");
  const orderedModifiers = _.intersection(resharperOrder, modifiers);

  return group(join(line, orderedModifiers));
}

function printAllMemberModifier(path, options, print) {
  return path.call(print, "terminal", 0);
}

function printMemberName(path, options, print) {
  return path.call(print, "namespace_or_type_name", 0);
}

function printSimpleName(path, options, print) {
  const node = path.getValue();
  const typeArgumentList = getAny(node, "type_argument_list");

  const docs = [path.call(print, "identifier", 0)];

  if (typeArgumentList) {
    docs.push(softline, path.call(print, typeArgumentList, 0));
  }

  return group(concat(docs));
}

function printBody(path, options, print) {
  const node = path.getValue();
  const block = getAny(node, "block");

  if (block) {
    return concat([line, path.call(print, block, 0)]);
  }

  return ";";
}

function printBlock(path, options, print) {
  const node = path.getValue();
  const docs = [];

  docs.push("{");

  const statementList = getAny(node, "statement_list");

  if (statementList) {
    docs.push(indent(concat([hardline, path.call(print, statementList, 0)])));
  }

  docs.push(printDanglingComments(path, options));

  // FIXME: Decide whether we want a `hardline` or a `line` (which would inline empty blocks like `int F() { }`).
  docs.push(hardline, "}");

  return concat(docs);
}

function printFormalParameterList(path, options, print) {
  const node = path.getValue();
  const parameters = getAll(node, ["fixed_parameters", "parameter_array"]);

  return group(
    concat([
      indent(
        concat([
          softline,
          printCommaList(
            parameters.map(parameter => path.call(print, parameter, 0))
          )
        ])
      ),
      softline
    ])
  );
}

function printFixedParameters(path, options, print) {
  return printCommaList(path.map(print, "fixed_parameter"));
}

function printFixedParameter(path, options, print) {
  const node = path.getValue();
  const argDeclaration = getAny(node, "arg_declaration");

  if (!argDeclaration) {
    return "__arglist";
  }

  const attributes = getAny(node, "attributes");
  const parameterModifier = getAny(node, "parameter_modifier");

  const docs = [];

  if (attributes) {
    docs.push(path.call(print, attributes, 0));
  }

  if (parameterModifier) {
    docs.push(path.call(print, parameterModifier, 0));
  }

  docs.push(path.call(print, argDeclaration, 0));

  return group(join(line, docs));
}

function printFixedPointerDeclarators(path, options, print) {
  return printCommaList(path.map(print, "fixed_pointer_declarator"));
}

function printFixedPointerDeclarator(path, options, print) {
  return group(
    concat([
      path.call(print, "identifier", 0),
      line,
      "=",
      line,
      path.call(print, "fixed_pointer_initializer", 0)
    ])
  );
}

function printFixedPointerInitializer(path, options, print) {
  const node = path.getValue();
  const expression = getAny(node, "expression");

  if (expression) {
    if (isSymbol(node.children[0], "&")) {
      return group(concat(["&", path.call(print, expression, 0)]));
    } else {
      return path.call(print, expression, 0);
    }
  }

  return path.call(print, "local_variable_initializer_unsafe", 0);
}

function printFixedSizeBufferDeclarator(path, options, print) {
  return group(
    concat([
      path.call(print, "identifier", 0),
      "[",
      indent(concat([softline, path.call(print, "expression", 0)])),
      softline,
      "]"
    ])
  );
}

function printLocalVariableInitializerUnsafe(path, options, print) {
  return group(
    concat([
      "stackalloc",
      line,
      path.call(print, "type", 0),
      "[",
      indent(group(concat([softline, path.call(print, "expression", 0)]))),
      softline,
      "]"
    ])
  );
}

function printParameterArray(path, options, print) {
  const node = path.getValue();
  const attributes = getAny(node, "attributes");

  const docs = [];

  if (attributes) {
    docs.push(path.call(print, attributes, 0), line);
  }

  docs.push("params", line);
  docs.push(path.call(print, "array_type", 0), line);
  docs.push(path.call(print, "identifier", 0));

  return group(concat(docs));
}

function printArgDeclaration(path, options, print) {
  const node = path.getValue();
  const expression = getAny(node, "expression");

  const docs = [
    path.call(print, "type", 0),
    line,
    path.call(print, "identifier", 0)
  ];

  if (expression) {
    docs.push(
      group(
        concat([
          line,
          indent(concat(["=", line, path.call(print, expression, 0)]))
        ])
      )
    );
  }

  return group(concat(docs));
}

function printConstantDeclaration(path, options, print) {
  return group(
    concat([
      group(concat(["const", line, path.call(print, "type", 0)])),
      indent(concat([line, path.call(print, "constant_declarators", 0)])),
      ";"
    ])
  );
}

function printConstantDeclarators(path, options, print) {
  return printCommaList(path.map(print, "constant_declarator"));
}

function printConstantDeclarator(path, options, print) {
  return group(
    concat([
      path.call(print, "identifier", 0),
      line,
      "=",
      line,
      path.call(print, "expression", 0)
    ])
  );
}

function printInterfaceDefinition(path, options, print) {
  const node = path.getValue();
  const variantTypeParameterList = getAny(node, "variant_type_parameter_list");
  const interfaceBase = getAny(node, "interface_base");
  const typeParameterConstraintsClauses = getAny(
    node,
    "type_parameter_constraints_clauses"
  );

  const interfaceHead = ["interface", line, path.call(print, "identifier", 0)];

  if (variantTypeParameterList) {
    interfaceHead.push(softline, path.call(print, variantTypeParameterList, 0));
  }

  if (interfaceBase) {
    interfaceHead.push(line, path.call(print, interfaceBase, 0));
  }

  if (typeParameterConstraintsClauses) {
    interfaceHead.push(
      line,
      path.call(print, typeParameterConstraintsClauses, 0)
    );
  }

  return group(
    concat([
      group(concat(interfaceHead)),
      line,
      path.call(print, "interface_body", 0)
    ])
  );
}

function printInterfaceMemberDeclaration(path, options, print) {
  const node = path.getValue();
  const docs = [];

  const isNew = node.children.find(node => isSymbol(node, "new"));
  const isEvent = node.children.find(node => isSymbol(node, "event"));
  const isUnsafe = node.children.find(node => isSymbol(node, "unsafe"));
  const identifierDocs = path.call(print, "identifier", 0);
  const attributes = getAny(node, "attributes");
  const type = getAny(node, "type");
  const interfaceAccessors = getAny(node, "interface_accessors");
  const formalParameterList = getAny(node, "formal_parameter_list");

  if (attributes) {
    docs.push(path.call(print, attributes, 0), hardline);
  }

  const declarationPart = [];

  if (isNew) {
    declarationPart.push("new", " ");
  }

  if (isEvent) {
    declarationPart.push("event", " ");
    declarationPart.push(path.call(print, type, 0), line, identifierDocs, ";");
  } else {
    if (isUnsafe) {
      declarationPart.push("unsafe", " ");
    }

    if (interfaceAccessors) {
      declarationPart.push(path.call(print, type, 0), line);

      if (identifierDocs) {
        declarationPart.push(identifierDocs, line);
      } else if (formalParameterList) {
        declarationPart.push("this", "[");
        declarationPart.push(
          indent(concat([softline, path.call(print, formalParameterList, 0)]))
        );
        declarationPart.push("]", line);
      }

      declarationPart.push(
        group(
          concat([
            "{",
            indent(concat([line, path.call(print, interfaceAccessors, 0)])),
            line,
            "}"
          ])
        )
      );
    } else {
      const typeParameterList = getAny(node, "type_parameter_list");
      const typeParameterConstraintsClauses = getAny(
        node,
        "type_parameter_constraints_clauses"
      );

      declarationPart.push(type ? path.call(print, type, 0) : "void", line);

      declarationPart.push(identifierDocs);

      if (typeParameterList) {
        declarationPart.push(path.call(print, typeParameterList, 0));
      }

      declarationPart.push("(");

      if (formalParameterList) {
        declarationPart.push(
          indent(concat([softline, path.call(print, formalParameterList, 0)])),
          softline
        );
      }

      declarationPart.push(")");

      if (typeParameterConstraintsClauses) {
        declarationPart.push(
          indent(
            concat([line, path.call(print, typeParameterConstraintsClauses, 0)])
          )
        );
      }

      declarationPart.push(";");
    }
  }

  docs.push(group(concat(declarationPart)));

  return group(concat(docs));
}

function printTypeParameterList(path, options, print) {
  const node = path.getValue();
  const typeParameters = getAny(node, [
    "type_parameter",
    "variant_type_parameter"
  ]);

  return group(
    concat([
      "<",
      indent(group(printCommaList(path.map(print, typeParameters)))),
      ">"
    ])
  );
}

function printTypeParameter(path, options, print) {
  const node = path.getValue();

  const docs = [];

  const attributes = getAny(node, "attributes");

  if (attributes) {
    docs.push(path.call(print, attributes, 0), line);
  }

  const varianceAnnotation = getAny(node, "variance_annotation");

  if (varianceAnnotation) {
    docs.push(path.call(print, varianceAnnotation, 0), line);
  }

  const identifier = path.call(print, "identifier", 0);
  docs.push(identifier);

  return group(concat(docs));
}

function printVarianceAnnotation(path, options, print) {
  return path.call(print, "children", 0);
}

function printDelegateDefinition(path, options, print) {
  const node = path.getValue();
  const variantTypeParameterList = getAny(node, "variant_type_parameter_list");
  const typeParameterConstraintsClauses = getAny(
    node,
    "type_parameter_constraints_clauses"
  );
  const formalParameterList = getAny(node, "formal_parameter_list");

  return group(
    concat([
      group(concat(["delegate", line, path.call(print, "return_type", 0)])),
      indent(
        group(
          concat([
            line,
            group(
              concat([
                group(
                  concat([
                    path.call(print, "identifier", 0),
                    softline,
                    variantTypeParameterList
                      ? path.call(print, variantTypeParameterList, 0)
                      : softline,
                    softline,
                    "(",
                    formalParameterList
                      ? path.call(print, formalParameterList, 0)
                      : softline,
                    ")"
                  ])
                ),
                typeParameterConstraintsClauses
                  ? indent(
                      group(
                        concat([
                          line,
                          path.call(print, typeParameterConstraintsClauses, 0)
                        ])
                      )
                    )
                  : softline
              ])
            )
          ])
        )
      ),
      ";"
    ])
  );
}

function printReturnType(path, options, print) {
  return path.call(print, "children", 0);
}

function printTypeParameterConstraintsClauses(path, options, print) {
  return printCommaList(path.map(print, "type_parameter_constraints_clause"));
}

function printTypeParameterConstraintsClause(path, options, print) {
  return group(
    concat([
      "where",
      line,
      path.call(print, "identifier", 0),
      line,
      ":",
      line,
      path.call(print, "type_parameter_constraints", 0)
    ])
  );
}

function printTypeParameterConstraints(path, options, print) {
  const node = path.getValue();
  const constraints = getAll(node, [
    "primary_constraint",
    "secondary_constraints",
    "constructor_constraint"
  ]);

  return printCommaList(
    constraints.map(constraint => path.call(print, constraint, 0))
  );
}

function printConstructorConstraint() {
  return concat(["new", "(", ")"]);
}

function printPrimaryConstraint(path, options, print) {
  return path.call(print, "children", 0);
}

function printSecondaryConstraints(path, options, print) {
  return printCommaList(path.map(print, "namespace_or_type_name"));
}

function canAssignmentBreak(node) {
  const lambdaExpression = getDescendant(
    node,
    "expression.non_assignment_expression.lambda_expression"
  );

  if (lambdaExpression) {
    return false;
  }

  return true;
}

function printAssignment(path, options, print) {
  const left = path.call(print, "unary_expression", 0);
  const operator = path.call(print, "assignment_operator", 0);
  const right = path.call(print, "expression", 0);

  // FIXME: Refine logic so member expression chains or conditional expressions can break.
  const canBreak = canAssignmentBreak(path.getValue());

  return group(
    concat([
      group(concat([left, " ", operator])),
      canBreak ? group(indent(concat([line, right]))) : concat([" ", right])
    ])
  );
}

function printOperator(path, options, print) {
  return path.call(print, "children", 0);
}

function printRightOperator(path, options, print) {
  return concat(path.map(print, "children"));
}

function printFieldDeclaration(path, options, print) {
  return group(concat([path.call(print, "variable_declarators", 0), ";"]));
}

function printEventDeclaration(path, options, print) {
  const node = path.getValue();
  const variableDeclarators = getAny(node, "variable_declarators");

  const docs = ["event", " ", path.call(print, "type", 0)];

  if (variableDeclarators) {
    docs.push(
      indent(concat([line, path.call(print, "variable_declarators", 0), ";"]))
    );
  } else {
    docs.push(
      line,
      path.call(print, "member_name", 0),
      line,
      group(
        concat([
          "{",
          indent(
            concat([line, path.call(print, "event_accessor_declarations", 0)])
          ),
          line,
          "}"
        ])
      )
    );
  }

  return group(concat(docs));
}

function printAccessorDeclarations(path, options, print) {
  const node = path.getValue();
  const attributes = getAny(node, "attributes");
  const accessorModifier = getAny(node, "accessor_modifier");
  const accessorBody = getAny(node, ["accessor_body", "block"]);
  const accessorOperator = path.call(print, "terminal", 0);

  const docs = [];

  if (attributes) {
    docs.push(path.call(print, attributes, 0), line);
  }

  if (accessorModifier) {
    docs.push(path.call(print, accessorModifier, 0), line);
  }

  docs.push(accessorOperator);

  if (accessorBody == "block") {
    docs.push(line);
  }

  docs.push(path.call(print, accessorBody, 0));

  const counterAccessorDeclarations = {
    get: "set_accessor_declaration",
    set: "get_accessor_declaration",
    add: "remove_accessor_declaration",
    remove: "add_accessor_declaration"
  };

  if (counterAccessorDeclarations[accessorOperator]) {
    const counterAccessorDeclaration = getAny(
      node,
      counterAccessorDeclarations[accessorOperator]
    );

    if (counterAccessorDeclaration) {
      docs.push(line, path.call(print, counterAccessorDeclaration, 0));
    }
  }

  return group(concat(docs));
}

function printInterfaceAccessors(path, options, print) {
  const node = path.getValue();
  const attributes = getAny(node, "attributes")
    ? path.map(print, "attributes")
    : [];
  const firstAccessorAttributes =
    attributes.length >= 1 && isType(node.children[0], "attributes");
  const secondAccessorAttributes =
    (attributes.length == 1 && !firstAccessorAttributes) ||
    attributes.length == 2;
  const accessors = node["terminal"]
    .map(child => child.value)
    .filter(s => ["get", "set"].includes(s));
  const firstAccessor = accessors[0];
  const secondAccessor = accessors[1];

  const docs = [];

  const firstAccessorPart = [];

  if (firstAccessorAttributes) {
    firstAccessorPart.push(attributes[0], hardline);
  }

  firstAccessorPart.push(firstAccessor, ";");

  docs.push(group(concat(firstAccessorPart)));

  if (secondAccessor) {
    const secondAccessorPart = [];

    if (secondAccessorAttributes) {
      secondAccessorPart.push(attributes[1], hardline);
    }

    secondAccessorPart.push(secondAccessor, ";");

    docs.push(line, group(concat(secondAccessorPart)));
  }

  return group(concat(docs));
}

function printIndexerDeclarationSignature(path, options, print) {
  return group(
    concat([
      "this",
      softline,
      "[",
      indent(
        group(concat([softline, path.call(print, "formal_parameter_list", 0)]))
      ),
      softline,
      "]"
    ])
  );
}

function printIndexerDeclarationBody(path, options, print) {
  const node = path.getValue();
  const docs = [];

  const accessorDeclarations = getAny(node, "accessor_declarations");
  const expression = getAny(node, "expression");

  if (accessorDeclarations) {
    docs.push(
      group(
        concat([
          line,
          "{",
          indent(
            group(concat([hardline, path.call(print, accessorDeclarations, 0)]))
          ),
          hardline,
          "}"
        ])
      )
    );
  } else if (expression) {
    docs.push(
      " ",
      "=>",
      indent(group(concat([line, path.call(print, expression, 0)])))
    );
  }

  return group(concat(docs));
}

function printOperatorDeclarationSignature(path, options, print) {
  return group(
    concat([
      "operator",
      line,
      path.call(print, "overloadable_operator", 0),
      "(",
      indent(
        group(
          concat([softline, printCommaList(path.map(print, "arg_declaration"))])
        )
      ),
      softline,
      ")"
    ])
  );
}

function printOperatorDeclarationBody(path, options, print) {
  const node = path.getValue();
  const body = getAny(node, "body");

  if (body) {
    return path.call(print, body, 0);
  }

  return group(
    concat([
      " ",
      "=>",
      indent(group(concat([line, path.call(print, "expression", 0)])))
    ])
  );
}

function printStatementList(path, options, print) {
  const docs = [];

  let previousChild = null;

  path.each(path => {
    const child = path.getValue();

    if (previousChild) {
      if (child.lineStart - previousChild.lineEnd > 1) {
        docs.push(doublehardline);
      } else {
        docs.push(hardline);
      }
    }

    docs.push(print(path, options, print));

    previousChild = child;
  }, "children");

  return group(concat(docs));
}

function printLabeledStatement(path, options, print) {
  const node = path.getValue();

  const identifier = getAny(node, "identifier");

  if (!identifier) {
    return path.call(print, "children", 0);
  }

  const statement = getAny(node, [
    "labeled_statement",
    "declaration_statement",
    "embedded_statement"
  ]);

  return group(
    concat([
      path.call(print, identifier, 0),
      ":",
      group(concat([hardline, path.call(print, statement, 0)]))
    ])
  );
}

function printEmbeddedStatement(path, options, print) {
  return path.call(print, "children", 0);
}

function printExpressionStatement(path, options, print) {
  return group(concat([path.call(print, "expression", 0), ";"]));
}

function printEmptyStatement() {
  return empty;
}

function printDeclarationStatement(path, options, print) {
  const node = path.getValue();

  const identifier = getAny(node, "identifier");

  if (identifier) {
    return;
  }

  const declaration = getAny(node, [
    "local_variable_declaration",
    "local_constant_declaration"
  ]);
  const statement = getAny(node, ["labeled_statement", "embedded_statement"]);

  if (statement) {
    return path.call(print, statement, 0);
  }

  return concat([path.call(print, declaration, 0), ";"]);
}

function printVariableDeclarator(path, options, print) {
  const node = path.getValue();

  const initializer = getAny(node, [
    "local_variable_initializer",
    "variable_initializer"
  ]);

  const identifier = getAny(node, ["local_variable_identifier", "identifier"]);

  const docs = [path.call(print, identifier, 0)];

  if (initializer) {
    docs.push(" ", "=");

    const arrayInitializer = getDescendant(
      node[initializer][0],
      "array_initializer"
    );

    const initializerPart = [line, path.call(print, initializer, 0)];

    if (arrayInitializer) {
      docs.push(
        conditionalGroup([
          indent(group(concat(initializerPart))),
          group(concat(initializerPart))
        ])
      );
    } else {
      docs.push(indent(group(concat(initializerPart))));
    }
  }

  return group(concat(docs));
}

function printLocalVariableIdentifier(path, options, print) {
  const node = path.getValue();

  if (node.children.length === 1) {
    return path.call(print, "identifier", 0);
  }

  return group(
    concat([
      "(",
      indent(concat([softline, printCommaList(path.map(print, "identifier"))])),
      softline,
      ")"
    ])
  );
}

function printVariableDeclaration(path, options, print) {
  const node = path.getValue();
  const variableType = getAny(node, "local_variable_type");
  const variableDeclarators = getAll(node, [
    "local_variable_declarator",
    "variable_declarator"
  ]);

  const docs = [];

  if (variableType) {
    docs.push(path.call(print, variableType, 0), " ");
  }

  if (node[variableDeclarators].length == 1) {
    docs.push(path.call(print, variableDeclarators, 0));
  } else {
    docs.push(
      indent(
        group(
          concat([
            hardline,
            printCommaList(path.map(print, variableDeclarators))
          ])
        )
      )
    );
  }

  return group(concat(docs));
}

function printLocalConstantDeclaration(path, options, print) {
  return group(
    concat([
      group(concat(["const", " ", path.call(print, "type", 0)])),
      indent(concat([line, path.call(print, "constant_declarators", 0)]))
    ])
  );
}

function printLocalVariableType(path, options, print) {
  const node = path.getValue();
  const type = getAny(node, "type");

  if (type) {
    return path.call(print, "type", 0);
  }

  return "var";
}

function printVariableInitializer(path, options, print) {
  const node = path.getValue();
  const initializer = getAny(node, [
    "expression",
    "array_initializer",
    "local_variable_initializer_unsafe"
  ]);

  return path.call(print, initializer, 0);
}

function printSizeofExpression(path, options, print) {
  return group(
    concat([
      "sizeof",
      "(",
      concat([softline, indent(group(path.call(print, "type", 0)))]),
      softline,
      ")"
    ])
  );
}

function printNewExpression(path, options, print) {
  const node = path.getValue();

  const expressionPart = [];

  const child = node.children[1];

  if (isType(child, "type")) {
    const objectCreationExpression = getAny(node, "object_creation_expression");
    const objectOrCollectionInitializer = getAny(
      node,
      "object_or_collection_initializer"
    );

    expressionPart.push(path.call(print, "type", 0));

    if (objectCreationExpression) {
      const argumentList = getAny(
        node[objectCreationExpression][0],
        "argument_list"
      );
      const initializer = getAny(
        node[objectCreationExpression][0],
        "object_or_collection_initializer"
      );

      const argPart = [];

      argPart.push("(");

      if (argumentList) {
        argPart.push(
          indent(path.call(print, objectCreationExpression, 0, argumentList, 0))
        );
      }

      argPart.push(")");

      if (initializer) {
        argPart.push(
          line,
          path.call(print, objectCreationExpression, 0, initializer, 0)
        );
      }

      expressionPart.push(group(concat(argPart)));
    } else if (objectOrCollectionInitializer) {
      expressionPart.push(
        " ",
        path.call(print, objectOrCollectionInitializer, 0)
      );
    } else {
      const expressionList = getAny(node, "expression_list");
      const rankSpecifiers = getAny(node, "rank_specifier");
      const arrayInitializer = getAny(node, "array_initializer");

      if (expressionList) {
        expressionPart.push("[", path.call(print, expressionList, 0), "]");
      }

      if (rankSpecifiers) {
        expressionPart.push(concat(path.map(print, rankSpecifiers)));
      }

      if (arrayInitializer) {
        expressionPart.push(line, path.call(print, arrayInitializer, 0));
      }
    }
  } else if (isType(child, "anonymous_object_initializer")) {
    expressionPart.push(path.call(print, "anonymous_object_initializer", 0));
  } else if (isType(child, "rank_specifier")) {
    expressionPart.push(
      path.call(print, "rank_specifier", 0),
      line,
      path.call(print, "array_initializer", 0)
    );
  }

  return group(concat(["new", " ", concat(expressionPart)]));
}

function printBaseAccessExpression(path, options, print) {
  const node = path.getValue();
  const identifier = getAny(node, "identifier");
  const expressionList = getAny(node, "expression_list");

  const docs = ["base"];

  if (identifier) {
    docs.push(".");
    docs.push(path.call(print, "identifier", 0));

    const typeArgumentList = getAny(node, "type_argument_list");

    if (typeArgumentList) {
      docs.push(path.call(print, typeArgumentList, 0));
    }
  } else if (expressionList) {
    docs.push(
      "[",
      indent(concat([softline, path.call(print, expressionList, 0)])),
      softline,
      "]"
    );
  }

  return group(concat(docs));
}

function printLiteralExpression(path, options, print) {
  return path.getValue().token;
}

function printInterpolatedVerbatiumString(path, options, print) {
  return concat([
    '$@"',
    concat(path.map(print, "interpolated_verbatium_string_part")),
    '"'
  ]);
}

function printInterpolatedRegularString(path, options, print) {
  return group(
    concat([
      '$"',
      concat(path.map(print, "interpolated_regular_string_part")),
      '"'
    ])
  );
}

function printInterpolatedStringPart(path, options, print) {
  const node = path.getValue();
  const expression = getAny(node, "interpolated_string_expression");

  if (expression) {
    return group(
      concat([
        "{",
        indent(concat([softline, group(path.call(print, expression, 0))])),
        "}"
      ])
    );
  }

  return path.call(print, "children", 0);
}

function printInterpolatedStringExpression(path, options, print) {
  const docs = [];

  for (let doc of path.map(print, "children")) {
    docs.push(doc);
    if (doc == ",") {
      docs.push(" ");
    }
  }

  return group(concat(docs));
}

function printIsType(path, options, print) {
  const [baseType, ...rest] = path.map(print, "children");

  if (rest.length === 0) {
    return baseType;
  }

  return group(concat([baseType, " ", concat(rest)]));
}

function printIfStatement(path, options, print) {
  const node = path.getValue();
  const expression = path.call(print, "expression", 0);
  const ifBodies = path.map(print, "if_body");
  const hasElse = ifBodies.length > 1;
  const ifHasBraces = !!node["if_body"][0]["block"];
  const elseHasBraces = hasElse && !!node["if_body"][1]["block"];
  const hasElseIf = hasElse && !!node["if_body"][1]["if_statement"];

  const docs = [
    "if",
    " ",
    "(",
    group(concat([indent(group(concat([softline, expression]))), softline])),
    ")"
  ];

  if (ifHasBraces) {
    docs.push(hardline, ifBodies[0]);
  } else {
    docs.push(indent(group(concat([hasElse ? hardline : line, ifBodies[0]]))));
  }

  if (hasElse) {
    docs.push(hardline, "else");

    if (elseHasBraces || hasElseIf) {
      docs.push(hasElseIf ? " " : hardline, ifBodies[1]);
    } else {
      docs.push(indent(group(concat([hardline, ifBodies[1]]))));
    }
  }

  return group(concat(docs));
}

function printBreakingStatement(path, options, print) {
  const node = path.getValue();
  const expression = getAny(node, "expression");

  return group(
    concat([
      path.call(print, "terminal", 0),
      expression ? concat([" ", path.call(print, "expression", 0), ";"]) : ";"
    ])
  );
}

function printGotoStatement(path, options, print) {
  const node = path.getValue();
  const identifier = getAny(node, "identifier");
  const expression = getAny(node, "expression");

  const docs = ["goto"];

  if (identifier) {
    docs.push(indent(concat([line, path.call(print, "identifier", 0), ";"])));
  } else if (expression) {
    docs.push(
      indent(
        concat([line, "case", line, path.call(print, "expression", 0), ";"])
      )
    );
  } else {
    docs.push(" ", "default", ";");
  }

  return group(concat(docs));
}

function printWhileStatement(path, options, print) {
  return group(
    concat([
      group(
        concat([
          "while",
          " ",
          "(",
          indent(path.call(print, "expression", 0)),
          softline,
          ")"
        ])
      ),
      line,
      path.call(print, "embedded_statement", 0)
    ])
  );
}

function printDoStatement(path, options, print) {
  return group(
    concat([
      "do",
      line,
      path.call(print, "embedded_statement", 0),
      line,
      group(
        concat([
          "while",
          " ",
          "(",
          indent(path.call(print, "expression", 0)),
          softline,
          ")",
          ";"
        ])
      )
    ])
  );
}

function printForStatement(path, options, print) {
  const node = path.getValue();
  const forInitializer = getAny(node, "for_initializer");
  const expression = getAny(node, "expression");
  const forIterator = getAny(node, "for_iterator");

  return group(
    concat([
      group(
        concat([
          "for",
          " ",
          "(",
          indent(
            group(
              concat([
                softline,
                join(
                  concat([";", line]),
                  [forInitializer, expression, forIterator].map(e =>
                    e ? path.call(print, e, 0) : empty
                  )
                )
              ])
            )
          ),
          softline,
          ")"
        ])
      ),
      line,
      path.call(print, "embedded_statement", 0)
    ])
  );
}

function printForInitializer(path, options, print) {
  const node = path.getValue();
  const localVariableDeclaration = getAny(node, "local_variable_declaration");

  if (localVariableDeclaration) {
    return group(path.call(print, localVariableDeclaration, 0));
  }

  return group(join(concat([";", line]), path.map(print, "expression")));
}

function printForIterator(path, options, print) {
  return group(printCommaList(path.map(print, "expression")));
}

function printForeachStatement(path, options, print) {
  return group(
    concat([
      group(
        concat([
          "foreach",
          " ",
          "(",
          indent(
            group(
              concat([
                path.call(print, "local_variable_type", 0),
                line,
                path.call(print, "identifier", 0),
                line,
                "in",
                line,
                path.call(print, "expression", 0)
              ])
            )
          ),
          softline,
          ")"
        ])
      ),
      line,
      path.call(print, "embedded_statement", 0)
    ])
  );
}

function printSwitchStatement(path, options, print) {
  const node = path.getValue();
  const switchSections = getAny(node, "switch_section");

  const docs = [
    group(
      concat([
        "switch",
        " ",
        "(",
        indent(path.call(print, "expression", 0)),
        softline,
        ")"
      ])
    ),
    line
  ];

  docs.push("{");

  if (switchSections) {
    docs.push(
      indent(concat([line, join(hardline, path.map(print, switchSections))]))
    );
  }

  docs.push(line, "}");

  return group(concat(docs));
}

function printSwitchSection(path, options, print) {
  return group(
    concat([
      join(hardline, path.map(print, "switch_label")),
      indent(concat([hardline, path.call(print, "statement_list", 0)]))
    ])
  );
}

function printSwitchLabel(path, options, print) {
  const node = path.getValue();
  const expression = getAny(node, "expression");
  const type = getAny(node, "type");
  const switchWhen = getAny(node, "switch_when");

  if (expression) {
    const docs = ["case", " "];

    if (type) {
      docs.push(path.call(print, type, 0), " ");
    }

    docs.push(path.call(print, expression, 0));

    if (switchWhen) {
      docs.push(
        indent(group(concat([line, path.call(print, switchWhen, 0), ":"])))
      );
    } else {
      docs.push(":");
    }

    return group(concat(docs));
  }

  return group(concat(["default", ":"]));
}

function printSwitchFilter(path, options, print) {
  return group(concat(["when", path.call(print, "conditional_expression", 0)]));
}

function printCheckedStatement(path, options, print) {
  return group(
    concat([
      path.call(print, "terminal", 0),
      hardline,
      path.call(print, "block", 0)
    ])
  );
}

function printCheckedExpression(path, options, print) {
  return group(
    concat([
      path.call(print, "terminal", 0),
      "(",
      group(indent(concat([softline, path.call(print, "expression", 0)]))),
      softline,
      ")"
    ])
  );
}

function printDefaultValueExpression(path, options, print) {
  const node = path.getValue();
  const type = getAny(node, "type");

  const docs = ["default"];

  if (type) {
    docs.push(
      "(",
      indent(group(concat([softline, path.call(print, "type", 0)]))),
      softline,
      ")"
    );
  }

  return group(concat(docs));
}

function printAnonymousMethodExpression(path, options, print) {
  const node = path.getValue();
  const parameterList = getAny(
    node,
    "explicit_anonymous_function_parameter_list"
  );
  const isAsync = isSymbol(node.children[0], "async");

  const signaturePart = [];

  if (isAsync) {
    signaturePart.push("async", " ");
  }

  signaturePart.push("delegate", " ");

  const paramsPart = [];

  paramsPart.push("(");
  if (parameterList) {
    paramsPart.push(
      indent(concat([softline, path.call(print, parameterList, 0)]))
    );
  }
  paramsPart.push(")");

  signaturePart.push(group(concat(paramsPart)));

  return group(
    concat([
      group(concat(signaturePart)),
      hardline,
      path.call(print, "block", 0)
    ])
  );
}

function printTypeofExpression(path, options, print) {
  const node = path.getValue();
  const type = getAny(node, ["unbound_type_name", "type"]);

  return group(
    concat([
      "typeof",
      " ",
      "(",
      indent(concat([softline, type ? path.call(print, type, 0) : "void"])),
      softline,
      ")"
    ])
  );
}

function printUnboundTypeName(path, options, print) {
  const node = path.getValue();
  const hasDoubleColumn = node.children.find(child => isSymbol(child, "::"));

  const pathParts = [];

  let currentPathPart = [];

  path.each(path => {
    const child = path.getValue();
    if (isSymbol(child, ".") || isSymbol(child, "::")) {
      pathParts.push(currentPathPart);
      currentPathPart = [];
    } else {
      currentPathPart.push(print(path, options, print));
    }
  }, "children");

  pathParts.push(currentPathPart);

  if (!hasDoubleColumn) {
    return group(join(".", pathParts.map(concat)));
  }

  const [headPart, neckPart, ...tailParts] = pathParts;

  return group(
    join(".", [
      concat(headPart),
      "::",
      concat(neckPart),
      ...tailParts.map(concat)
    ])
  );
}

function printGenericDimensionSpecifier(path) {
  const node = path.getValue();
  const commas = node.children.length - 2;

  return concat(["<", ..._.repeat(",", commas), ">"]);
}

function printCapturingStatement(path, options, print) {
  const node = path.getValue();
  const capturedExpressions = getAll(node, [
    "expression",
    "resource_acquisition",
    "pointer_type",
    "fixed_pointer_declarators"
  ]);
  const embeddedStatement = getDescendant(node, "embedded_statement");
  const hasBraces = !!getAny(embeddedStatement, "block");

  const docs = [
    group(
      concat([
        path.call(print, "terminal", 0),
        " ",
        "(",
        group(
          concat([
            indent(
              group(
                concat([
                  softline,
                  join(
                    " ",
                    capturedExpressions.map(expression =>
                      path.call(print, expression, 0)
                    )
                  )
                ])
              )
            ),
            softline
          ])
        ),
        ")"
      ])
    )
  ];

  const onlyContainsACapturingStatement =
    !hasBraces &&
    !!getAny(embeddedStatement, [
      "using_statement",
      "fixed_statement",
      "lock_statement"
    ]);

  const statementDocs = path.call(print, "embedded_statement", 0);

  if (hasBraces || onlyContainsACapturingStatement) {
    docs.push(hardline, statementDocs);
  } else {
    docs.push(indent(group(concat([hardline, statementDocs]))));
  }

  return group(concat(docs));
}

function printYieldStatement(path, options, print) {
  const node = path.getValue();
  const expression = getAny(node, "expression");

  const docs = ["yield"];

  if (expression) {
    docs.push(
      indent(concat([" ", "return", " ", path.call(print, "expression", 0)]))
    );
  } else {
    docs.push(" ", "break");
  }

  docs.push(";");

  return group(concat(docs));
}

function printResourceAcquisition(path, options, print) {
  return path.call(print, "children", 0);
}

function printTryStatement(path, options, print) {
  const node = path.getValue();
  const block = path.call(print, "block", 0);
  const clauses = getAll(node, ["catch_clauses", "finally_clause"]);

  return group(
    concat([
      "try",
      hardline,
      block,
      hardline,
      join(hardline, clauses.map(clause => path.call(print, clause, 0)))
    ])
  );
}

function printCatchClauses(path, options, print) {
  const node = path.getValue();
  const clauses = getAll(node, [
    "specific_catch_clause",
    "general_catch_clause"
  ]);

  return join(
    hardline,
    _.flatten(clauses.map(clause => path.map(print, clause)))
  );
}

function printCatchClause(path, options, print) {
  const node = path.getValue();
  const classType = getAny(node, "class_type");
  const exceptionFilter = getAny(node, "exception_filter");

  const catchPart = ["catch"];

  if (classType) {
    catchPart.push(" ");

    const exceptionPart = [path.call(print, classType, 0)];

    const identifier = getAny(node, "identifier");

    if (identifier) {
      exceptionPart.push(" ", path.call(print, identifier, 0));
    }

    catchPart.push(
      group(
        concat([
          "(",
          indent(concat([softline, group(concat(exceptionPart))])),
          softline,
          ")"
        ])
      )
    );
  }

  if (exceptionFilter) {
    catchPart.push(line, path.call(print, exceptionFilter, 0));
  }

  return group(
    concat([group(concat(catchPart)), hardline, path.call(print, "block", 0)])
  );
}

function printFinallyClause(path, options, print) {
  return group(concat(["finally", hardline, path.call(print, "block", 0)]));
}

function printExceptionFilter(path, options, print) {
  return group(
    concat([
      "when",
      " ",
      "(",
      group(concat([softline, path.call(print, "expression", 0)])),
      softline,
      ")"
    ])
  );
}

function printObjectOrCollectionInitializer(path, options, print) {
  return path.call(print, "children", 0);
}

function printObjectInitializer(path, options, print) {
  const node = path.getValue();
  const memberInitializerList = getAny(node, [
    "member_initializer_list",
    "member_declarator_list"
  ]);

  const docs = ["{"];

  if (memberInitializerList) {
    docs.push(
      indent(concat([line, path.call(print, memberInitializerList, 0)]))
    );
  }

  docs.push(line, "}");

  return group(concat(docs));
}

function printCollectionInitializer(path, options, print) {
  return group(
    concat([
      "{",
      indent(
        concat([line, printCommaList(path.map(print, "element_initializer"))])
      ),
      line,
      "}"
    ])
  );
}

function printTupleInitializer(path, options, print) {
  return group(
    concat([
      "(",
      indent(
        concat([
          softline,
          printCommaList(path.map(print, "tuple_element_initializer"))
        ])
      ),
      softline,
      ")"
    ])
  );
}

function printTupleElementInitializer(path, options, print) {
  const node = path.getValue();
  const identifier = getAny(node, "identifier");

  const docs = [];

  if (identifier) {
    docs.push(path.call(print, identifier, 0), ":", line);
  }

  docs.push(path.call(print, "non_assignment_expression", 0));

  return group(concat(docs));
}

function printMemberInitializerList(path, options, print) {
  return printCommaList(path.map(print, "member_initializer"));
}

function printMemberInitializer(path, options, print) {
  const node = path.getValue();
  const identifier = getAny(node, "identifier");
  const expression = getAny(node, "expression");

  const docs = [];

  if (identifier) {
    docs.push(path.call(print, identifier, 0));
  } else if (expression) {
    docs.push(
      "[",
      indent(concat([softline, path.call(print, expression, 0)])),
      softline,
      "]"
    );
  }

  docs.push(" ", "=");
  docs.push(indent(concat([line, path.call(print, "initializer_value", 0)])));

  return group(concat(docs));
}

function printInitializerValue(path, options, print) {
  return path.call(print, "children", 0);
}

function printMemberDeclaratorList(path, options, print) {
  return printCommaList(path.map(print, "member_declarator"));
}

function printMemberDeclarator(path, options, print) {
  const node = path.getValue();
  const primaryExpression = getAny(node, "primary_expression");

  if (primaryExpression) {
    return path.call(print, primaryExpression, 0);
  }

  return group(
    concat([
      path.call(print, "identifier", 0),
      " ",
      "=",
      indent(concat([line, path.call(print, "expression", 0)]))
    ])
  );
}

function printElementInitializer(path, options, print) {
  const node = path.getValue();
  const nonAssignmentExpression = getAny(node, "non_assignment_expression");

  if (nonAssignmentExpression) {
    return path.call(print, nonAssignmentExpression, 0);
  }

  return group(
    concat([
      "{",
      indent(concat([line, path.call(print, "expression_list", 0)])),
      line,
      "}"
    ])
  );
}

function printExpressionList(path, options, print) {
  return printCommaList(path.map(print, "expression"));
}

function printRankSpecifier(path) {
  const node = path.getValue();
  const ranks = node.children.length - 2;

  return concat(["[", _.repeat(",", ranks), "]"]);
}

function printArrayInitializer(path, options, print) {
  return group(
    concat([
      "{",
      indent(
        concat([line, printCommaList(path.map(print, "variable_initializer"))])
      ),
      line,
      "}"
    ])
  );
}

function printBracketExpression(path, options, print) {
  const node = path.getValue();
  const isNullCoalescent = isSymbol(node.children[0], "?");
  const indexerArguments = path.map(print, "indexer_argument");

  const docs = [];

  if (isNullCoalescent) {
    docs.push("?");
  }

  docs.push("[", printCommaList(indexerArguments), "]");

  return concat(docs);
}

function printIndexerArgument(path, options, print) {
  const node = path.getValue();
  const identifier = getAny(node, "identifier");

  const docs = [];

  if (identifier) {
    docs.push(path.call(print, "identifier", 0), ":", line);
  }

  docs.push(path.call(print, "expression", 0));

  return group(concat(docs));
}

function printQueryExpression(path, options, print) {
  return group(
    concat([
      path.call(print, "from_clause", 0),
      line,
      path.call(print, "query_body", 0)
    ])
  );
}

function printFromClause(path, options, print) {
  const node = path.getValue();
  const type = getAny(node, "type");

  const fromPart = ["from", line];

  if (type) {
    fromPart.push(path.call(print, "type", 0), line);
  }

  fromPart.push(path.call(print, "identifier", 0));

  const inPart = ["in", line, path.call(print, "expression", 0)];

  return group(concat([group(concat(fromPart)), line, group(concat(inPart))]));
}

function printQueryBody(path, options, print) {
  const node = path.getValue();
  const queryContinuation = getAny(node, "query_continuation");
  const queryBodyClause = getAny(node, "query_body_clause");

  const docs = [];

  if (queryBodyClause) {
    docs.push(join(line, path.map(print, "query_body_clause")), line);
  }

  docs.push(path.call(print, "select_or_group_clause", 0));

  if (queryContinuation) {
    docs.push(line, path.call(print, queryContinuation, 0));
  }

  return group(concat(docs));
}

function printQueryBodyClause(path, options, print) {
  return path.call(print, "children", 0);
}

function printLetClause(path, options, print) {
  return group(
    concat([
      "let",
      line,
      path.call(print, "identifier", 0),
      line,
      "=",
      line,
      path.call(print, "expression", 0)
    ])
  );
}

function printWhereClause(path, options, print) {
  return group(concat(["where", line, path.call(print, "expression", 0)]));
}

function printCombinedJoinClause(path, options, print) {
  const node = path.getValue();
  const type = getAny(node, "type");
  const identifierDocs = path.map(print, "identifier");
  const expressionDocs = path.map(print, "expression");

  const joinPart = ["join", line];

  if (type) {
    joinPart.push(path.call(print, "type", 0), line);
  }

  joinPart.push(identifierDocs[0]);

  const inPart = ["in", line, expressionDocs[0]];
  const onPart = ["on", line, expressionDocs[1]];
  const equalsPart = ["equals", line, expressionDocs[2]];

  const docs = [
    group(concat(joinPart)),
    line,
    group(concat(inPart)),
    line,
    group(concat(onPart)),
    line,
    group(concat(equalsPart))
  ];

  if (identifierDocs.length > 1) {
    const intoPart = ["into", line, identifierDocs[1]];
    docs.push(line, group(concat(intoPart)));
  }
  return group(concat(docs));
}

function printOrderByClause(path, options, print) {
  return group(
    concat(["orderby", line, printCommaList(path.map(print, "ordering"))])
  );
}

function printOrdering(path, options, print) {
  const node = path.getValue();
  const dir = getAny(node, "terminal");

  return group(
    concat([path.call(print, "expression", 0), line, path.call(print, dir, 0)])
  );
}

function printSelectOrGroupClause(path, options, print) {
  const expressionDocs = path.map(print, "expression");

  if (expressionDocs.length == 1) {
    return group(concat(["select", line, expressionDocs[0]]));
  } else {
    return group(
      concat([
        "group",
        line,
        expressionDocs[0],
        line,
        "by",
        line,
        expressionDocs[1]
      ])
    );
  }
}

function printQueryContinuation(path, options, print) {
  return group(
    concat([
      "into",
      line,
      path.call(print, "identifier", 0),
      line,
      path.call(print, "query_body", 0)
    ])
  );
}

function printLambdaExpression(path, options, print) {
  const node = path.getValue();

  const isAsync = isSymbol(node.children[0], "async");
  const isExpression = !!node["anonymous_function_body"][0]["expression"];

  const docs = [];

  if (isAsync) {
    docs.push("async", " ");
  }

  docs.push(path.call(print, "anonymous_function_signature", 0));
  docs.push(" ", "=>");

  const bodyPart = group(
    concat([line, path.call(print, "anonymous_function_body", 0)])
  );

  docs.push(isExpression ? indent(bodyPart) : bodyPart);

  return group(concat(docs));
}

function printAnonymousFunctionSignature(path, options, print) {
  const node = path.getValue();
  const identifier = getAny(node, "identifier");
  const parameters = getAny(node, [
    "explicit_anonymous_function_parameter_list",
    "implicit_anonymous_function_parameter_list"
  ]);

  if (identifier) {
    return path.call(print, identifier, 0);
  }

  const docs = [];

  docs.push("(");

  if (parameters) {
    docs.push(
      indent(group(concat([softline, path.call(print, parameters, 0)]))),
      softline
    );
  }

  docs.push(")");

  return group(concat(docs));
}

function printAnonymousFunctionBody(path, options, print) {
  return path.call(print, "children", 0);
}

function printAnonymousFunctionParameterList(path, options, print) {
  const node = path.getValue();
  const parameters = getAny(node, [
    "explicit_anonymous_function_parameter",
    "identifier"
  ]);

  return printCommaList(path.map(print, parameters));
}

function printExplicitAnonymousFunctionParameter(path, options, print) {
  const node = path.getValue();
  const refout =
    isSymbol(node.children[0], "ref") || isSymbol(node.children[0], "out");
  const docs = [];

  if (refout) {
    docs.push(path.call(print, "children", 0), line);
  }

  docs.push(
    path.call(print, "type", 0),
    line,
    path.call(print, "identifier", 0)
  );

  return group(concat(docs));
}

function printFallback(path, options, print) {
  const node = path.getValue();

  return `{${node.nodeType}}`;
}

function getDescendant(node, path) {
  const pathAccessorRegex = /^([a-zA-Z_]+)(\[([0-9])\])?$/;
  const pathParts = path.split(".");

  let currentNode = node;

  for (const pathPart of pathParts) {
    const match = pathAccessorRegex.exec(pathPart);

    if (!match) {
      throw new Error(`Incorrect descendant path: ${path}`);
    }

    const rank = Number(match[3]) || 0;
    const name = match[1];

    if (!currentNode[name] || !currentNode[name][rank]) {
      return null;
    }

    currentNode = currentNode[name][rank];
  }

  return currentNode;
}

function isType(node, type) {
  return node && node.nodeType === type;
}

// eslint-disable-next-line no-unused-vars
function debugAtLine(node, line) {
  if (node && node.lineStart <= line && node.lineEnd >= line) {
    // eslint-disable-next-line no-debugger
    debugger;
  }
}

function isLastComment(path) {
  const stack = path.stack;
  const comments = stack[stack.length - 3];
  const currentComment = stack[stack.length - 1];
  return comments && comments[comments.length - 1] === currentComment;
}

function printComment(path, options) {
  const node = path.getValue();

  node.printed = true;
  // console.log(
  //   `leading: ${node.leading}, trailing: ${node.trailing}, ${node.lineStart}-${
  //     node.lineEnd
  //   }, "${node.value}"`
  // );

  if (node.value.startsWith("//")) {
    return node.value.trimRight();
  } else if (node.value.startsWith("#")) {
    const isPreviousLineEmpty = util.isPreviousLineEmpty(
      options.originalText,
      node,
      options
    );
    const isNextLineEmpty = util.isNextLineEmptyAfterIndex(
      options.originalText,
      options.locEnd(node) + 1
    );
    const docs = [];
    if (isPreviousLineEmpty) {
      docs.push(dedentToRoot(hardline));
    }
    docs.push(trim, node.value);
    if (isNextLineEmpty && isLastComment(path)) {
      docs.push(hardline);
    }
    return concat(docs);
  } else {
    return node.value.trim("\n");
  }
}

function canAttachComment(node) {
  return (
    node &&
    node.leading === undefined &&
    node.trailing === undefined &&
    node.dangling === undefined
  );
}

function getCommentChildNodes(node) {
  return node.children.filter(child => !isType(child, "terminal"));
}

function hasPreprocessorDirectives(node) {
  return (
    node.comments && node.comments.find(child => isType(child, "directive"))
  );
}

function handleOwnLineComments(
  comment /*, text, options, ast, isLastComment*/
) {
  if (
    comment.followingNode &&
    ["#if", "#region"].some(d => comment.value.startsWith(d))
  ) {
    util.addLeadingComment(comment.followingNode, comment);
    return true;
  } else if (
    comment.precedingNode &&
    ["#endregion", "#elif", "#else", "#endif"].some(d =>
      comment.value.startsWith(d)
    )
  ) {
    util.addTrailingComment(comment.precedingNode, comment);
    return true;
  }

  return false;
}

function printDanglingComments(path, options) {
  const parts = [];
  const node = path.getValue();

  if (!node || !node.comments) {
    return "";
  }

  path.each(commentPath => {
    const comment = commentPath.getValue();

    if (comment && !comment.leading && !comment.trailing) {
      parts.push(printComment(commentPath, options));
    }
  }, "comments");

  if (parts.length === 0) {
    return "";
  }

  return indent(concat([hardline, join(hardline, parts)]));
}

module.exports = {
  print,
  printComment,
  canAttachComment,
  getCommentChildNodes
  // handleComments: {
  //   ownLine: handleOwnLineComments
  // }
};
