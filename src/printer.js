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
  const docs = [];

  for (let child of node.children) {
    let r = group(printNode(child));
    docs.push(r);
  }

  return group(join(concat([hardline, hardline]), docs));
}

function printExternAliasDirectives(node) {
  const docs = [];

  for (let child of node.children) {
    let r = group(printNode(child));
    docs.push(r);
  }

  return group(join(hardline, docs));
}

function printExternAliasDirective(node) {
  assertNodeStructure(node, 4);

  return group(
    concat([
      "extern",
      line,
      "alias",
      line,
      printNode(node.children[2]),
      softline,
      ";"
    ])
  );
}

function printTerminalNode(node) {
  if (
    ["<EOF>", ";", ".", ",", "[", "]", "(", ")", ":"].includes(node.symbol.text)
  )
    return "";

  return node.symbol.text;
}

function printGenericSymbol(node) {
  if (node.symbol !== undefined) {
    return printNode(node);
  }

  assertNodeStructure(node, 1);

  return printGenericSymbol(node.children[0]);
}

function printIdentifier(node) {
  return printGenericSymbol(node);
}

function printUsingDirectives(node) {
  const groupUsingDirectives = (node, directiveName) => {
    return getChildNodes(node, directiveName).map(printNode);
  };

  const getUsingPath = parts => {
    if (
      typeof parts === "string" &&
      parts !== "using" &&
      parts != "static" &&
      alphanumerical(parts)
    ) {
      // If already string, just return
      return parts;
    } else if (parts.type === "group" || parts.type === "indent") {
      return getUsingPath(parts.contents);
    } else if (parts.type === "concat") {
      return parts.parts.map(getUsingPath).join("");
    } else {
      return "";
    }
  };

  // Sort usings.
  const sortUsingDirectives = docs => {
    for (let doc of docs) {
      doc.usingPath = getUsingPath(doc);
    }

    let [systems, others] = _.map(
      _.partition(docs, doc => doc.usingPath.startsWith("System")),
      docs => _.sortBy(docs, ["usingPath"])
    );

    return systems.concat(others);
  };

  let namespaces = sortUsingDirectives(
    groupUsingDirectives(node, "UsingNamespaceDirectiveContext")
  );
  let aliases = sortUsingDirectives(
    groupUsingDirectives(node, "UsingAliasDirectiveContext")
  );
  let statics = sortUsingDirectives(
    groupUsingDirectives(node, "UsingStaticDirectiveContext")
  );

  const docs = [namespaces, aliases, statics]
    .filter(usings => usings.length)
    .map(usings => join(hardline, usings));

  return join(doublehardline, docs);
}

function printUsingNamespaceDirective(node) {
  const docs = [];

  for (let child of node.children) {
    let r = printNode(child);
    if (r) docs.push(r);
  }

  return group(concat([join(line, docs), softline, ";"]));
}

function printNamespaceOrTypeName(node) {
  assertNodeStructure(node, 1, true);

  const identifiers = getChildNodes(node, "IdentifierContext");
  const typeArgumentList = getOptionalChildNode(
    node,
    "Type_argument_listContext"
  );

  const docs = [group(printDotList(identifiers))];

  if (typeArgumentList) {
    docs.push(softline, printNode(typeArgumentList));
  }

  return concat(docs);
}

function printUsingAliasDirective(node) {
  assertNodeStructure(node, 5);

  return group(
    concat([
      "using",
      group(
        indent(
          concat([
            line,
            printNode(node.children[1]),
            line,
            "=",
            group(
              indent(concat([line, printNode(node.children[3]), softline, ";"]))
            )
          ])
        )
      )
    ])
  );
}

function printUsingStaticDirective(node) {
  assertNodeStructure(node, 4);

  const docs = [];

  return group(
    concat([
      "using",
      line,
      "static",
      group(indent(concat([line, printNode(node.children[2]), softline, ";"])))
    ])
  );
}

function printTypeArgumentList(node) {
  return group(
    concat([
      "<",
      indent(group(printCommaList(node.children.slice(1, -1)))),
      softline,
      ">"
    ])
  );
}

function printType(node) {
  assertNodeStructure(node, 1);

  return printNode(node.children[0]);
}

function printList(separator, list) {
  if (!Array.isArray(list)) {
    throw new Error(`Not an array: ${list}`);
  }

  let docs = _.filter(_.filter(list).map(printNode));

  return join(separator, docs);
}

function printDotList(list) {
  return printList(concat([".", softline]), list);
}

