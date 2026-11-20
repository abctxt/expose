module Expose.Functions.Portfolio

open System
open System.Threading
open System.Threading.Tasks
open Expose.Core
open Expose.Core.Portfolio
open Expose.Core.Securities
open Expose.Data.Portfolio
open Expose.Functions.Common
open FsToolkit.ErrorHandling
open Microsoft.EntityFrameworkCore

(**
Function catalogue:
- showPortfolio: return the stored portfolio items in display order.
- readPortfolioItem: return one item by its public id.
- savePortfolioItem: create or update an item's name and ISIN.
*)

[<FunctionEnv>]
type PortfolioEnv = {
    ct: CancellationToken
    db: IPortfolioContext
}

type PortfolioObj = {
    ref: Guid
    name: string
    items: PortfolioItemObj list
}

and PortfolioItemObj = {
    ref: Guid
    name: string
    isin: string
}

module PortfolioItemObj =
    let fromRow (row: PortfolioItemRow) = {
        ref = row.Guid7
        name = row.DisplayName
        isin = row.OriginalIsin
    }

    let fromModel (model: Portfolio.PortfolioItem) = {
        ref = model.Guid
        name = model.Name
        isin = model.Isin
    }

module PortfolioObj =
    let fromRow (row: PortfolioItemRow) = {
        ref = row.Guid7
        name = if row.DisplayName <> null then row.DisplayName else ""
        isin = row.OriginalIsin
    }

    let fromModel (name: string) (models: Portfolio.PortfolioItem list) = {
        ref = Guid.Empty
        name = name
        items = models |> List.map PortfolioItemObj.fromModel
    }


[<Query>]
let showPortfolio (env: PortfolioEnv) : Task<Result<PortfolioObj, GenericError>> = taskResult {
    let! rows = env.db.Items.ToListAsync(env.ct)

    if rows.Count = 0 then
        return! Error EmptyResult
    else
        let items =
            rows
            |> Seq.sortBy (fun row -> row.DisplayOrder, row.Id)
            |> Seq.map PortfolioObj.fromRow
            |> Seq.toList

        // One portfolio for this version. It has no row of its own yet.
        return! Ok { ref = Guid.Empty; name = "Portfolio"; items = items }
}


[<Query>]
let readPortfolioItem (env: PortfolioEnv) (ref: Guid) : Task<Result<PortfolioItemObj, GenericError>> = taskResult {
    let! rows = env.db.Items.ToListAsync(env.ct)

    match rows |> Seq.tryFind (fun row -> row.Guid7 = ref) with
    | None -> return! Error NotFound
    | Some row -> return! Ok (PortfolioObj.fromRow row)
}


[<Mutation>]
let savePortfolioItem (env: PortfolioEnv) (obj: PortfolioItemObj) : Task<Result<PortfolioItemObj, GenericError>> = taskResult {
    let isin: Isin = { Name = obj.isin }
    let! model =
        PortfolioItem.tryCreate obj.ref obj.name isin 0m 0m 0
        |> Result.mapError (fun _ -> Invalid)

    //let test = PortfolioItem.dump model

    let! rows = env.db.Items.ToListAsync(env.ct)

    let row =
        match rows |> Seq.tryFind (fun row -> row.Guid7 = obj.ref) with
        | Some found -> found
        | None ->
            let created = PortfolioItemRow()
            created.Guid7 <- model.Guid
            created.NumberOfPieces <- model.Pieces
            created.CapitalAmount <- model.Capital
            env.db.Items.Add created |> ignore
            created

    row.DisplayName <- model.Name
    row.OriginalIsin <- model.Isin
    let! _ = env.db.SaveChangesAsync(env.ct)
    return! Ok (PortfolioItemObj.fromModel model)
}
