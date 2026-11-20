module Expose.Functions.EtfHoldings

open System
open System.Collections.Generic
open System.Linq
open System.Threading
open Expose.Data.EtfHoldings
open Expose.Functions.Common
open FsToolkit.ErrorHandling
open Microsoft.EntityFrameworkCore

(**
Function catalogue:
- listDocuments: return the stored holdings documents.
- readDocument: return one document by its public id.
- saveDocument: create or update a document's name and URLs.
- uploadDocumentAndReplace: store a manually uploaded spreadsheet in place of the current file.
- downloadDocumentFromVendor: fetch the spreadsheet from DownloadUrl when the vendor publishes a direct link.
- listParsingRules: return the parsing rules.
- readParsingRule: return one parsing rule.
- saveParsingRule: create or update a parsing rule.
- aiSuggestParsingRule: ask the chat client to propose a parsing rule for a document.
*)


[<FunctionEnv>]
type EtfHoldingsEnv = {
    ct: CancellationToken
    db: IEtfHoldingsContext
    xlsx: IWorksheetParser
    csv: ICsvTableParser
    fs: IFileStorage
}

type EtfHoldingObj = {
    guid: Guid
    name: string
    homepageUrl: string option
    downloadUrl: string option
}

type DocumentUpload = {
    size: uint
    mimeType: string
    bytes: IReadOnlyList<byte>
}


[<Query>]
let listDocuments (env: EtfHoldingsEnv) = taskResult {
    let db = env.db
    let! items = db.Documents.ToListAsync()

    if items.Count > 0 then
        let res =
            items
                .Select(fun x -> {
                    guid = x.Guid7
                    name = x.Name
                    homepageUrl = Option.ofObj x.HomepageUrl
                    downloadUrl = Option.ofObj x.DownloadUrl
                })
                .ToList()
        return! Ok res
    else
        return! Error EmptyResult
}


[<Query>]
let readDocument (env: EtfHoldingsEnv) (ref: Guid) = taskResult {
    return! Ok { guid = Guid.CreateVersion7(); name = ""; homepageUrl = Some ""; downloadUrl = Some "" }
}


[<Mutation>]
let saveDocument (env: EtfHoldingsEnv) (obj: EtfHoldingObj) = taskResult {
    return! Ok { guid = Guid.CreateVersion7(); name = ""; homepageUrl = Some ""; downloadUrl = Some "" }
}


[<Post("/upload")>]
let uploadDocumentAndReplace (env: EtfHoldingsEnv) (ref: Guid) (doc: DocumentUpload) = taskResult {
    return! Ok ()
}


[<Post("/post")>]
let downloadDocumentFromVendor (env: EtfHoldingsEnv) ([<Service>] http: IHttpDownloader) (ref: Guid) = taskResult {
    return! Ok ()
}


[<Query>]
let listParsingRules (env: EtfHoldingsEnv) = taskResult {
    return! Ok ()
}


[<Query>]
let readParsingRule (env: EtfHoldingsEnv) = taskResult {
    return! Ok ()
}


[<Mutation>]
let saveParsingRule (env: EtfHoldingsEnv) = taskResult {
    return! Ok ()
}


[<Query>]
let aiSuggestParsingRule (env: EtfHoldingsEnv) ([<Service>] chat: IOllamaChatClient) = taskResult {
    return! Ok ()
}
