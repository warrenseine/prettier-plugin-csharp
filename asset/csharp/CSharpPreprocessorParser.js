// Generated from asset/csharp/CSharpPreprocessorParser.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var CSharpPreprocessorParserListener = require('./CSharpPreprocessorParserListener').CSharpPreprocessorParserListener;
import java.util.Stack;
import java.util.HashSet;
var grammarFileName = "CSharpPreprocessorParser.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\u00c2}\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0005\u0002(\n\u0002\u0003\u0002\u0003\u0002\u0005",
    "\u0002,\n\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003",
    "\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0005\u0002=",
    "\n\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002",
    "\u0005\u0002D\n\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002",
    "\u0003\u0002\u0003\u0002\u0003\u0002\u0003\u0002\u0005\u0002N\n\u0002",
    "\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0005\u0004b\n\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0007\u0004x\n\u0004",
    "\f\u0004\u000e\u0004{\u000b\u0004\u0003\u0004\u0002\u0003\u0006\u0005",
    "\u0002\u0004\u0006\u0002\u0003\u0003\u0003\u00c0\u00c0\u0002\u0091\u0002",
    "M\u0003\u0002\u0002\u0002\u0004O\u0003\u0002\u0002\u0002\u0006a\u0003",
    "\u0002\u0002\u0002\b\t\u0007\u00b4\u0002\u0002\t\n\u0007\u00bf\u0002",
    "\u0002\n\u000b\u0005\u0004\u0003\u0002\u000b\f\b\u0002\u0001\u0002\f",
    "N\u0003\u0002\u0002\u0002\r\u000e\u0007\u00b5\u0002\u0002\u000e\u000f",
    "\u0007\u00bf\u0002\u0002\u000f\u0010\u0005\u0004\u0003\u0002\u0010\u0011",
    "\b\u0002\u0001\u0002\u0011N\u0003\u0002\u0002\u0002\u0012\u0013\u0007",
    "5\u0002\u0002\u0013\u0014\u0005\u0006\u0004\u0002\u0014\u0015\u0005",
    "\u0004\u0003\u0002\u0015\u0016\b\u0002\u0001\u0002\u0016N\u0003\u0002",
    "\u0002\u0002\u0017\u0018\u0007\u00b6\u0002\u0002\u0018\u0019\u0005\u0006",
    "\u0004\u0002\u0019\u001a\u0005\u0004\u0003\u0002\u001a\u001b\b\u0002",
    "\u0001\u0002\u001bN\u0003\u0002\u0002\u0002\u001c\u001d\u0007%\u0002",
    "\u0002\u001d\u001e\u0005\u0004\u0003\u0002\u001e\u001f\b\u0002\u0001",
    "\u0002\u001fN\u0003\u0002\u0002\u0002 !\u0007\u00b7\u0002\u0002!\"\u0005",
    "\u0004\u0003\u0002\"#\b\u0002\u0001\u0002#N\u0003\u0002\u0002\u0002",
    "$+\u0007\u00b8\u0002\u0002%\'\u0007\u00b3\u0002\u0002&(\u0007\\\u0002",
    "\u0002\'&\u0003\u0002\u0002\u0002\'(\u0003\u0002\u0002\u0002(,\u0003",
    "\u0002\u0002\u0002),\u0007\u001f\u0002\u0002*,\u0007\u00be\u0002\u0002",
    "+%\u0003\u0002\u0002\u0002+)\u0003\u0002\u0002\u0002+*\u0003\u0002\u0002",
    "\u0002,-\u0003\u0002\u0002\u0002-.\u0005\u0004\u0003\u0002./\b\u0002",
    "\u0001\u0002/N\u0003\u0002\u0002\u000201\u0007\u00b9\u0002\u000212\u0007",
    "\u00c1\u0002\u000223\u0005\u0004\u0003\u000234\b\u0002\u0001\u00024",
    "N\u0003\u0002\u0002\u000256\u0007\u00ba\u0002\u000267\u0007\u00c1\u0002",
    "\u000278\u0005\u0004\u0003\u000289\b\u0002\u0001\u00029N\u0003\u0002",
    "\u0002\u0002:<\u0007\u00bb\u0002\u0002;=\u0007\u00c1\u0002\u0002<;\u0003",
    "\u0002\u0002\u0002<=\u0003\u0002\u0002\u0002=>\u0003\u0002\u0002\u0002",
    ">?\u0005\u0004\u0003\u0002?@\b\u0002\u0001\u0002@N\u0003\u0002\u0002",
    "\u0002AC\u0007\u00bc\u0002\u0002BD\u0007\u00c1\u0002\u0002CB\u0003\u0002",
    "\u0002\u0002CD\u0003\u0002\u0002\u0002DE\u0003\u0002\u0002\u0002EF\u0005",
    "\u0004\u0003\u0002FG\b\u0002\u0001\u0002GN\u0003\u0002\u0002\u0002H",
    "I\u0007\u00bd\u0002\u0002IJ\u0007\u00c1\u0002\u0002JK\u0005\u0004\u0003",
    "\u0002KL\b\u0002\u0001\u0002LN\u0003\u0002\u0002\u0002M\b\u0003\u0002",
    "\u0002\u0002M\r\u0003\u0002\u0002\u0002M\u0012\u0003\u0002\u0002\u0002",
    "M\u0017\u0003\u0002\u0002\u0002M\u001c\u0003\u0002\u0002\u0002M \u0003",
    "\u0002\u0002\u0002M$\u0003\u0002\u0002\u0002M0\u0003\u0002\u0002\u0002",
    "M5\u0003\u0002\u0002\u0002M:\u0003\u0002\u0002\u0002MA\u0003\u0002\u0002",
    "\u0002MH\u0003\u0002\u0002\u0002N\u0003\u0003\u0002\u0002\u0002OP\t",
    "\u0002\u0002\u0002P\u0005\u0003\u0002\u0002\u0002QR\b\u0004\u0001\u0002",
    "RS\u0007a\u0002\u0002Sb\b\u0004\u0001\u0002TU\u0007+\u0002\u0002Ub\b",
    "\u0004\u0001\u0002VW\u0007\u00bf\u0002\u0002Wb\b\u0004\u0001\u0002X",
    "Y\u0007\u0080\u0002\u0002YZ\u0005\u0006\u0004\u0002Z[\u0007\u0081\u0002",
    "\u0002[\\\b\u0004\u0001\u0002\\b\u0003\u0002\u0002\u0002]^\u0007\u008e",
    "\u0002\u0002^_\u0005\u0006\u0004\u0007_`\b\u0004\u0001\u0002`b\u0003",
    "\u0002\u0002\u0002aQ\u0003\u0002\u0002\u0002aT\u0003\u0002\u0002\u0002",
    "aV\u0003\u0002\u0002\u0002aX\u0003\u0002\u0002\u0002a]\u0003\u0002\u0002",
    "\u0002by\u0003\u0002\u0002\u0002cd\f\u0006\u0002\u0002de\u0007\u009b",
    "\u0002\u0002ef\u0005\u0006\u0004\u0007fg\b\u0004\u0001\u0002gx\u0003",
    "\u0002\u0002\u0002hi\f\u0005\u0002\u0002ij\u0007\u009c\u0002\u0002j",
    "k\u0005\u0006\u0004\u0006kl\b\u0004\u0001\u0002lx\u0003\u0002\u0002",
    "\u0002mn\f\u0004\u0002\u0002no\u0007\u0098\u0002\u0002op\u0005\u0006",
    "\u0004\u0005pq\b\u0004\u0001\u0002qx\u0003\u0002\u0002\u0002rs\f\u0003",
    "\u0002\u0002st\u0007\u0099\u0002\u0002tu\u0005\u0006\u0004\u0004uv\b",
    "\u0004\u0001\u0002vx\u0003\u0002\u0002\u0002wc\u0003\u0002\u0002\u0002",
    "wh\u0003\u0002\u0002\u0002wm\u0003\u0002\u0002\u0002wr\u0003\u0002\u0002",
    "\u0002x{\u0003\u0002\u0002\u0002yw\u0003\u0002\u0002\u0002yz\u0003\u0002",
    "\u0002\u0002z\u0007\u0003\u0002\u0002\u0002{y\u0003\u0002\u0002\u0002",
    "\n\'+<CMawy"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'\u00EF\u00BB\u00BF'", null, null, null, null, 
                     null, "'#'", "'abstract'", "'add'", "'alias'", "'__arglist'", 
                     "'as'", "'ascending'", "'async'", "'await'", "'base'", 
                     "'bool'", "'break'", "'by'", "'byte'", "'case'", "'catch'", 
                     "'char'", "'checked'", "'class'", "'const'", "'continue'", 
                     "'decimal'", "'default'", "'delegate'", "'descending'", 
                     "'do'", "'double'", "'dynamic'", "'else'", "'enum'", 
                     "'equals'", "'event'", "'explicit'", "'extern'", "'false'", 
                     "'finally'", "'fixed'", "'float'", "'for'", "'foreach'", 
                     "'from'", "'get'", "'goto'", "'group'", "'if'", "'implicit'", 
                     "'in'", "'int'", "'interface'", "'internal'", "'into'", 
                     "'is'", "'join'", "'let'", "'lock'", "'long'", "'nameof'", 
                     "'namespace'", "'new'", "'null'", "'object'", "'on'", 
                     "'operator'", "'orderby'", "'out'", "'override'", "'params'", 
                     "'partial'", "'private'", "'protected'", "'public'", 
                     "'readonly'", "'ref'", "'remove'", "'return'", "'sbyte'", 
                     "'sealed'", "'select'", "'set'", "'short'", "'sizeof'", 
                     "'stackalloc'", "'static'", "'string'", "'struct'", 
                     "'switch'", "'this'", "'throw'", "'true'", "'try'", 
                     "'typeof'", "'uint'", "'ulong'", "'unchecked'", "'unsafe'", 
                     "'ushort'", "'using'", "'var'", "'virtual'", "'void'", 
                     "'volatile'", "'when'", "'where'", "'while'", "'yield'", 
                     null, null, null, null, null, null, null, null, null, 
                     null, "'{'", "'}'", "'['", "']'", "'('", "')'", "'.'", 
                     "','", "':'", "';'", "'+'", "'-'", "'*'", "'/'", "'%'", 
                     "'&'", "'|'", "'^'", "'!'", "'~'", "'='", "'<'", "'>'", 
                     "'?'", "'::'", "'??'", "'++'", "'--'", "'&&'", "'||'", 
                     "'->'", "'=='", "'!='", "'<='", "'>='", "'+='", "'-='", 
                     "'*='", "'/='", "'%='", "'&='", "'|='", "'^='", "'<<'", 
                     "'<<='", "'{{'", null, null, null, null, null, null, 
                     null, null, null, null, "'define'", "'undef'", "'elif'", 
                     "'endif'", "'line'", null, null, null, null, null, 
                     "'hidden'", null, null, null, "'}}'" ];

