from expose_yfinance.yf_provider import YFinanceProvider


class _FakeTicker:
    def __init__(self, price: float = 123.45):
        self.fast_info = {
            "lastPrice": price,
            "currency": "USD",
            "exchange": "NMS",
            "marketState": "REGULAR",
        }
        self.info = {}


async def test_fetch_quote_uses_fast_info():
    provider = YFinanceProvider(ticker_factory=lambda _: _FakeTicker())
    quote = await provider.fetch_quote("aapl")
    assert quote is not None
    assert quote.symbol == "AAPL"
    assert quote.price == 123.45
    assert quote.currency == "USD"
    assert quote.exchange == "NMS"
    assert quote.is_market_open is True


class _FakeCryptoTicker:
    def __init__(self, price: float = 68227.18):
        self.fast_info = {
            "lastPrice": price,
            "currency": "USD",
            "exchange": "CCC",
            "marketState": "CLOSED",
        }
        self.info = {}


async def test_fetch_quote_marks_crypto_open_24_7():
    provider = YFinanceProvider(ticker_factory=lambda _: _FakeCryptoTicker())
    quote = await provider.fetch_quote("btc-usd")
    assert quote is not None
    assert quote.symbol == "BTC-USD"
    assert quote.is_market_open is True

