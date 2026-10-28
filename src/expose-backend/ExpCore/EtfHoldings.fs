module Expose.Core.EtfHoldings

open System
open Expose.Core.Common.Types


type EtfHolding = {
    Guid: Guid
    Name: string
    WebUrl: Url option
}
