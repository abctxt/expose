module Expose.Core.EtfHoldings

open System


type Document = {
    Guid: Guid
    Name: string
    FileRef: Guid
    HomepageUrl: Url option
    DownloadUrl: Url option
    ParsingRule: ParsingRule option
}

and ParsingRule = Csv of CsvParsingRule | Xlsx of XslxParsingRule | AI of ChaoticParseAI


and CsvParsingRule = {
    SkipRows: uint
    Separator: CsvColumnSeparator
}

and CsvColumnSeparator = Comma | Semicolon | Other of char


and ChaoticParseAI = {
    Instructions: string option
}


and XslxParsingRule = {
    SheetNumber: uint
    FirstRowIndex: uint
    LastRowIndex: uint
    FirstColumnIndex: uint
    LastColumnIndex: uint
}


type Download = {
    Guid: Guid
    Document: Document
}
