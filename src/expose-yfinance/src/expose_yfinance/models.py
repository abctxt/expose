from dataclasses import dataclass


@dataclass(frozen=True)
class QuoteData:
    symbol: str
    price: float
    currency: str
    exchange: str
    timestamp_unix_ms: int
    source: str
    is_market_open: bool
