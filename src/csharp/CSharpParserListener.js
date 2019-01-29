// jshint ignore: start
var antlr4 = require("antlr4/index");

// This class defines a complete listener for a parse tree produced by CSharpParser.
function CSharpParserListener() {
  antlr4.tree.ParseTreeListener.call(this);
  return this;
}

CSharpParserListener.prototype = Object.create(
  antlr4.tree.ParseTreeListener.prototype
);
CSharpParserListener.prototype.constructor = CSharpParserListener;

// Enter a parse tree produced by CSharpParser#compilation_unit.
CSharpParserListener.prototype.enterCompilation_unit = function(ctx) {};

// Exit a parse tree produced by CSharpParser#compilation_unit.
CSharpParserListener.prototype.exitCompilation_unit = function(ctx) {};

// Enter a parse tree produced by CSharpParser#namespace_or_type_name.
CSharpParserListener.prototype.enterNamespace_or_type_name = function(ctx) {};

// Exit a parse tree produced by CSharpParser#namespace_or_type_name.
CSharpParserListener.prototype.exitNamespace_or_type_name = function(ctx) {};

// Enter a parse tree produced by CSharpParser#type.
CSharpParserListener.prototype.enterType = function(ctx) {};

// Exit a parse tree produced by CSharpParser#type.
CSharpParserListener.prototype.exitType = function(ctx) {};

// Enter a parse tree produced by CSharpParser#base_type.
CSharpParserListener.prototype.enterBase_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#base_type.
CSharpParserListener.prototype.exitBase_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#simple_type.
CSharpParserListener.prototype.enterSimple_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#simple_type.
CSharpParserListener.prototype.exitSimple_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#numeric_type.
CSharpParserListener.prototype.enterNumeric_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#numeric_type.
CSharpParserListener.prototype.exitNumeric_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#integral_type.
CSharpParserListener.prototype.enterIntegral_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#integral_type.
CSharpParserListener.prototype.exitIntegral_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#floating_point_type.
CSharpParserListener.prototype.enterFloating_point_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#floating_point_type.
CSharpParserListener.prototype.exitFloating_point_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#tuple_type.
CSharpParserListener.prototype.enterTuple_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#tuple_type.
CSharpParserListener.prototype.exitTuple_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#tuple_element_type.
CSharpParserListener.prototype.enterTuple_element_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#tuple_element_type.
CSharpParserListener.prototype.exitTuple_element_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#class_type.
CSharpParserListener.prototype.enterClass_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#class_type.
CSharpParserListener.prototype.exitClass_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#type_argument_list.
CSharpParserListener.prototype.enterType_argument_list = function(ctx) {};

// Exit a parse tree produced by CSharpParser#type_argument_list.
CSharpParserListener.prototype.exitType_argument_list = function(ctx) {};

// Enter a parse tree produced by CSharpParser#argument_list.
CSharpParserListener.prototype.enterArgument_list = function(ctx) {};

// Exit a parse tree produced by CSharpParser#argument_list.
CSharpParserListener.prototype.exitArgument_list = function(ctx) {};

// Enter a parse tree produced by CSharpParser#argument.
CSharpParserListener.prototype.enterArgument = function(ctx) {};

// Exit a parse tree produced by CSharpParser#argument.
CSharpParserListener.prototype.exitArgument = function(ctx) {};

// Enter a parse tree produced by CSharpParser#typed_argument.
CSharpParserListener.prototype.enterTyped_argument = function(ctx) {};

// Exit a parse tree produced by CSharpParser#typed_argument.
CSharpParserListener.prototype.exitTyped_argument = function(ctx) {};

// Enter a parse tree produced by CSharpParser#expression.
CSharpParserListener.prototype.enterExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#expression.
CSharpParserListener.prototype.exitExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#non_assignment_expression.
CSharpParserListener.prototype.enterNon_assignment_expression = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#non_assignment_expression.
CSharpParserListener.prototype.exitNon_assignment_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#assignment.
CSharpParserListener.prototype.enterAssignment = function(ctx) {};

// Exit a parse tree produced by CSharpParser#assignment.
CSharpParserListener.prototype.exitAssignment = function(ctx) {};

// Enter a parse tree produced by CSharpParser#assignment_operator.
CSharpParserListener.prototype.enterAssignment_operator = function(ctx) {};

// Exit a parse tree produced by CSharpParser#assignment_operator.
CSharpParserListener.prototype.exitAssignment_operator = function(ctx) {};

// Enter a parse tree produced by CSharpParser#conditional_expression.
CSharpParserListener.prototype.enterConditional_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#conditional_expression.
CSharpParserListener.prototype.exitConditional_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#null_coalescing_expression.
CSharpParserListener.prototype.enterNull_coalescing_expression = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#null_coalescing_expression.
CSharpParserListener.prototype.exitNull_coalescing_expression = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#conditional_or_expression.
CSharpParserListener.prototype.enterConditional_or_expression = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#conditional_or_expression.
CSharpParserListener.prototype.exitConditional_or_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#conditional_and_expression.
CSharpParserListener.prototype.enterConditional_and_expression = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#conditional_and_expression.
CSharpParserListener.prototype.exitConditional_and_expression = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#inclusive_or_expression.
CSharpParserListener.prototype.enterInclusive_or_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#inclusive_or_expression.
CSharpParserListener.prototype.exitInclusive_or_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#exclusive_or_expression.
CSharpParserListener.prototype.enterExclusive_or_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#exclusive_or_expression.
CSharpParserListener.prototype.exitExclusive_or_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#and_expression.
CSharpParserListener.prototype.enterAnd_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#and_expression.
CSharpParserListener.prototype.exitAnd_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#equality_expression.
CSharpParserListener.prototype.enterEquality_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#equality_expression.
CSharpParserListener.prototype.exitEquality_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#relational_expression.
CSharpParserListener.prototype.enterRelational_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#relational_expression.
CSharpParserListener.prototype.exitRelational_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#shift_expression.
CSharpParserListener.prototype.enterShift_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#shift_expression.
CSharpParserListener.prototype.exitShift_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#additive_expression.
CSharpParserListener.prototype.enterAdditive_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#additive_expression.
CSharpParserListener.prototype.exitAdditive_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#multiplicative_expression.
CSharpParserListener.prototype.enterMultiplicative_expression = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#multiplicative_expression.
CSharpParserListener.prototype.exitMultiplicative_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#unary_expression.
CSharpParserListener.prototype.enterUnary_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#unary_expression.
CSharpParserListener.prototype.exitUnary_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#primary_expression.
CSharpParserListener.prototype.enterPrimary_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#primary_expression.
CSharpParserListener.prototype.exitPrimary_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#literalExpression.
CSharpParserListener.prototype.enterLiteralExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#literalExpression.
CSharpParserListener.prototype.exitLiteralExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#simpleNameExpression.
CSharpParserListener.prototype.enterSimpleNameExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#simpleNameExpression.
CSharpParserListener.prototype.exitSimpleNameExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#parenthesisExpressions.
CSharpParserListener.prototype.enterParenthesisExpressions = function(ctx) {};

// Exit a parse tree produced by CSharpParser#parenthesisExpressions.
CSharpParserListener.prototype.exitParenthesisExpressions = function(ctx) {};