var symbolicNames = [ null, "BYTE_ORDER_MARK", "SINGLE_LINE_DOC_COMMENT", 
                      "DELIMITED_DOC_COMMENT", "SINGLE_LINE_COMMENT", "DELIMITED_COMMENT", 
                      "WHITESPACES", "SHARP", "ABSTRACT", "ADD", "ALIAS", 
                      "ARGLIST", "AS", "ASCENDING", "ASYNC", "AWAIT", "BASE", 
                      "BOOL", "BREAK", "BY", "BYTE", "CASE", "CATCH", "CHAR", 
                      "CHECKED", "CLASS", "CONST", "CONTINUE", "DECIMAL", 
                      "DEFAULT", "DELEGATE", "DESCENDING", "DO", "DOUBLE", 
                      "DYNAMIC", "ELSE", "ENUM", "EQUALS", "EVENT", "EXPLICIT", 
                      "EXTERN", "FALSE", "FINALLY", "FIXED", "FLOAT", "FOR", 
                      "FOREACH", "FROM", "GET", "GOTO", "GROUP", "IF", "IMPLICIT", 
                      "IN", "INT", "INTERFACE", "INTERNAL", "INTO", "IS", 
                      "JOIN", "LET", "LOCK", "LONG", "NAMEOF", "NAMESPACE", 
                      "NEW", "NULL", "OBJECT", "ON", "OPERATOR", "ORDERBY", 
                      "OUT", "OVERRIDE", "PARAMS", "PARTIAL", "PRIVATE", 
                      "PROTECTED", "PUBLIC", "READONLY", "REF", "REMOVE", 
                      "RETURN", "SBYTE", "SEALED", "SELECT", "SET", "SHORT", 
                      "SIZEOF", "STACKALLOC", "STATIC", "STRING", "STRUCT", 
                      "SWITCH", "THIS", "THROW", "TRUE", "TRY", "TYPEOF", 
                      "UINT", "ULONG", "UNCHECKED", "UNSAFE", "USHORT", 
                      "USING", "VAR", "VIRTUAL", "VOID", "VOLATILE", "WHEN", 
                      "WHERE", "WHILE", "YIELD", "IDENTIFIER", "LITERAL_ACCESS", 
                      "INTEGER_LITERAL", "HEX_INTEGER_LITERAL", "REAL_LITERAL", 
                      "CHARACTER_LITERAL", "REGULAR_STRING", "VERBATIUM_STRING", 
                      "INTERPOLATED_REGULAR_STRING_START", "INTERPOLATED_VERBATIUM_STRING_START", 
                      "OPEN_BRACE", "CLOSE_BRACE", "OPEN_BRACKET", "CLOSE_BRACKET", 
                      "OPEN_PARENS", "CLOSE_PARENS", "DOT", "COMMA", "COLON", 
                      "SEMICOLON", "PLUS", "MINUS", "STAR", "DIV", "PERCENT", 
                      "AMP", "BITWISE_OR", "CARET", "BANG", "TILDE", "ASSIGNMENT", 
                      "LT", "GT", "INTERR", "DOUBLE_COLON", "OP_COALESCING", 
                      "OP_INC", "OP_DEC", "OP_AND", "OP_OR", "OP_PTR", "OP_EQ", 
                      "OP_NE", "OP_LE", "OP_GE", "OP_ADD_ASSIGNMENT", "OP_SUB_ASSIGNMENT", 
                      "OP_MULT_ASSIGNMENT", "OP_DIV_ASSIGNMENT", "OP_MOD_ASSIGNMENT", 
                      "OP_AND_ASSIGNMENT", "OP_OR_ASSIGNMENT", "OP_XOR_ASSIGNMENT", 
                      "OP_LEFT_SHIFT", "OP_LEFT_SHIFT_ASSIGNMENT", "DOUBLE_CURLY_INSIDE", 
                      "OPEN_BRACE_INSIDE", "REGULAR_CHAR_INSIDE", "VERBATIUM_DOUBLE_QUOTE_INSIDE", 
                      "DOUBLE_QUOTE_INSIDE", "REGULAR_STRING_INSIDE", "VERBATIUM_INSIDE_STRING", 
                      "CLOSE_BRACE_INSIDE", "FORMAT_STRING", "DIRECTIVE_WHITESPACES", 
                      "DIGITS", "DEFINE", "UNDEF", "ELIF", "ENDIF", "LINE", 
                      "ERROR", "WARNING", "REGION", "ENDREGION", "PRAGMA", 
                      "DIRECTIVE_HIDDEN", "CONDITIONAL_SYMBOL", "DIRECTIVE_NEW_LINE", 
                      "TEXT", "DOUBLE_CURLY_CLOSE_INSIDE" ];

