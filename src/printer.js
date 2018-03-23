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

  return group(join(doublehardline, docs));
}

function printExternAliasDirectives(node) {
  const externAliasDirectives = getChildNodes(
    node,
    "Extern_alias_directiveContext"
  );

  return group(join(hardline, externAliasDirectives.map(printNode)));
}

function printExternAliasDirective(node) {
  const identifier = getChildNode(node, "IdentifierContext");

  return group(
    concat([
      "extern",
      " ",
      "alias",
      indent(concat([line, printNode(identifier)])),
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

  if (node.children.length === 1) return printGenericSymbol(node.children[0]);

  // Certain symbols are parsed as 2 symbols, eg. "<<".
  return concat(node.children.map(printGenericSymbol));
}

function printIdentifier(node) {
  return printGenericSymbol(node);
}

function printKeyword(node) {
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

function printNamespaceOrTypeName(node) {
  const identifiers = getChildNodes(node, "IdentifierContext");
  const typeArgumentList = getOptionalChildNode(
    node,
    "Type_argument_listContext"
  );

  const docs = [printDotList(identifiers)];

  if (typeArgumentList) {
    docs.push(printNode(typeArgumentList));
  }

  return group(concat(docs));
}

function printUsingNamespaceDirective(node) {
  const namespace = getChildNode(node, "Namespace_or_type_nameContext");

  return group(
    concat(["using", indent(concat([line, printNode(namespace)])), ";"])
  );
}

function printUsingAliasDirective(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const namespace = getChildNode(node, "Namespace_or_type_nameContext");

  return group(
    concat([
      "using",
      indent(
        concat([
          line,
          printNode(identifier),
          line,
          "=",
          indent(concat([line, printNode(namespace), ";"]))
        ])
      )
    ])
  );
}

function printUsingStaticDirective(node) {
  const namespace = getChildNode(node, "Namespace_or_type_nameContext");

  return group(
    concat([
      "using",
      " ",
      "static",
      indent(concat([line, printNode(namespace)])),
      ";"
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

function printArgumentList(node) {
  return printCommaList(node.children);
}

function printArgument(node) {
  const identifier = getOptionalChildNode(node, "IdentifierContext");
  const expression = getChildNode(node, "ExpressionContext");
  const refout = node.refout;

  const docs = [];

  if (identifier) {
    docs.push(printNode(identifier), softline, ":", line);
  }

  if (refout) {
    docs.push(refout.text, line);
  }

  docs.push(printNode(expression));

  return group(concat(docs));
}

function printType(node) {
  const baseType = getChildNode(node, "Base_typeContext");
  const specifiers = node.children.slice(1);

  return concat([printNode(baseType), ...specifiers.map(printNode)]);
}

function printBaseType(node) {
  const simpleType = getOptionalChildNode(node, "Simple_typeContext");
  const classType = getOptionalChildNode(node, "Class_typeContext");

  if (simpleType) return printNode(simpleType);
  if (classType) return printNode(classType);

  return concat(["void", "*"]);
}

function printSimpleType(node) {
  return printGenericSymbol(node);
}

function printClassType(node) {
  const namespace = getOptionalChildNode(node, "Namespace_or_type_nameContext");

  if (namespace) return printNode(namespace);

  return printGenericSymbol(node);
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

function printCommaList(list, separator = line) {
  return printList(concat([",", separator]), list);
}

function printCommaList(list) {
  return printList(concat([",", line]), list);
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

  const hasParenthesis =
    attributeArguments.length || isSymbol(node.children[1], "(");

  const docs = [printNode(namespaceOrTypeName)];

  if (hasParenthesis) {
    docs.push("(");
  }

  if (attributeArguments.length) {
    docs.push(indent(concat([softline, printCommaList(attributeArguments)])));
  }

  if (hasParenthesis) {
    docs.push(")");
  }

  return group(concat(docs));
}

function printAttributeArgument(node) {
  const identifier = getOptionalChildNode(node, "IdentifierContext");
  const expression = getChildNode(node, "ExpressionContext");

  const docs = [];

  if (identifier) {
    docs.push(printNode(identifier), ":");
  }

  docs.push(printNode(expression));

  return group(concat(docs));
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

function printAttributeTarget(node) {
  const identifier = getOptionalChildNode(node, "IdentifierContext");

  if (!identifier) return printGenericSymbol(node);

  return printNode(identifier);
}

function printExpression(node) {
  if (node.children.length === 1) return printNode(node.children[0]);

  return group(join(line, node.children.map(printNode)));
}

function printPrimaryExpression(node) {
  const parts = [];

  let currentPart = [];
  parts.push(currentPart);

  for (let child of node.children) {
    if (child.constructor.name === "Member_accessContext") {
      currentPart = [];
      parts.push(currentPart);
    }

    currentPart.push(child);
  }

  const separator = parts.length > 3 ? hardline : softline;

  return group(
    concat([
      group(join(softline, parts[0].map(printNode))),
      indent(
        group(
          concat([
            separator,
            join(
              separator,
              parts
                .slice(1)
                .map(part => group(join(softline, part.map(printNode))))
            )
          ])
        )
      )
    ])
  );
}

function printUnaryExpression(node) {
  const primaryExpression = getOptionalChildNode(
    node,
    "Primary_expressionContext"
  );

  if (primaryExpression) {
    return printNode(primaryExpression);
  }

  const unaryExpression = getChildNode(node, "Unary_expressionContext");

  const type = getOptionalChildNode(node, "TypeContext");

  if (type) {
    return group(
      concat(["(", printNode(type), ")", line, printNode(unaryExpression)])
    );
  }

  let separator = isSymbol(node.children[0], "await") ? line : softline;

  return group(join(softline, node.children.map(printNode)));
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
  const namespaceMemberDeclarations = getChildNodes(
    node,
    "Namespace_member_declarationContext"
  );

  return group(
    join(doublehardline, namespaceMemberDeclarations.map(printNode))
  );
}

function printNamespaceMemberDeclaration(node) {
  const namespace = getAnyChildNode(node, [
    "Namespace_declarationContext",
    "Type_declarationContext"
  ]);

  return group(printNode(namespace));
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
  return group(printList(" ", node.children));
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
    memberWithModifiers.push(printNode(allMemberModifiers), " ");
  }

  memberWithModifiers.push(printNode(memberDefinition));

  docs.push(group(concat(memberWithModifiers)));

  return group(concat(docs));
}

function printCommonMemberDeclaration(node) {
  return printList(line, node.children);
}

function printMethodDeclaration(node) {
  const methodMemberName = getAnyChildNode(node, [
    "Method_member_nameContext",
    "IdentifierContext"
  ]);
  const typeParameterList = getOptionalChildNode(
    node,
    "Type_parameter_listContext"
  );
  const formalParameterList = getOptionalChildNode(
    node,
    "Formal_parameter_listContext"
  );
  const methodBody = getAnyChildNode(node, [
    "Method_bodyContext",
    "BodyContext"
  ]);
  const rightArrow = getOptionalChildNode(node, "Right_arrowContext");
  const expression = getOptionalChildNode(node, "ExpressionContext");

  const constructorInitializer = getOptionalChildNode(
    node,
    "Constructor_initializerContext"
  );
  const typeParameterConstraintsClauses = getOptionalChildNode(
    node,
    "Type_parameter_constraints_clausesContext"
  );

  const docs = [printNode(methodMemberName)];

  if (typeParameterList) {
    docs.push(printNode(typeParameterList));
  }

  docs.push("(");

  if (formalParameterList) {
    docs.push(printNode(formalParameterList));
  }

  docs.push(")");

  if (typeParameterConstraintsClauses) {
    docs.push(line, printNode(typeParameterConstraintsClauses));
  }

  if (constructorInitializer) {
    docs.push(" ", ":");
    docs.push(
      indent(group(concat([hardline, printNode(constructorInitializer)])))
    );
  }

  if (rightArrow && expression) {
    docs.push(
      line,
      "=>",
      indent(group(concat([line, printNode(expression), ";"])))
    );
  } else if (methodBody) {
    docs.push(printNode(methodBody));
  }

  return concat(docs);
}

function printQualifiedIdentifier(node) {
  return printDotList(node.children);
}

function printConstructorInitializer(node) {
  assertNodeStructure(node, 2, true);

  const base = node.children[1]; // base or this
  const argumentList = getOptionalChildNode(node, "Argument_listContext");

  const docs = [printNode(base), "("];

  if (argumentList) {
    docs.push(indent(concat([softline, printNode(argumentList)])), softline);
  }

  docs.push(")");

  return group(concat(docs));
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

  let modifiers = node.children.map(printNode);
  let orderedModifiers = _.intersection(resharperOrder, modifiers);

  return group(join(line, orderedModifiers));
}

function printAllMemberModifier(node) {
  return printGenericSymbol(node);
}

function printMethodMemberName(node) {
  return printDotList(node.children);
}

function printMemberAccess(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const typeArgumentList = getOptionalChildNode(
    node,
    "Type_argument_listContext"
  );
  const isNullCoalescent = isSymbol(node.children[0], "?");

  const docs = [];

  if (isNullCoalescent) {
    docs.push("?");
  }

  docs.push(softline, ".", printNode(identifier));

  if (typeArgumentList) {
    docs.push(softline, printNode(typeArgumentList));
  }

  return group(concat(docs));
}

function printMethodBody(node) {
  const block = getOptionalChildNode(node, "BlockContext");

  if (!block) return ";";

  return concat([line, printNode(block)]);
}

function printBlock(node) {
  const docs = [];

  docs.push("{");

  const statementList = getOptionalChildNode(node, "Statement_listContext");

  if (statementList) {
    docs.push(indent(concat([hardline, printNode(statementList)])));
  }

  docs.push(line, "}");

  return concat(docs);
}

function printFormalParameterList(node) {
  const fixedParameters = getOptionalChildNode(node, "Fixed_parametersContext");
  const parameterArray = getOptionalChildNode(node, "Parameter_arrayContext");

  return group(
    concat([indent(concat([softline, printNode(fixedParameters)])), softline])
  );
}

function printFixedParameters(node) {
  const fixedParameters = getChildNodes(node, "Fixed_parameterContext");

  return printCommaList(fixedParameters);
}

function printFixedParameter(node) {
  // FIXME: Handle __arglist if somebody cares.
  const argDeclaration = getOptionalChildNode(node, "Arg_declarationContext");
  const attributes = getOptionalChildNode(node, "AttributesContext");
  const parameterModifier = getOptionalChildNode(
    node,
    "Parameter_modifierContext"
  );

  return group(
    printList(line, [attributes, parameterModifier, argDeclaration])
  );
}

function printArgDeclaration(node) {
  const type = getChildNode(node, "TypeContext");
  const identifier = getOptionalChildNode(node, "IdentifierContext");

  return printList(line, [type, identifier]);
}

function printConstantDeclaration(node) {
  const type = getChildNode(node, "TypeContext");
  const constantDeclarators = getChildNode(node, "Constant_declaratorsContext");

  return group(
    concat([
      group(concat(["const", line, printNode(type)])),
      indent(concat([line, printNode(constantDeclarators)])),
      ";"
    ])
  );
}

function printConstantDeclarators(node) {
  const constantDeclarators = getChildNodes(node, "Constant_declaratorContext");

  return printCommaList(constantDeclarators);
}

function printConstantDeclarator(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const expression = getChildNode(node, "ExpressionContext");

  return group(
    concat([printNode(identifier), line, "=", line, printNode(expression)])
  );
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

  return group(
    concat(["<", indent(group(printCommaList(variantTypeParameters))), ">"])
  );
}

function printVariantTypeParameter(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const attributes = getOptionalChildNode(node, "AttributesContext");
  const varianceAnnotation = getOptionalChildNode(
    node,
    "Variance_annotationContext"
  );

  return printList(line, [attributes, varianceAnnotation, identifier]);
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
  const typeParameterConstraints = getChildNode(
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
    printNode(typeParameterConstraints)
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
  const classType = getOptionalChildNode(node, "Class_typeContext");

  if (!classType) return printGenericSymbol(node);

  return printNode(classType);
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

function printTypedMemberDeclaration(node) {
  const type = getChildNode(node, "TypeContext");
  const declaration = getAnyChildNode(node, [
    "Namespace_or_type_nameContext",
    "Method_declarationContext",
    "Property_declarationContext",
    "Indexer_declarationContext",
    "Operator_declarationContext",
    "Field_declarationContext"
  ]);

  if (
    declaration &&
    declaration.constructor.name === "Namespace_or_type_nameContext"
  ) {
    const indexer = getChildNode(node, "Indexer_declarationContext");

    return group(
      concat([
        printNode(type),
        line,
        printNode(declaration),
        softline,
        ".",
        softline,
        printNode(indexer)
      ])
    );
  }

  return group(concat([printNode(type), line, printNode(declaration)]));
}

function printStatementList(node) {
  return printList(hardline, node.children);
}

function printDeclarationStatement(node) {
  const declaration = getAnyChildNode(node, [
    "Local_variable_declarationContext",
    "Local_constant_declarationContext"
  ]);

  return group(concat([printNode(declaration), ";"]));
}

function printLabeledStatement(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const statement = getAnyChildNode(node, [
    "LabeledStatementContext",
    "DeclarationStatementContext",
    "EmbeddedStatementContext"
  ]);

  return group(
    concat([printNode(identifier), ":", line, printNode(statement)])
  );
}

function printEmbeddedStatement(node) {
  assertNodeStructure(node, 1);

  return printNode(node.children[0]);
}

function printExpressionStatement(node) {
  const expression = getChildNode(node, "ExpressionContext");

  return group(concat([printNode(expression), ";"]));
}

function printEmptyStatement(node) {
  // FIXME: This will potentially push 2 successive hardlines.
  // return ";";
  return "";
}

function printStatement(node) {
  const declaration = getAnyChildNode(node, [
    "Local_variable_declarationContext",
    "Local_constant_declarationContext"
  ]);
  const statement = getAnyChildNode(node, [
    "Labeled_statementContext",
    "Embedded_statementContext"
  ]);

  if (statement) return printNode(statement);

  return concat([printNode(declaration), ";"]);
}

function printLocalVariableDeclaration(node) {
  const localVariableType = getChildNode(node, "Local_variable_typeContext");
  const localVariableDeclarators = getChildNodes(
    node,
    "Local_variable_declaratorContext"
  );

  let separator = localVariableDeclarators.length > 1 ? hardline : line;

  return group(
    concat([
      printNode(localVariableType),
      indent(
        concat([separator, printCommaList(localVariableDeclarators, separator)])
      )
    ])
  );
}

function printLocalConstantDeclaration(node) {
  const type = getChildNode(node, "TypeContext");
  const constantDeclarators = getChildNodes(
    node,
    "Constant_declaratorsContext"
  );

  return group(
    concat([
      group(concat("const", " ", printNode(type))),
      indent(concat([line, printCommaList(constantDeclarators)]))
    ])
  );
}

function printLocalVariableType(node) {
  const type = getOptionalChildNode(node, "TypeContext");

  if (type) {
    return printNode(type);
  }

  return "var";
}

function printLocalVariableDeclarator(node) {
  const identifier = getChildNode(node, "IdentifierContext");

  const initializer = getOptionalChildNode(
    node,
    "Local_variable_initializerContext"
  );

  const docs = [printNode(identifier)];

  if (initializer) {
    docs.push(line, "=");
    docs.push(indent(concat([line, printNode(initializer)])));
  }

  return group(concat(docs));
}

function printLocalVariableInitializer(node) {
  const initializer = getAnyChildNode(node, [
    "ExpressionContext",
    "Array_initializerContext",
    "Local_variable_initializer_unsafeContext"
  ]);

  return printNode(initializer);
}

function printSizeofExpression(node) {
  const type = getChildNode(node, "TypeContext");

  return group(
    concat([
      "sizeof",
      "(",
      concat([softline, indent(group(printNode(type)))]),
      softline,
      ")"
    ])
  );
}

function printObjectCreationExpression(node) {
  assertNodeStructure(node, 2, true);

  let expressionPart = [];

  let context = node.children[1].constructor.name;

  if (context === "TypeContext") {
    const type = getChildNode(node, "TypeContext");
    const objectOrCollection = getAnyChildNode(node, [
      "Object_creation_expressionContext",
      "Object_or_collection_initializerContext"
    ]);

    expressionPart.push(printNode(type));

    if (objectOrCollection) {
      expressionPart.push(line, printNode(objectOrCollection));
    } else {
      const expressionList = getOptionalChildNode(
        node,
        "Expression_listContext"
      );
      const rankSpecifiers = getChildNodes(node, "Rank_specifierContext");
      const arrayInitializer = getOptionalChildNode(
        node,
        "Array_initializerContext"
      );

      if (expressionList) {
        expressionPart.push("[", printNode(expressionList), "]");
      }

      if (rankSpecifiers) {
        expressionPart.push(line, concat(rankSpecifiers.map(printNode)));
      }

      if (arrayInitializer) {
        expressionPart.push(line, printNode(arrayInitializer));
      }
    }
  } else if (context === "Anonymous_object_initializerContext") {
    const anonymousObjectInitializer = getChildNode(
      node,
      "Anonymous_object_initializerContext"
    );
    expressionPart.push(printNode(anonymousObjectInitializer));
  } else if (context === "Rank_specifierContext") {
    const rankSpecifier = getChildNode(node, "Rank_specifierContext");
    const arrayInitializer = getChildNode(node, "Array_initializerContext");

    expressionPart.push(
      printNode(rankSpecifier),
      line,
      printNode(arrayInitializer)
    );
  }

  return group(concat(["new", " ", concat(expressionPart)]));
}

function printBaseAccessExpression(node) {
  const identifier = getOptionalChildNode(node, "IdentifierContext");
  const typeArgumentList = getOptionalChildNode(
    node,
    "Type_argument_listContext"
  );
  const expressionList = getOptionalChildNode(node, "Expression_listContext");

  const docs = ["base"];

  if (identifier) {
    docs.push(".");
    docs.push(printNode(identifier));

    if (typeArgumentList) {
      docs.push(printNode(typeArgumentList));
    }
  } else if (expressionList) {
    docs.push(
      "[",
      indent(concat([softline, printNode(expressionList)])),
      softline,
      "]"
    );
  }

  return group(concat(docs));
}

function printNode(node) {
  if (!node || node.parentCtx === undefined) {
    debugger;
    throw new Error(`Not a node: ${node}`);
  }

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
    case "KeywordContext":
      return printKeyword(node);
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
    case "Argument_listContext":
      return printArgumentList(node);
    case "ArgumentContext":
      return printArgument(node);
    case "TypeContext":
      return printType(node);
    case "Base_typeContext":
      return printBaseType(node);
    case "Class_typeContext":
      return printClassType(node);
    case "Predefined_typeContext":
    case "Simple_typeContext":
    case "Numeric_typeContext":
    case "Integral_typeContext":
      return printSimpleType(node);
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
    case "Attribute_targetContext":
      return printAttributeTarget(node);
    case "Method_member_nameContext":
      return printMethodMemberName(node);
    case "Formal_parameter_listContext":
      return printFormalParameterList(node);
    case "Fixed_parametersContext":
      return printFixedParameters(node);
    case "Fixed_parameterContext":
      return printFixedParameter(node);
    case "Method_bodyContext":
    case "BodyContext":
      return printMethodBody(node);
    case "ExpressionContext":
    case "MemberAccessExpressionContext":
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
    case "LiteralExpressionContext":
    case "LiteralContext":
    case "Boolean_literalContext":
    case "String_literalContext":
      return printExpression(node);
    case "Primary_expressionContext":
      return printPrimaryExpression(node);
    case "Unary_expressionContext":
      return printUnaryExpression(node);
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
    case "Constructor_declarationContext":
    case "Destructor_definitionContext":
      return printMethodDeclaration(node);
    case "Constructor_initializerContext":
      return printConstructorInitializer(node);
    case "Arg_declarationContext":
      return printArgDeclaration(node);
    case "Constant_declarationContext":
      return printConstantDeclaration(node);
    case "Constant_declaratorsContext":
      return printConstantDeclarators(node);
    case "Constant_declaratorContext":
      return printConstantDeclarator(node);
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
    case "Typed_member_declarationContext":
      return printTypedMemberDeclaration(node);
    case "Member_accessContext":
      return printMemberAccess(node);
    case "Statement_listContext":
      return printStatementList(node);
    case "LabeledStatementContext":
    case "EmbeddedStatementContext":
    case "DeclarationStatementContext":
      return printStatement(node);
    case "Labeled_statementContext":
      return printLabeledStatement(node);
    case "Embedded_statementContext":
      return printEmbeddedStatement(node);
    case "Local_variable_declarationContext":
      return printLocalVariableDeclaration(node);
    case "Local_constant_declarationContext":
      return printLocalConstantDeclaration(node);
    case "ExpressionStatementContext":
      return printExpressionStatement(node);
    case "EmptyStatementContext":
      return printEmptyStatement(node);
    case "Local_variable_typeContext":
      return printLocalVariableType(node);
    case "Local_variable_declaratorContext":
      return printLocalVariableDeclarator(node);
    case "Local_variable_initializerContext":
      return printLocalVariableInitializer(node);
    // case "LiteralExpressionContext":
    // case "SimpleNameExpressionContext":
    // case "ParenthesisExpressionsContext":
    // case "MemberAccessExpressionContext":
    // case "MemberAccessExpressionContext":
    // case "LiteralAccessExpressionContext":
    // case "ThisReferenceExpressionContext":
    // case "TypeofExpressionContext":
    // case "CheckedExpressionContext":
    // case "UncheckedExpressionContext":
    // case "DefaultValueExpressionContext":
    // case "AnonymousMethodExpressionContext":
    // case "NameofExpressionContext":
    case "SizeofExpressionContext":
      return printSizeofExpression(node);
    case "ObjectCreationExpressionContext":
      return printObjectCreationExpression(node);
    case "BaseAccessExpressionContext":
      return printBaseAccessExpression(node);
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

function isSymbol(node, symbol) {
  return node && node.symbol && node.symbol.text === symbol;
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

function breakDebug(node, line) {
  if (node && node.start && node.start.line === line) debugger;
}

function genericPrint(path, options, print) {
  const node = path.getValue();
  // Not using `path.call(print, "foo")` to recurse because all child nodes
  // are under the `children` array property.
  const result = printNode(node);
  return result;
}

module.exports = genericPrint;
