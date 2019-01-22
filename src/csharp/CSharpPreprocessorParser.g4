// Eclipse Public License - v 1.0, http://www.eclipse.org/legal/epl-v10.html
// Copyright (c) 2013, Christian Wulf (chwchw@gmx.de)
// Copyright (c) 2016-2017, Ivan Kochurkin (kvanttt@gmail.com), Positive Technologies.

parser grammar CSharpPreprocessorParser;

options { tokenVocab=CSharpLexer; }

@parser::members
{
this.conditions = [true];
this.conditionalSymbols = new Set(["DEBUG"]);

this.prototype.allConditions = function() {
	return this.conditions.indexOf(false) < 0;
}
}

preprocessor_directive returns [boolean value]
	: DEFINE CONDITIONAL_SYMBOL directive_new_line_or_sharp{ this.conditionalSymbols.add($CONDITIONAL_SYMBOL.text);
	   $value = this.allConditions(); } #preprocessorDeclaration

	| UNDEF CONDITIONAL_SYMBOL directive_new_line_or_sharp{ this.conditionalSymbols.remove($CONDITIONAL_SYMBOL.text);
	   $value = this.allConditions(); } #preprocessorDeclaration

	| IF expr=preprocessor_expression directive_new_line_or_sharp
	  { $value = $expr.value === "true" && this.allConditions();; this.conditions.push($expr.value === "true"); }
	  #preprocessorConditional

	| ELIF expr=preprocessor_expression directive_new_line_or_sharp
	  { if (!this.conditions[this.conditions.length - 1]) { this.conditions.pop(); $value = $expr.value === "true" && this.allConditions();;
	     this.conditions.push($expr.value === "true"); } else $value = false;; }
	     #preprocessorConditional

	| ELSE directive_new_line_or_sharp
	  { if (!this.conditions[this.conditions.length - 1]) { this.conditions.pop(); $value = true && this.allConditions();; this.conditions.push(true); }
	    else $value = false;; }    #preprocessorConditional

	| ENDIF directive_new_line_or_sharp             { this.conditions.pop(); $value = this.conditions.peek();; }
	   #preprocessorConditional
	| LINE (DIGITS STRING? | DEFAULT | DIRECTIVE_HIDDEN) directive_new_line_or_sharp { $value = this.allConditions(); }
	   #preprocessorLine

	| ERROR TEXT directive_new_line_or_sharp       { $value = this.allConditions(); }   #preprocessorDiagnostic

	| WARNING TEXT directive_new_line_or_sharp     { $value = this.allConditions(); }   #preprocessorDiagnostic

	| REGION TEXT? directive_new_line_or_sharp      { $value = this.allConditions(); }   #preprocessorRegion

	| ENDREGION TEXT? directive_new_line_or_sharp  { $value = this.allConditions(); }   #preprocessorRegion

	| PRAGMA TEXT directive_new_line_or_sharp      { $value = this.allConditions(); }   #preprocessorPragma
	;

directive_new_line_or_sharp
    : DIRECTIVE_NEW_LINE
    | EOF
    ;

preprocessor_expression returns [String value]
	: TRUE                                 { $value = "true"; }
	| FALSE                                { $value = "false"; }
	| CONDITIONAL_SYMBOL                   { $value = this.conditionalSymbols.has($CONDITIONAL_SYMBOL.text) ? "true" : "false"; }
	| OPEN_PARENS expr=preprocessor_expression CLOSE_PARENS { $value = $expr.value; }
	| BANG expr=preprocessor_expression     { $value = $expr.value === "true" ? "false" : "true"; }
	| expr1=preprocessor_expression OP_EQ expr2=preprocessor_expression
	  { $value = ($expr1.value == $expr2.value ? "true" : "false"); }
	| expr1=preprocessor_expression OP_NE expr2=preprocessor_expression
	  { $value = ($expr1.value != $expr2.value ? "true" : "false"); }
	| expr1=preprocessor_expression OP_AND expr2=preprocessor_expression
	  { $value = ($expr1.value === "true" && $expr2.value === "true" ? "true" : "false"); }
	| expr1=preprocessor_expression OP_OR expr2=preprocessor_expression
	  { $value = ($expr1.value === "true" || $expr2.value === "true" ? "true" : "false"); }
	;