var ruleNames =  [ "preprocessor_directive", "directive_new_line_or_sharp", 
                   "preprocessor_expression" ];

function CSharpPreprocessorParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
	Stack<Boolean> conditions = new Stack<Boolean>() {{ conditions.push(true); }};
	public HashSet<String> ConditionalSymbols = new HashSet<String>() {{ ConditionalSymbols.add("DEBUG"); }};

	private boolean allConditions() {
		for(boolean condition: conditions) {
			if (!condition)
				return false;
		}
		return true;
	}

    return this;
}

CSharpPreprocessorParser.prototype = Object.create(antlr4.Parser.prototype);
CSharpPreprocessorParser.prototype.constructor = CSharpPreprocessorParser;

Object.defineProperty(CSharpPreprocessorParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

CSharpPreprocessorParser.EOF = antlr4.Token.EOF;
CSharpPreprocessorParser.BYTE_ORDER_MARK = 1;
CSharpPreprocessorParser.SINGLE_LINE_DOC_COMMENT = 2;
CSharpPreprocessorParser.DELIMITED_DOC_COMMENT = 3;
CSharpPreprocessorParser.SINGLE_LINE_COMMENT = 4;
CSharpPreprocessorParser.DELIMITED_COMMENT = 5;
CSharpPreprocessorParser.WHITESPACES = 6;
CSharpPreprocessorParser.SHARP = 7;
CSharpPreprocessorParser.ABSTRACT = 8;
CSharpPreprocessorParser.ADD = 9;
CSharpPreprocessorParser.ALIAS = 10;
CSharpPreprocessorParser.ARGLIST = 11;
CSharpPreprocessorParser.AS = 12;
CSharpPreprocessorParser.ASCENDING = 13;
CSharpPreprocessorParser.ASYNC = 14;
CSharpPreprocessorParser.AWAIT = 15;
CSharpPreprocessorParser.BASE = 16;
CSharpPreprocessorParser.BOOL = 17;
CSharpPreprocessorParser.BREAK = 18;
CSharpPreprocessorParser.BY = 19;
CSharpPreprocessorParser.BYTE = 20;
CSharpPreprocessorParser.CASE = 21;
CSharpPreprocessorParser.CATCH = 22;
CSharpPreprocessorParser.CHAR = 23;
CSharpPreprocessorParser.CHECKED = 24;
CSharpPreprocessorParser.CLASS = 25;
CSharpPreprocessorParser.CONST = 26;
CSharpPreprocessorParser.CONTINUE = 27;
CSharpPreprocessorParser.DECIMAL = 28;
CSharpPreprocessorParser.DEFAULT = 29;
CSharpPreprocessorParser.DELEGATE = 30;
CSharpPreprocessorParser.DESCENDING = 31;
CSharpPreprocessorParser.DO = 32;
CSharpPreprocessorParser.DOUBLE = 33;
CSharpPreprocessorParser.DYNAMIC = 34;
CSharpPreprocessorParser.ELSE = 35;
CSharpPreprocessorParser.ENUM = 36;
CSharpPreprocessorParser.EQUALS = 37;
CSharpPreprocessorParser.EVENT = 38;
CSharpPreprocessorParser.EXPLICIT = 39;
CSharpPreprocessorParser.EXTERN = 40;
CSharpPreprocessorParser.FALSE = 41;
CSharpPreprocessorParser.FINALLY = 42;
CSharpPreprocessorParser.FIXED = 43;
CSharpPreprocessorParser.FLOAT = 44;
CSharpPreprocessorParser.FOR = 45;
CSharpPreprocessorParser.FOREACH = 46;
CSharpPreprocessorParser.FROM = 47;
CSharpPreprocessorParser.GET = 48;
CSharpPreprocessorParser.GOTO = 49;
CSharpPreprocessorParser.GROUP = 50;
CSharpPreprocessorParser.IF = 51;
CSharpPreprocessorParser.IMPLICIT = 52;
CSharpPreprocessorParser.IN = 53;
CSharpPreprocessorParser.INT = 54;
CSharpPreprocessorParser.INTERFACE = 55;
CSharpPreprocessorParser.INTERNAL = 56;
CSharpPreprocessorParser.INTO = 57;
CSharpPreprocessorParser.IS = 58;
CSharpPreprocessorParser.JOIN = 59;
CSharpPreprocessorParser.LET = 60;
CSharpPreprocessorParser.LOCK = 61;
CSharpPreprocessorParser.LONG = 62;
CSharpPreprocessorParser.NAMEOF = 63;
CSharpPreprocessorParser.NAMESPACE = 64;
CSharpPreprocessorParser.NEW = 65;
CSharpPreprocessorParser.NULL = 66;
CSharpPreprocessorParser.OBJECT = 67;
CSharpPreprocessorParser.ON = 68;
CSharpPreprocessorParser.OPERATOR = 69;
CSharpPreprocessorParser.ORDERBY = 70;
CSharpPreprocessorParser.OUT = 71;
CSharpPreprocessorParser.OVERRIDE = 72;
CSharpPreprocessorParser.PARAMS = 73;
CSharpPreprocessorParser.PARTIAL = 74;
CSharpPreprocessorParser.PRIVATE = 75;
CSharpPreprocessorParser.PROTECTED = 76;
CSharpPreprocessorParser.PUBLIC = 77;
CSharpPreprocessorParser.READONLY = 78;
CSharpPreprocessorParser.REF = 79;
CSharpPreprocessorParser.REMOVE = 80;
CSharpPreprocessorParser.RETURN = 81;
CSharpPreprocessorParser.SBYTE = 82;
CSharpPreprocessorParser.SEALED = 83;
CSharpPreprocessorParser.SELECT = 84;
CSharpPreprocessorParser.SET = 85;
CSharpPreprocessorParser.SHORT = 86;
CSharpPreprocessorParser.SIZEOF = 87;
CSharpPreprocessorParser.STACKALLOC = 88;
CSharpPreprocessorParser.STATIC = 89;
CSharpPreprocessorParser.STRING = 90;
CSharpPreprocessorParser.STRUCT = 91;
CSharpPreprocessorParser.SWITCH = 92;
CSharpPreprocessorParser.THIS = 93;
CSharpPreprocessorParser.THROW = 94;
CSharpPreprocessorParser.TRUE = 95;
CSharpPreprocessorParser.TRY = 96;
CSharpPreprocessorParser.TYPEOF = 97;
CSharpPreprocessorParser.UINT = 98;
CSharpPreprocessorParser.ULONG = 99;
CSharpPreprocessorParser.UNCHECKED = 100;
CSharpPreprocessorParser.UNSAFE = 101;
CSharpPreprocessorParser.USHORT = 102;
CSharpPreprocessorParser.USING = 103;
CSharpPreprocessorParser.VAR = 104;
CSharpPreprocessorParser.VIRTUAL = 105;
CSharpPreprocessorParser.VOID = 106;
CSharpPreprocessorParser.VOLATILE = 107;
CSharpPreprocessorParser.WHEN = 108;
CSharpPreprocessorParser.WHERE = 109;
CSharpPreprocessorParser.WHILE = 110;
CSharpPreprocessorParser.YIELD = 111;
CSharpPreprocessorParser.IDENTIFIER = 112;
CSharpPreprocessorParser.LITERAL_ACCESS = 113;
CSharpPreprocessorParser.INTEGER_LITERAL = 114;
CSharpPreprocessorParser.HEX_INTEGER_LITERAL = 115;
CSharpPreprocessorParser.REAL_LITERAL = 116;
CSharpPreprocessorParser.CHARACTER_LITERAL = 117;
CSharpPreprocessorParser.REGULAR_STRING = 118;
CSharpPreprocessorParser.VERBATIUM_STRING = 119;
CSharpPreprocessorParser.INTERPOLATED_REGULAR_STRING_START = 120;
CSharpPreprocessorParser.INTERPOLATED_VERBATIUM_STRING_START = 121;
CSharpPreprocessorParser.OPEN_BRACE = 122;
CSharpPreprocessorParser.CLOSE_BRACE = 123;
CSharpPreprocessorParser.OPEN_BRACKET = 124;
CSharpPreprocessorParser.CLOSE_BRACKET = 125;
CSharpPreprocessorParser.OPEN_PARENS = 126;
CSharpPreprocessorParser.CLOSE_PARENS = 127;
CSharpPreprocessorParser.DOT = 128;
CSharpPreprocessorParser.COMMA = 129;
CSharpPreprocessorParser.COLON = 130;
CSharpPreprocessorParser.SEMICOLON = 131;
CSharpPreprocessorParser.PLUS = 132;
CSharpPreprocessorParser.MINUS = 133;
CSharpPreprocessorParser.STAR = 134;
CSharpPreprocessorParser.DIV = 135;
CSharpPreprocessorParser.PERCENT = 136;
CSharpPreprocessorParser.AMP = 137;
CSharpPreprocessorParser.BITWISE_OR = 138;
CSharpPreprocessorParser.CARET = 139;
CSharpPreprocessorParser.BANG = 140;
CSharpPreprocessorParser.TILDE = 141;
CSharpPreprocessorParser.ASSIGNMENT = 142;
CSharpPreprocessorParser.LT = 143;
CSharpPreprocessorParser.GT = 144;
CSharpPreprocessorParser.INTERR = 145;
CSharpPreprocessorParser.DOUBLE_COLON = 146;
CSharpPreprocessorParser.OP_COALESCING = 147;
CSharpPreprocessorParser.OP_INC = 148;
CSharpPreprocessorParser.OP_DEC = 149;
CSharpPreprocessorParser.OP_AND = 150;
CSharpPreprocessorParser.OP_OR = 151;
CSharpPreprocessorParser.OP_PTR = 152;
CSharpPreprocessorParser.OP_EQ = 153;
CSharpPreprocessorParser.OP_NE = 154;
CSharpPreprocessorParser.OP_LE = 155;
CSharpPreprocessorParser.OP_GE = 156;
CSharpPreprocessorParser.OP_ADD_ASSIGNMENT = 157;
CSharpPreprocessorParser.OP_SUB_ASSIGNMENT = 158;
CSharpPreprocessorParser.OP_MULT_ASSIGNMENT = 159;
CSharpPreprocessorParser.OP_DIV_ASSIGNMENT = 160;
CSharpPreprocessorParser.OP_MOD_ASSIGNMENT = 161;
CSharpPreprocessorParser.OP_AND_ASSIGNMENT = 162;
CSharpPreprocessorParser.OP_OR_ASSIGNMENT = 163;
CSharpPreprocessorParser.OP_XOR_ASSIGNMENT = 164;
CSharpPreprocessorParser.OP_LEFT_SHIFT = 165;
CSharpPreprocessorParser.OP_LEFT_SHIFT_ASSIGNMENT = 166;
CSharpPreprocessorParser.DOUBLE_CURLY_INSIDE = 167;
CSharpPreprocessorParser.OPEN_BRACE_INSIDE = 168;
CSharpPreprocessorParser.REGULAR_CHAR_INSIDE = 169;
CSharpPreprocessorParser.VERBATIUM_DOUBLE_QUOTE_INSIDE = 170;
CSharpPreprocessorParser.DOUBLE_QUOTE_INSIDE = 171;
CSharpPreprocessorParser.REGULAR_STRING_INSIDE = 172;
CSharpPreprocessorParser.VERBATIUM_INSIDE_STRING = 173;
CSharpPreprocessorParser.CLOSE_BRACE_INSIDE = 174;
CSharpPreprocessorParser.FORMAT_STRING = 175;
CSharpPreprocessorParser.DIRECTIVE_WHITESPACES = 176;
CSharpPreprocessorParser.DIGITS = 177;
CSharpPreprocessorParser.DEFINE = 178;
CSharpPreprocessorParser.UNDEF = 179;
CSharpPreprocessorParser.ELIF = 180;
CSharpPreprocessorParser.ENDIF = 181;
CSharpPreprocessorParser.LINE = 182;
CSharpPreprocessorParser.ERROR = 183;
CSharpPreprocessorParser.WARNING = 184;
CSharpPreprocessorParser.REGION = 185;
CSharpPreprocessorParser.ENDREGION = 186;
CSharpPreprocessorParser.PRAGMA = 187;
CSharpPreprocessorParser.DIRECTIVE_HIDDEN = 188;
CSharpPreprocessorParser.CONDITIONAL_SYMBOL = 189;
CSharpPreprocessorParser.DIRECTIVE_NEW_LINE = 190;
CSharpPreprocessorParser.TEXT = 191;
CSharpPreprocessorParser.DOUBLE_CURLY_CLOSE_INSIDE = 192;

CSharpPreprocessorParser.RULE_preprocessor_directive = 0;
CSharpPreprocessorParser.RULE_directive_new_line_or_sharp = 1;
CSharpPreprocessorParser.RULE_preprocessor_expression = 2;

function Preprocessor_directiveContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CSharpPreprocessorParser.RULE_preprocessor_directive;
    this.value = null
    return this;
}