// Enter a parse tree produced by CSharpParser#tupleExpression.
CSharpParserListener.prototype.enterTupleExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#tupleExpression.
CSharpParserListener.prototype.exitTupleExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#predefinedTypeExpression.
CSharpParserListener.prototype.enterPredefinedTypeExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#predefinedTypeExpression.
CSharpParserListener.prototype.exitPredefinedTypeExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#qualifiedAliasMemberExpression.
CSharpParserListener.prototype.enterQualifiedAliasMemberExpression = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#qualifiedAliasMemberExpression.
CSharpParserListener.prototype.exitQualifiedAliasMemberExpression = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#literalAccessExpression.
CSharpParserListener.prototype.enterLiteralAccessExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#literalAccessExpression.
CSharpParserListener.prototype.exitLiteralAccessExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#thisReferenceExpression.
CSharpParserListener.prototype.enterThisReferenceExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#thisReferenceExpression.
CSharpParserListener.prototype.exitThisReferenceExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#baseAccessExpression.
CSharpParserListener.prototype.enterBaseAccessExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#baseAccessExpression.
CSharpParserListener.prototype.exitBaseAccessExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#newExpression.
CSharpParserListener.prototype.enterNewExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#newExpression.
CSharpParserListener.prototype.exitNewExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#typeofExpression.
CSharpParserListener.prototype.enterTypeofExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#typeofExpression.
CSharpParserListener.prototype.exitTypeofExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#checkedExpression.
CSharpParserListener.prototype.enterCheckedExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#checkedExpression.
CSharpParserListener.prototype.exitCheckedExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#uncheckedExpression.
CSharpParserListener.prototype.enterUncheckedExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#uncheckedExpression.
CSharpParserListener.prototype.exitUncheckedExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#defaultValueExpression.
CSharpParserListener.prototype.enterDefaultValueExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#defaultValueExpression.
CSharpParserListener.prototype.exitDefaultValueExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#anonymousMethodExpression.
CSharpParserListener.prototype.enterAnonymousMethodExpression = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#anonymousMethodExpression.
CSharpParserListener.prototype.exitAnonymousMethodExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#sizeofExpression.
CSharpParserListener.prototype.enterSizeofExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#sizeofExpression.
CSharpParserListener.prototype.exitSizeofExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#nameofExpression.
CSharpParserListener.prototype.enterNameofExpression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#nameofExpression.
CSharpParserListener.prototype.exitNameofExpression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#simple_name.
CSharpParserListener.prototype.enterSimple_name = function(ctx) {};

// Exit a parse tree produced by CSharpParser#simple_name.
CSharpParserListener.prototype.exitSimple_name = function(ctx) {};

// Enter a parse tree produced by CSharpParser#bracket_expression.
CSharpParserListener.prototype.enterBracket_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#bracket_expression.
CSharpParserListener.prototype.exitBracket_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#indexer_argument.
CSharpParserListener.prototype.enterIndexer_argument = function(ctx) {};

// Exit a parse tree produced by CSharpParser#indexer_argument.
CSharpParserListener.prototype.exitIndexer_argument = function(ctx) {};

// Enter a parse tree produced by CSharpParser#predefined_type.
CSharpParserListener.prototype.enterPredefined_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#predefined_type.
CSharpParserListener.prototype.exitPredefined_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#expression_list.
CSharpParserListener.prototype.enterExpression_list = function(ctx) {};

// Exit a parse tree produced by CSharpParser#expression_list.
CSharpParserListener.prototype.exitExpression_list = function(ctx) {};

// Enter a parse tree produced by CSharpParser#object_or_collection_initializer.
CSharpParserListener.prototype.enterObject_or_collection_initializer = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#object_or_collection_initializer.
CSharpParserListener.prototype.exitObject_or_collection_initializer = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#object_initializer.
CSharpParserListener.prototype.enterObject_initializer = function(ctx) {};

// Exit a parse tree produced by CSharpParser#object_initializer.
CSharpParserListener.prototype.exitObject_initializer = function(ctx) {};

// Enter a parse tree produced by CSharpParser#member_initializer_list.
CSharpParserListener.prototype.enterMember_initializer_list = function(ctx) {};

// Exit a parse tree produced by CSharpParser#member_initializer_list.
CSharpParserListener.prototype.exitMember_initializer_list = function(ctx) {};

// Enter a parse tree produced by CSharpParser#member_initializer.
CSharpParserListener.prototype.enterMember_initializer = function(ctx) {};

// Exit a parse tree produced by CSharpParser#member_initializer.
CSharpParserListener.prototype.exitMember_initializer = function(ctx) {};

// Enter a parse tree produced by CSharpParser#initializer_value.
CSharpParserListener.prototype.enterInitializer_value = function(ctx) {};

// Exit a parse tree produced by CSharpParser#initializer_value.
CSharpParserListener.prototype.exitInitializer_value = function(ctx) {};

// Enter a parse tree produced by CSharpParser#collection_initializer.
CSharpParserListener.prototype.enterCollection_initializer = function(ctx) {};

// Exit a parse tree produced by CSharpParser#collection_initializer.
CSharpParserListener.prototype.exitCollection_initializer = function(ctx) {};

// Enter a parse tree produced by CSharpParser#tuple_initializer.
CSharpParserListener.prototype.enterTuple_initializer = function(ctx) {};

// Exit a parse tree produced by CSharpParser#tuple_initializer.
CSharpParserListener.prototype.exitTuple_initializer = function(ctx) {};

// Enter a parse tree produced by CSharpParser#tuple_element_initializer.
CSharpParserListener.prototype.enterTuple_element_initializer = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#tuple_element_initializer.
CSharpParserListener.prototype.exitTuple_element_initializer = function(ctx) {};

// Enter a parse tree produced by CSharpParser#element_initializer.
CSharpParserListener.prototype.enterElement_initializer = function(ctx) {};

// Exit a parse tree produced by CSharpParser#element_initializer.
CSharpParserListener.prototype.exitElement_initializer = function(ctx) {};

// Enter a parse tree produced by CSharpParser#anonymous_object_initializer.
CSharpParserListener.prototype.enterAnonymous_object_initializer = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#anonymous_object_initializer.
CSharpParserListener.prototype.exitAnonymous_object_initializer = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#member_declarator_list.
CSharpParserListener.prototype.enterMember_declarator_list = function(ctx) {};

// Exit a parse tree produced by CSharpParser#member_declarator_list.
CSharpParserListener.prototype.exitMember_declarator_list = function(ctx) {};

// Enter a parse tree produced by CSharpParser#member_declarator.
CSharpParserListener.prototype.enterMember_declarator = function(ctx) {};

// Exit a parse tree produced by CSharpParser#member_declarator.
CSharpParserListener.prototype.exitMember_declarator = function(ctx) {};

// Enter a parse tree produced by CSharpParser#unbound_type_name.
CSharpParserListener.prototype.enterUnbound_type_name = function(ctx) {};

// Exit a parse tree produced by CSharpParser#unbound_type_name.
CSharpParserListener.prototype.exitUnbound_type_name = function(ctx) {};

// Enter a parse tree produced by CSharpParser#generic_dimension_specifier.
CSharpParserListener.prototype.enterGeneric_dimension_specifier = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#generic_dimension_specifier.
CSharpParserListener.prototype.exitGeneric_dimension_specifier = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#isType.
CSharpParserListener.prototype.enterIsType = function(ctx) {};

