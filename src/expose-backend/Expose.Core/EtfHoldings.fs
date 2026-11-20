module Expose.Core.EtfHoldings

open System
open Expose.Core.Common.Types


type EtfHolding = {
    Guid: Guid
    Name: string
    HomepageUrl: Url option
    DownloadUrl: Url option
}