function printCommaList(list) {
  return printList(concat([",", line]), list);
}

function printSpaceList(list) {
  return printList(line, list);
}

function printGlobalAttributeSection(node) {
  const globalAttributeTarget = getChildNode(
    node,
    "Global_attribute_targetContext"
  );
  const attributeList = getChildNode(node, "Attribute_listContext");

  const attributePart = [softline];

  if (globalAttributeTarget) {
    attributePart.push(printNode(globalAttributeTarget), ":", line);
  }

  attributePart.push(printNode(attributeList));

  return group(concat(["[", indent(concat(attributePart)), softline, "]"]));
}

function printGlobalAttributeTarget(node) {
  return printGenericSymbol(node);
}

function printAttributeList(node) {
  const attributes = getChildNodes(node, "AttributeContext");

  return printCommaList(attributes);
}

function printAttribute(node) {
  const namespaceOrTypeName = getChildNode(
    node,
    "Namespace_or_type_nameContext"
  );
  const attributeArguments = getChildNodes(node, "Attribute_argumentContext");

  const docs = [printNode(namespaceOrTypeName), softline];

  if (attributeArguments.length) {
    docs.push(
      group(
        concat([
          "(",
          indent(concat([softline, printCommaList(attributeArguments)])),
          softline,
          ")"
        ])
      )
    );
  }

  return group(concat(docs));
}

function printAttributeArgument(node) {
  assertNodeStructure(node, 1);

  return printNode(node.children[0]);
}

function printAttributes(node) {
  return join(hardline, node.children.map(printNode));
}

function printAttributeSection(node) {
  const attributeTarget = getOptionalChildNode(node, "Attribute_targetContext");
  const attributeList = getChildNode(node, "Attribute_listContext");

  const attributePart = [softline];

  if (attributeTarget) {
    attributePart.push(printNode(attributeTarget), ":", line);
  }

  attributePart.push(printNode(attributeList));

  return group(concat(["[", indent(concat(attributePart)), softline, "]"]));
}

function printExpression(node) {
  return group(join(line, node.children.map(printNode)));
}

function printParenthesisExpression(node) {
  const expression = getChildNode(node, "ExpressionContext");

  return group(concat(["(", softline, printNode(expression), softline, ")"]));
}

function printSimpleNameExpression(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const typeArgumentList = getOptionalChildNode(
    node,
    "Type_argument_listContext"
  );

  const docs = [printNode(identifier)];

  if (typeArgumentList) {
    docs.push(softline, printNode(typeArgumentList));
  }

  return group(concat(docs));
}

function printNamespaceMemberDeclarations(node) {
  return join(doublehardline, node.children.map(printNode));
}

function printNamespaceMemberDeclaration(node) {
  assertNodeStructure(node, 1);

  return printNode(node.children[0]);
}

function printNamespaceDeclaration(node) {
  const qualifiedIdentifier = getChildNode(node, "Qualified_identifierContext");
  const namespaceBody = getChildNode(node, "Namespace_bodyContext");

  return group(
    concat([
      group(concat(["namespace", line, printNode(qualifiedIdentifier)])),
      hardline,
      printNode(namespaceBody),
      hardline
    ])
  );
}

function printBracketBody(node) {
  assertNodeStructure(node, 2, true);

  const children = node.children.slice(1, -1);

  const body = children.length
    ? concat([
        indent(
          concat([hardline, join(doublehardline, children.map(printNode))])
        ),
        hardline
      ])
    : line;

  return group(concat(["{", body, "}"]));
}

function printTypeDeclaration(node) {
  return group(join(" ", node.children.map(printNode)));
}

function printClassDefinition(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const classBase = getOptionalChildNode(node, "Class_baseContext");
  const classBody = getChildNode(node, "Class_bodyContext");

  let classHead = ["class", line, printNode(identifier)];

  if (classBase) {
    classHead.push(line, printNode(classBase));
  }

  return group(concat([group(concat(classHead)), line, printNode(classBody)]));
}

function printClassBase(node) {
  assertNodeStructure(node, 2, true);

  return group(concat([":", line, printCommaList(node.children.slice(1))]));
}

function printClassMemberDeclarations(node) {
  // FIXME: Maybe group by type.
  return join(doublehardline, node.children.map(printNode));
}