// Exit a parse tree produced by CSharpParser#isType.
CSharpParserListener.prototype.exitIsType = function(ctx) {};

// Enter a parse tree produced by CSharpParser#lambda_expression.
CSharpParserListener.prototype.enterLambda_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#lambda_expression.
CSharpParserListener.prototype.exitLambda_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#anonymous_function_signature.
CSharpParserListener.prototype.enterAnonymous_function_signature = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#anonymous_function_signature.
CSharpParserListener.prototype.exitAnonymous_function_signature = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#explicit_anonymous_function_parameter_list.
CSharpParserListener.prototype.enterExplicit_anonymous_function_parameter_list = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#explicit_anonymous_function_parameter_list.
CSharpParserListener.prototype.exitExplicit_anonymous_function_parameter_list = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#explicit_anonymous_function_parameter.
CSharpParserListener.prototype.enterExplicit_anonymous_function_parameter = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#explicit_anonymous_function_parameter.
CSharpParserListener.prototype.exitExplicit_anonymous_function_parameter = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#implicit_anonymous_function_parameter_list.
CSharpParserListener.prototype.enterImplicit_anonymous_function_parameter_list = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#implicit_anonymous_function_parameter_list.
CSharpParserListener.prototype.exitImplicit_anonymous_function_parameter_list = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#anonymous_function_body.
CSharpParserListener.prototype.enterAnonymous_function_body = function(ctx) {};

// Exit a parse tree produced by CSharpParser#anonymous_function_body.
CSharpParserListener.prototype.exitAnonymous_function_body = function(ctx) {};

// Enter a parse tree produced by CSharpParser#query_expression.
CSharpParserListener.prototype.enterQuery_expression = function(ctx) {};

// Exit a parse tree produced by CSharpParser#query_expression.
CSharpParserListener.prototype.exitQuery_expression = function(ctx) {};

// Enter a parse tree produced by CSharpParser#from_clause.
CSharpParserListener.prototype.enterFrom_clause = function(ctx) {};

// Exit a parse tree produced by CSharpParser#from_clause.
CSharpParserListener.prototype.exitFrom_clause = function(ctx) {};

// Enter a parse tree produced by CSharpParser#query_body.
CSharpParserListener.prototype.enterQuery_body = function(ctx) {};

// Exit a parse tree produced by CSharpParser#query_body.
CSharpParserListener.prototype.exitQuery_body = function(ctx) {};

// Enter a parse tree produced by CSharpParser#query_body_clause.
CSharpParserListener.prototype.enterQuery_body_clause = function(ctx) {};

// Exit a parse tree produced by CSharpParser#query_body_clause.
CSharpParserListener.prototype.exitQuery_body_clause = function(ctx) {};

// Enter a parse tree produced by CSharpParser#let_clause.
CSharpParserListener.prototype.enterLet_clause = function(ctx) {};

// Exit a parse tree produced by CSharpParser#let_clause.
CSharpParserListener.prototype.exitLet_clause = function(ctx) {};

// Enter a parse tree produced by CSharpParser#where_clause.
CSharpParserListener.prototype.enterWhere_clause = function(ctx) {};

// Exit a parse tree produced by CSharpParser#where_clause.
CSharpParserListener.prototype.exitWhere_clause = function(ctx) {};

// Enter a parse tree produced by CSharpParser#combined_join_clause.
CSharpParserListener.prototype.enterCombined_join_clause = function(ctx) {};

// Exit a parse tree produced by CSharpParser#combined_join_clause.
CSharpParserListener.prototype.exitCombined_join_clause = function(ctx) {};

// Enter a parse tree produced by CSharpParser#orderby_clause.
CSharpParserListener.prototype.enterOrderby_clause = function(ctx) {};

// Exit a parse tree produced by CSharpParser#orderby_clause.
CSharpParserListener.prototype.exitOrderby_clause = function(ctx) {};

// Enter a parse tree produced by CSharpParser#ordering.
CSharpParserListener.prototype.enterOrdering = function(ctx) {};

// Exit a parse tree produced by CSharpParser#ordering.
CSharpParserListener.prototype.exitOrdering = function(ctx) {};

// Enter a parse tree produced by CSharpParser#select_or_group_clause.
CSharpParserListener.prototype.enterSelect_or_group_clause = function(ctx) {};

// Exit a parse tree produced by CSharpParser#select_or_group_clause.
CSharpParserListener.prototype.exitSelect_or_group_clause = function(ctx) {};

// Enter a parse tree produced by CSharpParser#query_continuation.
CSharpParserListener.prototype.enterQuery_continuation = function(ctx) {};

// Exit a parse tree produced by CSharpParser#query_continuation.
CSharpParserListener.prototype.exitQuery_continuation = function(ctx) {};

// Enter a parse tree produced by CSharpParser#labeledStatement.
CSharpParserListener.prototype.enterLabeledStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#labeledStatement.
CSharpParserListener.prototype.exitLabeledStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#declarationStatement.
CSharpParserListener.prototype.enterDeclarationStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#declarationStatement.
CSharpParserListener.prototype.exitDeclarationStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#embeddedStatement.
CSharpParserListener.prototype.enterEmbeddedStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#embeddedStatement.
CSharpParserListener.prototype.exitEmbeddedStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#labeled_statement.
CSharpParserListener.prototype.enterLabeled_statement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#labeled_statement.
CSharpParserListener.prototype.exitLabeled_statement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#embedded_statement.
CSharpParserListener.prototype.enterEmbedded_statement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#embedded_statement.
CSharpParserListener.prototype.exitEmbedded_statement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#emptyStatement.
CSharpParserListener.prototype.enterEmptyStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#emptyStatement.
CSharpParserListener.prototype.exitEmptyStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#expressionStatement.
CSharpParserListener.prototype.enterExpressionStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#expressionStatement.
CSharpParserListener.prototype.exitExpressionStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#ifStatement.
CSharpParserListener.prototype.enterIfStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#ifStatement.
CSharpParserListener.prototype.exitIfStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#switchStatement.
CSharpParserListener.prototype.enterSwitchStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#switchStatement.
CSharpParserListener.prototype.exitSwitchStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#whileStatement.
CSharpParserListener.prototype.enterWhileStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#whileStatement.
CSharpParserListener.prototype.exitWhileStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#doStatement.
CSharpParserListener.prototype.enterDoStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#doStatement.
CSharpParserListener.prototype.exitDoStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#forStatement.
CSharpParserListener.prototype.enterForStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#forStatement.
CSharpParserListener.prototype.exitForStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#foreachStatement.
CSharpParserListener.prototype.enterForeachStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#foreachStatement.
CSharpParserListener.prototype.exitForeachStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#breakStatement.
CSharpParserListener.prototype.enterBreakStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#breakStatement.
CSharpParserListener.prototype.exitBreakStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#continueStatement.
CSharpParserListener.prototype.enterContinueStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#continueStatement.
CSharpParserListener.prototype.exitContinueStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#gotoStatement.
CSharpParserListener.prototype.enterGotoStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#gotoStatement.
CSharpParserListener.prototype.exitGotoStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#returnStatement.
CSharpParserListener.prototype.enterReturnStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#returnStatement.
CSharpParserListener.prototype.exitReturnStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#throwStatement.
CSharpParserListener.prototype.enterThrowStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#throwStatement.
CSharpParserListener.prototype.exitThrowStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#tryStatement.
CSharpParserListener.prototype.enterTryStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#tryStatement.
CSharpParserListener.prototype.exitTryStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#checkedStatement.
CSharpParserListener.prototype.enterCheckedStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#checkedStatement.
CSharpParserListener.prototype.exitCheckedStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#uncheckedStatement.
CSharpParserListener.prototype.enterUncheckedStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#uncheckedStatement.
CSharpParserListener.prototype.exitUncheckedStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#lockStatement.
CSharpParserListener.prototype.enterLockStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#lockStatement.
CSharpParserListener.prototype.exitLockStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#usingStatement.
CSharpParserListener.prototype.enterUsingStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#usingStatement.
CSharpParserListener.prototype.exitUsingStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#yieldStatement.
CSharpParserListener.prototype.enterYieldStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#yieldStatement.
CSharpParserListener.prototype.exitYieldStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#unsafeStatement.
CSharpParserListener.prototype.enterUnsafeStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#unsafeStatement.
CSharpParserListener.prototype.exitUnsafeStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#fixedStatement.
CSharpParserListener.prototype.enterFixedStatement = function(ctx) {};

