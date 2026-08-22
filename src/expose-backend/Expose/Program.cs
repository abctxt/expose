using System.Text.Json.Serialization;
using Expose.MarketData.V1;
using Expose.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Tomlyn.Extensions.Configuration;

var builder = WebApplication.CreateSlimBuilder(args);
builder.WebHost.UseKestrelHttpsConfiguration();

var exposeTomlPath = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", "..", "..", "config", "expose.toml"));
builder.Configuration.AddTomlFile(path: exposeTomlPath, optional: true, reloadOnChange: true);

var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()?
    .Where(origin => !string.IsNullOrWhiteSpace(origin))
    .Distinct(StringComparer.OrdinalIgnoreCase)
    .ToArray();
if (corsOrigins is null || corsOrigins.Length == 0) {
    throw new InvalidOperationException(
        $"Missing required CORS configuration 'Cors:Origins' in '{exposeTomlPath}'. " +
        "Create config/expose.toml (for example from config/~expose.toml) and define at least one origin.");
}

builder.Services.ConfigureHttpJsonOptions(options => {
    options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
});
builder.Services.AddCors(options => {
    options.AddPolicy("FrontendCors", policy => {
        policy.WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.Configure<YFinanceServiceOptions>(builder.Configuration.GetSection("Services:YFinance"));

var yfinanceOptions = builder.Configuration.GetSection("Services:YFinance").Get<YFinanceServiceOptions>() ?? new YFinanceServiceOptions();
builder.Services.AddGrpcClient<YFinanceMarketData.YFinanceMarketDataClient>(options => {
    options.Address = new Uri(yfinanceOptions.GrpcUrl);
});
builder.Services.AddSingleton<YFinanceQuoteCache>();
builder.Services.AddHostedService<YFinanceStreamWorker>();

var app = builder.Build();
app.UseCors("FrontendCors");

if (app.Environment.IsDevelopment()) { }

var marketApi = app.MapGroup("/market");
marketApi.MapGet("/quotes/{symbol}", Results<Ok<YFinanceQuote>, NotFound> (string symbol, YFinanceQuoteCache cache) =>
        cache.TryGet(symbol, out var quote) && quote is not null
            ? TypedResults.Ok(quote)
            : TypedResults.NotFound())
    .WithName("GetMarketQuoteBySymbol");

marketApi.MapGet("/quotes", (string? symbols, YFinanceQuoteCache cache) => {
        if (string.IsNullOrWhiteSpace(symbols)) {
            return TypedResults.Ok(cache.GetAll());
        }

        var requestedSymbols = symbols.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(s => s.ToUpperInvariant());
        return TypedResults.Ok(cache.GetMany(requestedSymbols));
    })
    .WithName("GetMarketQuotes");

await app.RunAsync();


[JsonSerializable(typeof(YFinanceQuote))]
[JsonSerializable(typeof(YFinanceQuote[]))]
internal partial class AppJsonSerializerContext : JsonSerializerContext
{ }
