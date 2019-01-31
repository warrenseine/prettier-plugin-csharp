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

const alphanumerical = require("is-alphanumerical");
const _ = require("lodash");

function printCompilationUnit(path, options, print) {
  const node = path.getValue();
  const parts = [];

  const externAliasDirectives = getAny(node, "extern_alias_directives");
  const usingDirectives = getAny(node, "using_directives");
  const globalAttributeSections = getAny(node, "global_attribute_section");
  const namespaceMemberDeclarations = getAny(
    node,
    "namespace_member_declarations"
  );

  if (externAliasDirectives) {
    parts.push(path.call(print, externAliasDirectives, 0));
  }

  if (usingDirectives) {
    parts.push(path.call(print, usingDirectives, 0));
  }

  if (globalAttributeSections) {
    parts.push(join(hardline, path.map(print, globalAttributeSections)));
  }

  if (namespaceMemberDeclarations) {
    parts.push(path.call(print, namespaceMemberDeclarations, 0));
  }

  return concat([join(doublehardline, parts), line]);
}

function printExternAliasDirectives(path, options, print) {
  return join(hardline, path.map(print, "extern_alias_directive"));
}

function printExternAliasDirective(path, options, print) {
  return group(
    concat([
      "extern",
      " ",
      "alias",
      indent(concat([line, path.call(print, "identifier", 0)])),
      ";"
    ])
  );
}

function printTerminal(path) {
  const node = path.getValue();
  return node.value;
}

function printIdentifier(path, options, print) {
  return path.call(print, "terminal", 0);
}

function printKeyword(path, options, print) {
  return path.call(print, "terminal", 0);
}

function reorderAndPrintUsingDirectives(path, options, print) {
  // Broken with preprocessor directives.
  const node = path.getValue();

  const getUsingPath = parts => {
    if (
      typeof parts === "string" &&
      parts !== "using" &&
      parts != "static" &&
      alphanumerical(parts)
    ) {
      return parts;
    } else if (parts.type === "group" || parts.type === "indent") {
      return getUsingPath(parts.contents);
    } else if (parts.type === "concat") {
      return parts.parts.map(getUsingPath).join(empty);
    } else {
      return empty;
    }
  };

  const sortUsingDirectives = docs => {
    for (const doc of docs) {
      doc.usingPath = getUsingPath(doc);
    }

    const [systems, others] = _.map(
      _.partition(docs, doc => doc.usingPath.startsWith("System")),
      docs => _.sortBy(docs, ["usingPath"])
    );

    return systems.concat(others);
  };

  const namespaces = getAny(node, "using_namespace_directive");
  const aliases = getAny(node, "using_alias_directive");
  const statics = getAny(node, "using_static_directive");

  const docs = [namespaces, aliases, statics]
    .filter(usings => usings)
    .map(usings =>
      join(hardline, sortUsingDirectives(path.map(print, usings)))
    );

  return join(doublehardline, docs);
}

function printUsingDirectives(path, options, print) {
  const node = path.getValue();

  if (hasPreprocessorDirectives(node)) {
    return join(hardline, path.map(print, "children"));
  }

  return reorderAndPrintUsingDirectives(path, options, print);
}

function printNamespaceOrTypeName(path, options, print) {
  const pathParts = [];

  let currentPathPart = [];

  path.each(path => {
    const node = path.getValue();
    if (isSymbol(node, ".")) {
      pathParts.push(currentPathPart);
      currentPathPart = [];
    } else {
      currentPathPart.push(print(path, options, print));
    }
  }, "children");

  pathParts.push(currentPathPart);

  return join(".", pathParts.map(concat));
}

function printUsingNamespaceDirective(path, options, print) {
  return group(
    concat([
      "using",
      indent(concat([line, path.call(print, "namespace_or_type_name", 0)])),
      ";"
    ])
  );
}

function printUsingAliasDirective(path, options, print) {
  const identifier = path.call(print, "identifier", 0);
  const namespace = path.call(print, "namespace_or_type_name", 0);

  return group(
    concat([
      "using",
      indent(
        concat([
          line,
          identifier,
          line,
          "=",
          indent(concat([line, namespace, ";"]))
        ])
      )
    ])
  );
}

