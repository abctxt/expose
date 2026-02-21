using System.Collections.Concurrent;
using Expose.MarketData.V1;

namespace Expose.Services;

public class YFinanceQuoteCache
{
    private readonly ConcurrentDictionary<string, YFinanceQuote> _quotes = new(StringComparer.OrdinalIgnoreCase);

    public void Upsert(QuoteSnapshot snapshot)
    {
        var quote = new YFinanceQuote(
            snapshot.Symbol,
            snapshot.Price,
            snapshot.Currency,
            snapshot.Exchange,
            snapshot.TimestampUnixMs,
            snapshot.Source,
            snapshot.Sequence,
            snapshot.IsMarketOpen
        );
        _quotes[snapshot.Symbol] = quote;
    }

    public bool TryGet(string symbol, out YFinanceQuote? quote) =>
        _quotes.TryGetValue(symbol.ToUpperInvariant(), out quote);

    public IReadOnlyCollection<YFinanceQuote> GetAll() => _quotes.Values.ToArray();

    public IReadOnlyCollection<YFinanceQuote> GetMany(IEnumerable<string> symbols)
    {
        var result = new List<YFinanceQuote>();
        foreach (var symbol in symbols) {
            if (_quotes.TryGetValue(symbol.ToUpperInvariant(), out var quote)) {
                result.Add(quote);
            }
        }
        return result;
    }
}
