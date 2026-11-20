using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Expose.Generator;


internal static class GrpcEmitter
{
    public static void Append(StringBuilder src, IReadOnlyList<Endpoint> endpoints)
    {
        var operations = endpoints.Where(endpoint => (endpoint.Bridges & Bridges.Grpc) != 0).ToList();
        var tab = " ".Repeat(4);
        foreach (var endpoint in operations)
            Messages.Append(src, $"{endpoint.Operation}Request", Fields(endpoint));

        src.AppendLine();
        src.AppendLine("[System.ServiceModel.ServiceContract]");
        src.AppendLine("public interface IGeneratedGrpcServices");
        src.AppendLine("{");
        foreach (var endpoint in operations)
            src.AppendLine($"{tab}global::System.Threading.Tasks.Task<{endpoint.ResponseType}> {endpoint.Operation}({endpoint.Operation}Request request);");
        src.AppendLine("}");
        src.AppendLine();

        var envs = EnvFields(operations);
        var constructor = string.Join(", ", envs.Select(env => $"{env.Type} {env.Field.TrimStart('_')}"));
        src.AppendLine("public sealed class GeneratedGrpcServices : IGeneratedGrpcServices");
        src.AppendLine("{");
        foreach (var env in envs)
            src.AppendLine($"{tab}private readonly {env.Type} {env.Field};");
        src.AppendLine($"{tab}public GeneratedGrpcServices({constructor})");
        src.AppendLine($"{tab}{{");
        foreach (var env in envs)
            src.AppendLine($"{tab.Repeat(2)}{env.Field} = {env.Field.TrimStart('_')};");
        src.AppendLine($"{tab}}}");
        foreach (var endpoint in operations)
            AppendMethod(src, endpoint, envs);
        src.AppendLine("}");
    }

    private static void AppendMethod(StringBuilder src, Endpoint endpoint, List<(string Type, string Field)> envs)
    {
        var tab = " ".Repeat(4);
        src.AppendLine($"{tab}public async global::System.Threading.Tasks.Task<{endpoint.ResponseType}> {endpoint.Operation}({endpoint.Operation}Request request)");
        src.AppendLine($"{tab}{{");
        src.AppendLine($"{tab.Repeat(2)}var result = await {endpoint.Method}({endpoint.Call(envs, "request")});");
        ResultMapping.Append(src, endpoint, 2, "return", "throw new Grpc.Core.RpcException(new Grpc.Core.Status(Grpc.Core.StatusCode.NotFound, \"NotFound\"));",
            "throw new Grpc.Core.RpcException(new Grpc.Core.Status(Grpc.Core.StatusCode.InvalidArgument, \"Invalid\"));");
        src.AppendLine($"{tab}}}");
    }

    private static List<Member> Fields(Endpoint endpoint)
    {
        var fields = new List<Member>();
        foreach (var parameter in endpoint.Parameters) {
            if (parameter.Kind is ParameterKind.Route or ParameterKind.Query)
                fields.Add(new Member(Names.Pascal(parameter.Name), parameter.Type));
            else if (parameter.Kind == ParameterKind.Body && parameter.Fields is not null)
                fields.AddRange(parameter.Fields);
        }

        return fields;
    }

    private static List<(string Type, string Field)> EnvFields(IReadOnlyList<Endpoint> endpoints)
    {
        var fields = new List<(string Type, string Field)>();
        foreach (var parameter in endpoints.SelectMany(endpoint => endpoint.Parameters)) {
            if (parameter.Kind != ParameterKind.Service || fields.Any(field => field.Type == parameter.Type))
                continue;
            var shortName = parameter.Type.Split('.').Last();
            fields.Add((parameter.Type, "_" + Names.Camel(shortName)));
        }

        return fields;
    }
}