// Exit a parse tree produced by CSharpParser#fixedStatement.
CSharpParserListener.prototype.exitFixedStatement = function(ctx) {};

// Enter a parse tree produced by CSharpParser#block.
CSharpParserListener.prototype.enterBlock = function(ctx) {};

// Exit a parse tree produced by CSharpParser#block.
CSharpParserListener.prototype.exitBlock = function(ctx) {};

// Enter a parse tree produced by CSharpParser#local_variable_declaration.
CSharpParserListener.prototype.enterLocal_variable_declaration = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#local_variable_declaration.
CSharpParserListener.prototype.exitLocal_variable_declaration = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#local_variable_type.
CSharpParserListener.prototype.enterLocal_variable_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#local_variable_type.
CSharpParserListener.prototype.exitLocal_variable_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#local_variable_declarator.
CSharpParserListener.prototype.enterLocal_variable_declarator = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#local_variable_declarator.
CSharpParserListener.prototype.exitLocal_variable_declarator = function(ctx) {};

// Enter a parse tree produced by CSharpParser#local_variable_identifier.
CSharpParserListener.prototype.enterLocal_variable_identifier = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#local_variable_identifier.
CSharpParserListener.prototype.exitLocal_variable_identifier = function(ctx) {};

// Enter a parse tree produced by CSharpParser#local_variable_initializer.
CSharpParserListener.prototype.enterLocal_variable_initializer = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#local_variable_initializer.
CSharpParserListener.prototype.exitLocal_variable_initializer = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#local_constant_declaration.
CSharpParserListener.prototype.enterLocal_constant_declaration = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#local_constant_declaration.
CSharpParserListener.prototype.exitLocal_constant_declaration = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#if_body.
CSharpParserListener.prototype.enterIf_body = function(ctx) {};

// Exit a parse tree produced by CSharpParser#if_body.
CSharpParserListener.prototype.exitIf_body = function(ctx) {};

// Enter a parse tree produced by CSharpParser#switch_section.
CSharpParserListener.prototype.enterSwitch_section = function(ctx) {};

// Exit a parse tree produced by CSharpParser#switch_section.
CSharpParserListener.prototype.exitSwitch_section = function(ctx) {};

// Enter a parse tree produced by CSharpParser#switch_label.
CSharpParserListener.prototype.enterSwitch_label = function(ctx) {};

// Exit a parse tree produced by CSharpParser#switch_label.
CSharpParserListener.prototype.exitSwitch_label = function(ctx) {};

// Enter a parse tree produced by CSharpParser#switch_filter.
CSharpParserListener.prototype.enterSwitch_filter = function(ctx) {};

// Exit a parse tree produced by CSharpParser#switch_filter.
CSharpParserListener.prototype.exitSwitch_filter = function(ctx) {};

// Enter a parse tree produced by CSharpParser#statement_list.
CSharpParserListener.prototype.enterStatement_list = function(ctx) {};

// Exit a parse tree produced by CSharpParser#statement_list.
CSharpParserListener.prototype.exitStatement_list = function(ctx) {};

// Enter a parse tree produced by CSharpParser#for_initializer.
CSharpParserListener.prototype.enterFor_initializer = function(ctx) {};

// Exit a parse tree produced by CSharpParser#for_initializer.
CSharpParserListener.prototype.exitFor_initializer = function(ctx) {};

// Enter a parse tree produced by CSharpParser#for_iterator.
CSharpParserListener.prototype.enterFor_iterator = function(ctx) {};

// Exit a parse tree produced by CSharpParser#for_iterator.
CSharpParserListener.prototype.exitFor_iterator = function(ctx) {};

// Enter a parse tree produced by CSharpParser#catch_clauses.
CSharpParserListener.prototype.enterCatch_clauses = function(ctx) {};

// Exit a parse tree produced by CSharpParser#catch_clauses.
CSharpParserListener.prototype.exitCatch_clauses = function(ctx) {};

// Enter a parse tree produced by CSharpParser#specific_catch_clause.
CSharpParserListener.prototype.enterSpecific_catch_clause = function(ctx) {};

// Exit a parse tree produced by CSharpParser#specific_catch_clause.
CSharpParserListener.prototype.exitSpecific_catch_clause = function(ctx) {};

// Enter a parse tree produced by CSharpParser#general_catch_clause.
CSharpParserListener.prototype.enterGeneral_catch_clause = function(ctx) {};

// Exit a parse tree produced by CSharpParser#general_catch_clause.
CSharpParserListener.prototype.exitGeneral_catch_clause = function(ctx) {};

// Enter a parse tree produced by CSharpParser#exception_filter.
CSharpParserListener.prototype.enterException_filter = function(ctx) {};

// Exit a parse tree produced by CSharpParser#exception_filter.
CSharpParserListener.prototype.exitException_filter = function(ctx) {};

// Enter a parse tree produced by CSharpParser#finally_clause.
CSharpParserListener.prototype.enterFinally_clause = function(ctx) {};

// Exit a parse tree produced by CSharpParser#finally_clause.
CSharpParserListener.prototype.exitFinally_clause = function(ctx) {};

// Enter a parse tree produced by CSharpParser#resource_acquisition.
CSharpParserListener.prototype.enterResource_acquisition = function(ctx) {};

// Exit a parse tree produced by CSharpParser#resource_acquisition.
CSharpParserListener.prototype.exitResource_acquisition = function(ctx) {};

// Enter a parse tree produced by CSharpParser#namespace_declaration.
CSharpParserListener.prototype.enterNamespace_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#namespace_declaration.
CSharpParserListener.prototype.exitNamespace_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#qualified_identifier.
CSharpParserListener.prototype.enterQualified_identifier = function(ctx) {};

// Exit a parse tree produced by CSharpParser#qualified_identifier.
CSharpParserListener.prototype.exitQualified_identifier = function(ctx) {};