Preprocessor_directiveContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Preprocessor_directiveContext.prototype.constructor = Preprocessor_directiveContext;


 
Preprocessor_directiveContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
    this.value = ctx.value;
};


function PreprocessorDiagnosticContext(parser, ctx) {
	Preprocessor_directiveContext.call(this, parser);
    Preprocessor_directiveContext.prototype.copyFrom.call(this, ctx);
    return this;
}

PreprocessorDiagnosticContext.prototype = Object.create(Preprocessor_directiveContext.prototype);
PreprocessorDiagnosticContext.prototype.constructor = PreprocessorDiagnosticContext;

CSharpPreprocessorParser.PreprocessorDiagnosticContext = PreprocessorDiagnosticContext;

PreprocessorDiagnosticContext.prototype.ERROR = function() {
    return this.getToken(CSharpPreprocessorParser.ERROR, 0);
};

PreprocessorDiagnosticContext.prototype.TEXT = function() {
    return this.getToken(CSharpPreprocessorParser.TEXT, 0);
};

PreprocessorDiagnosticContext.prototype.directive_new_line_or_sharp = function() {
    return this.getTypedRuleContext(Directive_new_line_or_sharpContext,0);
};

PreprocessorDiagnosticContext.prototype.WARNING = function() {
    return this.getToken(CSharpPreprocessorParser.WARNING, 0);
};
PreprocessorDiagnosticContext.prototype.enterRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.enterPreprocessorDiagnostic(this);
	}
};

