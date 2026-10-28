using Microsoft.EntityFrameworkCore;

namespace Expose.Data.EtfHoldings;


public interface IEtfHoldingsContext
{
    public const string TablePrefix = "etf_holdings_";
    public const string DocumentsTable = TablePrefix + "documents";

    public DbSet<EtfHoldingsDocument> Documents { get; }
}
