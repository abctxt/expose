namespace Expose.Services;

public record YFinanceQuote(
    string Symbol,
    double Price,
    string Currency,
    string Exchange,
    long TimestampUnixMs,
    string Source,
    long Sequence,
    bool IsMarketOpen
);