PreprocessorDiagnosticContext.prototype.exitRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.exitPreprocessorDiagnostic(this);
	}
};


function PreprocessorRegionContext(parser, ctx) {
	Preprocessor_directiveContext.call(this, parser);
    Preprocessor_directiveContext.prototype.copyFrom.call(this, ctx);
    return this;
}

PreprocessorRegionContext.prototype = Object.create(Preprocessor_directiveContext.prototype);
PreprocessorRegionContext.prototype.constructor = PreprocessorRegionContext;

CSharpPreprocessorParser.PreprocessorRegionContext = PreprocessorRegionContext;

PreprocessorRegionContext.prototype.REGION = function() {
    return this.getToken(CSharpPreprocessorParser.REGION, 0);
};

PreprocessorRegionContext.prototype.directive_new_line_or_sharp = function() {
    return this.getTypedRuleContext(Directive_new_line_or_sharpContext,0);
};

PreprocessorRegionContext.prototype.TEXT = function() {
    return this.getToken(CSharpPreprocessorParser.TEXT, 0);
};

PreprocessorRegionContext.prototype.ENDREGION = function() {
    return this.getToken(CSharpPreprocessorParser.ENDREGION, 0);
};
PreprocessorRegionContext.prototype.enterRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.enterPreprocessorRegion(this);
	}
};

PreprocessorRegionContext.prototype.exitRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.exitPreprocessorRegion(this);
	}
};


function PreprocessorDeclarationContext(parser, ctx) {
	Preprocessor_directiveContext.call(this, parser);
    this._CONDITIONAL_SYMBOL = null; // Token;
    Preprocessor_directiveContext.prototype.copyFrom.call(this, ctx);
    return this;
}

PreprocessorDeclarationContext.prototype = Object.create(Preprocessor_directiveContext.prototype);
PreprocessorDeclarationContext.prototype.constructor = PreprocessorDeclarationContext;

CSharpPreprocessorParser.PreprocessorDeclarationContext = PreprocessorDeclarationContext;

PreprocessorDeclarationContext.prototype.DEFINE = function() {
    return this.getToken(CSharpPreprocessorParser.DEFINE, 0);
};

PreprocessorDeclarationContext.prototype.CONDITIONAL_SYMBOL = function() {
    return this.getToken(CSharpPreprocessorParser.CONDITIONAL_SYMBOL, 0);
};

PreprocessorDeclarationContext.prototype.directive_new_line_or_sharp = function() {
    return this.getTypedRuleContext(Directive_new_line_or_sharpContext,0);
};

PreprocessorDeclarationContext.prototype.UNDEF = function() {
    return this.getToken(CSharpPreprocessorParser.UNDEF, 0);
};
PreprocessorDeclarationContext.prototype.enterRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.enterPreprocessorDeclaration(this);
	}
};

PreprocessorDeclarationContext.prototype.exitRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.exitPreprocessorDeclaration(this);
	}
};


function PreprocessorConditionalContext(parser, ctx) {
	Preprocessor_directiveContext.call(this, parser);
    this.expr = null; // Preprocessor_expressionContext;
    Preprocessor_directiveContext.prototype.copyFrom.call(this, ctx);
    return this;
}

