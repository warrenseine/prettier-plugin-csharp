// jshint ignore: start
var antlr4 = require("antlr4/index");

// This class defines a complete listener for a parse tree produced by CSharpPreprocessorParser.
function CSharpPreprocessorParserListener() {
  antlr4.tree.ParseTreeListener.call(this);
  return this;
}

CSharpPreprocessorParserListener.prototype = Object.create(
  antlr4.tree.ParseTreeListener.prototype
);
CSharpPreprocessorParserListener.prototype.constructor = CSharpPreprocessorParserListener;

// Enter a parse tree produced by CSharpPreprocessorParser#preprocessorDeclaration.
CSharpPreprocessorParserListener.prototype.enterPreprocessorDeclaration = function(
  ctx
) {};

// Exit a parse tree produced by CSharpPreprocessorParser#preprocessorDeclaration.
CSharpPreprocessorParserListener.prototype.exitPreprocessorDeclaration = function(
  ctx
) {};

// Enter a parse tree produced by CSharpPreprocessorParser#preprocessorConditional.
CSharpPreprocessorParserListener.prototype.enterPreprocessorConditional = function(
  ctx
) {};

// Exit a parse tree produced by CSharpPreprocessorParser#preprocessorConditional.
CSharpPreprocessorParserListener.prototype.exitPreprocessorConditional = function(
  ctx
) {};

// Enter a parse tree produced by CSharpPreprocessorParser#preprocessorLine.
CSharpPreprocessorParserListener.prototype.enterPreprocessorLine = function(
  ctx
) {};

// Exit a parse tree produced by CSharpPreprocessorParser#preprocessorLine.
CSharpPreprocessorParserListener.prototype.exitPreprocessorLine = function(
  ctx
) {};

// Enter a parse tree produced by CSharpPreprocessorParser#preprocessorDiagnostic.
CSharpPreprocessorParserListener.prototype.enterPreprocessorDiagnostic = function(
  ctx
) {};

// Exit a parse tree produced by CSharpPreprocessorParser#preprocessorDiagnostic.
CSharpPreprocessorParserListener.prototype.exitPreprocessorDiagnostic = function(
  ctx
) {};

// Enter a parse tree produced by CSharpPreprocessorParser#preprocessorRegion.
CSharpPreprocessorParserListener.prototype.enterPreprocessorRegion = function(
  ctx
) {};

// Exit a parse tree produced by CSharpPreprocessorParser#preprocessorRegion.
CSharpPreprocessorParserListener.prototype.exitPreprocessorRegion = function(
  ctx
) {};

// Enter a parse tree produced by CSharpPreprocessorParser#preprocessorPragma.
CSharpPreprocessorParserListener.prototype.enterPreprocessorPragma = function(
  ctx
) {};

// Exit a parse tree produced by CSharpPreprocessorParser#preprocessorPragma.
CSharpPreprocessorParserListener.prototype.exitPreprocessorPragma = function(
  ctx
) {};

// Enter a parse tree produced by CSharpPreprocessorParser#directive_new_line_or_sharp.
CSharpPreprocessorParserListener.prototype.enterDirective_new_line_or_sharp = function(
  ctx
) {};

// Exit a parse tree produced by CSharpPreprocessorParser#directive_new_line_or_sharp.
CSharpPreprocessorParserListener.prototype.exitDirective_new_line_or_sharp = function(
  ctx
) {};

// Enter a parse tree produced by CSharpPreprocessorParser#preprocessor_expression.
CSharpPreprocessorParserListener.prototype.enterPreprocessor_expression = function(
  ctx
) {};

// Exit a parse tree produced by CSharpPreprocessorParser#preprocessor_expression.
CSharpPreprocessorParserListener.prototype.exitPreprocessor_expression = function(
  ctx
) {};

exports.CSharpPreprocessorParserListener = CSharpPreprocessorParserListener;
