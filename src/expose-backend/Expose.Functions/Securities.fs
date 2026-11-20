module Expose.Functions.Securities

open System
open System.Collections.Generic
open System.Linq
open System.Threading
open System.Threading.Tasks
open Expose.Data.EtfHoldings
open Expose.Functions.Common
open FsToolkit.ErrorHandling
open Microsoft.EntityFrameworkCore

(**
Function catalogue:
- listSecurities:
*)


[<FunctionEnv>]
type SecuritiesEnv = {
    ct: CancellationToken
    //db: IEtfHoldingsContext
}

type SecurityObj = {
    guid: Guid
    isin: string
    name: string
}


[<Query>]
let listSecurities (env: SecuritiesEnv) : Task<Result<string, GenericError>> = taskResult {
    return ""
}