PreprocessorConditionalContext.prototype = Object.create(Preprocessor_directiveContext.prototype);
PreprocessorConditionalContext.prototype.constructor = PreprocessorConditionalContext;

CSharpPreprocessorParser.PreprocessorConditionalContext = PreprocessorConditionalContext;

PreprocessorConditionalContext.prototype.IF = function() {
    return this.getToken(CSharpPreprocessorParser.IF, 0);
};

PreprocessorConditionalContext.prototype.directive_new_line_or_sharp = function() {
    return this.getTypedRuleContext(Directive_new_line_or_sharpContext,0);
};

PreprocessorConditionalContext.prototype.preprocessor_expression = function() {
    return this.getTypedRuleContext(Preprocessor_expressionContext,0);
};

PreprocessorConditionalContext.prototype.ELIF = function() {
    return this.getToken(CSharpPreprocessorParser.ELIF, 0);
};

PreprocessorConditionalContext.prototype.ELSE = function() {
    return this.getToken(CSharpPreprocessorParser.ELSE, 0);
};

PreprocessorConditionalContext.prototype.ENDIF = function() {
    return this.getToken(CSharpPreprocessorParser.ENDIF, 0);
};
PreprocessorConditionalContext.prototype.enterRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.enterPreprocessorConditional(this);
	}
};

PreprocessorConditionalContext.prototype.exitRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.exitPreprocessorConditional(this);
	}
};


function PreprocessorPragmaContext(parser, ctx) {
	Preprocessor_directiveContext.call(this, parser);
    Preprocessor_directiveContext.prototype.copyFrom.call(this, ctx);
    return this;
}

PreprocessorPragmaContext.prototype = Object.create(Preprocessor_directiveContext.prototype);
PreprocessorPragmaContext.prototype.constructor = PreprocessorPragmaContext;

CSharpPreprocessorParser.PreprocessorPragmaContext = PreprocessorPragmaContext;

PreprocessorPragmaContext.prototype.PRAGMA = function() {
    return this.getToken(CSharpPreprocessorParser.PRAGMA, 0);
};

PreprocessorPragmaContext.prototype.TEXT = function() {
    return this.getToken(CSharpPreprocessorParser.TEXT, 0);
};

PreprocessorPragmaContext.prototype.directive_new_line_or_sharp = function() {
    return this.getTypedRuleContext(Directive_new_line_or_sharpContext,0);
};
PreprocessorPragmaContext.prototype.enterRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.enterPreprocessorPragma(this);
	}
};

PreprocessorPragmaContext.prototype.exitRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.exitPreprocessorPragma(this);
	}
};


function PreprocessorLineContext(parser, ctx) {
	Preprocessor_directiveContext.call(this, parser);
    Preprocessor_directiveContext.prototype.copyFrom.call(this, ctx);
    return this;
}

PreprocessorLineContext.prototype = Object.create(Preprocessor_directiveContext.prototype);
PreprocessorLineContext.prototype.constructor = PreprocessorLineContext;

CSharpPreprocessorParser.PreprocessorLineContext = PreprocessorLineContext;

PreprocessorLineContext.prototype.LINE = function() {
    return this.getToken(CSharpPreprocessorParser.LINE, 0);
};

PreprocessorLineContext.prototype.directive_new_line_or_sharp = function() {
    return this.getTypedRuleContext(Directive_new_line_or_sharpContext,0);
};

PreprocessorLineContext.prototype.DIGITS = function() {
    return this.getToken(CSharpPreprocessorParser.DIGITS, 0);
};

PreprocessorLineContext.prototype.DEFAULT = function() {
    return this.getToken(CSharpPreprocessorParser.DEFAULT, 0);
};

PreprocessorLineContext.prototype.DIRECTIVE_HIDDEN = function() {
    return this.getToken(CSharpPreprocessorParser.DIRECTIVE_HIDDEN, 0);
};

PreprocessorLineContext.prototype.STRING = function() {
    return this.getToken(CSharpPreprocessorParser.STRING, 0);
};
PreprocessorLineContext.prototype.enterRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.enterPreprocessorLine(this);
	}
};

PreprocessorLineContext.prototype.exitRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.exitPreprocessorLine(this);
	}
};



CSharpPreprocessorParser.Preprocessor_directiveContext = Preprocessor_directiveContext;

