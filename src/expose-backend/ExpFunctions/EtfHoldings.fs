module Expose.Functions.EtfHoldings

open System
open System.Linq
open System.Threading
open Expose.Data.EtfHoldings
open Expose.Functions.Common
open FsToolkit.ErrorHandling
open Microsoft.EntityFrameworkCore


[<FunctionEnv>]
type EtfHoldingsEnv = {
    ct: CancellationToken
    db: IEtfHoldingsContext
    fs: IFileStorageService
    xlsx: ISpreadsheetParser
    csv: ICsvTableParser
}

type EtfHoldingObj = {
    guid: Guid
    name: string
    webUrl: string option
}


[<Query>]
let listEtfHoldings (env: EtfHoldingsEnv) = taskResult {
    let db = env.db
    let! items = db.Documents.ToListAsync()

    if items.Count > 0 then
        let res = items
                    .Select(fun x -> {guid = x.Guid7; name = x.Name; webUrl = if x.WebUrl <> null then Some x.WebUrl else None})
                    .ToList()
        return! Ok res
    else
        return! Error EmptyResult
}


[<Query>]
let readEtfHolding (env: EtfHoldingsEnv) (id: Guid) = taskResult {
    return! Ok { guid = Guid.CreateVersion7(); name = ""; webUrl = Some "" }
}


[<Mutation>]
let saveEtfHolding (env: EtfHoldingsEnv) (obj: EtfHoldingObj) = taskResult {
    return! Ok { guid = Guid.CreateVersion7(); name = ""; webUrl = Some "" }
}