// Enter a parse tree produced by CSharpParser#namespace_body.
CSharpParserListener.prototype.enterNamespace_body = function(ctx) {};

// Exit a parse tree produced by CSharpParser#namespace_body.
CSharpParserListener.prototype.exitNamespace_body = function(ctx) {};

// Enter a parse tree produced by CSharpParser#extern_alias_directives.
CSharpParserListener.prototype.enterExtern_alias_directives = function(ctx) {};

// Exit a parse tree produced by CSharpParser#extern_alias_directives.
CSharpParserListener.prototype.exitExtern_alias_directives = function(ctx) {};

// Enter a parse tree produced by CSharpParser#extern_alias_directive.
CSharpParserListener.prototype.enterExtern_alias_directive = function(ctx) {};

// Exit a parse tree produced by CSharpParser#extern_alias_directive.
CSharpParserListener.prototype.exitExtern_alias_directive = function(ctx) {};

// Enter a parse tree produced by CSharpParser#using_directives.
CSharpParserListener.prototype.enterUsing_directives = function(ctx) {};

// Exit a parse tree produced by CSharpParser#using_directives.
CSharpParserListener.prototype.exitUsing_directives = function(ctx) {};

// Enter a parse tree produced by CSharpParser#usingAliasDirective.
CSharpParserListener.prototype.enterUsingAliasDirective = function(ctx) {};

// Exit a parse tree produced by CSharpParser#usingAliasDirective.
CSharpParserListener.prototype.exitUsingAliasDirective = function(ctx) {};

// Enter a parse tree produced by CSharpParser#usingNamespaceDirective.
CSharpParserListener.prototype.enterUsingNamespaceDirective = function(ctx) {};

// Exit a parse tree produced by CSharpParser#usingNamespaceDirective.
CSharpParserListener.prototype.exitUsingNamespaceDirective = function(ctx) {};

// Enter a parse tree produced by CSharpParser#usingStaticDirective.
CSharpParserListener.prototype.enterUsingStaticDirective = function(ctx) {};

// Exit a parse tree produced by CSharpParser#usingStaticDirective.
CSharpParserListener.prototype.exitUsingStaticDirective = function(ctx) {};

// Enter a parse tree produced by CSharpParser#namespace_member_declarations.
CSharpParserListener.prototype.enterNamespace_member_declarations = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#namespace_member_declarations.
CSharpParserListener.prototype.exitNamespace_member_declarations = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#namespace_member_declaration.
CSharpParserListener.prototype.enterNamespace_member_declaration = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#namespace_member_declaration.
CSharpParserListener.prototype.exitNamespace_member_declaration = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#type_declaration.
CSharpParserListener.prototype.enterType_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#type_declaration.
CSharpParserListener.prototype.exitType_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#qualified_alias_member.
CSharpParserListener.prototype.enterQualified_alias_member = function(ctx) {};

// Exit a parse tree produced by CSharpParser#qualified_alias_member.
CSharpParserListener.prototype.exitQualified_alias_member = function(ctx) {};

// Enter a parse tree produced by CSharpParser#type_parameter_list.
CSharpParserListener.prototype.enterType_parameter_list = function(ctx) {};

// Exit a parse tree produced by CSharpParser#type_parameter_list.
CSharpParserListener.prototype.exitType_parameter_list = function(ctx) {};

// Enter a parse tree produced by CSharpParser#type_parameter.
CSharpParserListener.prototype.enterType_parameter = function(ctx) {};

// Exit a parse tree produced by CSharpParser#type_parameter.
CSharpParserListener.prototype.exitType_parameter = function(ctx) {};

// Enter a parse tree produced by CSharpParser#class_base.
CSharpParserListener.prototype.enterClass_base = function(ctx) {};

// Exit a parse tree produced by CSharpParser#class_base.
CSharpParserListener.prototype.exitClass_base = function(ctx) {};

// Enter a parse tree produced by CSharpParser#interface_type_list.
CSharpParserListener.prototype.enterInterface_type_list = function(ctx) {};

// Exit a parse tree produced by CSharpParser#interface_type_list.
CSharpParserListener.prototype.exitInterface_type_list = function(ctx) {};

// Enter a parse tree produced by CSharpParser#type_parameter_constraints_clauses.
CSharpParserListener.prototype.enterType_parameter_constraints_clauses = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#type_parameter_constraints_clauses.
CSharpParserListener.prototype.exitType_parameter_constraints_clauses = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#type_parameter_constraints_clause.
CSharpParserListener.prototype.enterType_parameter_constraints_clause = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#type_parameter_constraints_clause.
CSharpParserListener.prototype.exitType_parameter_constraints_clause = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#type_parameter_constraints.
CSharpParserListener.prototype.enterType_parameter_constraints = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#type_parameter_constraints.
CSharpParserListener.prototype.exitType_parameter_constraints = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#primary_constraint.
CSharpParserListener.prototype.enterPrimary_constraint = function(ctx) {};

// Exit a parse tree produced by CSharpParser#primary_constraint.
CSharpParserListener.prototype.exitPrimary_constraint = function(ctx) {};

// Enter a parse tree produced by CSharpParser#secondary_constraints.
CSharpParserListener.prototype.enterSecondary_constraints = function(ctx) {};

// Exit a parse tree produced by CSharpParser#secondary_constraints.
CSharpParserListener.prototype.exitSecondary_constraints = function(ctx) {};

// Enter a parse tree produced by CSharpParser#constructor_constraint.
CSharpParserListener.prototype.enterConstructor_constraint = function(ctx) {};

// Exit a parse tree produced by CSharpParser#constructor_constraint.
CSharpParserListener.prototype.exitConstructor_constraint = function(ctx) {};

// Enter a parse tree produced by CSharpParser#class_body.
CSharpParserListener.prototype.enterClass_body = function(ctx) {};

// Exit a parse tree produced by CSharpParser#class_body.
CSharpParserListener.prototype.exitClass_body = function(ctx) {};

// Enter a parse tree produced by CSharpParser#class_member_declarations.
CSharpParserListener.prototype.enterClass_member_declarations = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#class_member_declarations.
CSharpParserListener.prototype.exitClass_member_declarations = function(ctx) {};

// Enter a parse tree produced by CSharpParser#class_member_declaration.
CSharpParserListener.prototype.enterClass_member_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#class_member_declaration.
CSharpParserListener.prototype.exitClass_member_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#all_member_modifiers.
CSharpParserListener.prototype.enterAll_member_modifiers = function(ctx) {};

// Exit a parse tree produced by CSharpParser#all_member_modifiers.
CSharpParserListener.prototype.exitAll_member_modifiers = function(ctx) {};

// Enter a parse tree produced by CSharpParser#all_member_modifier.
CSharpParserListener.prototype.enterAll_member_modifier = function(ctx) {};

// Exit a parse tree produced by CSharpParser#all_member_modifier.
CSharpParserListener.prototype.exitAll_member_modifier = function(ctx) {};

// Enter a parse tree produced by CSharpParser#common_member_declaration.
CSharpParserListener.prototype.enterCommon_member_declaration = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#common_member_declaration.
CSharpParserListener.prototype.exitCommon_member_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#typed_member_declaration.
CSharpParserListener.prototype.enterTyped_member_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#typed_member_declaration.
CSharpParserListener.prototype.exitTyped_member_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#constant_declarators.
CSharpParserListener.prototype.enterConstant_declarators = function(ctx) {};

