#!/usr/bin/env -S dotnet fsi

//#r "nuget: FSharp.Data.LiteralProviders"
//#load "src/Expose/BuildInfo.fs"

open System
open System.Diagnostics
open System.IO

let args = fsi.CommandLineArgs |> Array.AsReadOnly

// Todo
