using Expose.Data.EtfHoldings;
using Expose.Functions;
using Expose.Functions.Common;
using Microsoft.EntityFrameworkCore;

namespace Expose;


/// <summary>
/// Prototype for the ETF holdings functions. Incomplete: database access is hardcoded to the local
/// MariaDB socket, the <c>expose</c> database, server version 13.0.2, and the current OS user.
/// </summary>
public class EtfHoldingsTests
{
    private const string SocketPath = "/opt/homebrew/var/run/mysql.sock";

    [Test]
    public async Task Test(CancellationToken ct)
    {
        Skip.Unless(File.Exists(SocketPath), "Local MariaDB socket is not available.");

        await using var db = new ExposeDb();
        var canConnect = await db.Database.CanConnectAsync(ct);
        await Assert.That(canConnect).IsTrue();

        var dump = await db.Documents.ToListAsync(ct);
        await Assert.That(dump).IsNotEmpty();

        await TestFunction(db, ct);
    }


    private async Task TestFunction(ExposeDb db, CancellationToken ct)
    {
        var env = new EtfHoldings.EtfHoldingsEnv(ct, db, new FileStorage(), new XlsxParser(), new CsvParser());

        var res = await EtfHoldings.listEtfHoldings(env);

        await Assert.That(res.IsOk).IsTrue();
    }


    /// <summary>
    /// The development MariaDB instance: database <c>expose</c> over the Homebrew socket, same as <c>mysql</c> then <c>USE expose</c>.
    /// </summary>
    private sealed class ExposeDb : DbContext, IEtfHoldingsContext
    {
        public DbSet<EtfHoldingsDocument> Documents { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            var connectionString = $"Server={SocketPath};Database=expose;User ID={Environment.UserName};Protocol=Unix";
            options.UseMySql(connectionString, new MariaDbServerVersion(new Version(13, 0, 2)));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EtfHoldingsDocument>();
        }
    }


    private sealed class FileStorage : IFileStorageService {}
    private sealed class XlsxParser : ISpreadsheetParser {}
    private sealed class CsvParser : ICsvTableParser {}
}