// Exit a parse tree produced by CSharpParser#constant_declarators.
CSharpParserListener.prototype.exitConstant_declarators = function(ctx) {};

// Enter a parse tree produced by CSharpParser#constant_declarator.
CSharpParserListener.prototype.enterConstant_declarator = function(ctx) {};

// Exit a parse tree produced by CSharpParser#constant_declarator.
CSharpParserListener.prototype.exitConstant_declarator = function(ctx) {};

// Enter a parse tree produced by CSharpParser#variable_declarators.
CSharpParserListener.prototype.enterVariable_declarators = function(ctx) {};

// Exit a parse tree produced by CSharpParser#variable_declarators.
CSharpParserListener.prototype.exitVariable_declarators = function(ctx) {};

// Enter a parse tree produced by CSharpParser#variable_declarator.
CSharpParserListener.prototype.enterVariable_declarator = function(ctx) {};

// Exit a parse tree produced by CSharpParser#variable_declarator.
CSharpParserListener.prototype.exitVariable_declarator = function(ctx) {};

// Enter a parse tree produced by CSharpParser#variable_initializer.
CSharpParserListener.prototype.enterVariable_initializer = function(ctx) {};

// Exit a parse tree produced by CSharpParser#variable_initializer.
CSharpParserListener.prototype.exitVariable_initializer = function(ctx) {};

// Enter a parse tree produced by CSharpParser#return_type.
CSharpParserListener.prototype.enterReturn_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#return_type.
CSharpParserListener.prototype.exitReturn_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#member_name.
CSharpParserListener.prototype.enterMember_name = function(ctx) {};

// Exit a parse tree produced by CSharpParser#member_name.
CSharpParserListener.prototype.exitMember_name = function(ctx) {};

// Enter a parse tree produced by CSharpParser#method_body.
CSharpParserListener.prototype.enterMethod_body = function(ctx) {};

// Exit a parse tree produced by CSharpParser#method_body.
CSharpParserListener.prototype.exitMethod_body = function(ctx) {};

// Enter a parse tree produced by CSharpParser#formal_parameter_list.
CSharpParserListener.prototype.enterFormal_parameter_list = function(ctx) {};

// Exit a parse tree produced by CSharpParser#formal_parameter_list.
CSharpParserListener.prototype.exitFormal_parameter_list = function(ctx) {};

// Enter a parse tree produced by CSharpParser#fixed_parameters.
CSharpParserListener.prototype.enterFixed_parameters = function(ctx) {};

// Exit a parse tree produced by CSharpParser#fixed_parameters.
CSharpParserListener.prototype.exitFixed_parameters = function(ctx) {};

// Enter a parse tree produced by CSharpParser#fixed_parameter.
CSharpParserListener.prototype.enterFixed_parameter = function(ctx) {};

// Exit a parse tree produced by CSharpParser#fixed_parameter.
CSharpParserListener.prototype.exitFixed_parameter = function(ctx) {};

// Enter a parse tree produced by CSharpParser#parameter_modifier.
CSharpParserListener.prototype.enterParameter_modifier = function(ctx) {};

// Exit a parse tree produced by CSharpParser#parameter_modifier.
CSharpParserListener.prototype.exitParameter_modifier = function(ctx) {};

// Enter a parse tree produced by CSharpParser#parameter_array.
CSharpParserListener.prototype.enterParameter_array = function(ctx) {};

// Exit a parse tree produced by CSharpParser#parameter_array.
CSharpParserListener.prototype.exitParameter_array = function(ctx) {};

// Enter a parse tree produced by CSharpParser#accessor_declarations.
CSharpParserListener.prototype.enterAccessor_declarations = function(ctx) {};

// Exit a parse tree produced by CSharpParser#accessor_declarations.
CSharpParserListener.prototype.exitAccessor_declarations = function(ctx) {};

// Enter a parse tree produced by CSharpParser#get_accessor_declaration.
CSharpParserListener.prototype.enterGet_accessor_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#get_accessor_declaration.
CSharpParserListener.prototype.exitGet_accessor_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#set_accessor_declaration.
CSharpParserListener.prototype.enterSet_accessor_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#set_accessor_declaration.
CSharpParserListener.prototype.exitSet_accessor_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#accessor_modifier.
CSharpParserListener.prototype.enterAccessor_modifier = function(ctx) {};

// Exit a parse tree produced by CSharpParser#accessor_modifier.
CSharpParserListener.prototype.exitAccessor_modifier = function(ctx) {};

// Enter a parse tree produced by CSharpParser#accessor_body.
CSharpParserListener.prototype.enterAccessor_body = function(ctx) {};

// Exit a parse tree produced by CSharpParser#accessor_body.
CSharpParserListener.prototype.exitAccessor_body = function(ctx) {};

// Enter a parse tree produced by CSharpParser#event_accessor_declarations.
CSharpParserListener.prototype.enterEvent_accessor_declarations = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#event_accessor_declarations.
CSharpParserListener.prototype.exitEvent_accessor_declarations = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#add_accessor_declaration.
CSharpParserListener.prototype.enterAdd_accessor_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#add_accessor_declaration.
CSharpParserListener.prototype.exitAdd_accessor_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#remove_accessor_declaration.
CSharpParserListener.prototype.enterRemove_accessor_declaration = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#remove_accessor_declaration.
CSharpParserListener.prototype.exitRemove_accessor_declaration = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#overloadable_operator.
CSharpParserListener.prototype.enterOverloadable_operator = function(ctx) {};

// Exit a parse tree produced by CSharpParser#overloadable_operator.
CSharpParserListener.prototype.exitOverloadable_operator = function(ctx) {};

// Enter a parse tree produced by CSharpParser#conversion_operator_declarator.
CSharpParserListener.prototype.enterConversion_operator_declarator = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#conversion_operator_declarator.
CSharpParserListener.prototype.exitConversion_operator_declarator = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#constructor_initializer.
CSharpParserListener.prototype.enterConstructor_initializer = function(ctx) {};

// Exit a parse tree produced by CSharpParser#constructor_initializer.
CSharpParserListener.prototype.exitConstructor_initializer = function(ctx) {};

// Enter a parse tree produced by CSharpParser#body.
CSharpParserListener.prototype.enterBody = function(ctx) {};

// Exit a parse tree produced by CSharpParser#body.
CSharpParserListener.prototype.exitBody = function(ctx) {};

// Enter a parse tree produced by CSharpParser#struct_interfaces.
CSharpParserListener.prototype.enterStruct_interfaces = function(ctx) {};

// Exit a parse tree produced by CSharpParser#struct_interfaces.
CSharpParserListener.prototype.exitStruct_interfaces = function(ctx) {};

// Enter a parse tree produced by CSharpParser#struct_body.
CSharpParserListener.prototype.enterStruct_body = function(ctx) {};

// Exit a parse tree produced by CSharpParser#struct_body.
CSharpParserListener.prototype.exitStruct_body = function(ctx) {};