function printClassMemberDeclaration(node) {
  const attributes = getOptionalChildNode(node, "AttributesContext");
  const allMemberModifiers = getOptionalChildNode(
    node,
    "All_member_modifiersContext"
  );
  const memberDefinition = getAnyChildNode(node, [
    "Common_member_declarationContext",
    "Destructor_definitionContext"
  ]);

  const docs = [];

  if (attributes) {
    docs.push(group(concat([printNode(attributes), hardline])));
  }

  const memberWithModifiers = [];

  if (allMemberModifiers) {
    memberWithModifiers.push(printNode(allMemberModifiers), line);
  }

  memberWithModifiers.push(printNode(memberDefinition));

  docs.push(group(concat(memberWithModifiers)));

  return group(concat(docs));
}

function printCommonMemberDeclaration(node) {
  return group(join(" ", node.children.map(printNode)));
}

function printMethodDeclaration(node) {
  assertNodeStructure(node, 4, true);

  const methodMemberName = getChildNode(node, "Method_member_nameContext");
  const formalParameterList = getOptionalChildNode(
    node,
    "Formal_parameter_listContext"
  );
  const methodBody = getOptionalChildNode(node, "Method_bodyContext");
  const rightArrow = getOptionalChildNode(node, "Right_arrowContext");
  const expression = getOptionalChildNode(node, "ExpressionContext");

  const docs = [printNode(methodMemberName)];

  docs.push(softline, "(");

  if (formalParameterList) {
    docs.push(printNode(formalParameterList));
  }

  docs.push(softline, ")");
  docs.push(line);

  if (rightArrow && expression) {
    docs.push(printNode(expression));
  } else if (methodBody) {
    docs.push(printNode(methodBody));
  }

  return concat(docs);
}

function printQualifiedIdentifier(node) {
  return printDotList(node.children);
}

function printAllMemberModifiers(node) {
  let resharperOrder = [
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
    "async"
  ];

  let modifiers = node.children.map(printNode).map(_.toString);

  let orderedModifiers = _.intersection(resharperOrder, modifiers);

  return group(join(line, orderedModifiers));
}

function printAllMemberModifier(node) {
  return printGenericSymbol(node);
}

function printMethodMemberName(node) {
  return printDotList(node.children);
}

function printMethodBody(node) {
  assertNodeStructure(node, 1);

  return printNode(node.children[0]);
}

function printBlock(node) {
  const docs = [];

  docs.push("{");

  const statementList = getOptionalChildNode(node, "Statement_listContext");

  if (statementList) {
    docs.push(indent(printNode(statementList)));
  }

  docs.push(line, "}");

  return concat(docs);
}

function printFormalParameterList(node) {
  const fixedParameters = getChildNode(node, "Fixed_parametersContext");
  const parameterArray = getOptionalChildNode(node, "Parameter_arrayContext");

  return printCommaList([fixedParameters, parameterArray]);
}

function printFixedParameters(node) {
  const fixedParameters = getChildNodes(node, "Fixed_parameterContext");

  return indent(
    concat([
      softline,
      join(concat([",", line]), fixedParameters.map(printNode))
    ])
  );
}

function printFixedParameter(node) {
  // FIXME: Handle __arglist if somebody cares.
  const argDeclaration = getOptionalChildNode(node, "Arg_declarationContext");
  const parameterModifier = getOptionalChildNode(
    node,
    "Parameter_modifierContext"
  );

  return printSpaceList([parameterModifier, argDeclaration]);
}

function printArgDeclaration(node) {
  const type = getChildNode(node, "TypeContext");
  const identifier = getOptionalChildNode(node, "IdentifierContext");

  return printSpaceList([type, identifier]);
}

function printInterfaceDefinition(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const variantTypeParameterList = getOptionalChildNode(
    node,
    "Variant_type_parameter_listContext"
  );
  const interfaceBase = getOptionalChildNode(node, "Interface_baseContext");
  const interfaceBody = getChildNode(node, "Interface_bodyContext");

  let interfaceHead = ["interface", line, printNode(identifier)];

  if (variantTypeParameterList) {
    interfaceHead.push(softline, printNode(variantTypeParameterList));
  }

  if (interfaceBase) {
    interfaceHead.push(line, printNode(interfaceBase));
  }

  return group(
    concat([group(concat(interfaceHead)), line, printNode(interfaceBody)])
  );
}

function printVariantTypeParameterList(node) {
  const variantTypeParameters = getChildNodes(
    node,
    "Variant_type_parameterContext"
  );

  return group(concat(["<", printCommaList(variantTypeParameters), ">"]));
}

function printVariantTypeParameter(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const varianceAnnotation = getOptionalChildNode(
    node,
    "Variance_annotationContext"
  );

  return printSpaceList([varianceAnnotation, identifier]);
}