CSharpPreprocessorParser.prototype.preprocessor_directive = function() {

    var localctx = new Preprocessor_directiveContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, CSharpPreprocessorParser.RULE_preprocessor_directive);
    var _la = 0; // Token type
    try {
        this.state = 75;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case CSharpPreprocessorParser.DEFINE:
            localctx = new PreprocessorDeclarationContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 6;
            this.match(CSharpPreprocessorParser.DEFINE);
            this.state = 7;
            localctx._CONDITIONAL_SYMBOL = this.match(CSharpPreprocessorParser.CONDITIONAL_SYMBOL);
            this.state = 8;
            this.directive_new_line_or_sharp();
             ConditionalSymbols.add((localctx._CONDITIONAL_SYMBOL===null ? null : localctx._CONDITIONAL_SYMBOL.text));
            	   localctx.value =  allConditions() 
            break;
        case CSharpPreprocessorParser.UNDEF:
            localctx = new PreprocessorDeclarationContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 11;
            this.match(CSharpPreprocessorParser.UNDEF);
            this.state = 12;
            localctx._CONDITIONAL_SYMBOL = this.match(CSharpPreprocessorParser.CONDITIONAL_SYMBOL);
            this.state = 13;
            this.directive_new_line_or_sharp();
             ConditionalSymbols.remove((localctx._CONDITIONAL_SYMBOL===null ? null : localctx._CONDITIONAL_SYMBOL.text));
            	   localctx.value =  allConditions() 
            break;
        case CSharpPreprocessorParser.IF:
            localctx = new PreprocessorConditionalContext(this, localctx);
            this.enterOuterAlt(localctx, 3);
            this.state = 16;
            this.match(CSharpPreprocessorParser.IF);
            this.state = 17;
            localctx.expr = this.preprocessor_expression(0);
            this.state = 18;
            this.directive_new_line_or_sharp();
             localctx.value =  localctx.expr.value.equals("true") && allConditions() conditions.push(localctx.expr.value.equals("true")); 
            break;
        case CSharpPreprocessorParser.ELIF:
            localctx = new PreprocessorConditionalContext(this, localctx);
            this.enterOuterAlt(localctx, 4);
            this.state = 21;
            this.match(CSharpPreprocessorParser.ELIF);
            this.state = 22;
            localctx.expr = this.preprocessor_expression(0);
            this.state = 23;
            this.directive_new_line_or_sharp();
             if (!conditions.peek()) { conditions.pop(); localctx.value =  localctx.expr.value.equals("true") && allConditions()
            	     conditions.push(localctx.expr.value.equals("true")); } else localctx.value =  false 
            break;
        case CSharpPreprocessorParser.ELSE:
            localctx = new PreprocessorConditionalContext(this, localctx);
            this.enterOuterAlt(localctx, 5);
            this.state = 26;
            this.match(CSharpPreprocessorParser.ELSE);
            this.state = 27;
            this.directive_new_line_or_sharp();
             if (!conditions.peek()) { conditions.pop(); localctx.value =  true && allConditions() conditions.push(true); }
            	    else localctx.value =  false 
            break;
        case CSharpPreprocessorParser.ENDIF:
            localctx = new PreprocessorConditionalContext(this, localctx);
            this.enterOuterAlt(localctx, 6);
            this.state = 30;
            this.match(CSharpPreprocessorParser.ENDIF);
            this.state = 31;
            this.directive_new_line_or_sharp();
             conditions.pop(); localctx.value =  conditions.peek() 
            break;
        case CSharpPreprocessorParser.LINE:
            localctx = new PreprocessorLineContext(this, localctx);
            this.enterOuterAlt(localctx, 7);
            this.state = 34;
            this.match(CSharpPreprocessorParser.LINE);
            this.state = 41;
            this._errHandler.sync(this);
            switch(this._input.LA(1)) {
            case CSharpPreprocessorParser.DIGITS:
                this.state = 35;
                this.match(CSharpPreprocessorParser.DIGITS);
                this.state = 37;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if(_la===CSharpPreprocessorParser.STRING) {
                    this.state = 36;
                    this.match(CSharpPreprocessorParser.STRING);
                }

                break;
            case CSharpPreprocessorParser.DEFAULT:
                this.state = 39;
                this.match(CSharpPreprocessorParser.DEFAULT);
                break;
            case CSharpPreprocessorParser.DIRECTIVE_HIDDEN:
                this.state = 40;
                this.match(CSharpPreprocessorParser.DIRECTIVE_HIDDEN);
                break;
            default:
                throw new antlr4.error.NoViableAltException(this);
            }
            this.state = 43;
            this.directive_new_line_or_sharp();
             localctx.value =  allConditions() 
            break;
        case CSharpPreprocessorParser.ERROR:
            localctx = new PreprocessorDiagnosticContext(this, localctx);
            this.enterOuterAlt(localctx, 8);
            this.state = 46;
            this.match(CSharpPreprocessorParser.ERROR);
            this.state = 47;
            this.match(CSharpPreprocessorParser.TEXT);
            this.state = 48;
            this.directive_new_line_or_sharp();
             localctx.value =  allConditions() 
            break;
        case CSharpPreprocessorParser.WARNING:
            localctx = new PreprocessorDiagnosticContext(this, localctx);
            this.enterOuterAlt(localctx, 9);
            this.state = 51;
            this.match(CSharpPreprocessorParser.WARNING);
            this.state = 52;
            this.match(CSharpPreprocessorParser.TEXT);
            this.state = 53;
            this.directive_new_line_or_sharp();
             localctx.value =  allConditions() 
            break;
        case CSharpPreprocessorParser.REGION:
            localctx = new PreprocessorRegionContext(this, localctx);
            this.enterOuterAlt(localctx, 10);
            this.state = 56;
            this.match(CSharpPreprocessorParser.REGION);
            this.state = 58;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===CSharpPreprocessorParser.TEXT) {
                this.state = 57;
                this.match(CSharpPreprocessorParser.TEXT);
            }

            this.state = 60;
            this.directive_new_line_or_sharp();
             localctx.value =  allConditions() 
            break;
        case CSharpPreprocessorParser.ENDREGION:
            localctx = new PreprocessorRegionContext(this, localctx);
            this.enterOuterAlt(localctx, 11);
            this.state = 63;
            this.match(CSharpPreprocessorParser.ENDREGION);
            this.state = 65;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
            if(_la===CSharpPreprocessorParser.TEXT) {
                this.state = 64;
                this.match(CSharpPreprocessorParser.TEXT);
            }

            this.state = 67;
            this.directive_new_line_or_sharp();
             localctx.value =  allConditions() 
            break;
        case CSharpPreprocessorParser.PRAGMA:
            localctx = new PreprocessorPragmaContext(this, localctx);
            this.enterOuterAlt(localctx, 12);
            this.state = 70;
            this.match(CSharpPreprocessorParser.PRAGMA);
            this.state = 71;
            this.match(CSharpPreprocessorParser.TEXT);
            this.state = 72;
            this.directive_new_line_or_sharp();
             localctx.value =  allConditions() 
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function Directive_new_line_or_sharpContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CSharpPreprocessorParser.RULE_directive_new_line_or_sharp;
    return this;
}

Directive_new_line_or_sharpContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Directive_new_line_or_sharpContext.prototype.constructor = Directive_new_line_or_sharpContext;

Directive_new_line_or_sharpContext.prototype.DIRECTIVE_NEW_LINE = function() {
    return this.getToken(CSharpPreprocessorParser.DIRECTIVE_NEW_LINE, 0);
};

Directive_new_line_or_sharpContext.prototype.EOF = function() {
    return this.getToken(CSharpPreprocessorParser.EOF, 0);
};

Directive_new_line_or_sharpContext.prototype.enterRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.enterDirective_new_line_or_sharp(this);
	}
};

Directive_new_line_or_sharpContext.prototype.exitRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.exitDirective_new_line_or_sharp(this);
	}
};




CSharpPreprocessorParser.Directive_new_line_or_sharpContext = Directive_new_line_or_sharpContext;

CSharpPreprocessorParser.prototype.directive_new_line_or_sharp = function() {

    var localctx = new Directive_new_line_or_sharpContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, CSharpPreprocessorParser.RULE_directive_new_line_or_sharp);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 77;
        _la = this._input.LA(1);
        if(!(_la===CSharpPreprocessorParser.EOF || _la===CSharpPreprocessorParser.DIRECTIVE_NEW_LINE)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function Preprocessor_expressionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = CSharpPreprocessorParser.RULE_preprocessor_expression;
    this.value = null
    this.expr1 = null; // Preprocessor_expressionContext
    this._CONDITIONAL_SYMBOL = null; // Token
    this.expr = null; // Preprocessor_expressionContext
    this.expr2 = null; // Preprocessor_expressionContext
    return this;
}

Preprocessor_expressionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Preprocessor_expressionContext.prototype.constructor = Preprocessor_expressionContext;