function printUsingStaticDirective(path, options, print) {
  const namespace = path.call(print, "namespace_or_type_name", 0);

  return group(
    concat(["using", " ", "static", indent(concat([line, namespace])), ";"])
  );
}

function printTypeArgumentList(path, options, print) {
  return group(
    concat([
      "<",
      indent(group(printCommaList(path.map(print, "type")))),
      softline,
      ">"
    ])
  );
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

function printGlobalAttributeSection(path, options, print) {
  const globalAttributeTarget = path.call(print, "global_attribute_target", 0);
  const attributeList = path.call(print, "attribute_list", 0);

  return group(
    concat([
      "[",
      indent(
        concat([softline, globalAttributeTarget, ":", line, attributeList])
      ),
      softline,
      "]"
    ])
  );
}

function printGlobalAttributeTarget(path, options, print) {
  return path.call(print, "children", 0);
}

function printAttributeList(path, options, print) {
  const attributes = path.map(print, "attribute");

  return printCommaList(attributes);
}

function printAttribute(path, options, print) {
  const node = path.getValue();
  const attributeArguments = getAll(node, "attribute_argument");
  const hasParenthesis =
    node.children.findIndex(child => isSymbol(child, "(")) >= 0;

  const docs = [path.call(print, "namespace_or_type_name", 0)];

  if (hasParenthesis) {
    docs.push("(");
  }

  if (attributeArguments.length) {
    docs.push(
      indent(
        concat([softline, printCommaList(path.map(print, attributeArguments))])
      )
    );
  }

  if (hasParenthesis) {
    docs.push(")");
  }

  return group(concat(docs));
}

function printAttributeArgument(path, options, print) {
  const node = path.getValue();
  const identifier = getAny(node, "identifier");

  const docs = [];

  if (identifier) {
    docs.push(path.call(print, identifier, 0), ":", line);
  }

  docs.push(path.call(print, "expression", 0));

  return concat(docs);
}

function printAttributes(path, options, print) {
  return join(hardline, path.map(print, "children"));
}

function printAttributeSection(path, options, print) {
  const node = path.getValue();
  const attributeTarget = getAny(node, "attribute_target");

  const attributePart = [softline];

  if (attributeTarget) {
    attributePart.push(path.call(print, attributeTarget, 0), ":", line);
  }

  attributePart.push(path.call(print, "attribute_list", 0));

  return group(concat(["[", indent(concat(attributePart)), softline, "]"]));
}

function printAttributeTarget(path, options, print) {
  return path.call(print, "children", 0);
}

function printNonAssignmentExpression(path, options, print) {
  return path.call(print, "children", 0);
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

function printBinaryishExpression(path, options, print) {
  const node = path.getValue();
  if (node.children.length === 1) {
    return path.call(print, "children", 0);
  }

  const operations = _.chunk(path.map(print, "children"), 2);

  return group(
    join(
      line,
      operations.map(([operand, operator]) =>
        operator ? group(concat([operand, " ", operator])) : operand
      )
    )
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

function printParenthesisExpression(path, options, print) {
  return concat([
    "(",
    softline,
    path.call(print, "expression", 0),
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
  const qualifiedIdentifier = path.call(print, "qualified_identifier", 0);
  const namespaceBody = path.call(print, "namespace_body", 0);

  return group(
    concat([
      group(concat(["namespace", line, qualifiedIdentifier])),
      hardline,
      namespaceBody
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

function printQualifiedIdentifier(path, options, print) {
  return printDotList(path.map(print, "identifier"));
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
  return path.call(print, "children", 0);
}

function printLiteral(path, options, print) {
  return path.call(print, "children", 0);
}

function printInterpolatedVerbatiumString(path, options, print) {
  return group(
    concat([
      '$@"',
      concat(path.map(print, "interpolated_verbatium_string_part")),
      '"'
    ])
  );
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

function printNode(path, options, print) {
  const node = path.getValue();

  switch (node.nodeType) {
    case "compilation_unit":
      return printCompilationUnit(path, options, print);
    case "extern_alias_directives":
      return printExternAliasDirectives(path, options, print);
    case "extern_alias_directive":
      return printExternAliasDirective(path, options, print);
    case "terminal":
      return printTerminal(path, options, print);
    case "identifier":
      return printIdentifier(path, options, print);
    case "keyword":
    case "this_reference_expression":
    case "parameter_modifier":
      return printKeyword(path, options, print);
    case "using_directives":
      return printUsingDirectives(path, options, print);
    case "using_namespace_directive":
      return printUsingNamespaceDirective(path, options, print);
    case "namespace_or_type_name":
      return printNamespaceOrTypeName(path, options, print);
    case "method_member_name":
    case "unbound_type_name":
      return printUnboundTypeName(path, options, print);
    case "using_alias_directive":
      return printUsingAliasDirective(path, options, print);
    case "type_argument_list":
      return printTypeArgumentList(path, options, print);
    case "argument_list":
      return printArgumentList(path, options, print);
    case "argument":
      return printArgument(path, options, print);
    case "typed_argument":
      return printTypedArgument(path, options, print);
    case "is_type":
      return printIsType(path, options, print);
    case "type":
      return printType(path, options, print);
    case "base_type":
      return printBaseType(path, options, print);
    case "class_type":
      return printClassType(path, options, print);
    case "tuple_type":
      return printTupleType(path, options, print);
    case "tuple_element_type":
      return printTupleElementType(path, options, print);
    case "predefined_type":
    case "simple_type":
    case "numeric_type":
    case "integral_type":
    case "floating_point_type":
      return printSimpleType(path, options, print);
    case "pointer_type":
      return printPointerType(path, options, print);
    case "array_type":
      return printArrayType(path, options, print);
    case "using_static_directive":
      return printUsingStaticDirective(path, options, print);
    case "global_attribute_section":
      return printGlobalAttributeSection(path, options, print);
    case "global_attribute_target":
      return printGlobalAttributeTarget(path, options, print);
    case "attribute_list":
      return printAttributeList(path, options, print);
    case "attribute":
      return printAttribute(path, options, print);
    case "attributes":
      return printAttributes(path, options, print);
    case "attribute_argument":
      return printAttributeArgument(path, options, print);
    case "attribute_section":
      return printAttributeSection(path, options, print);
    case "attribute_target":
      return printAttributeTarget(path, options, print);
    case "simple_name":
      return printSimpleName(path, options, print);
    case "member_name":
      return printMemberName(path, options, print);
    case "formal_parameter_list":
      return printFormalParameterList(path, options, print);
    case "fixed_parameters":
      return printFixedParameters(path, options, print);
    case "fixed_parameter":
      return printFixedParameter(path, options, print);
    case "fixed_pointer_declarators":
      return printFixedPointerDeclarators(path, options, print);
    case "fixed_pointer_declarator":
      return printFixedPointerDeclarator(path, options, print);
    case "fixed_pointer_initializer":
      return printFixedPointerInitializer(path, options, print);
    case "fixed_size_buffer_declarator":
      return printFixedSizeBufferDeclarator(path, options, print);
    case "local_variable_initializer_unsafe":
      return printLocalVariableInitializerUnsafe(path, options, print);
    case "parameter_array":
      return printParameterArray(path, options, print);
    case "accessor_body":
    case "method_body":
    case "body":
      return printBody(path, options, print);
    case "expression":
      return printExpression(path, options, print);
    case "non_assignment_expression":
      return printNonAssignmentExpression(path, options, print);
    case "conditional_expression":
      return printConditionalExpression(path, options, print);
    case "null_coalescing_expression":
      return printNullCoalescingExpression(path, options, print);
    case "conditional_or_expression":
    case "conditional_and_expression":
    case "inclusive_or_expression":
    case "exclusive_or_expression":
    case "and_expression":
    case "equality_expression":
    case "relational_expression":
    case "shift_expression":
    case "additive_expression":
    case "multiplicative_expression":
      return printBinaryishExpression(path, options, print);
    case "literal_expression":
      return printLiteralExpression(path, options, print);
    case "literal":
    case "string_literal":
    case "boolean_literal":
      return printLiteral(path, options, print);
    case "tuple_initializer":
      return printTupleInitializer(path, options, print);
    case "predefined_type_expression":
      return printPredefinedTypeExpression(path, options, print);
    case "qualified_alias_member_expression":
      return printQualifiedAliasMemberExpression(path, options, print);
    case "literal_access_expression":
      return printLiteralAccessExpression(path, options, print);
    case "primary_expression_start":
      return printPrimaryExpressionStart(path, options, print);
    case "primary_expression":
      return printPrimaryExpression(path, options, print);
    case "unary_expression":
      return printUnaryExpression(path, options, print);
    case "tuple_expression":
      return printTupleExpression(path, options, print);
    case "parenthesis_expressions":
      return printParenthesisExpression(path, options, print);
    case "simple_name_expression":
      return printSimpleNameExpression(path, options, print);
    case "namespace_member_declarations":
      return printNamespaceMemberDeclarations(path, options, print);
    case "namespace_member_declaration":
      return printNamespaceMemberDeclaration(path, options, print);
    case "type_declaration":
      return printTypeDeclaration(path, options, print);
    case "namespace_declaration":
      return printNamespaceDeclaration(path, options, print);
    case "namespace_body":
    case "class_body":
    case "struct_body":
    case "interface_body":
    case "enum_body":
      return printBraceBody(path, options, print);
    case "interface_type_list":
      return printInterfaceTypeList(path, options, print);
    case "class_definition":
    case "struct_definition":
    case "enum_definition":
      return printStructDefinition(path, options, print);
    case "interface_base":
    case "class_base":
    case "enum_base":
    case "struct_interfaces":
      return printStructBase(path, options, print);
    case "qualified_identifier":
      return printQualifiedIdentifier(path, options, print);
    case "qualified_alias_member":
      return printQualifiedAliasMember(path, options, print);
    case "all_member_modifiers":
      return printAllMemberModifiers(path, options, print);
    case "all_member_modifier":
      return printAllMemberModifier(path, options, print);
    case "accessor_modifier":
      return printAccessorModifier(path, options, print);
    case "class_member_declarations":
    case "struct_member_declarations":
      return printClassOrStructMemberDeclarations(path, options, print);
    case "enum_member_declaration":
      return printEnumMemberDeclaration(path, options, print);
    case "class_member_declaration":
    case "struct_member_declaration":
      return printClassOrStructMemberDeclaration(path, options, print);
    case "common_member_declaration":
      return printCommonMemberDeclaration(path, options, print);
    case "constructor_declaration":
    case "destructor_definition":
      return printMethodDeclaration(path, options, print);
    case "constructor_initializer":
      return printConstructorInitializer(path, options, print);
    case "arg_declaration":
      return printArgDeclaration(path, options, print);
    case "constant_declaration":
      return printConstantDeclaration(path, options, print);
    case "constant_declarators":
      return printConstantDeclarators(path, options, print);
    case "constant_declarator":
      return printConstantDeclarator(path, options, print);
    case "block":
      return printBlock(path, options, print);
    case "interface_definition":
      return printInterfaceDefinition(path, options, print);
    case "interface_member_declaration":
      return printInterfaceMemberDeclaration(path, options, print);
    case "type_parameter_list":
    case "variant_type_parameter_list":
      return printTypeParameterList(path, options, print);
    case "type_parameter":
    case "variant_type_parameter":
      return printTypeParameter(path, options, print);
    case "variance_annotation":
      return printVarianceAnnotation(path, options, print);
    case "delegate_definition":
      return printDelegateDefinition(path, options, print);
    case "return_type":
      return printReturnType(path, options, print);
    case "type_parameter_constraints_clauses":
      return printTypeParameterConstraintsClauses(path, options, print);
    case "type_parameter_constraints_clause":
      return printTypeParameterConstraintsClause(path, options, print);
    case "type_parameter_constraints":
      return printTypeParameterConstraints(path, options, print);
    case "constructor_constraint":
      return printConstructorConstraint(path, options, print);
    case "primary_constraint":
      return printPrimaryConstraint(path, options, print);
    case "secondary_constraints":
      return printSecondaryConstraints(path, options, print);
    case "assignment":
      return printAssignment(path, options, print);
    case "right_arrow":
    case "right_shift":
    case "right_shift_assignment":
      return printRightOperator(path, options, print);
    case "assignment_operator":
    case "overloadable_operator":
      return printOperator(path, options, print);
    case "field_declaration":
      return printFieldDeclaration(path, options, print);
    case "event_declaration":
      return printEventDeclaration(path, options, print);
    case "statement_list":
      return printStatementList(path, options, print);
    case "declaration_statement":
      return printDeclarationStatement(path, options, print);
    case "labeled_statement":
      return printLabeledStatement(path, options, print);
    case "embedded_statement":
    case "if_body":
      return printEmbeddedStatement(path, options, print);
    case "local_variable_declaration":
    case "variable_declarators":
      return printVariableDeclaration(path, options, print);
    case "local_constant_declaration":
      return printLocalConstantDeclaration(path, options, print);
    case "local_variable_identifier":
      return printLocalVariableIdentifier(path, options, print);
    case "expression_statement":
      return printExpressionStatement(path, options, print);
    case "empty_statement":
      return printEmptyStatement(path, options, print);
    case "local_variable_type":
      return printLocalVariableType(path, options, print);
    case "variable_declarator":
    case "local_variable_declarator":
      return printVariableDeclarator(path, options, print);
    case "sizeof_expression":
      return printSizeofExpression(path, options, print);
    case "object_creation_expression":
      return printObjectCreationExpression(path, options, print);
    case "new_expression":
      return printNewExpression(path, options, print);
    case "base_access_expression":
      return printBaseAccessExpression(path, options, print);
    case "method_invocation":
      return printMethodInvocation(path, options, print);
    case "interpolated_verbatium_string":
      return printInterpolatedVerbatiumString(path, options, print);
    case "interpolated_regular_string":
      return printInterpolatedRegularString(path, options, print);
    case "interpolated_regular_string_part":
    case "interpolated_verbatium_string_part":
      return printInterpolatedStringPart(path, options, print);
    case "interpolated_string_expression":
      return printInterpolatedStringExpression(path, options, print);
    case "if_statement":
      return printIfStatement(path, options, print);
    case "return_statement":
    case "throw_statement":
    case "break_statement":
    case "continue_statement":
      return printBreakingStatement(path, options, print);
    case "goto_statement":
      return printGotoStatement(path, options, print);
    case "switch_statement":
      return printSwitchStatement(path, options, print);
    case "switch_section":
      return printSwitchSection(path, options, print);
    case "switch_label":
      return printSwitchLabel(path, options, print);
    case "switch_filter":
      return printSwitchFilter(path, options, print);
    case "while_statement":
      return printWhileStatement(path, options, print);
    case "for_statement":
      return printForStatement(path, options, print);
    case "for_initializer":
      return printForInitializer(path, options, print);
    case "for_iterator":
      return printForIterator(path, options, print);
    case "foreach_statement":
      return printForeachStatement(path, options, print);
    case "do_statement":
      return printDoStatement(path, options, print);
    case "checked_statement":
    case "unchecked_statement":
    case "unsafe_statement":
      return printCheckedStatement(path, options, print);
    case "checked_expression":
    case "unchecked_expression":
      return printCheckedExpression(path, options, print);
    case "default_value_expression":
      return printDefaultValueExpression(path, options, print);
    case "anonymous_method_expression":
      return printAnonymousMethodExpression(path, options, print);
    case "typeof_expression":
      return printTypeofExpression(path, options, print);
    case "lock_statement":
    case "using_statement":
    case "fixed_statement":
      return printCapturingStatement(path, options, print);
    case "yield_statement":
      return printYieldStatement(path, options, print);
    case "resource_acquisition":
      return printResourceAcquisition(path, options, print);
    case "try_statement":
      return printTryStatement(path, options, print);
    case "catch_clauses":
      return printCatchClauses(path, options, print);
    case "specific_catch_clause":
    case "general_catch_clause":
      return printCatchClause(path, options, print);
    case "finally_clause":
      return printFinallyClause(path, options, print);
    case "exception_filter":
      return printExceptionFilter(path, options, print);
    case "object_or_collection_initializer":
      return printObjectOrCollectionInitializer(path, options, print);
    case "object_initializer":
    case "anonymous_object_initializer":
      return printObjectInitializer(path, options, print);
    case "collection_initializer":
      return printCollectionInitializer(path, options, print);
    case "tuple_initializer":
      return printTupleInitializer(path, options, print);
    case "tuple_element_initializer":
      return printTupleElementInitializer(path, options, print);
    case "member_initializer_list":
      return printMemberInitializerList(path, options, print);
    case "member_initializer":
      return printMemberInitializer(path, options, print);
    case "initializer_value":
      return printInitializerValue(path, options, print);
    case "member_declarator_list":
      return printMemberDeclaratorList(path, options, print);
    case "member_declarator":
      return printMemberDeclarator(path, options, print);
    case "element_initializer":
      return printElementInitializer(path, options, print);
    case "expression_list":
      return printExpressionList(path, options, print);
    case "rank_specifier":
      return printRankSpecifier(path, options, print);
    case "generic_dimension_specifier":
      return printGenericDimensionSpecifier(path, options, print);
    case "array_initializer":
      return printArrayInitializer(path, options, print);
    case "local_variable_initializer":
    case "variable_initializer":
      return printVariableInitializer(path, options, print);
    case "bracket_expression":
      return printBracketExpression(path, options, print);
    case "indexer_argument":
      return printIndexerArgument(path, options, print);
    case "query_expression":
      return printQueryExpression(path, options, print);
    case "from_clause":
      return printFromClause(path, options, print);
    case "query_body":
      return printQueryBody(path, options, print);
    case "query_body_clause":
      return printQueryBodyClause(path, options, print);
    case "where_clause":
      return printWhereClause(path, options, print);
    case "let_clause":
      return printLetClause(path, options, print);
    case "combined_join_clause":
      return printCombinedJoinClause(path, options, print);
    case "orderby_clause":
      return printOrderByClause(path, options, print);
    case "ordering":
      return printOrdering(path, options, print);
    case "select_or_group_clause":
      return printSelectOrGroupClause(path, options, print);
    case "query_continuation":
      return printQueryContinuation(path, options, print);
    case "accessor_declarations":
    case "set_accessor_declaration":
    case "get_accessor_declaration":
    case "event_accessor_declarations":
    case "add_accessor_declaration":
    case "remove_accessor_declaration":
      return printAccessorDeclarations(path, options, print);
    case "interface_accessors":
      return printInterfaceAccessors(path, options, print);
    case "lambda_expression":
      return printLambdaExpression(path, options, print);
    case "anonymous_function_signature":
      return printAnonymousFunctionSignature(path, options, print);
    case "anonymous_function_body":
      return printAnonymousFunctionBody(path, options, print);
    case "implicit_anonymous_function_parameter_list":
    case "explicit_anonymous_function_parameter_list":
      return printAnonymousFunctionParameterList(path, options, print);
    case "explicit_anonymous_function_parameter":
      return printExplicitAnonymousFunctionParameter(path, options, print);
    case "conversion_operator_declarator":
      return printConversionOperatorDeclarator(path, options, print);
    default:
      throw new Error(
        `Unknown C# node: ${node.nodeType || node.constructor.name}`
      );
  }
}

function getAll(node, types) {
  if (typeof types === "string") {
    return node[types] ? [types] : [];
  }
  return types.filter(type => node[type]);
}

function getAny(node, types) {
  if (typeof types === "string") {
    return node[types] ? types : undefined;
  }
  return types.find(type => node[type]);
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

function isSymbol(node, symbol) {
  return isType(node, "terminal") && node.value === symbol;
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
    return node.value;
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
    (node.comments &&
      node.comments.find(child => isType(child, "directive"))) ||
    (node.children && node.children.find(hasPreprocessorDirectives))
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
  print: printNode,
  printComment,
  canAttachComment,
  getCommentChildNodes,
  handleComments: {
    ownLine: handleOwnLineComments
  }
};
