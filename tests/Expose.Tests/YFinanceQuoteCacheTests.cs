using Expose.MarketData.V1;
using Expose.Services;
using Xunit;

namespace Expose.Tests;

public class YFinanceQuoteCacheTests
{
    [Fact]
    public void UpsertAndTryGet_ReturnsStoredQuote()
    {
        var cache = new YFinanceQuoteCache();
        cache.Upsert(new QuoteSnapshot
        {
            Symbol = "AAPL",
            Price = 201.42,
            Currency = "USD",
            Exchange = "NMS",
            TimestampUnixMs = 1735689600123,
            Source = "test",
            Sequence = 1,
            IsMarketOpen = true
        });

        var found = cache.TryGet("aapl", out var quote);

        Assert.True(found);
        Assert.NotNull(quote);
        Assert.Equal("AAPL", quote.Symbol);
        Assert.Equal(201.42, quote.Price, 3);
    }

    [Fact]
    public void GetMany_ReturnsOnlyRequestedSymbols()
    {
        var cache = new YFinanceQuoteCache();
        cache.Upsert(new QuoteSnapshot { Symbol = "AAPL", Price = 100, Currency = "USD", Exchange = "NMS", TimestampUnixMs = 1, Source = "test", Sequence = 1 });
        cache.Upsert(new QuoteSnapshot { Symbol = "MSFT", Price = 200, Currency = "USD", Exchange = "NMS", TimestampUnixMs = 2, Source = "test", Sequence = 1 });

        var quotes = cache.GetMany(["MSFT"]).ToArray();

        Assert.Single(quotes);
        Assert.Equal("MSFT", quotes[0].Symbol);
    }
}

