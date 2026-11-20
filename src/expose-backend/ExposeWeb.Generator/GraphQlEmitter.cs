using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Expose.Generator;


internal static class GraphQlEmitter
{
    public static void Append(StringBuilder src, IReadOnlyList<Endpoint> endpoints)
    {
        AppendType(src, "GeneratedQueries", endpoints.Where(endpoint => endpoint.GraphQl == GraphQlOperation.Query).ToList());
        var mutations = endpoints.Where(endpoint => endpoint.GraphQl == GraphQlOperation.Mutation).ToList();
        if (mutations.Count > 0)
            AppendType(src, "GeneratedMutations", mutations);
    }

    private static void AppendType(StringBuilder src, string typeName, List<Endpoint> endpoints)
    {
        var tab = " ".Repeat(4);
        src.AppendLine($"public sealed class {typeName}");
        src.AppendLine("{");
        foreach (var endpoint in endpoints) {
            var parameters = string.Join(", ", Parameters(endpoint));
            src.AppendLine($"{tab}[HotChocolate.GraphQLName(\"{endpoint.FunctionName}\")]");
            src.AppendLine($"{tab}public async global::System.Threading.Tasks.Task<{endpoint.ResponseType}> {endpoint.Operation}({parameters})");
            src.AppendLine($"{tab}{{");
            src.AppendLine($"{tab.Repeat(2)}var result = await {endpoint.Method}({endpoint.Call(null, null)});");
            ResultMapping.Append(src, endpoint, 2, "return", "throw new HotChocolate.GraphQLException(\"NotFound\");", "throw new HotChocolate.GraphQLException(\"Invalid\");");
            src.AppendLine($"{tab}}}");
        }

        src.AppendLine("}");
    }

    private static List<string> Parameters(Endpoint endpoint)
    {
        var parameters = new List<string>();
        foreach (var parameter in endpoint.Parameters) {
            if (parameter.Kind == ParameterKind.Service) {
                parameters.Add($"[HotChocolate.Service] {parameter.Type} {parameter.Name}");
                continue;
            }

            if (parameter.Kind == ParameterKind.Body && parameter.Fields is not null) {
                parameters.AddRange(parameter.Fields.Select(field => $"{field.Type} {Names.Camel(field.Name)}"));
                continue;
            }

            parameters.Add($"{parameter.Type} {parameter.Name}");
        }

        return parameters;
    }
}