// Enter a parse tree produced by CSharpParser#struct_member_declaration.
CSharpParserListener.prototype.enterStruct_member_declaration = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#struct_member_declaration.
CSharpParserListener.prototype.exitStruct_member_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#array_type.
CSharpParserListener.prototype.enterArray_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#array_type.
CSharpParserListener.prototype.exitArray_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#rank_specifier.
CSharpParserListener.prototype.enterRank_specifier = function(ctx) {};

// Exit a parse tree produced by CSharpParser#rank_specifier.
CSharpParserListener.prototype.exitRank_specifier = function(ctx) {};

// Enter a parse tree produced by CSharpParser#array_initializer.
CSharpParserListener.prototype.enterArray_initializer = function(ctx) {};

// Exit a parse tree produced by CSharpParser#array_initializer.
CSharpParserListener.prototype.exitArray_initializer = function(ctx) {};

// Enter a parse tree produced by CSharpParser#variant_type_parameter_list.
CSharpParserListener.prototype.enterVariant_type_parameter_list = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#variant_type_parameter_list.
CSharpParserListener.prototype.exitVariant_type_parameter_list = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#variant_type_parameter.
CSharpParserListener.prototype.enterVariant_type_parameter = function(ctx) {};

// Exit a parse tree produced by CSharpParser#variant_type_parameter.
CSharpParserListener.prototype.exitVariant_type_parameter = function(ctx) {};

// Enter a parse tree produced by CSharpParser#variance_annotation.
CSharpParserListener.prototype.enterVariance_annotation = function(ctx) {};

// Exit a parse tree produced by CSharpParser#variance_annotation.
CSharpParserListener.prototype.exitVariance_annotation = function(ctx) {};

// Enter a parse tree produced by CSharpParser#interface_base.
CSharpParserListener.prototype.enterInterface_base = function(ctx) {};

// Exit a parse tree produced by CSharpParser#interface_base.
CSharpParserListener.prototype.exitInterface_base = function(ctx) {};

// Enter a parse tree produced by CSharpParser#interface_body.
CSharpParserListener.prototype.enterInterface_body = function(ctx) {};

// Exit a parse tree produced by CSharpParser#interface_body.
CSharpParserListener.prototype.exitInterface_body = function(ctx) {};

// Enter a parse tree produced by CSharpParser#interface_member_declaration.
CSharpParserListener.prototype.enterInterface_member_declaration = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#interface_member_declaration.
CSharpParserListener.prototype.exitInterface_member_declaration = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#interface_accessors.
CSharpParserListener.prototype.enterInterface_accessors = function(ctx) {};

// Exit a parse tree produced by CSharpParser#interface_accessors.
CSharpParserListener.prototype.exitInterface_accessors = function(ctx) {};

// Enter a parse tree produced by CSharpParser#enum_base.
CSharpParserListener.prototype.enterEnum_base = function(ctx) {};

// Exit a parse tree produced by CSharpParser#enum_base.
CSharpParserListener.prototype.exitEnum_base = function(ctx) {};

// Enter a parse tree produced by CSharpParser#enum_body.
CSharpParserListener.prototype.enterEnum_body = function(ctx) {};

// Exit a parse tree produced by CSharpParser#enum_body.
CSharpParserListener.prototype.exitEnum_body = function(ctx) {};

// Enter a parse tree produced by CSharpParser#enum_member_declaration.
CSharpParserListener.prototype.enterEnum_member_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#enum_member_declaration.
CSharpParserListener.prototype.exitEnum_member_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#global_attribute_section.
CSharpParserListener.prototype.enterGlobal_attribute_section = function(ctx) {};

// Exit a parse tree produced by CSharpParser#global_attribute_section.
CSharpParserListener.prototype.exitGlobal_attribute_section = function(ctx) {};

// Enter a parse tree produced by CSharpParser#global_attribute_target.
CSharpParserListener.prototype.enterGlobal_attribute_target = function(ctx) {};

// Exit a parse tree produced by CSharpParser#global_attribute_target.
CSharpParserListener.prototype.exitGlobal_attribute_target = function(ctx) {};

// Enter a parse tree produced by CSharpParser#attributes.
CSharpParserListener.prototype.enterAttributes = function(ctx) {};

// Exit a parse tree produced by CSharpParser#attributes.
CSharpParserListener.prototype.exitAttributes = function(ctx) {};

// Enter a parse tree produced by CSharpParser#attribute_section.
CSharpParserListener.prototype.enterAttribute_section = function(ctx) {};

// Exit a parse tree produced by CSharpParser#attribute_section.
CSharpParserListener.prototype.exitAttribute_section = function(ctx) {};

// Enter a parse tree produced by CSharpParser#attribute_target.
CSharpParserListener.prototype.enterAttribute_target = function(ctx) {};

// Exit a parse tree produced by CSharpParser#attribute_target.
CSharpParserListener.prototype.exitAttribute_target = function(ctx) {};

// Enter a parse tree produced by CSharpParser#attribute_list.
CSharpParserListener.prototype.enterAttribute_list = function(ctx) {};

// Exit a parse tree produced by CSharpParser#attribute_list.
CSharpParserListener.prototype.exitAttribute_list = function(ctx) {};

// Enter a parse tree produced by CSharpParser#attribute.
CSharpParserListener.prototype.enterAttribute = function(ctx) {};

// Exit a parse tree produced by CSharpParser#attribute.
CSharpParserListener.prototype.exitAttribute = function(ctx) {};

// Enter a parse tree produced by CSharpParser#attribute_argument.
CSharpParserListener.prototype.enterAttribute_argument = function(ctx) {};

// Exit a parse tree produced by CSharpParser#attribute_argument.
CSharpParserListener.prototype.exitAttribute_argument = function(ctx) {};

// Enter a parse tree produced by CSharpParser#pointer_type.
CSharpParserListener.prototype.enterPointer_type = function(ctx) {};

// Exit a parse tree produced by CSharpParser#pointer_type.
CSharpParserListener.prototype.exitPointer_type = function(ctx) {};

// Enter a parse tree produced by CSharpParser#fixed_pointer_declarators.
CSharpParserListener.prototype.enterFixed_pointer_declarators = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#fixed_pointer_declarators.
CSharpParserListener.prototype.exitFixed_pointer_declarators = function(ctx) {};

// Enter a parse tree produced by CSharpParser#fixed_pointer_declarator.
CSharpParserListener.prototype.enterFixed_pointer_declarator = function(ctx) {};

// Exit a parse tree produced by CSharpParser#fixed_pointer_declarator.
CSharpParserListener.prototype.exitFixed_pointer_declarator = function(ctx) {};

// Enter a parse tree produced by CSharpParser#fixed_pointer_initializer.
CSharpParserListener.prototype.enterFixed_pointer_initializer = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#fixed_pointer_initializer.
CSharpParserListener.prototype.exitFixed_pointer_initializer = function(ctx) {};

// Enter a parse tree produced by CSharpParser#fixed_size_buffer_declarator.
CSharpParserListener.prototype.enterFixed_size_buffer_declarator = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#fixed_size_buffer_declarator.
CSharpParserListener.prototype.exitFixed_size_buffer_declarator = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#local_variable_initializer_unsafe.
CSharpParserListener.prototype.enterLocal_variable_initializer_unsafe = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#local_variable_initializer_unsafe.
CSharpParserListener.prototype.exitLocal_variable_initializer_unsafe = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#right_arrow.
CSharpParserListener.prototype.enterRight_arrow = function(ctx) {};

