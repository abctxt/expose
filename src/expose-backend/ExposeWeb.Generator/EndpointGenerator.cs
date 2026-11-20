using System.Collections.Generic;
using Microsoft.CodeAnalysis;

namespace Expose.Generator;


/// <summary>
/// Finds F# methods tagged with a bridge marker and emits the HTTP, gRPC, and GraphQL adapters.
/// </summary>
[Generator]
public sealed class EndpointGenerator : IIncrementalGenerator
{
    private static readonly DiagnosticDescriptor Invalid = new(
        "FNAPI001",
        "Endpoint signature is not supported",
        "{0}",
        "FnApi",
        DiagnosticSeverity.Warning,
        true);

    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        context.RegisterSourceOutput(context.CompilationProvider, static (source, compilation) => {
            var errors = new List<string>();
            var endpoints = EndpointDiscovery.Find(compilation, errors);
            foreach (var error in errors)
                source.ReportDiagnostic(Diagnostic.Create(Invalid, Location.None, error));

            if (endpoints.Count == 0)
                return;

            source.AddSource("Endpoints.g.cs", GeneratedSource.Emit(endpoints));
        });
    }
}
