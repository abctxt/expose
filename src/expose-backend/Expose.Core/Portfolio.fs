module Expose.Core.Portfolio

open System
open Expose.Core.Securities
open FsToolkit.ErrorHandling
open ServiceStack.Text


type Pieces = private Pieces of decimal

module Pieces =
    let tryCreate value =
        if value >= 0m then Ok (Pieces value) else Error ()

    let value (Pieces n) = n


type Capital = private Capital of decimal

module Capital =
    let tryCreate value =
        if value >= 0m then Ok (Capital value) else Error ()

    let value (Capital n) = n


type PortfolioItem = private {
    guid: Guid
    name: string
    isin: Isin
    pieces: Pieces
    capital: Capital
    displayOrder: int
} with
    member t.Guid = t.guid
    member t.Name = t.name
    member t.Isin = t.isin.Name
    member t.Pieces = Pieces.value t.pieces
    member t.Capital = Capital.value t.capital
    member t.DisplayOrder = t.displayOrder


module PortfolioItem =

    type Error =
        | BlankName
        | NegativePieces
        | NegativeCapital

    let tryCreate guid (name: string) isin pieces capital displayOrder = result {
        do! Result.requireFalse BlankName (name.AsSpan().IsNullOrWhiteSpace())
        let! pieces = Pieces.tryCreate pieces |> Result.mapError (fun () -> NegativePieces)
        let! capital = Capital.tryCreate capital |> Result.mapError (fun () -> NegativeCapital)
        return {
            guid = guid
            name = name.Trim()
            isin = isin
            pieces = pieces
            capital = capital
            displayOrder = displayOrder
        }
    }

    let dump (item: PortfolioItem) = item.Dump()
