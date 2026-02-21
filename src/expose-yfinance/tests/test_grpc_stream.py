import grpc

from expose_yfinance.config import Settings
from expose_yfinance.grpc_server import pb2, pb2_grpc, run_grpc_server
from expose_yfinance.models import QuoteData


class _FakeProvider:
    def __init__(self):
        self._counter = 0

    async def fetch_quote(self, symbol: str):
        self._counter += 1
        return QuoteData(
            symbol=symbol,
            price=100.0 + self._counter,
            currency="USD",
            exchange="NMS",
            timestamp_unix_ms=1735689600000 + self._counter,
            source="test",
            is_market_open=True,
        )


async def test_subscribe_quotes_streams_updates():
    settings = Settings(grpc_port=50071, http_port=8099, poll_interval_ms=50, default_symbols=("AAPL",))
    server = await run_grpc_server(_FakeProvider(), settings)
    try:
        async with grpc.aio.insecure_channel("127.0.0.1:50071") as channel:
            client = pb2_grpc.YFinanceMarketDataStub(channel)
            call = client.SubscribeQuotes(pb2.SubscribeQuotesRequest(symbols=["AAPL"], poll_interval_ms=50))
            first = await call.read()
            assert first.symbol == "AAPL"
            assert first.price > 100
            call.cancel()
    finally:
        await server.stop(grace=1)

