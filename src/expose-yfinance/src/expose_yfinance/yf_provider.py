from __future__ import annotations

import asyncio
from datetime import datetime, timezone
import logging
from typing import Any, Callable

import yfinance as yf

from .models import QuoteData


class YFinanceProvider:
    def __init__(self, ticker_factory: Callable[[str], Any] | None = None):
        self._ticker_factory = ticker_factory or yf.Ticker
        self._log = logging.getLogger(__name__)

    async def fetch_quote(self, symbol: str) -> QuoteData | None:
        attempts = 3
        delay_seconds = 0.2
        for attempt in range(1, attempts + 1):
            try:
                return await asyncio.to_thread(self._fetch_sync, symbol)
            except Exception:
                if attempt >= attempts:
                    self._log.exception("Failed to fetch quote for %s after %s attempts", symbol, attempts)
                    return None
                await asyncio.sleep(delay_seconds)
                delay_seconds *= 2

    def _fetch_sync(self, symbol: str) -> QuoteData | None:
        ticker = self._ticker_factory(symbol)
        fast_info = getattr(ticker, "fast_info", {}) or {}

        price = fast_info.get("lastPrice") or fast_info.get("regularMarketPrice")
        currency = str(fast_info.get("currency") or "")
        exchange = str(fast_info.get("exchange") or "")
        market_state = str(fast_info.get("marketState") or "").lower()
        is_market_open = self._is_market_open(symbol, exchange, market_state)

        if price is None:
            info = getattr(ticker, "info", {}) or {}
            price = info.get("regularMarketPrice")
            if not currency:
                currency = str(info.get("currency") or "")
            if not exchange:
                exchange = str(info.get("exchange") or "")

        if price is None:
            self._log.warning("No price value available for symbol %s", symbol)
            return None

        return QuoteData(
            symbol=symbol.upper(),
            price=float(price),
            currency=currency,
            exchange=exchange,
            timestamp_unix_ms=int(datetime.now(tz=timezone.utc).timestamp() * 1000),
            source="yfinance",
            is_market_open=is_market_open,
        )

    @staticmethod
    def _is_market_open(symbol: str, exchange: str, market_state: str) -> bool:
        normalized_symbol = symbol.upper()
        normalized_exchange = exchange.upper()
        if normalized_exchange == "CCC" or normalized_symbol.endswith("-USD"):
            return True
        return market_state == "regular"