function printVarianceAnnotation(node) {
  return printGenericSymbol(node);
}

function printDelegateDefinition(node) {
  const returnType = getChildNode(node, "Return_typeContext");
  const identifier = getChildNode(node, "IdentifierContext");
  const variantTypeParameterList = getOptionalChildNode(
    node,
    "Variant_type_parameter_listContext"
  );
  const typeParameterConstraintsClauses = getOptionalChildNode(
    node,
    "Type_parameter_constraints_clausesContext"
  );
  const formalParameterList = getOptionalChildNode(
    node,
    "Formal_parameter_listContext"
  );

  return group(
    concat([
      group(concat(["delegate", line, printNode(returnType)])),
      indent(
        group(
          concat([
            line,
            group(
              concat([
                group(
                  concat([
                    printNode(identifier),
                    softline,
                    variantTypeParameterList
                      ? printNode(variantTypeParameterList)
                      : softline,
                    softline,
                    "(",
                    formalParameterList
                      ? printNode(formalParameterList)
                      : softline,
                    ")"
                  ])
                ),
                line,
                typeParameterConstraintsClauses
                  ? indent(group(printNode(typeParameterConstraintsClauses)))
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

function printReturnType(node) {
  return printGenericSymbol(node);
}

function printTypeParameterConstraintsClauses(node) {
  const clauses = getChildNodes(
    node,
    "Type_parameter_constraints_clauseContext"
  );

  return printCommaList(clauses);
}

function printTypeParameterConstraintsClause(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const typeParameterContraints = getChildNode(
    node,
    "Type_parameter_constraintsContext"
  );

  return concat([
    "where",
    line,
    printNode(identifier),
    line,
    ":",
    line,
    printNode(typeParameterContraints)
  ]);
}

function printTypeParameterConstraints(node) {
  const constraint = getAnyChildNode(node, [
    "Constructor_constraintContext",
    "Primary_constraintContext"
  ]);

  return printNode(constraint);
}

function printPrimaryConstraint(node) {
  return printGenericSymbol(node);
}

function printAssignment(node) {
  const unaryExpression = getChildNode(node, "Unary_expressionContext");
  const assignmentOperator = getChildNode(node, "Assignment_operatorContext");
  const expression = getChildNode(node, "ExpressionContext");

  return group(
    concat([
      group(
        concat([
          printNode(unaryExpression),
          line,
          printNode(assignmentOperator)
        ])
      ),
      line,
      printNode(expression)
    ])
  );
}

function printAssignmentOperator(node) {
  return printGenericSymbol(node);
}

function printNode(node) {
  if (!node || node.parentCtx === undefined) {
    throw new Error(`Not a node: ${node}`);
  }

  // console.log(node.constructor.name);
  switch (node.constructor.name) {
    case "Compilation_unitContext":
      return printCompilationUnit(node);
    case "Extern_alias_directivesContext":
      return printExternAliasDirectives(node);
    case "Extern_alias_directiveContext":
      return printExternAliasDirective(node);
    case "TerminalNodeImpl":
      return printTerminalNode(node);
    case "IdentifierContext":
      return printIdentifier(node);
    case "Using_directivesContext":
      return printUsingDirectives(node);
    case "UsingNamespaceDirectiveContext":
      return printUsingNamespaceDirective(node);
    case "Namespace_or_type_nameContext":
      return printNamespaceOrTypeName(node);
    case "UsingAliasDirectiveContext":
      return printUsingAliasDirective(node);
    case "Type_argument_listContext":
      return printTypeArgumentList(node);
    case "TypeContext":
    case "Base_typeContext":
    case "Class_typeContext":
    case "Simple_typeContext":
    case "Numeric_typeContext":
    case "Integral_typeContext":
      return printType(node);
    case "UsingStaticDirectiveContext":
      return printUsingStaticDirective(node);
    case "Global_attribute_sectionContext":
      return printGlobalAttributeSection(node);
    case "Global_attribute_targetContext":
      return printGlobalAttributeTarget(node);
    case "Attribute_listContext":
      return printAttributeList(node);
    case "AttributeContext":
      return printAttribute(node);
    case "AttributesContext":
      return printAttributes(node);
    case "Attribute_argumentContext":
      return printAttributeArgument(node);
    case "Attribute_sectionContext":
      return printAttributeSection(node);
    case "Method_member_nameContext":
      return printMethodMemberName(node);
    case "Formal_parameter_listContext":
      return printFormalParameterList(node);
    case "Fixed_parametersContext":
      return printFixedParameters(node);
    case "Fixed_parameterContext":
      return printFixedParameter(node);
    case "Method_bodyContext":
      return printMethodBody(node);
    case "ExpressionContext":
    case "Non_assignment_expressionContext":
    case "Conditional_expressionContext":
    case "Null_coalescing_expressionContext":
    case "Conditional_or_expressionContext":
    case "Conditional_and_expressionContext":
    case "Inclusive_or_expressionContext":
    case "Exclusive_or_expressionContext":
    case "And_expressionContext":
    case "Equality_expressionContext":
    case "Relational_expressionContext":
    case "Shift_expressionContext":
    case "Additive_expressionContext":
    case "Multiplicative_expressionContext":
    case "Unary_expressionContext":
    case "Primary_expressionContext":
    case "LiteralExpressionContext":
    case "LiteralContext":
    case "Boolean_literalContext":
    case "String_literalContext":
      return printExpression(node);
    case "ParenthesisExpressionsContext":
      return printParenthesisExpression(node);
    case "SimpleNameExpressionContext":
      return printSimpleNameExpression(node);
    case "Namespace_member_declarationsContext":
      return printNamespaceMemberDeclarations(node);
    case "Namespace_member_declarationContext":
      return printNamespaceMemberDeclaration(node);
    case "Type_declarationContext":
      return printTypeDeclaration(node);
    case "Namespace_declarationContext":
      return printNamespaceDeclaration(node);
    case "Namespace_bodyContext":
    case "Class_bodyContext":
    case "Interface_bodyContext":
      return printBracketBody(node);
    case "Class_definitionContext":
      return printClassDefinition(node);
    case "Class_baseContext":
      return printClassBase(node);
    case "Qualified_identifierContext":
      return printQualifiedIdentifier(node);
    case "All_member_modifiersContext":
      return printAllMemberModifiers(node);
    case "All_member_modifierContext":
      return printAllMemberModifier(node);
    case "Class_member_declarationsContext":
      return printClassMemberDeclarations(node);
    case "Class_member_declarationContext":
      return printClassMemberDeclaration(node);
    case "Common_member_declarationContext":
      return printCommonMemberDeclaration(node);
    case "Method_declarationContext":
      return printMethodDeclaration(node);
    case "Arg_declarationContext":
      return printArgDeclaration(node);
    case "BlockContext":
      return printBlock(node);
    case "Interface_definitionContext":
      return printInterfaceDefinition(node);
    case "Variant_type_parameter_listContext":
      return printVariantTypeParameterList(node);
    case "Variant_type_parameterContext":
      return printVariantTypeParameter(node);
    case "Variance_annotationContext":
      return printVarianceAnnotation(node);
    case "Delegate_definitionContext":
      return printDelegateDefinition(node);
    case "Return_typeContext":
      return printReturnType(node);
    case "Type_parameter_constraints_clausesContext":
      return printTypeParameterConstraintsClauses(node);
    case "Type_parameter_constraints_clauseContext":
      return printTypeParameterConstraintsClause(node);
    case "Type_parameter_constraintsContext":
      return printTypeParameterConstraints(node);
    case "Primary_constraintContext":
      return printPrimaryConstraint(node);
    case "AssignmentContext":
      return printAssignment(node);
    case "Assignment_operatorContext":
      return printAssignmentOperator(node);
    default:
      console.error("Unknown C# node:", node.constructor.name);
      return `{${node.constructor.name}}`;
  }
}

function getChildNodes(node, type) {
  return node.children.filter(n => n.constructor.name === type);
}

function getOptionalChildNode(node, type) {
  return node.children.find(n => n.constructor.name === type);
}

function getAnyChildNode(node, types) {
  return node.children.find(n => types.includes(n.constructor.name));
}

function getChildNode(node, type) {
  const child = getOptionalChildNode(node, type);

  if (!child) {
    debugger;
    throw new Error(
      `Missing child node ${type} inside ${
        node.constructor.name
      }. Children are: ${node.children.map(_.toString).join(", ")}`
    );
  }

  return child;
}

function assertNodeStructure(node, expectedLength, atLeast = false) {
  if (
    atLeast
      ? node.children.length < expectedLength
      : node.children.length !== expectedLength
  ) {
    debugger;
    throw new Error(
      `Unexpected node structure: ${
        node.children.length
      }/${expectedLength} children for ${node.constructor.name}`
    );
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
