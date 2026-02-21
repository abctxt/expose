namespace Expose.Services;

public class YFinanceServiceOptions
{
    public string GrpcUrl { get; set; } = "http://localhost:50061";
    public int PollIntervalMs { get; set; } = 2000;
    public string[] Symbols { get; set; } = ["AAPL", "MSFT", "^SPX", "^NDX", "BTC-USD", "ETH-USD", "SOL-USD"];
    public int ReconnectDelayMs { get; set; } = 2000;
}