// Exit a parse tree produced by CSharpParser#right_arrow.
CSharpParserListener.prototype.exitRight_arrow = function(ctx) {};

// Enter a parse tree produced by CSharpParser#right_shift.
CSharpParserListener.prototype.enterRight_shift = function(ctx) {};

// Exit a parse tree produced by CSharpParser#right_shift.
CSharpParserListener.prototype.exitRight_shift = function(ctx) {};

// Enter a parse tree produced by CSharpParser#right_shift_assignment.
CSharpParserListener.prototype.enterRight_shift_assignment = function(ctx) {};

// Exit a parse tree produced by CSharpParser#right_shift_assignment.
CSharpParserListener.prototype.exitRight_shift_assignment = function(ctx) {};

// Enter a parse tree produced by CSharpParser#literal.
CSharpParserListener.prototype.enterLiteral = function(ctx) {};

// Exit a parse tree produced by CSharpParser#literal.
CSharpParserListener.prototype.exitLiteral = function(ctx) {};

// Enter a parse tree produced by CSharpParser#boolean_literal.
CSharpParserListener.prototype.enterBoolean_literal = function(ctx) {};

// Exit a parse tree produced by CSharpParser#boolean_literal.
CSharpParserListener.prototype.exitBoolean_literal = function(ctx) {};

// Enter a parse tree produced by CSharpParser#string_literal.
CSharpParserListener.prototype.enterString_literal = function(ctx) {};

// Exit a parse tree produced by CSharpParser#string_literal.
CSharpParserListener.prototype.exitString_literal = function(ctx) {};

// Enter a parse tree produced by CSharpParser#interpolated_regular_string.
CSharpParserListener.prototype.enterInterpolated_regular_string = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#interpolated_regular_string.
CSharpParserListener.prototype.exitInterpolated_regular_string = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#interpolated_verbatium_string.
CSharpParserListener.prototype.enterInterpolated_verbatium_string = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#interpolated_verbatium_string.
CSharpParserListener.prototype.exitInterpolated_verbatium_string = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#interpolated_regular_string_part.
CSharpParserListener.prototype.enterInterpolated_regular_string_part = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#interpolated_regular_string_part.
CSharpParserListener.prototype.exitInterpolated_regular_string_part = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#interpolated_verbatium_string_part.
CSharpParserListener.prototype.enterInterpolated_verbatium_string_part = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#interpolated_verbatium_string_part.
CSharpParserListener.prototype.exitInterpolated_verbatium_string_part = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#interpolated_string_expression.
CSharpParserListener.prototype.enterInterpolated_string_expression = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#interpolated_string_expression.
CSharpParserListener.prototype.exitInterpolated_string_expression = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#keyword.
CSharpParserListener.prototype.enterKeyword = function(ctx) {};

// Exit a parse tree produced by CSharpParser#keyword.
CSharpParserListener.prototype.exitKeyword = function(ctx) {};

// Enter a parse tree produced by CSharpParser#class_definition.
CSharpParserListener.prototype.enterClass_definition = function(ctx) {};

// Exit a parse tree produced by CSharpParser#class_definition.
CSharpParserListener.prototype.exitClass_definition = function(ctx) {};

// Enter a parse tree produced by CSharpParser#struct_definition.
CSharpParserListener.prototype.enterStruct_definition = function(ctx) {};

// Exit a parse tree produced by CSharpParser#struct_definition.
CSharpParserListener.prototype.exitStruct_definition = function(ctx) {};

// Enter a parse tree produced by CSharpParser#interface_definition.
CSharpParserListener.prototype.enterInterface_definition = function(ctx) {};

// Exit a parse tree produced by CSharpParser#interface_definition.
CSharpParserListener.prototype.exitInterface_definition = function(ctx) {};

// Enter a parse tree produced by CSharpParser#enum_definition.
CSharpParserListener.prototype.enterEnum_definition = function(ctx) {};

// Exit a parse tree produced by CSharpParser#enum_definition.
CSharpParserListener.prototype.exitEnum_definition = function(ctx) {};

// Enter a parse tree produced by CSharpParser#delegate_definition.
CSharpParserListener.prototype.enterDelegate_definition = function(ctx) {};

// Exit a parse tree produced by CSharpParser#delegate_definition.
CSharpParserListener.prototype.exitDelegate_definition = function(ctx) {};

// Enter a parse tree produced by CSharpParser#event_declaration.
CSharpParserListener.prototype.enterEvent_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#event_declaration.
CSharpParserListener.prototype.exitEvent_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#field_declaration.
CSharpParserListener.prototype.enterField_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#field_declaration.
CSharpParserListener.prototype.exitField_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#property_declaration.
CSharpParserListener.prototype.enterProperty_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#property_declaration.
CSharpParserListener.prototype.exitProperty_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#constant_declaration.
CSharpParserListener.prototype.enterConstant_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#constant_declaration.
CSharpParserListener.prototype.exitConstant_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#indexer_declaration.
CSharpParserListener.prototype.enterIndexer_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#indexer_declaration.
CSharpParserListener.prototype.exitIndexer_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#destructor_definition.
CSharpParserListener.prototype.enterDestructor_definition = function(ctx) {};

// Exit a parse tree produced by CSharpParser#destructor_definition.
CSharpParserListener.prototype.exitDestructor_definition = function(ctx) {};

// Enter a parse tree produced by CSharpParser#constructor_declaration.
CSharpParserListener.prototype.enterConstructor_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#constructor_declaration.
CSharpParserListener.prototype.exitConstructor_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#method_declaration.
CSharpParserListener.prototype.enterMethod_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#method_declaration.
CSharpParserListener.prototype.exitMethod_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#method_member_name.
CSharpParserListener.prototype.enterMethod_member_name = function(ctx) {};

// Exit a parse tree produced by CSharpParser#method_member_name.
CSharpParserListener.prototype.exitMethod_member_name = function(ctx) {};

// Enter a parse tree produced by CSharpParser#operator_declaration.
CSharpParserListener.prototype.enterOperator_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#operator_declaration.
CSharpParserListener.prototype.exitOperator_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#arg_declaration.
CSharpParserListener.prototype.enterArg_declaration = function(ctx) {};

// Exit a parse tree produced by CSharpParser#arg_declaration.
CSharpParserListener.prototype.exitArg_declaration = function(ctx) {};

// Enter a parse tree produced by CSharpParser#method_invocation.
CSharpParserListener.prototype.enterMethod_invocation = function(ctx) {};

// Exit a parse tree produced by CSharpParser#method_invocation.
CSharpParserListener.prototype.exitMethod_invocation = function(ctx) {};

// Enter a parse tree produced by CSharpParser#object_creation_expression.
CSharpParserListener.prototype.enterObject_creation_expression = function(
  ctx
) {};

// Exit a parse tree produced by CSharpParser#object_creation_expression.
CSharpParserListener.prototype.exitObject_creation_expression = function(
  ctx
) {};

// Enter a parse tree produced by CSharpParser#identifier.
CSharpParserListener.prototype.enterIdentifier = function(ctx) {};

// Exit a parse tree produced by CSharpParser#identifier.
CSharpParserListener.prototype.exitIdentifier = function(ctx) {};

exports.CSharpParserListener = CSharpParserListener;
