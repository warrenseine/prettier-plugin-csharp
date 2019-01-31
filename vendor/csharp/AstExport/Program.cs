using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using static System.Console;

namespace AstExport
{
    static class Program
    {
        private static readonly HashSet<string> TokenBlacklist = new HashSet<string>
        {
            "EndOfFileToken",
            "ColonToken",
            "SemicolonToken",
            "DotToken",
            "OpenBraceToken",
            "CloseBraceToken",
            "OpenParenToken",
            "CloseParenToken",
            "OpenBracketToken",
            "CloseBracketToken",
            "LessThanToken",
            "GreaterThanToken",
            "NamespaceKeyword"
        };

        private static readonly Type SyntaxTokenType = typeof(SyntaxToken);

        private static void Main(string[] args)
        {
            using (var stream = OpenInput(args))
            using (var reader = new StreamReader(stream, InputEncoding))
            {
                var text = reader.ReadToEnd();

                var tree = CSharpSyntaxTree.ParseText(text);
                var root = tree.GetCompilationUnitRoot();

                var ast = SerializeNode(root);

                var collector = new TriviaCollector();
                collector.Visit(root);

                ast["comments"] = JArray.FromObject(collector.Trivias.Select(SerializeTrivia));

                var content = PrintAst(args, ast);

                WriteOutput(content, args);
            }
        }

        private static string GetArgumentValue(IReadOnlyList<string> arguments, string argument)
        {
            var prefix = $"--{argument}=";
            var value = arguments.FirstOrDefault(a => a.StartsWith(prefix));

            return value?.Substring(prefix.Length);
        }

        private static Stream OpenInput(IReadOnlyList<string> args)
        {
            var path = GetArgumentValue(args, "input");

            return path != null ? new FileStream(path, FileMode.Open) : OpenStandardInput();
        }

        private static string PrintAst(IReadOnlyList<string> args, JObject ast)
        {
            var formatting = GetArgumentValue(args, "formatting") == "indented" ? Formatting.Indented : Formatting.None;

            return ast.ToString(formatting);
        }

        private static void WriteOutput(string content, IReadOnlyList<string> args)
        {
            var path = GetArgumentValue(args, "output");

            if (path == null)
            {
                WriteLine(content);
            }
            else
            {
                File.WriteAllText(path, content);
            }
        }

        private static JObject SerializeNode(SyntaxNode node)
        {
            var location = node.GetLocation();
            var sourceSpan = location.SourceSpan;
            var lineSpan = location.GetLineSpan();

            var kind = node.Kind();

            var result = new JObject
            {
                ["nodeType"] = kind.ToString(),
                ["start"] = sourceSpan.Start,
                ["end"] = sourceSpan.End,
                ["lineStart"] = lineSpan.StartLinePosition.Line,
                ["lineEnd"] = lineSpan.EndLinePosition.Line,
            };

            var children = node.ChildNodes().Select(SerializeNode).ToArray();

            result["children"] = JArray.FromObject(children);

            var properties = node.GetType().GetProperties();

            foreach (var property in properties)
            {
                var name = property.Name;

                if (property.PropertyType != SyntaxTokenType || TokenBlacklist.Contains(name) ||
                    !(property.GetValue(node) is SyntaxToken token))
                    continue;

                result[ToCamelCase(name)] = token.Text;
            }

            return result;
        }

        private static JObject SerializeTrivia(SyntaxTrivia trivia)
        {
            var location = trivia.GetLocation();
            var sourceSpan = location.SourceSpan;
            var lineSpan = location.GetLineSpan();

            return new JObject
            {
                ["nodeType"] = trivia.IsDirective ? "directive" : "comment",
                ["start"] = sourceSpan.Start,
                ["end"] = sourceSpan.End,
                ["lineStart"] = lineSpan.StartLinePosition.Line,
                ["lineEnd"] = lineSpan.EndLinePosition.Line,
                ["value"] = trivia.ToString()
            };
        }

        private static string ToCamelCase(string value)
        {
            return char.ToLowerInvariant(value[0]) + value.Substring(1);
        }
    }

    public class TriviaCollector : CSharpSyntaxWalker
    {
        public ICollection<SyntaxTrivia> Trivias { get; } = new List<SyntaxTrivia>();

        public TriviaCollector() : base(SyntaxWalkerDepth.Trivia)
        {
        }

        public override void VisitTrivia(SyntaxTrivia trivia)
        {
            if (trivia.IsKind(SyntaxKind.WhitespaceTrivia) || trivia.IsKind(SyntaxKind.EndOfLineTrivia))
                return;

            Trivias.Add(trivia);
        }
    }
}
