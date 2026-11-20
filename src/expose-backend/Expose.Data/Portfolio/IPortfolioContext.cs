using Microsoft.EntityFrameworkCore;

namespace Expose.Data.Portfolio;


public interface IPortfolioContext
{
    public const string TablePrefix = "portfolio_";
    public const string ItemsTable = TablePrefix + "items";

    public const int SharePiecesPrecision = 18;
    public const int SharePiecesScale = 8;
    public const int MoneyPrecision = 19;
    public const int MoneyScale = 4;

    public DbSet<PortfolioItemRow> Items { get; }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
