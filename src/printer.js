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
const empty = "";

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
    return empty;

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
      return parts.parts.map(getUsingPath).join(empty);
    } else {
      return empty;
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
  // FIXME: Group long identifiers.
  return group(
    concat(
      node.children.map(node => (isSymbol(node, ".") ? "." : printNode(node)))
    )
  );
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

  let docs = [printNode(baseType)];

  for (let specifier of node.children.slice(1)) {
    docs.push(printNode(specifier));
  }

  return concat(docs);
}

function printBaseType(node) {
  const type = getAnyChildNode(node, [
    "Simple_typeContext",
    "Class_typeContext"
  ]);

  if (!type) {
    return concat(["void", "*"]);
  }

  return printNode(type);
}

function printSimpleType(node) {
  return printGenericSymbol(node);
}

function printClassType(node) {
  const namespace = getOptionalChildNode(node, "Namespace_or_type_nameContext");

  if (namespace) return printNode(namespace);

  return printGenericSymbol(node);
}

function printPointerType(node) {
  const type = getAnyChildNode(node, [
    "Simple_typeContext",
    "Class_typeContext"
  ]);

  if (!type) {
    return concat(["void", "*"]);
  }

  return group(
    concat([printNode(type), ...node.children.slice(1).map(printNode)])
  );
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

function printSemiColumnList(list) {
  return printList(concat([";", line]), list);
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

function printNonAssignmentExpression(node) {
  return printNode(node.children[0]);
}

function printConditionalExpression(node) {
  const nullCoalescingExpression = getChildNode(
    node,
    "Null_coalescing_expressionContext"
  );
  const expressions = getChildNodes(node, "ExpressionContext");

  if (expressions.length === 0) {
    return printNode(nullCoalescingExpression);
  }

  return group(
    concat([
      printNode(nullCoalescingExpression),
      group(
        indent(
          concat([
            line,
            group(concat(["?", " ", printNode(expressions[0])])),
            line,
            group(concat([":", " ", printNode(expressions[1])]))
          ])
        )
      )
    ])
  );
}

function printNullCoalescingExpression(node) {
  const conditionalOrExpression = getChildNode(
    node,
    "Conditional_or_expressionContext"
  );
  const nullCoalescingExpression = getOptionalChildNode(
    node,
    "Null_coalescing_expressionContext"
  );

  if (!nullCoalescingExpression) {
    return printNode(conditionalOrExpression);
  }

  return group(
    concat([
      printNode(conditionalOrExpression),
      group(
        indent(
          concat([
            line,
            group(concat(["??", " ", printNode(nullCoalescingExpression)]))
          ])
        )
      )
    ])
  );
}

function printBinaryishExpression(node) {
  if (node.children.length === 1) {
    return printNode(node.children[0]);
  }

  let operations = _.chunk(node.children, 2);

  return indent(
    group(
      concat([
        softline,
        group(
          join(
            line,
            operations.map(
              ([operand, operator]) =>
                operator
                  ? group(
                      concat([
                        printNode(operand),
                        " ",
                        printGenericSymbol(operator)
                      ])
                    )
                  : printNode(operand)
            )
          )
        )
      ])
    )
  );
}

function printExpression(node) {
  if (node.children.length === 1) {
    return printNode(node.children[0]);
  }

  return group(join(line, node.children.map(printNode)));
}

function printPrimaryExpression(node) {
  const parts = [];

  let currentPart = null;

  for (let child of node.children) {
    if (currentPart === null) {
      currentPart = [];
      parts.push(currentPart);
    }

    if (isNode(child, "Method_invocationContext")) {
      currentPart.push(printNode(child));
      currentPart = null;
    } else {
      currentPart.push(softline, printNode(child));
    }
  }

  const headPart = parts[0];
  const tailParts = parts.slice(1);

  if (tailParts.length === 0) {
    return group(concat(headPart));
  }

  const separator = tailParts.length >= 3 ? hardline : softline;

  return group(
    concat([
      group(concat(headPart)),
      indent(
        group(
          concat([
            separator,
            join(separator, tailParts.map(part => group(concat(part))))
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

  if (isSymbol(node.children[0], "await")) {
    return group(
      concat(["await", indent(concat([line, printNode(node.children[1])]))])
    );
  } else {
    return group(concat(node.children.map(printNode)));
  }
}

function printMemberAccessExpression(node) {
  // FIXME: '?'? '.' identifier type_argument_list?
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

function printBraceBody(node) {
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
  const commonMemberDefinition = getOptionalChildNode(
    node,
    "Common_member_declarationContext"
  );
  const destructorDefinition = getOptionalChildNode(
    node,
    "Destructor_definitionContext"
  );

  const docs = [];

  if (attributes) {
    docs.push(group(concat([printNode(attributes), hardline])));
  }

  const memberWithModifiers = [];

  if (allMemberModifiers) {
    memberWithModifiers.push(printNode(allMemberModifiers), " ");
  }

  if (commonMemberDefinition) {
    const methodDeclaration = getOptionalChildNode(
      commonMemberDefinition,
      "Method_declarationContext"
    );

    if (methodDeclaration) {
      const signature = printMethodDeclarationSignature(methodDeclaration);
      const body = printMethodDeclarationBody(methodDeclaration);

      // It's always void (otherwise it's a typed_member_declaration).
      memberWithModifiers.push("void", " ", signature);
      memberWithModifiers.push(group(body));
    } else {
      memberWithModifiers.push(printNode(commonMemberDefinition));
    }
  } else if (destructorDefinition) {
    memberWithModifiers.push(printNode(destructorDefinition));
  }

  docs.push(group(concat(memberWithModifiers)));

  return group(concat(docs));
}

function printCommonMemberDeclaration(node) {
  return printList(line, node.children);
}

function printMethodDeclarationSignature(node) {
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

  return concat(docs);
}

function printMethodDeclarationBody(node) {
  const methodBody = getAnyChildNode(node, [
    "Method_bodyContext",
    "BodyContext"
  ]);
  const rightArrow = getOptionalChildNode(node, "Right_arrowContext");
  const expression = getOptionalChildNode(node, "ExpressionContext");

  const docs = [];

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

function printMethodDeclaration(node) {
  // FIXME: Kill this function as sub-functions are being split into
  // printCommonMemberDeclaration and printTypedMemberDeclaration.

  return concat([
    printMethodDeclarationSignature(node),
    printMethodDeclarationBody(node)
  ]);
}

function printMethodInvocation(node) {
  const argumentList = getOptionalChildNode(node, "Argument_listContext");

  return group(
    concat(["(", argumentList ? printNode(argumentList) : softline, ")"])
  );
}

function printQualifiedIdentifier(node) {
  return printDotList(node.children);
}

function printQualifiedAliasMember(node) {
  const identifiers = getChildNodes(node, "IdentifierContext");
  const typeArgumentList = getOptionalChildNode(
    node,
    "Type_argument_listContext"
  );

  const docs = [printNode(identifiers[0]), "::", printNode(identifiers[1])];

  if (typeArgumentList) {
    docs.push(printNode(typeArgumentList));
  }

  return group(concat(docs));
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

function printFixedPointerDeclarators(node) {
  const fixedPointerParameters = getChildNodes(
    node,
    "Fixed_pointer_declaratorContext"
  );

  return printCommaList(fixedPointerParameters);
}

function printFixedPointerDeclarator(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const initializer = getChildNode(node, "Fixed_pointer_initializerContext");

  return group(
    concat([printNode(identifier), line, "=", line, printNode(initializer)])
  );
}

function printFixedPointerInitializer(node) {
  const expression = getOptionalChildNode(node, "ExpressionContext");
  const localVariableInitializer = getOptionalChildNode(
    node,
    "Local_variable_initializer_unsafeContext"
  );

  if (expression) {
    if (isSymbol(node.children[0], "&")) {
      return group(concat(["&", printNode(expression)]));
    } else {
      return printNode(expression);
    }
  }

  return printNode(localVariableInitializer);
}

function printLocalVariableInitializerUnsafe(node) {
  const type = getChildNode(node, "TypeContext");
  const expression = getChildNode(node, "ExpressionContext");

  return group(
    concat([
      "stackalloc",
      line,
      printNode(type),
      "[",
      indent(group(concat([softline, printNode(expression)]))),
      softline,
      "]"
    ])
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

function printTypeParameterList(node) {
  const typeParameters = getAllChildNodes(node, [
    "Type_parameterContext",
    "Variant_type_parameterContext"
  ]);

  return group(
    concat(["<", indent(group(printCommaList(typeParameters))), ">"])
  );
}

function printTypeParameter(node) {
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

  if (isNode(declaration, "Namespace_or_type_nameContext")) {
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

function printFieldDeclaration(node) {
  const variableDeclarators = getChildNode(node, "Variable_declaratorsContext");

  return group(concat([printNode(variableDeclarators), ";"]));
}

function printStatementList(node) {
  let docs = [];

  let previousChild = null;

  for (let child of node.children) {
    if (previousChild) {
      if (child.start.line - previousChild.stop.line > 1) {
        docs.push(doublehardline);
      } else {
        docs.push(hardline);
      }
    }

    docs.push(printNode(child));

    previousChild = child;
  }

  return group(concat(docs));
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
    concat([
      printNode(identifier),
      ":",
      group(concat([hardline, printNode(statement)]))
    ])
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
  return empty;
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

function printVariableDeclarators(node) {
  const variableDeclarators = getChildNodes(node, "Variable_declaratorContext");

  return printCommaList(variableDeclarators);
}

function printVariableDeclarator(node) {
  const identifier = getChildNode(node, "IdentifierContext");

  const initializer = getAnyChildNode(node, [
    "Local_variable_initializerContext",
    "Variable_initializerContext"
  ]);

  const docs = [printNode(identifier)];

  if (initializer) {
    docs.push(" ", "=", " ", printNode(initializer));
  }

  return group(concat(docs));
}

function printLocalVariableDeclaration(node) {
  const localVariableType = getChildNode(node, "Local_variable_typeContext");
  const localVariableDeclarators = getChildNodes(
    node,
    "Local_variable_declaratorContext"
  );

  let docs = [printNode(localVariableType)];

  if (localVariableDeclarators.length > 1) {
    docs.push(
      indent(
        concat([hardline, printCommaList(localVariableDeclarators, hardline)])
      )
    );
  } else {
    docs.push(" ", printNode(localVariableDeclarators[0]));
  }

  return group(concat(docs));
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

function printPrimaryObjectCreationExpression(node) {
  assertNodeStructure(node, 2, true);

  let expressionPart = [];

  const child = node.children[1];

  if (isNode(child, "TypeContext")) {
    const type = getChildNode(node, "TypeContext");
    const objectCreationExpression = getOptionalChildNode(
      node,
      "Object_creation_expressionContext"
    );
    const objectOrCollectionInitializer = getOptionalChildNode(
      node,
      "Object_or_collection_initializerContext"
    );

    expressionPart.push(printNode(type));

    if (objectCreationExpression) {
      expressionPart.push(printNode(objectCreationExpression));
    } else if (objectOrCollectionInitializer) {
      expressionPart.push(" ", printNode(objectOrCollectionInitializer));
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
        expressionPart.push(concat(rankSpecifiers.map(printNode)));
      }

      if (arrayInitializer) {
        expressionPart.push(line, printNode(arrayInitializer));
      }
    }
  } else if (isNode(child, "Anonymous_object_initializerContext")) {
    const anonymousObjectInitializer = getChildNode(
      node,
      "Anonymous_object_initializerContext"
    );
    expressionPart.push(printNode(anonymousObjectInitializer));
  } else if (isNode(child, "Rank_specifierContext")) {
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

function printObjectCreationExpression(node) {
  const argumentList = getOptionalChildNode(node, "Argument_listContext");
  const initializer = getOptionalChildNode(
    node,
    "Object_or_collection_initializerContext"
  );

  let docs = [];

  docs.push("(");

  if (argumentList) {
    docs.push(indent(printNode(argumentList)));
  }

  docs.push(")");

  if (initializer) {
    docs.push(line, printNode(initializer));
  }

  return group(concat(docs));
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

function printLiteralExpression(node) {
  return printNode(node.children[0]);
}

function printLiteral(node) {
  const stringLiteral = getOptionalChildNode(node, "String_literalContext");

  if (stringLiteral) {
    return printNode(stringLiteral);
  }

  return printGenericSymbol(node.children[0]);
}

function printStringLiteral(node) {
  const interpolatedString = getAnyChildNode(node, [
    "Interpolated_regular_stringContext",
    "Interpolated_verbatium_stringContext"
  ]);

  if (interpolatedString) {
    return printNode(interpolatedString);
  }

  return printGenericSymbol(node.children[0]);
}

function printInterpolatedRegularString(node) {
  const parts = getChildNodes(node, "Interpolated_regular_string_partContext");

  return group(concat(['$"', concat(parts.map(printNode)), '"']));
}

function printInterpolatedStringPart(node) {
  const expression = getOptionalChildNode(
    node,
    "Interpolated_string_expressionContext"
  );

  if (expression) {
    if (getOptionalChildNode(expression, "ExpressionContext")) {
      return group(
        concat([
          "{",
          indent(concat([softline, group(printNode(expression))])),
          "}"
        ])
      );
    }

    return group(printNode(expression));
  }

  return printGenericSymbol(node.children[0]);
}

function printInterpolatedStringExpression(node) {
  // FIXME: Handle format strings.
  const expressions = getChildNodes(node, "ExpressionContext");

  return group(printCommaList(expressions));
}

function printIsType(node) {
  const baseType = getChildNode(node, "Base_typeContext");
  const rest = node.children.slice(1);

  if (rest.length === 0) return printNode(baseType);

  return group(concat([printNode(baseType), " ", concat(rest.map(printNode))]));
}

function printIfStatement(node) {
  const expression = getChildNode(node, "ExpressionContext");
  const ifBodies = getChildNodes(node, "If_bodyContext");
  const hasElse = ifBodies.length > 1;
  const ifHasBraces = !!getOptionalChildNode(ifBodies[0], "BlockContext");
  const elseHasBraces =
    hasElse && !!getOptionalChildNode(ifBodies[1], "BlockContext");
  const hasElseIf =
    hasElse && !!getOptionalChildNode(ifBodies[1], "IfStatementContext");

  let docs = [
    "if",
    " ",
    "(",
    group(
      concat([
        indent(group(concat([softline, printNode(expression)]))),
        softline
      ])
    ),
    ")"
  ];

  if (ifHasBraces) {
    docs.push(hardline, printNode(ifBodies[0]));
  } else {
    docs.push(
      indent(group(concat([hasElse ? hardline : line, printNode(ifBodies[0])])))
    );
  }

  if (hasElse) {
    docs.push(hardline, "else");

    if (elseHasBraces || hasElseIf) {
      docs.push(hasElseIf ? " " : hardline, printNode(ifBodies[1]));
    } else {
      docs.push(indent(group(concat([hardline, printNode(ifBodies[1])]))));
    }
  }

  return group(concat(docs));
}

function printBreakingStatement(node) {
  const keyword = node.children[0];
  const expression = getOptionalChildNode(node, "ExpressionContext");

  let docs = [printNode(keyword)];

  if (expression) {
    docs.push(indent(concat([line, printNode(expression), ";"])));
  } else {
    docs.push(";");
  }

  return group(concat(docs));
}

function printGotoStatement(node) {
  const identifier = getOptionalChildNode(node, "IdentifierContext");
  const expression = getOptionalChildNode(node, "ExpressionContext");

  let docs = ["goto"];

  if (identifier) {
    docs.push(indent(concat([line, printNode(identifier), ";"])));
  } else if (expression) {
    docs.push(indent(concat([line, "case", line, printNode(expression), ";"])));
  } else {
    docs.push(" ", "default", ";");
  }

  return group(concat(docs));
}

function printWhileStatement(node) {
  const expression = getChildNode(node, "ExpressionContext");
  const embeddedStatement = getChildNode(node, "Embedded_statementContext");

  return group(
    concat([
      group(
        concat([
          "while",
          " ",
          "(",
          indent(printNode(expression)),
          softline,
          ")"
        ])
      ),
      line,
      printNode(embeddedStatement)
    ])
  );
}

function printDoStatement(node) {
  const embeddedStatement = getChildNode(node, "Embedded_statementContext");
  const expression = getChildNode(node, "ExpressionContext");

  return group(
    concat([
      "do",
      line,
      printNode(embeddedStatement),
      line,
      group(
        concat([
          "while",
          " ",
          "(",
          indent(printNode(expression)),
          softline,
          ")",
          ";"
        ])
      )
    ])
  );
}

function printForStatement(node) {
  const forInitializer = getOptionalChildNode(node, "For_initializerContext");
  const expression = getOptionalChildNode(node, "ExpressionContext");
  const forIterator = getOptionalChildNode(node, "For_iteratorContext");
  const embeddedStatement = getChildNode(node, "Embedded_statementContext");

  const forExpressions = [forInitializer, expression, forIterator].map(
    e => (e ? printExpression(e) : empty)
  );

  return group(
    concat([
      group(
        concat([
          "for",
          " ",
          "(",
          indent(
            group(concat([softline, join(concat([";", line]), forExpressions)]))
          ),
          softline,
          ")"
        ])
      ),
      line,
      printNode(embeddedStatement)
    ])
  );
}

function printForInitializer(node) {
  const localVariableDeclaration = getOptionalChildNode(
    node,
    "Local_variable_declarationContext"
  );
  const expressions = getChildNodes(node, "ExpressionContext");

  if (localVariableDeclaration) {
    return group(printNode(localVariableDeclaration));
  }

  return group(join(concat([";", line]), expressions));
}

function printForIterator(node) {
  const expressions = getChildNodes(node, "ExpressionContext");

  return group(printCommaList(expressions));
}

function printForeachStatement(node) {
  const localVariableType = getChildNode(node, "Local_variable_typeContext");
  const identifier = getChildNode(node, "IdentifierContext");
  const expression = getOptionalChildNode(node, "ExpressionContext");
  const embeddedStatement = getChildNode(node, "Embedded_statementContext");

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
                printNode(localVariableType),
                line,
                printNode(identifier),
                line,
                "in",
                line,
                printNode(expression)
              ])
            )
          ),
          softline,
          ")"
        ])
      ),
      line,
      printNode(embeddedStatement)
    ])
  );
}

function printSwitchStatement(node) {
  const expression = getChildNode(node, "ExpressionContext");
  const switchSections = getChildNodes(node, "Switch_sectionContext");

  const docs = [
    group(
      concat(["switch", " ", "(", indent(printNode(expression)), softline, ")"])
    ),
    line
  ];

  docs.push("{");

  if (switchSections.length) {
    docs.push(
      indent(concat([line, join(hardline, switchSections.map(printNode))]))
    );
  }

  docs.push(line, "}");

  return group(concat(docs));
}

function printSwitchSection(node) {
  const switchLabels = getChildNodes(node, "Switch_labelContext");
  const statementList = getChildNode(node, "Statement_listContext");

  return group(
    concat([
      join(hardline, switchLabels.map(printNode)),
      indent(concat([hardline, printNode(statementList)]))
    ])
  );
}

function printSwitchLabel(node) {
  const expression = getOptionalChildNode(node, "ExpressionContext");

  if (expression) {
    return group(concat(["case", " ", printNode(expression), ":"]));
  }

  return group(concat(["default", ":"]));
}

function printCheckedStatement(node) {
  const keyword = node.children[0];
  const block = getChildNode(node, "BlockContext");

  return group(concat([printNode(keyword), hardline, printNode(block)]));
}

function printCheckedExpression(node) {
  const checkedOrUnchecked = node.children[0];
  const expression = getChildNode(node, "ExpressionContext");

  return group(
    concat([
      printNode(checkedOrUnchecked),
      "(",
      group(indent(concat([softline, printNode(expression)]))),
      softline,
      ")"
    ])
  );
}

function printCapturingStatement(node) {
  const keyword = node.children[0];
  const capturedExpressions = getAllChildNodes(node, [
    "ExpressionContext",
    "Resource_acquisitionContext",
    "Pointer_typeContext",
    "Fixed_pointer_declaratorsContext"
  ]);
  const embeddedStatement = getChildNode(node, "Embedded_statementContext");
  const hasBraces = !!getOptionalChildNode(embeddedStatement, "BlockContext");

  const docs = [
    group(
      concat([
        printNode(keyword),
        " ",
        "(",
        group(
          concat([
            indent(
              group(concat([softline, printList(" ", capturedExpressions)]))
            ),
            softline
          ])
        ),
        ")"
      ])
    )
  ];

  if (hasBraces) {
    docs.push(hardline, printNode(embeddedStatement));
  } else {
    docs.push(indent(group(concat([hardline, printNode(embeddedStatement)]))));
  }

  return group(concat(docs));
}

function printYieldStatement(node) {
  const expression = getOptionalChildNode(node, "ExpressionContext");

  const docs = ["yield"];

  if (expression) {
    docs.push(indent(concat([line, "return", " ", printNode(expression)])));
  } else {
    docs.push(line, "break");
  }

  docs.push(";");

  return group(concat(docs));
}

function printResourceAcquisition(node) {
  return printNode(node.children[0]);
}

function printTryStatement(node) {
  const block = getChildNode(node, "BlockContext");
  const clauses = getAllChildNodes(node, [
    "Catch_clausesContext",
    "Finally_clause"
  ]);

  const docs = ["try", hardline, printNode(block)];

  for (let clause of clauses) {
    docs.push(hardline, printNode(clause));
  }

  return group(concat(docs));
}

function printCatchClauses(node) {
  const catchClauses = getAllChildNodes(node, [
    "Specific_catch_clauseContext",
    "General_catch_clauseContext"
  ]);

  return printList(hardline, catchClauses);
}

function printCatchClause(node) {
  const classType = getOptionalChildNode(node, "Class_typeContext");
  const identifier = getOptionalChildNode(node, "IdentifierContext");
  const exceptionFilter = getOptionalChildNode(node, "Exception_filterContext");
  const block = getChildNode(node, "BlockContext");

  const docs = ["catch"];

  if (classType) {
    docs.push(" ");

    const exceptionPart = [printNode(classType)];

    if (identifier) {
      exceptionPart.push(" ", printNode(identifier));
    }

    docs.push(
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
    docs.push(line, printNode(exceptionFilter));
  }

  docs.push(line, printNode(block));

  return group(concat(docs));
}

function printExceptionFilter(node) {
  const expression = getChildNode(node, "ExpressionContext");

  return group(
    concat([
      "when",
      " ",
      "(",
      group(concat([softline, printNode(expression)])),
      softline,
      ")"
    ])
  );
}

function printObjectOrCollectionInitializer(node) {
  const initializer = getAnyChildNode(node, [
    "Object_initializerContext",
    "Collection_initializerContext"
  ]);
  return printNode(initializer);
}

function printObjectInitializer(node) {
  const memberInitializerList = getAnyChildNode(node, [
    "Member_initializer_listContext",
    "Member_declarator_listContext"
  ]);

  let docs = ["{"];

  if (memberInitializerList) {
    docs.push(indent(concat([line, printNode(memberInitializerList)])));
  }

  docs.push(line, "}");

  return group(concat(docs));
}

function printCollectionInitializer(node) {
  const elementInitializers = getChildNodes(node, "Element_initializerContext");

  return group(
    concat([
      "{",
      indent(concat([line, printCommaList(elementInitializers)])),
      line,
      "}"
    ])
  );
}

function printMemberInitializerList(node) {
  const memberInitializers = getChildNodes(node, "Member_initializerContext");

  return printCommaList(memberInitializers);
}

function printMemberInitializer(node) {
  const identifier = getOptionalChildNode(node, "IdentifierContext");
  const expression = getOptionalChildNode(node, "ExpressionContext");
  const value = getChildNode(node, "Initializer_valueContext");

  let docs = [];

  if (identifier) {
    docs.push(printNode(identifier));
  } else if (expression) {
    docs.push(
      "[",
      indent(concat([softline, printNode(expression)])),
      softline,
      "]"
    );
  }

  docs.push(" ", "=");
  docs.push(indent(concat([line, printNode(value)])));

  return group(concat(docs));
}

function printInitializerValue(node) {
  const value = getAnyChildNode(node, [
    "ExpressionContext",
    "Object_or_collection_initializerContext"
  ]);

  return printNode(value);
}

function printMemberDeclaratorList(node) {
  const memberDeclarators = getChildNodes(node, "Member_declaratorContext");

  return printCommaList(memberDeclarators);
}

function printMemberDeclarator(node) {
  const identifier = getOptionalChildNode(node, "IdentifierContext");
  const expression = getOptionalChildNode(node, "ExpressionContext");
  const primaryExpression = getOptionalChildNode(
    node,
    "Primary_expressionContext"
  );

  if (primaryExpression) {
    return printNode(primaryExpression);
  }

  return group(
    concat([
      printNode(identifier),
      " ",
      "=",
      indent(concat([line, printNode(expression)]))
    ])
  );
}

function printElementInitializer(node) {
  const nonAssignmentExpression = getOptionalChildNode(
    node,
    "Non_assignment_expressionContext"
  );
  const expressionList = getOptionalChildNode(node, "Expression_listContext");

  if (nonAssignmentExpression) {
    return printNode(nonAssignmentExpression);
  }

  return group(
    concat(["{", indent(concat([line, printNode(expressionList)])), line, "}"])
  );
}

function printExpressionList(node) {
  const expressions = getChildNodes(node, "ExpressionContext");

  return printCommaList(expressions);
}

function printRankSpecifier(node) {
  let ranks = node.children.length - 2;

  return concat(["[", _.repeat(",", ranks), "]"]);
}

function printArrayInitializer(node) {
  const variableInitializers = getChildNodes(
    node,
    "Variable_initializerContext"
  );

  return group(
    concat([
      "{",
      indent(concat([line, printCommaList(variableInitializers)])),
      line,
      "}"
    ])
  );
}

function printVariableInitializer(node) {
  assertNodeStructure(node, 1);

  return printNode(node.children[0]);
}

function printBracketExpression(node) {
  const isNullCoalescent = isSymbol(node.children[0], "?");
  const indexerArguments = getChildNodes(node, "Indexer_argumentContext");

  let docs = [];

  if (isNullCoalescent) {
    docs.push("?");
  }

  docs.push("[", printCommaList(indexerArguments), "]");

  return concat(docs);
}

function printIndexerArgument(node) {
  const identifier = getOptionalChildNode(node, "IdentifierContext");
  const expression = getChildNode(node, "ExpressionContext");

  const docs = [];

  if (identifier) {
    docs.push(printNode(identifier), ":", line);
  }

  docs.push(printNode(expression));

  return group(concat(docs));
}

function printQueryExpression(node) {
  const fromClause = getChildNode(node, "From_clauseContext");
  const queryBody = getChildNode(node, "Query_bodyContext");

  return group(concat([printNode(fromClause), line, printNode(queryBody)]));
}

function printFromClause(node) {
  const type = getOptionalChildNode(node, "TypeContext");
  const identifier = getChildNode(node, "IdentifierContext");
  const expression = getChildNode(node, "ExpressionContext");

  const fromPart = ["from", line];

  if (type) {
    fromPart.push(printNode(type), line);
  }

  fromPart.push(printNode(identifier));

  const inPart = ["in", line, printNode(expression)];

  return group(concat([group(concat(fromPart)), line, group(concat(inPart))]));
}

function printQueryBody(node) {
  const queryBodyClauses = getChildNodes(node, "Query_body_clauseContext");
  const selectOrGroupClause = getChildNode(
    node,
    "Select_or_group_clauseContext"
  );
  const queryContinuation = getOptionalChildNode(
    node,
    "Query_continuationContext"
  );

  const docs = [
    printList(line, queryBodyClauses),
    line,
    printNode(selectOrGroupClause)
  ];

  if (queryContinuation) {
    docs.push(line, printNode(queryContinuation));
  }

  return group(concat(docs));
}

function printQueryBodyClause(node) {
  return printNode(node.children[0]);
}

function printLetClause(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const expression = getChildNode(node, "ExpressionContext");

  return group(
    concat([
      "let",
      line,
      printNode(identifier),
      line,
      "=",
      line,
      printNode(expression)
    ])
  );
}

function printWhereClause(node) {
  const expression = getChildNode(node, "ExpressionContext");

  return group(concat(["where", line, printNode(expression)]));
}

function printCombinedJoinClause(node) {
  const type = getOptionalChildNode(node, "TypeContext");
  const identifiers = getChildNodes(node, "IdentifierContext");
  const expressions = getChildNodes(node, "ExpressionContext");

  const joinPart = ["join", line];

  if (type) {
    joinPart.push(printNode(type), line);
  }

  joinPart.push(printNode(identifiers[0]));

  const inPart = ["in", line, printNode(expressions[0])];
  const onPart = ["on", line, printNode(expressions[1])];
  const equalsPart = ["equals", line, printNode(expressions[2])];

  const docs = [
    group(concat(joinPart)),
    line,
    group(concat(inPart)),
    line,
    group(concat(onPart)),
    line,
    group(concat(equalsPart))
  ];

  if (identifiers.length > 1) {
    const intoPart = ["into", line, printNode(identifiers[1])];
    docs.push(line, group(concat(intoPart)));
  }
  return group(concat(docs));
}

function printOrderByClause(node) {
  const orderings = getChildNodes(node, "OrderingContext");

  return group(concat(["orderby", line, printCommaList(orderings)]));
}

function printOrdering(node) {
  const expression = getChildNode(node, "ExpressionContext");
  const dir = node.dir;

  return group(concat([printNode(expression), line, dir.text]));
}

function printSelectOrGroupClause(node) {
  const expressions = getChildNodes(node, "ExpressionContext");

  if (expressions.length == 1) {
    return group(concat(["select", line, printNode(expressions[0])]));
  } else {
    return group(
      concat([
        "group",
        line,
        printNode(expressions[0]),
        line,
        "by",
        line,
        printNode(expressions[1])
      ])
    );
  }
}

function printQueryContinuation(node) {
  const identifier = getChildNode(node, "IdentifierContext");
  const queryBody = getChildNode(node, "Query_bodyContext");

  return group(
    concat(["into", line, printNode(identifier), line, printNode(queryBody)])
  );
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
    case "ThisReferenceExpressionContext":
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
    case "Pointer_typeContext":
      return printPointerType(node);
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
    case "Fixed_pointer_declaratorsContext":
      return printFixedPointerDeclarators(node);
    case "Fixed_pointer_declaratorContext":
      return printFixedPointerDeclarator(node);
    case "Fixed_pointer_initializerContext":
      return printFixedPointerInitializer(node);
    case "Local_variable_initializer_unsafeContext":
      return printLocalVariableInitializerUnsafe(node);
    case "Method_bodyContext":
    case "BodyContext":
      return printMethodBody(node);
    case "ExpressionContext":
      return printExpression(node);
    case "Non_assignment_expressionContext":
      return printNonAssignmentExpression(node);
    case "Conditional_expressionContext":
      return printConditionalExpression(node);
    case "Null_coalescing_expressionContext":
      return printNullCoalescingExpression(node);
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
      return printBinaryishExpression(node);
    case "LiteralExpressionContext":
      return printLiteralExpression(node);
    case "LiteralContext":
      return printLiteral(node);
    case "String_literalContext":
      return printStringLiteral(node);
    case "MemberAccessExpressionContext":
      return printMemberAccessExpression(node);
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
      return printBraceBody(node);
    case "Class_definitionContext":
      return printClassDefinition(node);
    case "Class_baseContext":
      return printClassBase(node);
    case "Qualified_identifierContext":
      return printQualifiedIdentifier(node);
    case "Qualified_alias_memberContext":
      return printQualifiedAliasMember(node);
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
    case "Type_parameter_listContext":
    case "Variant_type_parameter_listContext":
      return printTypeParameterList(node);
    case "Type_parameterContext":
    case "Variant_type_parameterContext":
      return printTypeParameter(node);
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
    case "Field_declarationContext":
      return printFieldDeclaration(node);
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
    case "If_bodyContext":
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
    case "Variable_declaratorsContext":
      return printVariableDeclarators(node);
    case "Variable_declaratorContext":
    case "Local_variable_declaratorContext":
      return printVariableDeclarator(node);
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
      return printPrimaryObjectCreationExpression(node);
    case "BaseAccessExpressionContext":
      return printBaseAccessExpression(node);
    case "Method_invocationContext":
      return printMethodInvocation(node);
    case "Interpolated_regular_stringContext":
      return printInterpolatedRegularString(node);
    case "Interpolated_regular_string_partContext":
    case "Interpolated_verbatium_string_partContext":
      return printInterpolatedStringPart(node);
    case "Interpolated_string_expressionContext":
      return printInterpolatedStringExpression(node);
    case "IsTypeContext":
      return printSimpleType(node);
    case "Object_creation_expressionContext":
      return printObjectCreationExpression(node);
    case "IfStatementContext":
      return printIfStatement(node);
    case "ReturnStatementContext":
    case "ThrowStatementContext":
    case "BreakStatementContext":
    case "ContinueStatementContext":
      return printBreakingStatement(node);
    case "GotoStatementContext":
      return printGotoStatement(node);
    case "SwitchStatementContext":
      return printSwitchStatement(node);
    case "Switch_sectionContext":
      return printSwitchSection(node);
    case "Switch_labelContext":
      return printSwitchLabel(node);
    case "WhileStatementContext":
      return printWhileStatement(node);
    case "ForStatementContext":
      return printForStatement(node);
    case "For_initializerContext":
      return printForInitializer(node);
    case "For_iteratorContext":
      return printForIterator(node);
    case "ForeachStatementContext":
      return printForeachStatement(node);
    case "DoStatementContext":
      return printDoStatement(node);
    case "CheckedStatementContext":
    case "UncheckedStatementContext":
    case "UnsafeStatementContext":
      return printCheckedStatement(node);
    case "CheckedExpressionContext":
    case "UncheckedExpressionContext":
      return printCheckedExpression(node);
    case "LockStatementContext":
    case "UsingStatementContext":
    case "FixedStatementContext":
      return printCapturingStatement(node);
    case "YieldStatementContext":
      return printYieldStatement(node);
    case "Resource_acquisitionContext":
      return printResourceAcquisition(node);
    case "TryStatementContext":
      return printTryStatement(node);
    case "Catch_clausesContext":
      return printCatchClauses(node);
    case "Specific_catch_clauseContext":
    case "General_catch_clauseContext":
      return printCatchClause(node);
    case "Exception_filterContext":
      return printExceptionFilter(node);
    case "Object_or_collection_initializerContext":
      return printObjectOrCollectionInitializer(node);
    case "Object_initializerContext":
    case "Anonymous_object_initializerContext":
      return printObjectInitializer(node);
    case "Collection_initializerContext":
      return printCollectionInitializer(node);
    case "Member_initializer_listContext":
      return printMemberInitializerList(node);
    case "Member_initializerContext":
      return printMemberInitializer(node);
    case "Initializer_valueContext":
      return printInitializerValue(node);
    case "Member_declarator_listContext":
      return printMemberDeclaratorList(node);
    case "Member_declaratorContext":
      return printMemberDeclarator(node);
    case "Element_initializerContext":
      return printElementInitializer(node);
    case "Expression_listContext":
      return printExpressionList(node);
    case "Rank_specifierContext":
      return printRankSpecifier(node);
    case "Array_initializerContext":
      return printArrayInitializer(node);
    case "Variable_initializerContext":
      return printVariableInitializer(node);
    case "Bracket_expressionContext":
      return printBracketExpression(node);
    case "Indexer_argumentContext":
      return printIndexerArgument(node);
    case "Query_expressionContext":
      return printQueryExpression(node);
    case "From_clauseContext":
      return printFromClause(node);
    case "Query_bodyContext":
      return printQueryBody(node);
    case "Query_body_clauseContext":
      return printQueryBodyClause(node);
    case "Where_clauseContext":
      return printWhereClause(node);
    case "Let_clauseContext":
      return printLetClause(node);
    case "Combined_join_clauseContext":
      return printCombinedJoinClause(node);
    case "Orderby_clauseContext":
      return printOrderByClause(node);
    case "OrderingContext":
      return printOrdering(node);
    case "Select_or_group_clauseContext":
      return printSelectOrGroupClause(node);
    case "Query_continuationContext":
      return printQueryContinuation(node);
    default:
      console.error("Unknown C# node:", node.constructor.name);
      return `{${node.constructor.name}}`;
  }
}

function getChildNodes(node, type) {
  return node.children.filter(n => n.constructor.name === type);
}

function getAllChildNodes(node, types) {
  return node.children.filter(n => types.includes(n.constructor.name));
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

function isNode(node, type) {
  return node && node.constructor.name === type;
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

function debugAtLine(node, line) {
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
