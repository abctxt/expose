using Expose.MarketData.V1;
using Grpc.Core;
using Microsoft.Extensions.Options;

namespace Expose.Services;

public class YFinanceStreamWorker(
    YFinanceMarketData.YFinanceMarketDataClient client,
    YFinanceQuoteCache cache,
    IOptions<YFinanceServiceOptions> options,
    ILogger<YFinanceStreamWorker> logger
) : BackgroundService
{
    private readonly YFinanceServiceOptions _options = options.Value;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested) {
            try {
                var request = new SubscribeQuotesRequest {
                    PollIntervalMs = _options.PollIntervalMs,
                    IncludeHeartbeat = false
                };
                request.Symbols.AddRange(_options.Symbols.Where(s => !string.IsNullOrWhiteSpace(s)).Select(s => s.ToUpperInvariant()));

                using var call = client.SubscribeQuotes(request, cancellationToken: stoppingToken);
                await foreach (var update in call.ResponseStream.ReadAllAsync(stoppingToken)) {
                    cache.Upsert(update);
                }
            } catch (RpcException ex) when (ex.StatusCode == StatusCode.Cancelled && stoppingToken.IsCancellationRequested) {
                break;
            } catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) {
                break;
            } catch (Exception ex) {
                logger.LogWarning(ex, "YFinance stream disconnected. Reconnecting in {DelayMs}ms", _options.ReconnectDelayMs);
                await Task.Delay(_options.ReconnectDelayMs, stoppingToken);
            }
        }
    }
}
