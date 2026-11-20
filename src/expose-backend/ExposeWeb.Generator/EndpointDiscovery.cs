using System.Collections.Generic;
using System.Linq;
using Microsoft.CodeAnalysis;

namespace Expose.Generator;


/// <summary>
/// Route tokens bind from the route, FunctionEnv types come from DI, and one remaining record is the JSON body.
/// </summary>
internal static class EndpointDiscovery
{
    public static List<Endpoint> Find(Compilation compilation, List<string> errors)
    {
        var endpoints = new List<Endpoint>();
        foreach (var method in Methods(compilation)) {
            if (Has(method, "QueryAttribute") && Has(method, "MutationAttribute")) {
                errors.Add(method.Name + " cannot be both a query and a mutation.");
                continue;
            }

            if (!Marked(method, out var bridges, out var verb, out var template, out var graphQl))
                continue;

            if (!TryDescribe(method, bridges, verb, template, graphQl, out var endpoint, out var error)) {
                errors.Add(error);
                continue;
            }

            endpoints.Add(endpoint);
        }

        return endpoints;
    }

    private static IEnumerable<IMethodSymbol> Methods(Compilation compilation)
    {
        foreach (var assembly in compilation.SourceModule.ReferencedAssemblySymbols) {
            if (assembly.Name.StartsWith("System") || assembly.Name.StartsWith("Microsoft") || assembly.Name == "FSharp.Core")
                continue;

            foreach (var method in Methods(assembly.GlobalNamespace))
                yield return method;
        }
    }

    private static IEnumerable<IMethodSymbol> Methods(INamespaceOrTypeSymbol symbol)
    {
        if (symbol is INamespaceSymbol ns) {
            foreach (var member in ns.GetMembers())
            foreach (var method in Methods(member))
                yield return method;
            yield break;
        }

        var type = (INamedTypeSymbol)symbol;
        foreach (var method in type.GetMembers().OfType<IMethodSymbol>()) {
            if (method.MethodKind == MethodKind.Ordinary && method.DeclaredAccessibility == Accessibility.Public)
                yield return method;
        }

        foreach (var nested in type.GetTypeMembers())
        foreach (var method in Methods(nested))
            yield return method;
    }

    private static bool Marked(IMethodSymbol method, out Bridges bridges, out string verb, out string template, out GraphQlOperation graphQl)
    {
        bridges = Bridges.None;
        verb = "GET";
        template = "";
        graphQl = GraphQlOperation.None;

        var get = Route(method, "GetAttribute", "GET");
        var post = Route(method, "PostAttribute", "POST");
        if (get is not null) {
            bridges |= Bridges.Http;
            verb = get.Value.Verb;
            template = get.Value.Template;
        } else if (post is not null) {
            bridges |= Bridges.Http;
            verb = post.Value.Verb;
            template = post.Value.Template;
        }

        if (Has(method, "QueryAttribute")) {
            bridges |= Bridges.GraphQl;
            graphQl = GraphQlOperation.Query;
        }

        if (Has(method, "MutationAttribute")) {
            bridges |= Bridges.GraphQl;
            graphQl = GraphQlOperation.Mutation;
        }

        if (Has(method, "GrpcAttribute"))
            bridges |= Bridges.Grpc;

        return bridges != Bridges.None;
    }

    private static bool Has(IMethodSymbol method, string attributeName) =>
        method.GetAttributes().Any(attribute => attribute.AttributeClass?.Name == attributeName);

    private static (string Verb, string Template)? Route(IMethodSymbol method, string attributeName, string verb)
    {
        var attribute = method.GetAttributes().FirstOrDefault(a => a.AttributeClass?.Name == attributeName);
        if (attribute is null || attribute.ConstructorArguments.Length == 0)
            return null;

        return (verb, attribute.ConstructorArguments[0].Value as string ?? "");
    }

