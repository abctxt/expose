namespace Expose.Functions.Common

open System


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
