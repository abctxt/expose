using System;
using System.Collections.Generic;
using System.Linq;

namespace Expose.Generator;


[Flags]
internal enum Bridges
{
    None = 0,
    Http = 1,
    Grpc = 2,
    GraphQl = 4
}


internal enum GraphQlOperation
{
    None,
    Query,
    Mutation
}


internal enum ParameterKind
{
    Route,
    Query,
    Service,
    Body
}


internal readonly struct Member
{
    public Member(string name, string type)
    {
        Name = name;
        Type = type;
    }

    public string Name { get; }
    public string Type { get; }
}


internal readonly struct Parameter
{
    public Parameter(string name, string type, ParameterKind kind, List<Member>? fields, string? fsharpType = null)
    {
        Name = name;
        Type = type;
        Kind = kind;
        Fields = fields;
        FSharpType = fsharpType;
    }

    public string Name { get; }
    public string Type { get; }
    public ParameterKind Kind { get; }
    public List<Member>? Fields { get; }
    public string? FSharpType { get; }
}


internal readonly struct Endpoint
{
    public Endpoint(
        string verb,
        string template,
        Bridges bridges,
        GraphQlOperation graphQl,
        string method,
        string? responseRecord,
        List<Member>? responseFields,
        List<string> errorCases,
        List<Parameter> parameters)
    {
        Verb = verb;
        Template = template;
        Bridges = bridges;
        GraphQl = graphQl;
        Method = method;
        ResponseRecord = responseRecord;
        ResponseFields = responseFields;
        ErrorCases = errorCases;
        Parameters = parameters;
    }

    public string Verb { get; }
    public string Template { get; }
    public Bridges Bridges { get; }
    public GraphQlOperation GraphQl { get; }
    public string Method { get; }
    public string? ResponseRecord { get; }
    public List<Member>? ResponseFields { get; }
    public List<string> ErrorCases { get; }
    public List<Parameter> Parameters { get; }

    public string Operation => Names.Pascal(FunctionName);

    public string FunctionName => Method.Split('.').Last();

    public string ResponseType => ResponseRecord ?? "string";

    public string Call(IReadOnlyList<(string Type, string Field)>? envs, string? request)
    {
        return string.Join(", ", Parameters.Select(parameter => {
            if (parameter.Kind == ParameterKind.Service) {
                if (request is null)
                    return parameter.Name;
                return envs!.First(env => env.Type == parameter.Type).Field;
            }

            if (parameter.Kind == ParameterKind.Body && parameter.Fields is not null && parameter.FSharpType is not null) {
                var fields = parameter.Fields.Select(field => request is null ? Names.Camel(field.Name) : request + "." + field.Name);
                return "new " + parameter.FSharpType + "(" + string.Join(", ", fields) + ")";
            }

            return request is null ? parameter.Name : request + "." + Names.Pascal(parameter.Name);
        }));
    }
}


internal static class Names
{
    public static string Pascal(string name) =>
        string.IsNullOrEmpty(name) ? name : char.ToUpperInvariant(name[0]) + name.Substring(1);

    public static string Camel(string name) =>
        string.IsNullOrEmpty(name) ? name : char.ToLowerInvariant(name[0]) + name.Substring(1);
}