Preprocessor_expressionContext.prototype.TRUE = function() {
    return this.getToken(CSharpPreprocessorParser.TRUE, 0);
};

Preprocessor_expressionContext.prototype.FALSE = function() {
    return this.getToken(CSharpPreprocessorParser.FALSE, 0);
};

Preprocessor_expressionContext.prototype.CONDITIONAL_SYMBOL = function() {
    return this.getToken(CSharpPreprocessorParser.CONDITIONAL_SYMBOL, 0);
};

Preprocessor_expressionContext.prototype.OPEN_PARENS = function() {
    return this.getToken(CSharpPreprocessorParser.OPEN_PARENS, 0);
};

Preprocessor_expressionContext.prototype.CLOSE_PARENS = function() {
    return this.getToken(CSharpPreprocessorParser.CLOSE_PARENS, 0);
};

Preprocessor_expressionContext.prototype.preprocessor_expression = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(Preprocessor_expressionContext);
    } else {
        return this.getTypedRuleContext(Preprocessor_expressionContext,i);
    }
};

Preprocessor_expressionContext.prototype.BANG = function() {
    return this.getToken(CSharpPreprocessorParser.BANG, 0);
};

Preprocessor_expressionContext.prototype.OP_EQ = function() {
    return this.getToken(CSharpPreprocessorParser.OP_EQ, 0);
};

Preprocessor_expressionContext.prototype.OP_NE = function() {
    return this.getToken(CSharpPreprocessorParser.OP_NE, 0);
};

Preprocessor_expressionContext.prototype.OP_AND = function() {
    return this.getToken(CSharpPreprocessorParser.OP_AND, 0);
};

Preprocessor_expressionContext.prototype.OP_OR = function() {
    return this.getToken(CSharpPreprocessorParser.OP_OR, 0);
};

Preprocessor_expressionContext.prototype.enterRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.enterPreprocessor_expression(this);
	}
};

Preprocessor_expressionContext.prototype.exitRule = function(listener) {
    if(listener instanceof CSharpPreprocessorParserListener ) {
        listener.exitPreprocessor_expression(this);
	}
};



CSharpPreprocessorParser.prototype.preprocessor_expression = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new Preprocessor_expressionContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 4;
    this.enterRecursionRule(localctx, 4, CSharpPreprocessorParser.RULE_preprocessor_expression, _p);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 95;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case CSharpPreprocessorParser.TRUE:
            this.state = 80;
            this.match(CSharpPreprocessorParser.TRUE);
             localctx.value =  "true" 
            break;
        case CSharpPreprocessorParser.FALSE:
            this.state = 82;
            this.match(CSharpPreprocessorParser.FALSE);
             localctx.value =  "false" 
            break;
        case CSharpPreprocessorParser.CONDITIONAL_SYMBOL:
            this.state = 84;
            localctx._CONDITIONAL_SYMBOL = this.match(CSharpPreprocessorParser.CONDITIONAL_SYMBOL);
             localctx.value =  ConditionalSymbols.contains((localctx._CONDITIONAL_SYMBOL===null ? null : localctx._CONDITIONAL_SYMBOL.text)) ? "true" : "false" 
            break;
        case CSharpPreprocessorParser.OPEN_PARENS:
            this.state = 86;
            this.match(CSharpPreprocessorParser.OPEN_PARENS);
            this.state = 87;
            localctx.expr = this.preprocessor_expression(0);
            this.state = 88;
            this.match(CSharpPreprocessorParser.CLOSE_PARENS);
             localctx.value =  localctx.expr.value 
            break;
        case CSharpPreprocessorParser.BANG:
            this.state = 91;
            this.match(CSharpPreprocessorParser.BANG);
            this.state = 92;
            localctx.expr = this.preprocessor_expression(5);
             localctx.value =  localctx.expr.value.equals("true") ? "false" : "true" 
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 119;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,7,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 117;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,6,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new Preprocessor_expressionContext(this, _parentctx, _parentState);
                    localctx.expr1 = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, CSharpPreprocessorParser.RULE_preprocessor_expression);
                    this.state = 97;
                    if (!( this.precpred(this._ctx, 4))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                    }
                    this.state = 98;
                    this.match(CSharpPreprocessorParser.OP_EQ);
                    this.state = 99;
                    localctx.expr2 = this.preprocessor_expression(5);
                     localctx.value =  (localctx.expr1.value == localctx.expr2.value ? "true" : "false") 
                    break;

                case 2:
                    localctx = new Preprocessor_expressionContext(this, _parentctx, _parentState);
                    localctx.expr1 = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, CSharpPreprocessorParser.RULE_preprocessor_expression);
                    this.state = 102;
                    if (!( this.precpred(this._ctx, 3))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                    }
                    this.state = 103;
                    this.match(CSharpPreprocessorParser.OP_NE);
                    this.state = 104;
                    localctx.expr2 = this.preprocessor_expression(4);
                     localctx.value =  (localctx.expr1.value != localctx.expr2.value ? "true" : "false") 
                    break;

                case 3:
                    localctx = new Preprocessor_expressionContext(this, _parentctx, _parentState);
                    localctx.expr1 = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, CSharpPreprocessorParser.RULE_preprocessor_expression);
                    this.state = 107;
                    if (!( this.precpred(this._ctx, 2))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
                    }
                    this.state = 108;
                    this.match(CSharpPreprocessorParser.OP_AND);
                    this.state = 109;
                    localctx.expr2 = this.preprocessor_expression(3);
                     localctx.value =  (localctx.expr1.value.equals("true") && localctx.expr2.value.equals("true") ? "true" : "false") 
                    break;

                case 4:
                    localctx = new Preprocessor_expressionContext(this, _parentctx, _parentState);
                    localctx.expr1 = _prevctx;
                    this.pushNewRecursionContext(localctx, _startState, CSharpPreprocessorParser.RULE_preprocessor_expression);
                    this.state = 112;
                    if (!( this.precpred(this._ctx, 1))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                    }
                    this.state = 113;
                    this.match(CSharpPreprocessorParser.OP_OR);
                    this.state = 114;
                    localctx.expr2 = this.preprocessor_expression(2);
                     localctx.value =  (localctx.expr1.value.equals("true") || localctx.expr2.value.equals("true") ? "true" : "false") 
                    break;

                } 
            }
            this.state = 121;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,7,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};


CSharpPreprocessorParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 2:
			return this.preprocessor_expression_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

CSharpPreprocessorParser.prototype.preprocessor_expression_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 4);
		case 1:
			return this.precpred(this._ctx, 3);
		case 2:
			return this.precpred(this._ctx, 2);
		case 3:
			return this.precpred(this._ctx, 1);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.CSharpPreprocessorParser = CSharpPreprocessorParser;
