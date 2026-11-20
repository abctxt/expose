using Tomlyn.Extensions.Configuration;
using Path = System.IO.Path;

if (args.Contains("--verify")) {
    // Early return indicating healthy executable
    return 0;
}

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

builder.Services.AddCors(options => {
    options.AddPolicy("FrontendCors", policy => {
        policy.WithOrigins(corsOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();
app.UseCors("FrontendCors");

if (app.Environment.IsDevelopment()) { }

await app.RunAsync();
return 0;
