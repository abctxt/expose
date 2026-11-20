using Expose.Data.Portfolio;
using Microsoft.EntityFrameworkCore;
using static Expose.Functions.Portfolio;

namespace Expose;


/// <summary>
/// Prototype for the portfolio functions. Incomplete: database access is hardcoded to the local
/// MariaDB socket, the <c>expose</c> database, server version 13.0.2, and the current OS user.
/// </summary>
public class PortfolioTests
{
    private const string SocketPath = "/opt/homebrew/var/run/mysql.sock";

    [Test]
    public async Task Test(CancellationToken ct)
    {
        Skip.Unless(File.Exists(SocketPath), "Local MariaDB socket is not available.");

        await using var db = new ExposeDb();
        var canConnect = await db.Database.CanConnectAsync(ct);
        await Assert.That(canConnect).IsTrue();

        var dump = await db.Items.ToListAsync(ct);
        await Assert.That(dump).IsNotEmpty();

        await TestFunction(db, ct);
    }


    private async Task TestFunction(ExposeDb db, CancellationToken ct)
    {
        var env = new PortfolioEnv(ct, db);
        var stored = db.Items.Local.OrderBy(item => item.DisplayOrder).ThenBy(item => item.Id).ToArray();
        var first = stored[0];

        var shown = await showPortfolio(env);
        await Assert.That(shown.IsOk).IsTrue();
        await Assert.That(shown.ResultValue.items.Length).IsEqualTo(stored.Length);
        await Assert.That(shown.ResultValue.items.Head.@ref).IsEqualTo(first.Guid7);
        await Assert.That(shown.ResultValue.items.Head.isin).IsEqualTo(first.OriginalIsin);
        await Assert.That(shown.ResultValue.items.Head.name).IsEqualTo(first.DisplayName);

        var read = await readPortfolioItem(env, first.Guid7);
        await Assert.That(read.IsOk).IsTrue();
        await Assert.That(read.ResultValue.isin).IsEqualTo(first.OriginalIsin);

        var missing = await readPortfolioItem(env, Guid.CreateVersion7());
        await Assert.That(missing.IsOk).IsFalse();

        var blank = await savePortfolioItem(env, new PortfolioItemObj(Guid.CreateVersion7(), "  ", "ZZ0000000001"));
        await Assert.That(blank.IsOk).IsFalse();

        await using var tx = await db.Database.BeginTransactionAsync(ct);
        var createdId = Guid.CreateVersion7();
        var saved = await savePortfolioItem(env, new PortfolioItemObj(createdId, "Sample position", "ZZ0000000001"));
        await Assert.That(saved.IsOk).IsTrue();
        await Assert.That(saved.ResultValue.isin).IsEqualTo("ZZ0000000001");

        var renamed = await savePortfolioItem(env, new PortfolioItemObj(first.Guid7, "Renamed for the test", first.OriginalIsin));
        await Assert.That(renamed.IsOk).IsTrue();
        await Assert.That(renamed.ResultValue.name).IsEqualTo("Renamed for the test");
        await tx.RollbackAsync(ct);
    }


    /// <summary>
    /// The development MariaDB instance: database <c>expose</c> over the Homebrew socket, same as <c>mysql</c> then <c>USE expose</c>.
    /// </summary>
    private sealed class ExposeDb : DbContext, IPortfolioContext
    {
        public DbSet<PortfolioItemRow> Items { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            var connectionString = $"Server={SocketPath};Database=expose;User ID={Environment.UserName};Protocol=Unix";
            options.UseMySql(connectionString, new MariaDbServerVersion(new Version(13, 0, 2)));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // portfolio_items has no timestamp columns. EntityBase declares them for other entities.
            modelBuilder.Entity<PortfolioItemRow>(entity => {
                entity.Ignore(item => item.CreatedAt);
                entity.Ignore(item => item.UpdatedAt);
            });
        }
    }
}
