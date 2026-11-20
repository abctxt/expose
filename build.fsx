#!/usr/bin/env -S dotnet fsi

open System
open System.Diagnostics
open System.IO
open System.Text


let applicationName = "Expose"


type BuildTarget = MacOS | Linux_arm64 | Linux_x64 | Windows_x64
    with
    static member Default() = Linux_x64


let args = fsi.CommandLineArgs |> Array.AsReadOnly

let wait = args.Contains("--wait")
let verify = args.Contains("--verify")

let getArgValue (argName: string) =
    let argIndex = Array.tryFindIndex (fun x -> x = argName) fsi.CommandLineArgs
    match argIndex with
    | Some idx when idx + 1 < fsi.CommandLineArgs.Length -> Some args.[idx + 1]
    | _ -> None

let outDir = getArgValue "--out"

let buildTarget =
    if args.Contains("macos") then MacOS
    elif args.Contains("win-x64") then Windows_x64
    elif args.Contains("linux-x64") then Linux_x64
    elif args.Contains("linux-arm64") then Linux_arm64
    else BuildTarget.Default()

let buildOutFolder =
    match buildTarget with
    | MacOS -> "macos"
    | Linux_arm64 -> "linux-arm64"
    | Linux_x64 -> "linux-x64"
    | Windows_x64 -> "win-x64"

let buildDir =
    match outDir with
    | Some dir -> dir
    | None -> $"build/{buildOutFolder}"

let buildDirFullPath = Path.GetFullPath(Path.Combine(__SOURCE_DIRECTORY__, buildDir))

let stopwatch = Stopwatch.StartNew()


// --- Build application ---

let ensureBuildOutputFolderIsSafe() =
    if Directory.Exists(buildDirFullPath) then
        let hasContents =
            Directory.EnumerateFileSystemEntries(buildDirFullPath)
            |> Seq.isEmpty
            |> not

        if hasContents then
            failwithf
                "Refusing to build into non-empty output folder: %s. Use a missing or empty folder such as podman/expose-backend/build."
                buildDirFullPath

let buildApplication() =
    ensureBuildOutputFolderIsSafe()
    Directory.CreateDirectory(buildDirFullPath) |> ignore

    let buildFor =
        match buildTarget with
        | MacOS -> "osx-arm64"
        | Linux_arm64 -> "linux-arm64"
        | Linux_x64 -> "linux-x64"
        | Windows_x64 -> "win-x64"

    let dotnet = new Process(StartInfo = ProcessStartInfo(
        FileName = "dotnet",
        WorkingDirectory = __SOURCE_DIRECTORY__,
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        RedirectStandardInput = false,
        Arguments = $"publish --nologo -v minimal -r {buildFor} --self-contained false src/expose-backend/ExposeWeb -o \"{buildDirFullPath}\""))

    let logTask = fun (args: DataReceivedEventArgs) ->
        Console.WriteLine(args.Data)

    dotnet.ErrorDataReceived.Add(logTask)
    dotnet.OutputDataReceived.Add(logTask)

    dotnet.Start() |> ignore
    dotnet.BeginErrorReadLine()
    dotnet.BeginOutputReadLine()
    dotnet.WaitForExit()
    let publishExitCode = dotnet.ExitCode
    dotnet.Dispose()

    if publishExitCode <> 0 then
        failwithf "dotnet publish failed with exit code %d." publishExitCode

    // Cleanup output afterwards

    let devSettingsFile = $"{buildDirFullPath}/appsettings.Development.json"
    if File.Exists(devSettingsFile) then
        File.Delete devSettingsFile

    // Resulting platform
    buildTarget


// --- Verify application ---

let verifyApplication() =
    let workDir = buildDirFullPath
    let exeFile = applicationName + (if buildTarget = Windows_x64 then ".exe" else "")
    let exePath = Path.Combine(workDir, exeFile)

    let expose = new Process(StartInfo = ProcessStartInfo(
        FileName = exePath,
        WorkingDirectory = workDir,
        RedirectStandardOutput = true,
        RedirectStandardError = false,
        RedirectStandardInput = false,
        Arguments = "--verify"))

    let logTask = fun (args: DataReceivedEventArgs) ->
        Console.WriteLine(args.Data)

    expose.OutputDataReceived.Add(logTask)

    try
        expose.Start() |> ignore
        expose.BeginOutputReadLine()

        expose.WaitForExit()
        let exitCode = expose.ExitCode

        expose.Dispose()
        exitCode
    with
    | :? InvalidOperationException as e ->
        Console.WriteLine e.Message
        1
    | :? System.ComponentModel.Win32Exception as e ->
        Console.WriteLine e.Message
        1
    | _ -> 1


// ---

let waitMessage = if wait then " Press any key to exit." else ""

let buildResultMessage (elapsedTime: TimeSpan) =
    let duration =
        if elapsedTime.TotalMinutes >= 1.0
        then $"{int elapsedTime.TotalMinutes}m {elapsedTime.Seconds}s {elapsedTime.Milliseconds}ms"
        else $"{elapsedTime.Seconds}s {elapsedTime.Milliseconds}ms"

    let sb = StringBuilder()
    sb.AppendLine() |> ignore
    sb.AppendLine $"Product: {applicationName} ({buildTarget})" |> ignore
    sb.AppendLine $"Output: {buildDirFullPath}" |> ignore
    sb.AppendLine $"Duration: {duration}" |> ignore
    sb.ToString()


if verify then
    let res = verifyApplication()
    let msg, exitCode =
        match res with
        | 0 -> $"Successfully verified {applicationName}.", 0
        | _ -> $"Failed to verify {applicationName}.", 1

    Console.WriteLine (msg + waitMessage)
    Console.WriteLine (buildResultMessage stopwatch.Elapsed)

    if wait then Console.ReadKey() |> ignore
    exit exitCode


else // Building …
    let res = buildApplication()

    Console.WriteLine $"Successfully built {applicationName} for {res}.{waitMessage}"
    Console.WriteLine (buildResultMessage stopwatch.Elapsed)

    if wait then Console.ReadKey() |> ignore
    0
