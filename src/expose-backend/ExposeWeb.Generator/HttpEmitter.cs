using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Expose.Generator;


internal static class HttpEmitter
{
    public static void Append(StringBuilder src, IReadOnlyList<Endpoint> endpoints)
    {
        var tab = " ".Repeat(4);
        src.AppendLine($"{tab}public static void MapGeneratedEndpoints(this IEndpointRouteBuilder app)");
        src.AppendLine($"{tab}{{");
        foreach (var endpoint in endpoints) {
            if ((endpoint.Bridges & Bridges.Http) == 0)
                continue;
            AppendEndpoint(src, endpoint);
        }
        src.AppendLine($"{tab}}}");
    }

    private static void AppendEndpoint(StringBuilder src, Endpoint endpoint)
    {
        var tab = " ".Repeat(4);
        var verb = endpoint.Verb == "POST" ? "Post" : "Get";
        var parameters = string.Join(", ", endpoint.Parameters.Select(parameter => $"{parameter.Type} {parameter.Name}"));
        var call = string.Join(", ", endpoint.Parameters.Select(Argument));
        src.AppendLine($"{tab.Repeat(2)}// {endpoint.Verb} {endpoint.Template} -> {endpoint.Method}");
        src.AppendLine($"{tab.Repeat(2)}app.Map{verb}(\"{endpoint.Template}\", async ({parameters}) =>");
        src.AppendLine($"{tab.Repeat(2)}{{");
        src.AppendLine($"{tab.Repeat(3)}var result = await {endpoint.Method}({call});");
        src.AppendLine($"{tab.Repeat(3)}if (result.IsOk)");
        src.AppendLine($"{tab.Repeat(3)}{{");
        src.AppendLine($"{tab.Repeat(4)}var value = result.ResultValue;");
        if (endpoint.ResponseRecord is null)
            src.AppendLine($"{tab.Repeat(4)}return Results.Ok(value);");
        else {
            var fields = string.Join(", ", endpoint.ResponseFields!.Select(field => $"value.{field.Name}"));
            src.AppendLine($"{tab.Repeat(4)}return Results.Ok(new {endpoint.ResponseRecord}({fields}));");
        }

        src.AppendLine($"{tab.Repeat(3)}}}");
        src.AppendLine();
        src.AppendLine($"{tab.Repeat(3)}var error = result.ErrorValue;");
        if (endpoint.ErrorCases.Contains("IsNotFound"))
            src.AppendLine($"{tab.Repeat(3)}if (error.IsNotFound) return Results.NotFound();");
        src.AppendLine($"{tab.Repeat(3)}return Results.BadRequest();");
        src.AppendLine($"{tab.Repeat(2)}}});");
    }

    private static string Argument(Parameter parameter)
    {
        if (parameter.Kind != ParameterKind.Body || parameter.Fields is null || parameter.FSharpType is null)
            return parameter.Name;

        var fields = string.Join(", ", parameter.Fields.Select(field => $"{parameter.Name}.{field.Name}"));
        return $"new {parameter.FSharpType}({fields})";
    }
}
