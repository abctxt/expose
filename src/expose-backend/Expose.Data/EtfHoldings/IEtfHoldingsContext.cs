using Microsoft.EntityFrameworkCore;

namespace Expose.Data.EtfHoldings;


public interface IEtfHoldingsContext
{
    public const string TablePrefix = "etf_holdings_";
    public const string DocumentsTable = TablePrefix + "documents";
    public const string DownloadsTable = TablePrefix + "downloads";
    public const string ParsingRulesTable = TablePrefix + "parsing_rules";
    public const string LookupTable = TablePrefix + "lookup_table";

    public DbSet<EtfHoldingsDocumentRow> Documents { get; }
    public DbSet<EtfHoldingsDownloadRow> Downloads { get; }
    public DbSet<EtfHoldingsParsingRuleRow> ParsingRules { get; }
    public DbSet<EtfHoldingsLookupRow> Lookups { get; }
}
