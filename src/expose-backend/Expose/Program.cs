using Tomlyn.Extensions.Configuration;
using Path = System.IO.Path;

var builder = WebApplication.CreateSlimBuilder(args);

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
