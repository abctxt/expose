namespace Expose.Functions.Common

open System


// The generator reads these and emits the HTTP, gRPC, and GraphQL bridges.
// Get and Post publish an HTTP route. Query and Mutation publish a GraphQL field. Grpc publishes a gRPC operation.
// FunctionEnv marks a parameter type that is resolved from DI.


/// Parameter types marked with this attribute are resolved from DI.
[<Sealed>]
[<AttributeUsage(AttributeTargets.Class, AllowMultiple = false)>]
type FunctionEnvAttribute() =
    inherit Attribute()


/// GraphQL query.
[<Sealed>]
[<AttributeUsage(AttributeTargets.Method, AllowMultiple = false)>]
type QueryAttribute() =
    inherit Attribute()


/// GraphQL mutation.
[<Sealed>]
[<AttributeUsage(AttributeTargets.Method, AllowMultiple = false)>]
type MutationAttribute() =
    inherit Attribute()


[<Sealed>]
[<AttributeUsage(AttributeTargets.Method, AllowMultiple = false)>]
type GetAttribute(route: string) =
    inherit Attribute()
    member _.Route = route


[<Sealed>]
[<AttributeUsage(AttributeTargets.Method, AllowMultiple = false)>]
type PostAttribute(route: string) =
    inherit Attribute()
    member _.Route = route


/// gRPC operation.
[<Sealed>]
[<AttributeUsage(AttributeTargets.Method, AllowMultiple = false)>]
type GrpcAttribute() =
    inherit Attribute()