    private static bool TryDescribe(IMethodSymbol method, Bridges bridges, string verb, string template, GraphQlOperation graphQl, out Endpoint endpoint, out string error)
    {
        endpoint = default;
        error = "";

        if (!TryUnwrap(method.ReturnType, out var ok, out var err)) {
            error = method.Name + " must return Task<Result<'T, 'TError>>.";
            return false;
        }

        var tokens = RouteTokens(template);
        var parameters = new List<Parameter>();
        var sawBody = false;
        foreach (var parameter in method.Parameters) {
            if (tokens.Contains(parameter.Name)) {
                if (Primitive(parameter.Type) is not string primitive) {
                    error = method.Name + ": " + parameter.Name + " must be a primitive route value.";
                    return false;
                }

                parameters.Add(new Parameter(parameter.Name, primitive, ParameterKind.Route, null));
                continue;
            }

            if (parameter.Type.GetAttributes().Any(a => a.AttributeClass?.Name is "FunctionEnvAttribute" or "EndpointEnvAttribute")) {
                parameters.Add(new Parameter(parameter.Name, FullName(parameter.Type), ParameterKind.Service, null));
                continue;
            }

            if (Primitive(parameter.Type) is string query) {
                parameters.Add(new Parameter(parameter.Name, query, ParameterKind.Query, null));
                continue;
            }

            if (sawBody || !TryRecord(parameter.Type, out var fields)) {
                error = method.Name + ": " + parameter.Name + " is not a route token, a function env, or a record of primitive fields.";
                return false;
            }

            sawBody = true;
            parameters.Add(new Parameter(parameter.Name, parameter.Type.Name + "Request", ParameterKind.Body, fields, FullName(parameter.Type)));
        }

        if (!TryRecord(ok, out var responseFields) && Primitive(ok) is null) {
            error = method.Name + ": the success type must be a primitive or a record of primitives.";
            return false;
        }

        var cases = err.GetMembers().OfType<IPropertySymbol>()
            .Where(property => property.Type.SpecialType == SpecialType.System_Boolean && property.Name.StartsWith("Is"))
            .Select(property => property.Name)
            .ToList();

        endpoint = new Endpoint(
            verb,
            template,
            bridges,
            graphQl,
            FullName(method.ContainingType) + "." + method.Name,
            Primitive(ok) is null ? ok.Name + "Response" : null,
            responseFields,
            cases,
            parameters);
        return true;
    }

    private static bool TryUnwrap(ITypeSymbol type, out ITypeSymbol ok, out ITypeSymbol error)
    {
        ok = type;
        error = type;
        if (type is not INamedTypeSymbol task || task.Name != "Task" || task.TypeArguments.Length != 1)
            return false;

        if (task.TypeArguments[0] is not INamedTypeSymbol result || result.Name != "FSharpResult" || result.TypeArguments.Length != 2)
            return false;

        ok = result.TypeArguments[0];
        error = result.TypeArguments[1];
        return true;
    }

    private static bool TryRecord(ITypeSymbol type, out List<Member> fields)
    {
        fields = new List<Member>();
        if (!IsRecord(type))
            return false;

        fields = type.GetMembers().OfType<IPropertySymbol>()
            .Where(property => property.DeclaredAccessibility == Accessibility.Public && !property.IsStatic && property.ContainingType.Equals(type, SymbolEqualityComparer.Default))
            .Select(property => new Member(property.Name, Primitive(property.Type) ?? ""))
            .Where(member => member.Type.Length > 0)
            .ToList();

        var all = type.GetMembers().OfType<IPropertySymbol>()
            .Count(property => property.DeclaredAccessibility == Accessibility.Public && !property.IsStatic && !property.IsIndexer &&
                               property.ContainingType.Equals(type, SymbolEqualityComparer.Default));

        return fields.Count > 0 && fields.Count == all;
    }

    // F# records carry CompilationMappingAttribute(SourceConstructFlags.RecordType). KindMask is 31, RecordType is 2.
    private static bool IsRecord(ITypeSymbol type)
    {
        var attribute = type.GetAttributes().FirstOrDefault(a => a.AttributeClass?.Name == "CompilationMappingAttribute");
        if (attribute is null || attribute.ConstructorArguments.Length == 0 || attribute.ConstructorArguments[0].Value is not int flags)
            return false;

        return (flags & 31) == 2;
    }

    private static string? Primitive(ITypeSymbol type) => type.SpecialType switch {
        SpecialType.System_String => "string",
        SpecialType.System_Int32 => "int",
        SpecialType.System_Boolean => "bool",
        SpecialType.System_Decimal => "decimal",
        _ => null
    };

    private static HashSet<string> RouteTokens(string route)
    {
        var tokens = new HashSet<string>();
        for (var i = 0; (i = route.IndexOf('{', i)) >= 0;) {
            var end = route.IndexOf('}', i + 1);
            if (end < 0)
                break;
            var token = route.Substring(i + 1, end - i - 1);
            var colon = token.IndexOf(':');
            tokens.Add(colon >= 0 ? token.Substring(0, colon) : token);
            i = end + 1;
        }

        return tokens;
    }

    private static string FullName(ISymbol symbol) =>
        symbol.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat);
}
